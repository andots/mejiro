mod error;
mod models;

pub use error::Error;
pub use models::UserScript;

use std::{collections::HashMap, fs, path::Path, sync::RwLock, time::Duration};

use tauri::Manager;

use notify::{
    event::{ModifyKind, RenameMode},
    EventKind, RecursiveMode,
};
use notify_debouncer_full::{new_debouncer, DebounceEventResult};

use parus_common::{constants::EXTERNAL_WEBVIEW_LABEL, AppHandlePathExt};
use parus_fs::glob_files_with_matcher;

use models::check_path_is_user_js;

const PLUGIN_NAME: &str = "user-scripts";

type UserScriptCollection = HashMap<String, UserScript>;
type UserScriptState = RwLock<UserScriptCollection>;

fn load_user_scripts(dir: &Path) -> Result<UserScriptCollection, Error> {
    let mut scripts: UserScriptCollection = HashMap::new();
    let paths = glob_files_with_matcher(dir, "**/*.user.js")?;
    for path in paths {
        if let Ok(script) = fs::read_to_string(&path) {
            let user_script = UserScript::parse(&script);
            if let Some(path) = path.to_str() {
                scripts.insert(path.to_string(), user_script);
            }
        }
    }
    Ok(scripts)
}

trait AppHandleExt {
    fn manage_and_watch_user_scripts(&self);
    fn reload_external_webview(&self);
    fn update_user_script(&self, path: &Path) -> Result<(), Error>;
    fn add_user_script(&self, path: &Path) -> Result<(), Error>;
    fn remove_user_script(&self, path: &Path) -> Result<(), Error>;
    fn watch_user_scripts_dir(&self);
}

impl<R: tauri::Runtime> AppHandleExt for tauri::AppHandle<R> {
    fn manage_and_watch_user_scripts(&self) {
        let dir = self.get_user_scripts_dir();
        match load_user_scripts(&dir) {
            Ok(user_scripts) => {
                self.manage::<UserScriptState>(RwLock::new(user_scripts));
                self.watch_user_scripts_dir();
            }
            Err(e) => log::error!(
                "Error occured while loading user scripts: {:?}",
                e.to_string()
            ),
        }
    }

    fn reload_external_webview(&self) {
        if let Some(webview) = self.get_webview(EXTERNAL_WEBVIEW_LABEL) {
            if let Ok(url) = webview.url() {
                let _ = webview.navigate(url);
            }
        }
    }

    fn update_user_script(&self, path: &Path) -> Result<(), Error> {
        let script = fs::read_to_string(path)?;
        let user_script = UserScript::parse(&script);
        let state = self
            .try_state::<UserScriptState>()
            .ok_or(Error::StateNotManaged)?;
        {
            let mut map = state.write().map_err(|_| Error::PoisonError)?;
            let key = path.to_str().ok_or(Error::InvalidUTF8)?;
            map.entry(key.to_string())
                .and_modify(|value| *value = user_script);
        }
        log::info!("Update user script: {:?}", path.file_name());
        Ok(())
    }

    fn add_user_script(&self, path: &Path) -> Result<(), Error> {
        let script = fs::read_to_string(path)?;
        let user_script = UserScript::parse(&script);
        let state = self
            .try_state::<UserScriptState>()
            .ok_or(Error::StateNotManaged)?;
        {
            let mut map = state.write().map_err(|_| Error::PoisonError)?;
            let key = path.to_str().ok_or(Error::InvalidUTF8)?;
            map.insert(key.to_string(), user_script);
        }
        log::info!("Add user script: {:?}", path.file_name());
        Ok(())
    }

    fn remove_user_script(&self, path: &Path) -> Result<(), Error> {
        let state = self
            .try_state::<UserScriptState>()
            .ok_or(Error::StateNotManaged)?;
        {
            let mut map = state.write().map_err(|_| Error::PoisonError)?;
            let key = path.to_str().ok_or(Error::InvalidUTF8)?;
            map.remove(key);
        }
        log::info!("Remove user script: {:?}", path.file_name());
        Ok(())
    }

