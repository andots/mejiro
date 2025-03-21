use std::sync::Mutex;

use serde::Serialize;

use parus_bookmark::{
    bookmarks::{Bookmarks, NestedBookmark},
    data::{FolderData, ToolbarBookmarkData},
};
use parus_common::Error;

#[derive(Serialize)]
pub struct BookmarkResponse {
    index: usize,
    bookmarks: NestedBookmark,
}

#[tauri::command]
pub fn get_nested_json(
    state: tauri::State<'_, Mutex<Bookmarks>>,
    index: usize,
) -> Result<NestedBookmark, Error> {
    if index == 0 {
        return Err(Error::Other("index should not be 0".to_string()));
    }
    let bookmarks = state
        .lock()
        .map_err(|_| Error::Mutex("can't get bookmarks".to_string()))?;
    Ok(bookmarks.to_nested_bookmark(index)?)
}

#[tauri::command]
pub fn get_root_and_children_folders(
    state: tauri::State<'_, Mutex<Bookmarks>>,
) -> Result<Vec<FolderData>, Error> {
    let bookmarks = state
        .lock()
        .map_err(|_| Error::Mutex("can't get bookmarks".to_string()))?;
    Ok(bookmarks.get_root_and_children_folders()?)
}

#[tauri::command]
pub fn get_toolbar_bookmarks(
    state: tauri::State<'_, Mutex<Bookmarks>>,
) -> Result<Vec<ToolbarBookmarkData>, Error> {
    let bookmarks = state
        .lock()
        .map_err(|_| Error::Mutex("can't get bookmarks".to_string()))?;
    Ok(bookmarks.get_toolbar_bookmarks())
}

#[tauri::command]
pub fn add_bookmark(
    state: tauri::State<'_, Mutex<Bookmarks>>,
    title: String,
    url: String,
    top_level_index: usize,
) -> Result<BookmarkResponse, Error> {
    let mut bookmarks = state
        .lock()
        .map_err(|_| Error::Mutex("can't get bookmarks".to_string()))?;
    let index = bookmarks.add_bookmark(&title, &url, top_level_index)?;
    let nested = bookmarks.to_nested_bookmark(top_level_index)?;

    Ok(BookmarkResponse {
        index,
        bookmarks: nested,
    })
}

#[tauri::command]
pub fn append_bookmark_to_toolbar(
    state: tauri::State<'_, Mutex<Bookmarks>>,
    title: String,
    url: String,
    top_level_index: usize,
) -> Result<NestedBookmark, Error> {
    let mut bookmarks = state
        .lock()
        .map_err(|_| Error::Mutex("can't get bookmarks".to_string()))?;
    bookmarks.append_bookmark_to_toolbar(&title, &url)?;

    Ok(bookmarks.to_nested_bookmark(top_level_index)?)
}

#[tauri::command]
pub fn remove_bookmark(
    state: tauri::State<'_, Mutex<Bookmarks>>,
    index: usize,
    top_level_index: usize,
) -> Result<NestedBookmark, Error> {
    let mut bookmarks = state
        .lock()
        .map_err(|_| Error::Mutex("can't get bookmarks".to_string()))?;
    bookmarks.remove_subtree(index)?;

    Ok(bookmarks.to_nested_bookmark(top_level_index)?)
}

#[tauri::command]
pub fn update_bookmark_title(
    state: tauri::State<'_, Mutex<Bookmarks>>,
    index: usize,
    title: String,
    top_level_index: usize,
) -> Result<NestedBookmark, Error> {
    let mut bookmarks = state
        .lock()
        .map_err(|_| Error::Mutex("can't get bookmarks".to_string()))?;
    bookmarks.update_title(index, title)?;

    Ok(bookmarks.to_nested_bookmark(top_level_index)?)
}

#[tauri::command]
pub fn add_folder(
    state: tauri::State<'_, Mutex<Bookmarks>>,
    parent_index: usize,
    title: String,
    top_level_index: usize,
) -> Result<BookmarkResponse, Error> {
    let mut bookmarks = state
        .lock()
        .map_err(|_| Error::Mutex("can't get bookmarks".to_string()))?;

    let index = bookmarks.add_folder(parent_index, &title)?;
    let nested = bookmarks.to_nested_bookmark(top_level_index)?;

    Ok(BookmarkResponse {
        index,
        bookmarks: nested,
    })
}

#[tauri::command]
pub fn insert_after(
    state: tauri::State<'_, Mutex<Bookmarks>>,
    source_index: usize,
    destination_index: usize,
    top_level_index: usize,
) -> Result<NestedBookmark, Error> {
    let mut bookmarks = state
        .lock()
        .map_err(|_| Error::Mutex("can't get bookmarks".to_string()))?;
    bookmarks.insert_after(source_index, destination_index)?;

    Ok(bookmarks.to_nested_bookmark(top_level_index)?)
}

#[tauri::command]
pub fn insert_before(
    state: tauri::State<'_, Mutex<Bookmarks>>,
    source_index: usize,
    destination_index: usize,
    top_level_index: usize,
) -> Result<NestedBookmark, Error> {
    let mut bookmarks = state
        .lock()
        .map_err(|_| Error::Mutex("can't get bookmarks".to_string()))?;
    bookmarks.insert_before(source_index, destination_index)?;

    Ok(bookmarks.to_nested_bookmark(top_level_index)?)
}

#[tauri::command]
pub fn append_to_child(
    state: tauri::State<'_, Mutex<Bookmarks>>,
    source_index: usize,
    destination_index: usize,
    top_level_index: usize,
) -> Result<NestedBookmark, Error> {
    let mut bookmarks = state
        .lock()
        .map_err(|_| Error::Mutex("can't get bookmarks".to_string()))?;
    bookmarks.append_to_child(source_index, destination_index)?;

    Ok(bookmarks.to_nested_bookmark(top_level_index)?)
}

#[tauri::command]
pub fn prepend_to_child(
    state: tauri::State<'_, Mutex<Bookmarks>>,
    source_index: usize,
    destination_index: usize,
    top_level_index: usize,
) -> Result<NestedBookmark, Error> {
    let mut bookmarks = state
        .lock()
        .map_err(|_| Error::Mutex("can't get bookmarks".to_string()))?;
    bookmarks.prepend_to_child(source_index, destination_index)?;

    Ok(bookmarks.to_nested_bookmark(top_level_index)?)
}

#[tauri::command]
pub fn set_is_open(
    state: tauri::State<'_, Mutex<Bookmarks>>,
    index: usize,
    is_open: bool,
    top_level_index: usize,
) -> Result<NestedBookmark, Error> {
    let mut bookmarks = state
        .lock()
        .map_err(|_| Error::Mutex("can't get bookmarks".to_string()))?;
    bookmarks.set_is_open(index, is_open)?;

    Ok(bookmarks.to_nested_bookmark(top_level_index)?)
}

#[tauri::command]
pub fn toggle_is_open(
    state: tauri::State<'_, Mutex<Bookmarks>>,
    index: usize,
    top_level_index: usize,
) -> Result<NestedBookmark, Error> {
    let mut bookmarks = state
        .lock()
        .map_err(|_| Error::Mutex("can't get bookmarks".to_string()))?;
    bookmarks.toggle_is_open(index)?;

    Ok(bookmarks.to_nested_bookmark(top_level_index)?)
}
