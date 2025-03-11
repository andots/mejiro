use std::{fs, sync::Mutex};

use serde::de::DeserializeOwned;
use tauri::{plugin::PluginApi, Manager};

use parus_common::{deserialize_from_file, AppHandlePathExt, Error, EXTERNAL_WEBVIEW_LABEL};

use crate::models::AppSettings;

pub fn init<R: tauri::Runtime, C: DeserializeOwned>(
    app_handle: &tauri::AppHandle<R>,
    _api: PluginApi<R, C>,
) -> Result<AppSettingsPlugin<R>, Error> {
    let plugin = AppSettingsPlugin {
        app_handle: app_handle.clone(),
    };
    let settings = plugin.load_app_settings();
    app_handle.manage(Mutex::new(settings));
    Ok(plugin)
}

/// Access to the window-geometry-plugin APIs.
pub struct AppSettingsPlugin<R: tauri::Runtime> {
    app_handle: tauri::AppHandle<R>,
}

impl<R: tauri::Runtime> AppSettingsPlugin<R> {
    pub fn app_settings(&self) -> tauri::State<'_, Mutex<AppSettings>> {
        self.app_handle.state::<Mutex<AppSettings>>()
    }

    pub fn load_app_settings(&self) -> AppSettings {
        let path = self.app_handle.app_settings_path();
        deserialize_from_file(path)
    }

    pub fn save_app_settings(&self) -> Result<(), Error> {
        let path = self.app_handle.app_settings_path();
        let file = fs::File::create(path)?;
        if let Some(state) = self.app_handle.try_state::<Mutex<AppSettings>>() {
            let settings = state
                .lock()
                .map_err(|_| Error::Mutex("can't get settings".to_string()))?;
            serde_json::to_writer_pretty(file, &settings.clone())?;
        }
        Ok(())
    }

    /// Sync external url with start_page_url in AppSettings for last visited url
    pub fn sync_last_visited_url(&self) -> Result<(), Error> {
        if let Some(external) = self.app_handle.get_webview(EXTERNAL_WEBVIEW_LABEL) {
            if let Some(state) = self.app_handle.try_state::<Mutex<AppSettings>>() {
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
