use std::sync::Mutex;

use mejiro_core::{bookmarks::Bookmarks, data::FolderData};

use crate::error::AppError;

#[tauri::command]
pub async fn get_nested_json(
    state: tauri::State<'_, Mutex<Bookmarks>>,
    index: usize,
) -> Result<String, AppError> {
    if index == 0 {
        return Err(AppError::Other("index should not be 0".to_string()));
    }
    let bookmarks = state
        .lock()
        .map_err(|_| AppError::Mutex("can't get bookmarks".to_string()))?;
    Ok(bookmarks.to_nested_json(index)?)
}

#[tauri::command]
pub fn get_root_children_folder(
    state: tauri::State<'_, Mutex<Bookmarks>>,
) -> Result<Vec<FolderData>, AppError> {
    let bookmarks = state
        .lock()
        .map_err(|_| AppError::Mutex("can't get bookmarks".to_string()))?;
    let children = bookmarks.get_root_children_folder()?;
    Ok(children)
}

#[tauri::command]
pub async fn add_bookmark(
    state: tauri::State<'_, Mutex<Bookmarks>>,
    url: String,
    title: Option<String>,
    starting_index: usize,
) -> Result<String, AppError> {
    let mut bookmarks = state
        .lock()
        .map_err(|_| AppError::Mutex("can't get bookmarks".to_string()))?;
    bookmarks.add_bookmark(url, title, starting_index)?;

    Ok(bookmarks.to_nested_json(starting_index)?)
}

#[tauri::command]
pub fn remove_bookmark(
    state: tauri::State<'_, Mutex<Bookmarks>>,
    index: usize,
    starting_index: usize,
) -> Result<String, AppError> {
    let mut bookmarks = state
        .lock()
        .map_err(|_| AppError::Mutex("can't get bookmarks".to_string()))?;
    bookmarks.remove_subtree(index)?;

    Ok(bookmarks.to_nested_json(starting_index)?)
}
