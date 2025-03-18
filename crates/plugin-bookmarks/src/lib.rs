mod commands;
mod models;

use std::{fs, sync::Mutex};

use tauri::Manager;

use parus_bookmark::bookmarks::Bookmarks;
use parus_common::{AppHandlePathExt, Error};

const PLUGIN_NAME: &str = "bookmarks";

trait AppHandleExt {
    fn load_bookmarks(&self) -> Bookmarks;
    fn save_bookmarks(&self) -> Result<(), Error>;
}

impl<R: tauri::Runtime> AppHandleExt for tauri::AppHandle<R> {
    fn load_bookmarks(&self) -> Bookmarks {
        let path = self.bookmarks_path();
        if path.exists() {
            log::info!("Bookmarks file found: {:?}", path);
            // create backup before loading
            let backup_path = path.with_extension("bak");
            match fs::copy(&path, &backup_path) {
                Ok(_) => {
                    log::info!("Backup created: {:?}", backup_path);
                }
                Err(e) => {
                    log::warn!("Failed to create backup: {:?}", e);
                }
            }
            match Bookmarks::load_from_file(path) {
                Ok(bookmarks) => bookmarks,
                Err(e) => {
                    log::warn!("Load default bookmarks: {:?}", e);
                    Bookmarks::default()
                }
            }
        } else {
            log::warn!(
                "Bookmarks file not found, load default bookmarks: {:?}",
                path
            );
            Bookmarks::default()
        }
    }

    fn save_bookmarks(&self) -> Result<(), Error> {
        let path = self.bookmarks_path();
        let state = self.state::<Mutex<Bookmarks>>();
        let bookmarks = state
            .lock()
            .map_err(|_| Error::Mutex("can't lock bookmarks".to_string()))?;

        bookmarks.save_to_file(path)?;

        Ok(())
    }
}

/// Initializes the plugin.
pub fn init<R: tauri::Runtime>() -> tauri::plugin::TauriPlugin<R> {
    tauri::plugin::Builder::new(PLUGIN_NAME)
        .invoke_handler(tauri::generate_handler![
            commands::get_nested_json,
            commands::get_root_and_children_folders,
            commands::get_toolbar_bookmarks,
            commands::add_bookmark,
            commands::append_bookmark_to_toolbar,
            commands::remove_bookmark,
            commands::update_bookmark_title,
            commands::add_folder,
            commands::insert_after,
            commands::insert_before,
            commands::append_to_child,
            commands::prepend_to_child,
            commands::set_is_open,
            commands::toggle_is_open,
        ])
        .setup(|app, _api| {
            let bookmarks = app.load_bookmarks();
            app.manage(Mutex::new(bookmarks));
            Ok(())
        })
        .on_event(|app_handle, event| match event {
            tauri::RunEvent::Ready => {}
            tauri::RunEvent::Exit => {
                let _ = app_handle.save_bookmarks();
            }
            _ => {}
        })
        .build()
}