    fn watch_user_scripts_dir(&self) {
        let (tx, rx) = std::sync::mpsc::channel();
        let dir = self.get_user_scripts_dir();
        let app_handle = self.app_handle().clone();
        tauri::async_runtime::spawn_blocking(move || -> anyhow::Result<()> {
            let mut debouncer = new_debouncer(Duration::from_secs(1), None, tx)?;
            debouncer.watch(dir, RecursiveMode::Recursive)?;
            loop {
                match rx.recv() {
                    Ok(DebounceEventResult::Ok(events)) => {
                        for event in events.iter() {
                            let path = match event.paths.last() {
                                Some(v) => v,
                                None => break,
                            };
                            if check_path_is_user_js(path) {
                                log::debug!("event: {:?}, {:?}", event.kind, event.paths);
                                match event.kind {
                                    EventKind::Modify(modify) => match modify {
                                        ModifyKind::Any => {
                                            if let Err(e) = app_handle.update_user_script(path) {
                                                log::error!(
                                                    "update script error: {:?}",
                                                    e.to_string()
                                                );
                                            } else {
                                                app_handle.reload_external_webview();
                                            }
                                        }
                                        ModifyKind::Name(RenameMode::Both) => {
                                            if let (Some(from), Some(to)) =
                                                (event.paths.first(), event.paths.last())
                                            {
                                                // remove script (from)
                                                if let Err(e) = app_handle.remove_user_script(from)
                                                {
                                                    log::error!("{}", e);
                                                }
                                                // add script (to)
                                                if let Err(e) = app_handle.add_user_script(to) {
                                                    log::error!("{}", e);
                                                }
                                                app_handle.reload_external_webview();
                                            }
                                        }
                                        _ => {}
                                    },
                                    EventKind::Create(_) => {
                                        if let Err(e) = app_handle.add_user_script(path) {
                                            log::error!("add script error: {:?}", e.to_string());
                                        } else {
                                            app_handle.reload_external_webview();
                                        }
                                    }
                                    EventKind::Remove(_) => {
                                        if let Err(e) = app_handle.remove_user_script(path) {
                                            log::error!("remove script error: {}", e.to_string());
                                        } else {
                                            app_handle.reload_external_webview();
                                        }
                                    }
                                    _ => {}
                                }
                            }
                        }
                    }
                    Ok(DebounceEventResult::Err(e)) => {
                        log::warn!("notify error: {:?}", e);
                    }
                    Err(_) => {
                        log::error!("Channel closed, exiting watcher loop.");
                        break;
                    }
                }
            }
            Ok(())
        });
    }
}

trait WebviewExt {
    fn run_all_user_scripts(&self) -> Result<(), Error>;
}

impl<R: tauri::Runtime> WebviewExt for tauri::Webview<R> {
    fn run_all_user_scripts(&self) -> Result<(), Error> {
        let state = self
            .try_state::<UserScriptState>()
            .ok_or(Error::StateNotManaged)?;
        let user_scripts = state.read().map_err(|_| Error::PoisonError)?;
        let url = self.url()?;
        let url_str = url.as_str();

        for (_key, user_script) in user_scripts.iter() {
            let should_run = user_script.match_patterns.is_empty()
                || user_script
                    .match_patterns
                    .iter()
                    .any(|pattern| pattern.is_match(url_str));

            if should_run {
                let _ = self.eval(user_script.code.as_str());
            }
        }
        Ok(())
    }
}

/// Initializes the plugin.
pub fn init<R: tauri::Runtime>() -> tauri::plugin::TauriPlugin<R> {
    tauri::plugin::Builder::new(PLUGIN_NAME)
        .invoke_handler(tauri::generate_handler![])
        .setup(|app, _api| {
            app.manage_and_watch_user_scripts();
            Ok(())
        })
        .on_page_load(|webview, payload| {
            if webview.label() == EXTERNAL_WEBVIEW_LABEL {
                match payload.event() {
                    tauri::webview::PageLoadEvent::Started => {
                        // log::debug!("Started: {}", payload.url().as_str());
                        // webview.run_all_user_scripts();
                    }
                    tauri::webview::PageLoadEvent::Finished => {
                        log::debug!("Finished: {}", payload.url().as_str());
                        if let Err(e) = webview.run_all_user_scripts() {
                            log::error!("run all scripts error: {}", e.to_string());
                        }
                    }
                }
            }
        })
        .build()
}
