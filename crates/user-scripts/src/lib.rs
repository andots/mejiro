mod error;
mod models;
mod utils;

pub use error::Error;

use std::{fs, sync::Mutex};
use tauri::Manager;

use parus_common::{constants::EXTERNAL_WEBVIEW_LABEL, AppHandlePathExt};

use models::UserScript;
use utils::list_userscripts;

const PLUGIN_NAME: &str = "user-scripts";

type UserScripts = Vec<UserScript>;

trait AppHandleExt {
    fn load_user_scripts(&self) -> Result<UserScripts, Error>;
    fn eval_user_scripts<T: tauri::Runtime>(&self, webview: &tauri::Webview<T>);
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

    fn eval_user_scripts<T: tauri::Runtime>(&self, webview: &tauri::Webview<T>) {
        if let Some(state) = self.try_state::<Mutex<UserScripts>>() {
            if let Ok(user_scripts) = state.lock() {
                for user_script in user_scripts.iter() {
                    let _ = webview.eval(user_script.code.as_str());
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
                        let handle = webview.app_handle();
                        handle.eval_user_scripts(webview);
                    }
                    tauri::webview::PageLoadEvent::Finished => {
                        log::debug!("Finished: {}", payload.url().as_str());
                    }
                }
            }
        })
        .build()
}
