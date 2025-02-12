pub mod bookmarks;
pub mod webviews;

use tauri::{Emitter, EventTarget};

use crate::{constants::APP_WEBVIEW_LABEL, events::ExternalEvent};

// https://v2.tauri.app/develop/calling-rust/

#[tauri::command]
pub fn emit_page_params(app_handle: tauri::AppHandle, title: String, url: String) {
    // dev console says below, but can call this function from ipc window.__TAURI__.invoke(xxx)
    // Refused to connect to 'http://ipc.localhost/xxx'
    // because it violates the following Content Security Policy directive: "connect-src 'self'".
    // log::debug!("Title from IPC: {}", title);
    let _ = app_handle.emit_to(
        EventTarget::webview(APP_WEBVIEW_LABEL),
        ExternalEvent::Navigation.as_ref(),
        url,
    );
    let _ = app_handle.emit_to(
        EventTarget::webview(APP_WEBVIEW_LABEL),
        ExternalEvent::PageLoaded.as_ref(),
        title,
    );
}
