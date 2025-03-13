mod error;
mod models;
mod utils;

pub use error::Error;

use std::{fs, io::Read, sync::Mutex};
use tauri::Manager;

use parus_common::AppHandlePathExt;

use models::UserScript;
use utils::list_userscripts;

const PLUGIN_NAME: &str = "user-scripts";

trait AppHandleExt {
    fn load_user_scripts(&self) -> Vec<UserScript>;
}

impl<R: tauri::Runtime> AppHandleExt for tauri::AppHandle<R> {
    fn load_user_scripts(&self) -> Vec<UserScript> {
        let mut scripts = vec![];
        let dir = self.get_userscripts_dir();
        if let Ok(paths) = list_userscripts(&dir) {
            for path in paths {
                if let Ok(mut file) = fs::File::open(path) {
                    let mut script = String::new();
                    if file.read_to_string(&mut script).is_ok() {
                        let user_script = UserScript::parse(&script);
                        scripts.push(user_script);
                    }
                }
            }
        }
        scripts
    }
}

/// Initializes the plugin.
pub fn init<R: tauri::Runtime>() -> tauri::plugin::TauriPlugin<R> {
    tauri::plugin::Builder::new(PLUGIN_NAME)
        .invoke_handler(tauri::generate_handler![])
        .setup(|app, _api| {
            let scripts = app.load_user_scripts();
            app.manage(Mutex::new(scripts));
            Ok(())
        })
        .build()
}
