mod commands;
mod models;

use std::{fs, sync::Mutex};

use parus_common::{
    constants::{EXTERNAL_WEBVIEW_LABEL, MAINWINDOW_LABEL},
    utils::deserialize_from_file_or_default,
    AppHandlePathExt, Error,
};
use tauri::Manager;

pub use models::{default_start_page_url, AppSettings};

const PLUGIN_NAME: &str = "app-settings";

trait AppHandleExt {
    fn load_app_settings(&self) -> AppSettings;
    fn save_app_settings(&self) -> Result<(), Error>;
    fn sync_last_visited_url(&self) -> Result<(), Error>;
}

impl<R: tauri::Runtime> AppHandleExt for tauri::AppHandle<R> {
    fn load_app_settings(&self) -> AppSettings {
        let path = self.app_settings_path();
        deserialize_from_file_or_default(path)
    }

    fn save_app_settings(&self) -> Result<(), Error> {
        let path = self.app_settings_path();
        let file = fs::File::create(path)?;
        if let Some(state) = self.try_state::<Mutex<AppSettings>>() {
            let settings = state
                .lock()
                .map_err(|_| Error::Mutex("can't get settings".to_string()))?;
            serde_json::to_writer_pretty(file, &settings.clone())?;
        }
        Ok(())
    }

    /// Sync external url with start_page_url in AppSettings for last visited url
    fn sync_last_visited_url(&self) -> Result<(), Error> {
        if let Some(external) = self.get_webview(EXTERNAL_WEBVIEW_LABEL) {
            if let Some(state) = self.try_state::<Mutex<AppSettings>>() {
                let url = external.url()?;
                let mut settings = state
                    .lock()
                    .map_err(|_| Error::Mutex("can't get settings".to_string()))?;
                settings.start_page_url = url.to_string();
            }
        }
        Ok(())
    }
}

/// Initializes the plugin.
pub fn init<R: tauri::Runtime>() -> tauri::plugin::TauriPlugin<R> {
    tauri::plugin::Builder::new(PLUGIN_NAME)
        .invoke_handler(tauri::generate_handler![
            commands::get_app_settings,
            commands::update_app_settings
        ])
        .setup(|app, _api| {
            let settings = app.load_app_settings();
            app.manage(Mutex::new(settings));

            Ok(())
        })
        .on_event(|app_handle, event| match event {
            tauri::RunEvent::Ready => {}
            tauri::RunEvent::Exit => {
                // save settings before exit
                let _ = app_handle.save_app_settings();
            }
            tauri::RunEvent::WindowEvent { label, event, .. } => {
                if label == MAINWINDOW_LABEL {
                    if let tauri::WindowEvent::CloseRequested { .. } = event {
                        let _ = app_handle.sync_last_visited_url();
                    }
                }
            }
            _ => {}
        })
        .build()
}
