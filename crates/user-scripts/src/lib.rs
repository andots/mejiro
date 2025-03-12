mod models;

// use std::{fs, sync::Mutex};

// use parus_common::{AppHandlePathExt, Error};
// use tauri::Manager;

const PLUGIN_NAME: &str = "user-scripts";

// trait AppHandleExt {}

// impl<R: tauri::Runtime> AppHandleExt for tauri::AppHandle<R> {}

/// Initializes the plugin.
pub fn init<R: tauri::Runtime>() -> tauri::plugin::TauriPlugin<R> {
    tauri::plugin::Builder::new(PLUGIN_NAME)
        .invoke_handler(tauri::generate_handler![])
        .setup(|_app, _api| Ok(()))
        .build()
}
