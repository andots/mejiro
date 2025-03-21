use serde::Serialize;
use tauri::{Emitter, Manager};

use parus_common::{
    constants::{APP_WEBVIEW_LABEL, EXTERNAL_WEBVIEW_LABEL, MAINWINDOW_LABEL},
    AppEvent, AppHandleAppExt,
};

fn emit_to_app_webview<R, S>(
    app_handle: &tauri::AppHandle<R>,
    event: AppEvent,
    payload: S,
) -> Result<(), tauri::Error>
where
    R: tauri::Runtime,
    S: Serialize + Clone,
{
    app_handle.emit_to(
        tauri::EventTarget::webview(APP_WEBVIEW_LABEL),
        event.as_ref(),
        payload,
    )
}

#[tauri::command]
pub fn send_page_title<R: tauri::Runtime>(app_handle: tauri::AppHandle<R>, title: String) {
    let _ = emit_to_app_webview(&app_handle, AppEvent::ExternalTitleChanged, title.clone());
    if let Some(window) = app_handle.get_window(MAINWINDOW_LABEL) {
        let new_title = format!("{} | {}", title, app_handle.get_default_app_title());
        let _ = window.set_title(&new_title);
    }
}

#[tauri::command]
pub fn send_page_url<R: tauri::Runtime>(app_handle: tauri::AppHandle<R>, url: String) {
    let _ = emit_to_app_webview(&app_handle, AppEvent::ExternalUrlChanged, url);
}

/// Get the title of the external webview by evaluating a JavaScript
/// script sending title to send_page_title and it emits to app webview
#[tauri::command]
pub fn get_external_webview_title<R: tauri::Runtime>(app_handle: tauri::AppHandle<R>) {
    if let Some(webview) = app_handle.get_webview(EXTERNAL_WEBVIEW_LABEL) {
        let _ = webview.eval(include_str!("js/get-title.js"));
    }
}

#[tauri::command]
pub fn history_back<R: tauri::Runtime>(app_handle: tauri::AppHandle<R>) {
    if let Some(webview) = app_handle.get_webview(EXTERNAL_WEBVIEW_LABEL) {
        let _ = webview.eval(include_str!("js/history-back.js"));
    }
}

#[tauri::command]
pub fn history_forward<R: tauri::Runtime>(app_handle: tauri::AppHandle<R>) {
    if let Some(webview) = app_handle.get_webview(EXTERNAL_WEBVIEW_LABEL) {
        let _ = webview.eval(include_str!("js/history-forward.js"));
    }
}
