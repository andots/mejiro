use std::sync::Mutex;

use crate::{error::AppError, settings::UserSettings};

#[tauri::command]
pub async fn get_settings(
    state: tauri::State<'_, Mutex<UserSettings>>,
) -> Result<UserSettings, AppError> {
    let settings = state
        .lock()
        .map_err(|_| AppError::Mutex("can't get settings".to_string()))?;
    Ok(settings.clone())
}

#[tauri::command]
pub fn update_settings(
    settings: UserSettings,
    state: tauri::State<'_, Mutex<UserSettings>>,
) -> Result<UserSettings, AppError> {
    let mut state = state
        .lock()
        .map_err(|_| AppError::Mutex("can't update settings".to_string()))?;
    *state = settings;
    Ok(state.clone())
}
