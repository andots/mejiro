use crate::events::{emit_to_app_webview, AppEvent};

#[tauri::command]
pub fn emit_page_params(app_handle: tauri::AppHandle, title: String, url: String) {
    // dev console says below, but can call this function from ipc window.__TAURI__.invoke(xxx)
    // Refused to connect to 'http://ipc.localhost/xxx'
    // because it violates the following Content Security Policy directive: "connect-src 'self'".
    let _ = emit_to_app_webview(&app_handle, AppEvent::ExternalNavigation, url);
    let _ = emit_to_app_webview(&app_handle, AppEvent::ExternalPageLoaded, title);
}
