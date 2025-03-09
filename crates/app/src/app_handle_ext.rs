use std::{
    fs::{self},
    path::{Path, PathBuf},
    sync::Mutex,
};

use mejiro_core::bookmarks::Bookmarks;
use serde::Deserialize;
use strum::AsRefStr;
use tauri::{Manager, Runtime};

use crate::{
    constants::{DEFAUTL_HEADER_HEIGHT, EXTERNAL_WEBVIEW_LABEL, MAINWINDOW_LABEL},
    error::AppError,
    settings::{AppSettings, UserSettings, WindowGeometry},
};

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

fn deserialize_from_file<T, P>(path: P) -> T
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

pub trait AppHandleExt {
    fn get_default_app_title(&self) -> String;

    fn get_app_dir(&self) -> PathBuf;
    fn get_file_path_from_app_dir(&self, file_name: FileName) -> PathBuf;

    fn get_app_settings_file_path(&self) -> PathBuf;
    fn load_app_settings(&self) -> AppSettings;
    fn save_app_settings(&self) -> Result<(), AppError>;
    fn sync_last_visited_url(&self) -> Result<(), AppError>;

    fn get_window_geometry_file_path(&self) -> PathBuf;
    fn load_window_geometry(&self) -> WindowGeometry;
    fn save_window_geometry(&self) -> Result<(), AppError>;

    fn get_user_settings_file_path(&self) -> PathBuf;
    fn load_user_settings(&self) -> UserSettings;
    fn save_user_settings(&self) -> Result<(), AppError>;

    fn get_bookmarks_file_path(&self) -> PathBuf;
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

    /// Get the app directory (DATA_DIR/${bundle_identifier}) and create it if not exists.
    /// This function will panic if it fails to get the app dir.
    /// |Platform | Value                                    | Example                                  |
    /// | ------- | ---------------------------------------- | ---------------------------------------- |
    /// | Linux   | `$XDG_DATA_HOME` or `$HOME`/.local/share | /home/alice/.local/share                 |
    /// | macOS   | `$HOME`/Library/Application Support      | /Users/Alice/Library/Application Support |
    /// | Windows | `{FOLDERID_RoamingAppData}`              | C:\Users\Alice\AppData\Roaming           |
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

    fn get_file_path_from_app_dir(&self, file_name: FileName) -> PathBuf {
        self.get_app_dir().join(file_name.as_ref())
    }

    fn get_app_settings_file_path(&self) -> PathBuf {
        self.get_file_path_from_app_dir(FileName::AppSettings)
    }

    fn load_app_settings(&self) -> AppSettings {
        let path = self.get_app_settings_file_path();
        deserialize_from_file(path)
    }

    fn save_app_settings(&self) -> Result<(), AppError> {
        let path = self.get_app_settings_file_path();
        let file = fs::File::create(path)?;
        if let Some(state) = self.try_state::<Mutex<AppSettings>>() {
            let settings = state
                .lock()
                .map_err(|_| AppError::Mutex("can't get settings".to_string()))?;
            serde_json::to_writer_pretty(file, &settings.clone())?;
        }
        Ok(())
    }

    /// Sync external url with start_page_url in AppSettings for last visited url
    fn sync_last_visited_url(&self) -> Result<(), AppError> {
        if let Some(external) = self.get_webview(EXTERNAL_WEBVIEW_LABEL) {
            if let Some(state) = self.try_state::<Mutex<AppSettings>>() {
                let url = external.url()?;
                let mut settings = state
                    .lock()
                    .map_err(|_| AppError::Mutex("can't get settings".to_string()))?;
                settings.start_page_url = url.to_string();
            }
        }
        Ok(())
    }

    fn get_window_geometry_file_path(&self) -> PathBuf {
        self.get_file_path_from_app_dir(FileName::WindowGeometry)
    }

    fn load_window_geometry(&self) -> WindowGeometry {
        let path = self.get_window_geometry_file_path();
        deserialize_from_file(path)
    }

    fn save_window_geometry(&self) -> Result<(), AppError> {
        let (main_window, external) = match (
            self.get_window(MAINWINDOW_LABEL),
            self.get_webview(EXTERNAL_WEBVIEW_LABEL),
        ) {
            (Some(main_window), Some(external)) => (main_window, external),
            _ => return Err(AppError::WebviewNotFound),
        };
        let main_size = main_window.inner_size()?;
        let main_position = main_window.outer_position()?;
        let external_size = external.size()?;
        let geometry = WindowGeometry {
            width: main_size.width as f64,
            height: main_size.height as f64,
            x: main_position.x as f64,
            y: main_position.y as f64,
            sidebar_width: (main_size.width - external_size.width) as f64,
            header_height: DEFAUTL_HEADER_HEIGHT,
        };
        let path = self.get_window_geometry_file_path();
        let file = fs::File::create(path)?;
        serde_json::to_writer(file, &geometry)?;
        Ok(())
    }

    fn get_user_settings_file_path(&self) -> PathBuf {
        self.get_file_path_from_app_dir(FileName::UserSettings)
    }

    fn load_user_settings(&self) -> UserSettings {
        let path = self.get_user_settings_file_path();
        deserialize_from_file(path)
    }

    fn save_user_settings(&self) -> Result<(), AppError> {
        let path = self.get_user_settings_file_path();
        let file = fs::File::create(path)?;
        if let Some(state) = self.try_state::<Mutex<UserSettings>>() {
            let settings = state
                .lock()
                .map_err(|_| AppError::Mutex("can't get settings".to_string()))?;
            serde_json::to_writer_pretty(file, &settings.clone())?;
        }
        Ok(())
    }

    fn get_bookmarks_file_path(&self) -> PathBuf {
        self.get_file_path_from_app_dir(FileName::Bookmarks)
    }

    fn load_bookmarks(&self) -> Bookmarks {
        let path = self.get_bookmarks_file_path();
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
        let path = self.get_bookmarks_file_path();
        let state = self.state::<Mutex<Bookmarks>>();
        let bookmarks = state
            .lock()
            .map_err(|_| AppError::Mutex("can't lock bookmarks".to_string()))?;

        bookmarks.save_to_file(path)?;

        Ok(())
    }
}
