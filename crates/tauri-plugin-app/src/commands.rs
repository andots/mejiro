use tauri::{AppHandle, Runtime};

use crate::models::*;
use crate::PluginAppExt;
use crate::Result;

#[tauri::command]
pub(crate) async fn ping<R: Runtime>(
    app: AppHandle<R>,
    payload: PingRequest,
) -> Result<PingResponse> {
    app.plugin_app().ping(payload)
}
