use std::sync::Mutex;

use crate::AppSettings;
use parus_common::Error;

#[tauri::command]
pub fn get_app_settings(state: tauri::State<'_, Mutex<AppSettings>>) -> Result<AppSettings, Error> {
    let settings = state
        .lock()
        .map_err(|_| Error::Mutex("can't get settings".to_string()))?;
    Ok(settings.clone())
}

#[tauri::command]
pub fn update_app_settings(
    state: tauri::State<'_, Mutex<AppSettings>>,
    settings: AppSettings,
) -> Result<AppSettings, Error> {
    let mut state = state
        .lock()
        .map_err(|_| Error::Mutex("can't update settings".to_string()))?;
    *state = settings;
    Ok(state.clone())
}
