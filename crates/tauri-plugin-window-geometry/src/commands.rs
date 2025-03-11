use std::sync::Mutex;

use parus_common::Error;

use crate::models::WindowGeometry;

#[tauri::command]
pub(crate) fn get_window_geometry(
    state: tauri::State<'_, Mutex<WindowGeometry>>,
) -> Result<WindowGeometry, Error> {
    let state = state
        .lock()
        .map_err(|_| Error::Mutex("can't get settings".to_string()))?;
    Ok(state.clone())
}
