use std::sync::Mutex;

use mejiro_core::tree::BookmarkArena;

use crate::{
    error::AppError,
    events::{emit_to_app_webview, AppEvent},
};

#[tauri::command]
pub async fn get_nested_json(
    state: tauri::State<'_, Mutex<BookmarkArena>>,
) -> Result<String, AppError> {
    let arena = state
        .lock()
        .map_err(|_| AppError::Mutex("can't get bookmarks".to_string()))?;
    Ok(arena.to_nested_json(1)?)
}

#[tauri::command]
pub async fn add_bookmark(
    app_handle: tauri::AppHandle,
    state: tauri::State<'_, Mutex<BookmarkArena>>,
    url: String,
    title: Option<String>,
) -> Result<(), AppError> {
    let mut arena = state
        .lock()
        .map_err(|_| AppError::Mutex("can't get bookmarks".to_string()))?;
    arena.add_bookmark(url, title)?;

    emit_to_app_webview(
        &app_handle,
        AppEvent::BookmarkUpdated,
        arena.to_nested_json(1)?,
    )?;

    Ok(())
}
