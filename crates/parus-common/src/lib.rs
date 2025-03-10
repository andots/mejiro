use serde::Deserialize;
use tauri::Manager;

use std::fs;
use std::path::{Path, PathBuf};

pub const MAINWINDOW_LABEL: &str = "main";
pub const APP_WEBVIEW_LABEL: &str = "app";
pub const EXTERNAL_WEBVIEW_LABEL: &str = "external";

/// Deserialize or return Default
pub fn deserialize_from_file<T, P>(path: P) -> T
where
    T: for<'de> Deserialize<'de> + Default,
    P: AsRef<Path>,
{
    match fs::File::open(path) {
        Ok(file) => {
            let reader = std::io::BufReader::new(file);
            match serde_json::from_reader(reader) {
                Ok(data) => data,
                Err(e) => {
                    log::warn!("Failed to deserialize, return Default: {:?}", e);
                    T::default()
                }
            }
        }
        Err(e) => {
            log::warn!("Failed to open file, return Default: {:?}", e);
            T::default()
        }
    }
}

/// Get the app directory (DATA_DIR/${bundle_identifier}) and create it if not exists.
/// This function will panic if it fails to get the app dir.
/// |Platform | Value                                    | Example                                  |
/// | ------- | ---------------------------------------- | ---------------------------------------- |
/// | Linux   | `$XDG_DATA_HOME` or `$HOME`/.local/share | /home/alice/.local/share                 |
/// | macOS   | `$HOME`/Library/Application Support      | /Users/Alice/Library/Application Support |
/// | Windows | `{FOLDERID_RoamingAppData}`              | C:\Users\Alice\AppData\Roaming           |
pub fn get_app_dir<R>(app_handle: tauri::AppHandle<R>) -> PathBuf
where
    R: tauri::Runtime,
{
    let path = app_handle
        .path()
        .app_data_dir()
        .expect("Failed to get app data dir");

    match path.try_exists() {
        Ok(exists) => {
            if !exists {
                // create the app dir if it doesn't exist
                fs::create_dir_all(&path).expect("Failed to create app config dir");
                log::info!("App data dir created: {:?}", path);
            }
            path
        }
        Err(e) => {
            log::error!("Error checking app data dir: {:?}", e);
            panic!("Failed to check app data dir");
        }
    }
}
