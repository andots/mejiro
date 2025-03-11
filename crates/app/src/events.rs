use serde::Serialize;
use strum::AsRefStr;
use tauri::Emitter;

use parus_common::constants::APP_WEBVIEW_LABEL;

#[derive(AsRefStr)]
pub enum AppEvent {
    #[allow(dead_code)]
    #[strum(serialize = "app://settings-updated")]
    SettingsUpdated,

    #[allow(dead_code)]
    #[strum(serialize = "external://page-loaded")]
    ExternalPageLoaded,

    #[strum(serialize = "external://navigation")]
    ExternalNavigation,

    #[strum(serialize = "external://title-changed")]
    ExternalTitleChanged,

    #[strum(serialize = "external://url-changed")]
    ExternalUrlChanged,
}

pub fn emit_to_app_webview<S>(
    app_handle: &tauri::AppHandle,
    event: AppEvent,
    payload: S,
) -> Result<(), tauri::Error>
where
    S: Serialize + Clone,
{
    app_handle.emit_to(
        tauri::EventTarget::webview(APP_WEBVIEW_LABEL),
        event.as_ref(),
        payload,
    )
}
