use serde::{Deserialize, Serialize};
use tauri::{Manager, PhysicalPosition, PhysicalSize, Position, Rect, Size, Url};

use crate::{
    constants::{APP_WEBVIEW_LABEL, EXTERNAL_WEBVIEW_LABEL},
    error::AppError,
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
///https://docs.rs/tauri/latest/tauri/struct.Rect.html
impl From<WebviewBounds> for Rect {
    fn from(val: WebviewBounds) -> Self {
        Rect {
            size: Size::Physical(val.size),
            position: Position::Physical(val.position),
        }
    }
}

/// Get the app webview
fn get_app_webview(app_handle: tauri::AppHandle) -> Result<tauri::Webview, AppError> {
    app_handle
        .get_webview(APP_WEBVIEW_LABEL)
        .ok_or(AppError::WebviewNotFound)
}

/// Get the external webview
fn get_external_webview(app_handle: tauri::AppHandle) -> Result<tauri::Webview, AppError> {
    app_handle
        .get_webview(EXTERNAL_WEBVIEW_LABEL)
        .ok_or(AppError::WebviewNotFound)
}

/// Get the size and position of the app webview
#[tauri::command]
pub fn get_app_webview_bounds(app_handle: tauri::AppHandle) -> Result<Rect, AppError> {
    let webview = get_app_webview(app_handle)?;
    let bounds = webview.bounds()?;
    log::debug!("{:?}", bounds);
    Ok(bounds)
}

/// Get the size and position of the external webview
#[tauri::command]
pub fn get_external_webview_bounds(app_handle: tauri::AppHandle) -> Result<Rect, AppError> {
    let webview = get_external_webview(app_handle)?;
    let bounds = webview.bounds()?;
    log::debug!("{:?}", bounds);
    Ok(bounds)
}

/// Set the size and position of the external webview
#[tauri::command]
pub fn set_external_webview_bounds(
    app_handle: tauri::AppHandle,
    bounds: WebviewBounds,
) -> Result<(), AppError> {
    let webview = get_external_webview(app_handle)?;
    webview.set_bounds(bounds.into())?;
    Ok(())
}

/// Get the URL of the external webview
#[tauri::command]
pub fn get_external_webview_url(app_handle: tauri::AppHandle) -> Result<String, AppError> {
    let webview = get_external_webview(app_handle)?;
    let url = webview.url()?;
    Ok(url.to_string())
}

/// Get the size of the external webview
#[tauri::command]
pub fn get_external_webview_size(
    app_handle: tauri::AppHandle,
) -> Result<PhysicalSize<u32>, AppError> {
    let webview = get_external_webview(app_handle)?;
    let size = webview.size()?;
    log::debug!("size: {:?}", size);
    Ok(size)
}

/// Get the position of the external webview
#[tauri::command]
pub fn get_external_webview_position(
    app_handle: tauri::AppHandle,
) -> Result<PhysicalPosition<i32>, AppError> {
    let webview = get_external_webview(app_handle)?;
    let pos = webview.position()?;
    log::debug!("pos: {:?}", pos);
    Ok(pos)
}

/// Navigate the external webview to the given URL
#[tauri::command]
pub fn navigate_webview_url(app_handle: tauri::AppHandle, url: String) -> Result<(), AppError> {
    let parsed_url = Url::parse(&url).map_err(tauri::Error::InvalidUrl)?;
    let mut webview = get_external_webview(app_handle)?;
    webview.navigate(parsed_url)?;
    Ok(())
}

/// Hide the external webview
#[tauri::command]
pub fn hide_external_webview(app_handle: tauri::AppHandle) -> Result<(), AppError> {
    let webview = get_external_webview(app_handle)?;
    webview.hide()?;
    Ok(())
}

/// Show the external webview
#[tauri::command]
pub fn show_external_webview(app_handle: tauri::AppHandle) -> Result<(), AppError> {
    let webview = get_external_webview(app_handle)?;
    webview.show()?;
    Ok(())
}
