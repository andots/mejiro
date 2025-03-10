use std::sync::Mutex;

use tauri::{AppHandle, Runtime};

use crate::models::*;
use crate::Error;
use crate::PluginAppExt;

#[tauri::command]
pub(crate) async fn ping<R: Runtime>(
    app: AppHandle<R>,
    payload: PingRequest,
) -> Result<PingResponse, Error> {
    app.plugin_app().ping(payload)
}

#[tauri::command]
pub(crate) fn get_window_geometry(
    state: tauri::State<'_, Mutex<WindowGeometry>>,
) -> Result<WindowGeometry, Error> {
    let state = state
        .lock()
        .map_err(|_| Error::Mutex("can't get settings".to_string()))?;
    Ok(state.clone())
}
