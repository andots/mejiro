use std::{
    fs::{self},
    sync::Mutex,
};

use tauri::{Manager, Runtime};

use mejiro_core::bookmarks::Bookmarks;
use parus_common::AppHandlePathExt;

use crate::error::AppError;

pub trait AppHandleExt {
    fn get_default_app_title(&self) -> String;

    fn load_bookmarks(&self) -> Bookmarks;
    fn save_bookmarks(&self) -> Result<(), AppError>;
}

impl<R: Runtime> AppHandleExt for tauri::AppHandle<R> {
    /// Get the default title of the app. The title is in the format of "name - version".
    fn get_default_app_title(&self) -> String {
        format!(
            "{} - v{}",
            self.package_info().name,
            self.package_info().version
        )
    }

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

    fn save_bookmarks(&self) -> Result<(), AppError> {
        let path = self.bookmarks_path();
        let state = self.state::<Mutex<Bookmarks>>();
        let bookmarks = state
            .lock()
            .map_err(|_| AppError::Mutex("can't lock bookmarks".to_string()))?;

        bookmarks.save_to_file(path)?;

        Ok(())
    }
}
