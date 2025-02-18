use crate::events::{emit_to_app_webview, AppEvent};

#[tauri::command]
pub fn send_page_title(app_handle: tauri::AppHandle, title: String) {
    let _ = emit_to_app_webview(&app_handle, AppEvent::ExternalTitleChanged, title);
}

#[tauri::command]
pub fn send_page_url(app_handle: tauri::AppHandle, url: String) {
    let _ = emit_to_app_webview(&app_handle, AppEvent::ExternalNavigation, url);
}
