use tauri::Manager;

use parus_common::constants::MAINWINDOW_LABEL;
use parus_common::AppHandleAppExt;

use crate::events::{emit_to_app_webview, AppEvent};

#[tauri::command]
pub fn send_page_title(app_handle: tauri::AppHandle, title: String) {
    let _ = emit_to_app_webview(&app_handle, AppEvent::ExternalTitleChanged, title.clone());
    if let Some(window) = app_handle.get_window(MAINWINDOW_LABEL) {
        let new_title = format!("{} | {}", title, app_handle.get_default_app_title());
        let _ = window.set_title(&new_title);
    }
}

#[tauri::command]
pub fn send_page_url(app_handle: tauri::AppHandle, url: String) {
    let _ = emit_to_app_webview(&app_handle, AppEvent::ExternalUrlChanged, url);
}
