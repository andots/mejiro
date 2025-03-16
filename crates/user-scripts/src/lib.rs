mod error;
mod models;
mod utils;

pub use error::Error;
pub use models::UserScript;
use utils::check_path_is_user_js;

use std::{collections::HashMap, fs, path::Path, sync::Mutex, time::Duration};

use tauri::Manager;

use notify::{EventKind, RecursiveMode};
use notify_debouncer_full::{new_debouncer, DebounceEventResult};

use parus_common::{constants::EXTERNAL_WEBVIEW_LABEL, AppHandlePathExt};
use parus_fs::glob_files_with_matcher;

const PLUGIN_NAME: &str = "user-scripts";

type UserScriptCollection = HashMap<String, UserScript>;
type UserScriptState = Mutex<UserScriptCollection>;

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
                self.manage(Mutex::new(user_scripts));
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
            let mut map = state.lock().map_err(|_| Error::PoisonError)?;
            let key = path.to_str().ok_or(Error::InvalidUTF8)?;
            map.entry(key.to_string())
                .and_modify(|value| *value = user_script);
            log::debug!("Update user script: {:?}", key);
        }
        self.reload_external_webview();
        Ok(())
    }

    fn add_user_script(&self, path: &Path) -> Result<(), Error> {
        let script = fs::read_to_string(path)?;
        let user_script = UserScript::parse(&script);
        let state = self
            .try_state::<UserScriptState>()
            .ok_or(Error::StateNotManaged)?;
        {
            let mut map = state.lock().map_err(|_| Error::PoisonError)?;
            let key = path.to_str().ok_or(Error::InvalidUTF8)?;
            map.insert(key.to_string(), user_script);
            log::debug!("Add user script: {:?}", key);
        }
        self.reload_external_webview();
        Ok(())
    }

    fn remove_user_script(&self, path: &Path) -> Result<(), Error> {
        let state = self
            .try_state::<UserScriptState>()
            .ok_or(Error::StateNotManaged)?;
        {
            let mut map = state.lock().map_err(|_| Error::PoisonError)?;
            let key = path.to_str().ok_or(Error::InvalidUTF8)?;
            map.remove(key);
            log::debug!("Remove user script: {:?}", key);
        }
        self.reload_external_webview();
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
                                match event.kind {
                                    EventKind::Modify(_) => {
                                        if let Err(e) = app_handle.update_user_script(path) {
                                            log::error!("update script error: {:?}", e.to_string());
                                        }
                                    }
                                    EventKind::Create(_) => {
                                        if let Err(e) = app_handle.add_user_script(path) {
                                            log::error!("add script error: {:?}", e.to_string());
                                        }
                                    }
                                    EventKind::Remove(_) => {
                                        if let Err(e) = app_handle.remove_user_script(path) {
                                            log::error!("remove script error: {}", e.to_string());
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
        let user_scripts = state.lock().map_err(|_| Error::PoisonError)?;
        let url = self.url()?;
        let url_str = url.as_str();

        for (path, user_script) in user_scripts.iter() {
            let should_run = user_script.match_patterns.is_empty()
                || user_script
                    .match_patterns
                    .iter()
                    .any(|pattern| pattern.is_match(url_str));

            if should_run {
                log::debug!("Run userscript: {}", path);
                if let Err(err) = self.eval(user_script.code.as_str()) {
                    log::error!("Failed to execute userscript {}: {:?}", path, err);
                }
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
