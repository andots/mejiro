mod commands;
mod models;

pub use models::UserSettings;

use std::{fs, sync::Mutex};

use tauri::Manager;

use parus_common::{utils::deserialize_from_file_or_default, AppHandlePathExt, Error};

const PLUGIN_NAME: &str = "user-settings";

trait AppHandleExt {
    fn load_user_settings(&self) -> UserSettings;
    fn save_user_settings(&self) -> Result<(), Error>;
}

impl<R: tauri::Runtime> AppHandleExt for tauri::AppHandle<R> {
    fn load_user_settings(&self) -> UserSettings {
        let path = self.user_settings_path();
        deserialize_from_file_or_default(path)
    }

    fn save_user_settings(&self) -> Result<(), Error> {
        let path = self.user_settings_path();
        let file = fs::File::create(path)?;
        if let Some(state) = self.try_state::<Mutex<UserSettings>>() {
            let settings = state
                .lock()
                .map_err(|_| Error::Mutex("can't get settings".to_string()))?;
            serde_json::to_writer_pretty(file, &settings.clone())?;
        }
        Ok(())
    }
}

/// Initializes the plugin.
pub fn init<R: tauri::Runtime>() -> tauri::plugin::TauriPlugin<R> {
    tauri::plugin::Builder::new(PLUGIN_NAME)
        .invoke_handler(tauri::generate_handler![
            commands::get_user_settings,
            commands::update_user_settings
        ])
        .setup(|app, _api| {
            let settings = app.load_user_settings();
            app.manage(Mutex::new(settings));

            Ok(())
        })
        .on_event(|app_handle, event| match event {
            tauri::RunEvent::Ready => {}
            tauri::RunEvent::Exit => {
                // save settings before exit
                let _ = app_handle.save_user_settings();
            }
            _ => {}
        })
        .build()
}
