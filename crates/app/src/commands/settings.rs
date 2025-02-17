use std::sync::Mutex;

use crate::{error::AppError, settings::UserSettings};

#[tauri::command]
pub async fn get_settings(
    state: tauri::State<'_, Mutex<UserSettings>>,
) -> Result<UserSettings, AppError> {
    let state = state
        .lock()
        .map_err(|_| AppError::Mutex("can't get settings".to_string()))?;
    Ok(state.clone())
}
