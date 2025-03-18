use std::sync::Mutex;

use parus_common::Error;

use crate::models::UserSettings;

#[tauri::command]
pub fn get_user_settings(
    state: tauri::State<'_, Mutex<UserSettings>>,
) -> Result<UserSettings, Error> {
    let settings = state
        .lock()
        .map_err(|_| Error::Mutex("can't get settings".to_string()))?;
    Ok(settings.clone())
}

#[tauri::command]
pub fn update_user_settings(
    state: tauri::State<'_, Mutex<UserSettings>>,
    settings: UserSettings,
) -> Result<UserSettings, Error> {
    let mut state = state
        .lock()
        .map_err(|_| Error::Mutex("can't update settings".to_string()))?;
    *state = settings;
    Ok(state.clone())
}
