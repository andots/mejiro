#![allow(dead_code)]

use serde::Serialize;
use strum::AsRefStr;
use tauri::Emitter;

use crate::constants::APP_WEBVIEW_LABEL;

#[derive(AsRefStr)]
pub enum ExternalEvent {
    #[strum(serialize = "external://page-loaded")]
    PageLoaded,
    #[strum(serialize = "external://navigation")]
    Navigation,
}

#[derive(AsRefStr)]
pub enum BookmarkEvent {
    #[strum(serialize = "bookmark://update-tree")]
    UpdateTree,
}

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
