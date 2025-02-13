#![allow(dead_code)]

use serde::Serialize;
use strum::AsRefStr;
use tauri::Emitter;

use crate::constants::APP_WEBVIEW_LABEL;

#[derive(AsRefStr)]
pub enum AppEvent {
    #[strum(serialize = "app://settings-updated")]
    SettingsUpdated,
    #[strum(serialize = "app://external-page-loaded")]
    ExternalPageLoaded,
    #[strum(serialize = "app://external-navigation")]
    ExternalNavigation,
    #[strum(serialize = "app://bookmark-updated")]
    BookmarkUpdated,
}

pub fn emit_to_app<S>(
    app_handle: tauri::AppHandle,
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
