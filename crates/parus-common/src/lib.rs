use std::fs;
use std::path::{Path, PathBuf};

use serde::Deserialize;
use strum::AsRefStr;
use tauri::Manager;

pub const MAINWINDOW_LABEL: &str = "main";
pub const APP_WEBVIEW_LABEL: &str = "app";
pub const EXTERNAL_WEBVIEW_LABEL: &str = "external";

/// The file names are defined as an enum to prevent typos and to provide a centralized list of all data files.
/// Different file names should be used for debug and release builds to separate development and production data.
#[cfg(debug_assertions)]
#[derive(AsRefStr)]
pub enum FileName {
    #[strum(serialize = "dev-bookmarks.json")]
    Bookmarks,
    #[strum(serialize = "dev-app_settings.json")]
    AppSettings,
    #[strum(serialize = "dev-window_geometry.json")]
    WindowGeometry,
    #[strum(serialize = "dev-settings.json")]
    UserSettings,
    #[strum(serialize = "dev-favicons.db")]
    FaviconDatabase,
}

/// File names for release builds.
/// Bookmarks and window geometry data are stored in JSON format, but with a dot prefix and no extension name
/// to prevent accidental deletion or modification by users.
#[cfg(not(debug_assertions))]
#[derive(AsRefStr)]
pub enum FileName {
    #[strum(serialize = ".bookmarks")]
    Bookmarks,
    #[strum(serialize = ".app_settings")]
    AppSettings,
    #[strum(serialize = ".window_geometry")]
    WindowGeometry,
    #[strum(serialize = "settings.json")]
    UserSettings,
    #[strum(serialize = "favicons.db")]
    FaviconDatabase,
}

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

pub trait AppHandlePathExt {
    /// Get the app directory (DATA_DIR/${bundle_identifier}) and create it if not exists.
    /// This function will panic if it fails to get the app dir.
    /// |Platform | Value                                    | Example                                  |
    /// | ------- | ---------------------------------------- | ---------------------------------------- |
    /// | Linux   | `$XDG_DATA_HOME` or `$HOME`/.local/share | /home/alice/.local/share                 |
    /// | macOS   | `$HOME`/Library/Application Support      | /Users/Alice/Library/Application Support |
    /// | Windows | `{FOLDERID_RoamingAppData}`              | C:\Users\Alice\AppData\Roaming           |
    fn get_app_dir(&self) -> PathBuf;

    /// Get file path in application directory
    fn get_file_path_in_app_dir(&self, file_name: FileName) -> PathBuf;

    /// App settings file path
    fn app_settings_path(&self) -> PathBuf;

    /// Uer settings file path
    fn user_settings_path(&self) -> PathBuf;

    /// Bookmarks file path
    fn bookmarks_path(&self) -> PathBuf;

    /// Window geometry file path
    fn window_geometry_path(&self) -> PathBuf;

    /// Favicon database file path
    fn favicon_database_path(&self) -> PathBuf;
}

impl<R: tauri::Runtime> AppHandlePathExt for tauri::AppHandle<R> {
    fn get_app_dir(&self) -> PathBuf {
        let path = self
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

    fn get_file_path_in_app_dir(&self, file_name: FileName) -> PathBuf {
        self.get_app_dir().join(file_name.as_ref())
    }

    fn app_settings_path(&self) -> PathBuf {
        self.get_file_path_in_app_dir(FileName::AppSettings)
    }

    fn user_settings_path(&self) -> PathBuf {
        self.get_file_path_in_app_dir(FileName::UserSettings)
    }

    fn window_geometry_path(&self) -> PathBuf {
        self.get_file_path_in_app_dir(FileName::WindowGeometry)
    }

    fn bookmarks_path(&self) -> PathBuf {
        self.get_file_path_in_app_dir(FileName::Bookmarks)
    }

    fn favicon_database_path(&self) -> PathBuf {
        self.get_file_path_in_app_dir(FileName::FaviconDatabase)
    }
}
