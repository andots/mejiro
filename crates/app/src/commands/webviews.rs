use serde::{Deserialize, Serialize};
use tauri::{PhysicalPosition, PhysicalSize, Position, Rect, Size, Url};

use crate::{
    error::AppError,
    window::{get_app_webview, get_external_webview},
};

// https://v2.tauri.app/develop/calling-rust/

/// Size and position of the webview
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WebviewBounds {
    size: PhysicalSize<u32>,
    position: PhysicalPosition<i32>,
}

/// Convert WebviewBounds to Rect
/// Serialize is implemented for Rect but not Deserialize, so we need to convert it
/// https://docs.rs/tauri/latest/tauri/struct.Rect.html
impl From<WebviewBounds> for Rect {
    fn from(val: WebviewBounds) -> Self {
        Rect {
            size: Size::Physical(val.size),
            position: Position::Physical(val.position),
        }
    }
}

/// Get the size and position of the app webview
#[tauri::command]
pub fn get_app_webview_bounds(app_handle: tauri::AppHandle) -> Result<Rect, AppError> {
    let webview = get_app_webview(&app_handle)?;
    let bounds = webview.bounds()?;
    Ok(bounds)
}

/// Navigate the external webview to the given URL
#[tauri::command]
pub fn navigate_webview_url(app_handle: tauri::AppHandle, url: String) -> Result<(), AppError> {
    let parsed_url = Url::parse(&url).map_err(tauri::Error::InvalidUrl)?;
    let webview = get_external_webview(&app_handle)?;
    webview.navigate(parsed_url)?;
    Ok(())
}

/// Get the title of the external webview by evaluating a JavaScript
/// script sending title to send_page_title and it emits to app webview
#[tauri::command]
pub fn get_external_webview_title(app_handle: tauri::AppHandle) -> Result<(), AppError> {
    let webview = get_external_webview(&app_handle)?;
    let _ = webview.eval(include_str!("../../js/get-title.js"));
    Ok(())
}

/// Set the size and position of the external webview
#[tauri::command]
pub fn set_external_webview_bounds(
    app_handle: tauri::AppHandle,
    bounds: WebviewBounds,
) -> Result<(), AppError> {
    let webview = get_external_webview(&app_handle)?;
    webview.set_bounds(bounds.into())?;
    Ok(())
}

/// Show the external webview
#[tauri::command]
pub fn show_external_webview(app_handle: tauri::AppHandle) -> Result<(), AppError> {
    let webview = get_external_webview(&app_handle)?;
    webview.show()?;
    Ok(())
}

/// Hide the external webview
#[tauri::command]
pub fn hide_external_webview(app_handle: tauri::AppHandle) -> Result<(), AppError> {
    let webview = get_external_webview(&app_handle)?;
    webview.hide()?;
    Ok(())
}
