mod error;
mod models;
mod utils;

pub use error::Error;

use std::{fs, sync::Mutex, time::Duration};

use tauri::Manager;

use notify::{EventKind, RecursiveMode};
use notify_debouncer_full::{new_debouncer, DebounceEventResult};

use parus_common::{constants::EXTERNAL_WEBVIEW_LABEL, AppHandlePathExt};

use models::UserScript;
use utils::list_userscripts;

const PLUGIN_NAME: &str = "user-scripts";

type UserScripts = Vec<UserScript>;

trait AppHandleExt {
    fn load_user_scripts(&self) -> Result<UserScripts, Error>;
    fn watch_user_scripts(&self);
}

impl<R: tauri::Runtime> AppHandleExt for tauri::AppHandle<R> {
    fn load_user_scripts(&self) -> Result<UserScripts, Error> {
        let mut scripts = vec![];
        let dir = self.get_userscripts_dir();
        let paths = list_userscripts(&dir)?;
        for path in paths {
            if let Ok(script) = fs::read_to_string(path) {
                let user_script = UserScript::parse(&script);
                scripts.push(user_script);
            }
        }
        Ok(scripts)
    }

    fn watch_user_scripts(&self) {
        let (tx, rx) = std::sync::mpsc::channel();
        let path = self.get_userscripts_dir();
        // let app_handle = self.app_handle().clone();
        tauri::async_runtime::spawn_blocking(move || -> anyhow::Result<()> {
            let mut debouncer = new_debouncer(Duration::from_secs(1), None, tx)?;
            debouncer.watch(path, RecursiveMode::Recursive)?;
            loop {
                match rx.recv() {
                    Ok(DebounceEventResult::Ok(events)) => {
                        for event in events.iter() {
                            match event.kind {
                                EventKind::Modify(_) => {
                                    log::info!("File modified: {:?}", event.paths);
                                    // TODO: reload userscripts and rerun in webview
                                }
                                EventKind::Create(_) => {
                                    log::info!("File created: {:?}", event.paths);
                                }
                                EventKind::Remove(_) => {
                                    log::info!("File removed: {:?}", event.paths);
                                }
                                _ => {}
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
    fn run_all_user_scripts(&self);
}

impl<R: tauri::Runtime> WebviewExt for tauri::Webview<R> {
    fn run_all_user_scripts(&self) {
        if let Some(state) = self.try_state::<Mutex<UserScripts>>() {
            if let Ok(user_scripts) = state.lock() {
                for user_script in user_scripts.iter() {
                    let _ = self.eval(user_script.code.as_str());
                }
            }
        }
    }
}

/// Initializes the plugin.
pub fn init<R: tauri::Runtime>() -> tauri::plugin::TauriPlugin<R> {
    tauri::plugin::Builder::new(PLUGIN_NAME)
        .invoke_handler(tauri::generate_handler![])
        .setup(|app, _api| {
            match app.load_user_scripts() {
                Ok(scripts) => {
                    app.manage(Mutex::new(scripts));
                    app.watch_user_scripts();
                }
                Err(e) => log::error!("UserScript error: {}", e.to_string()),
            }
            Ok(())
        })
        .on_page_load(|webview, payload| {
            if webview.label() == EXTERNAL_WEBVIEW_LABEL {
                match payload.event() {
                    tauri::webview::PageLoadEvent::Started => {
                        log::debug!("Started: {}", payload.url().as_str());
                        webview.run_all_user_scripts();
                    }
                    tauri::webview::PageLoadEvent::Finished => {
                        log::debug!("Finished: {}", payload.url().as_str());
                    }
                }
            }
        })
        .build()
}
