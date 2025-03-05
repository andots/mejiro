use std::sync::Mutex;

use crate::{
    error::AppError,
    settings::{AppSettings, UserSettings},
};

#[tauri::command]
pub fn get_user_settings(
    state: tauri::State<'_, Mutex<UserSettings>>,
) -> Result<UserSettings, AppError> {
    let settings = state
        .lock()
        .map_err(|_| AppError::Mutex("can't get settings".to_string()))?;
    Ok(settings.clone())
}

#[tauri::command]
pub fn update_user_settings(
    state: tauri::State<'_, Mutex<UserSettings>>,
    settings: UserSettings,
) -> Result<UserSettings, AppError> {
    let mut state = state
        .lock()
        .map_err(|_| AppError::Mutex("can't update settings".to_string()))?;
    *state = settings;
    Ok(state.clone())
}

#[tauri::command]
pub fn get_app_settings(
    state: tauri::State<'_, Mutex<AppSettings>>,
) -> Result<AppSettings, AppError> {
    let settings = state
        .lock()
        .map_err(|_| AppError::Mutex("can't get settings".to_string()))?;
    Ok(settings.clone())
}

#[tauri::command]
pub fn update_app_settings(
    state: tauri::State<'_, Mutex<AppSettings>>,
    settings: AppSettings,
) -> Result<AppSettings, AppError> {
    let mut state = state
        .lock()
        .map_err(|_| AppError::Mutex("can't update settings".to_string()))?;
    *state = settings;
    Ok(state.clone())
}
