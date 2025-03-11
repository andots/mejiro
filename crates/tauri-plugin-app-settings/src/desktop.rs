use std::sync::Mutex;

use serde::de::DeserializeOwned;
use tauri::{plugin::PluginApi, Manager};

use parus_common::Error;

use crate::models::AppSettings;
use crate::AppHandleExt;

pub struct AppSettingsPlugin<R: tauri::Runtime> {
    app_handle: tauri::AppHandle<R>,
}

impl<R: tauri::Runtime> AppSettingsPlugin<R> {
    pub fn app_settings(&self) -> tauri::State<'_, Mutex<AppSettings>> {
        self.app_handle.state::<Mutex<AppSettings>>()
    }
}

pub fn init<R: tauri::Runtime, C: DeserializeOwned>(
    app_handle: &tauri::AppHandle<R>,
    _api: PluginApi<R, C>,
) -> Result<AppSettingsPlugin<R>, Error> {
    let plugin = AppSettingsPlugin {
        app_handle: app_handle.clone(),
    };
    let settings = app_handle.load_app_settings();
    app_handle.manage(Mutex::new(settings));
    Ok(plugin)
}
