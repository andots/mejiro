#![allow(dead_code)]

use std::{fs, io::Write, path::PathBuf, sync::Mutex};

use mejiro_core::tree::BookmarkArena;
use strum::AsRefStr;
use tauri::{Manager, Runtime};

use crate::{
    constants::MAINWINDOW_LABEL, error::AppError, settings::UserSettings, window::WindowGeometry,
};

#[derive(AsRefStr)]
pub enum FileName {
    #[strum(serialize = "bookmarks.json")]
    Bookmarks,
    #[strum(serialize = "settings.json")]
    Settings,
    #[strum(serialize = "window_geometry.json")]
    WindowGeometry,
}

pub trait AppHandleExt {
    fn get_defautl_title(&self) -> String;
    fn get_app_dir(&self) -> PathBuf;
    fn get_file_path_from_app_dir(&self, file_name: FileName) -> PathBuf;
    fn get_bookmarks_file_path(&self) -> PathBuf;
    fn get_settings_file_path(&self) -> PathBuf;
    fn get_window_geometry_file_path(&self) -> PathBuf;
    fn load_user_settings(&self) -> UserSettings;
    fn save_user_settings(&self) -> Result<(), AppError>;
    fn load_window_geometry(&self) -> WindowGeometry;
    fn save_window_geometry(&self) -> Result<(), AppError>;
    fn load_bookmark_arena(&self) -> BookmarkArena;
    fn save_bookmark_arena(&self) -> Result<(), AppError>;
}

impl<R: Runtime> AppHandleExt for tauri::AppHandle<R> {
    /// Get the default title of the app. The title is in the format of "name - version".
    fn get_defautl_title(&self) -> String {
        format!(
            "{} - v{}",
            self.package_info().name,
            self.package_info().version
        )
    }

    /// Get the app directory (DATA_DIR/${bundle_identifier}) and create it if not exists.
    /// This function will panic if it fails to get the app config dir.
    /// |Platform | Value                                    | Example                                  |
    /// | ------- | ---------------------------------------- | ---------------------------------------- |
    /// | Linux   | `$XDG_DATA_HOME` or `$HOME`/.local/share | /home/alice/.local/share                 |
    /// | macOS   | `$HOME`/Library/Application Support      | /Users/Alice/Library/Application Support |
    /// | Windows | `{FOLDERID_RoamingAppData}`              | C:\Users\Alice\AppData\Roaming           |
    fn get_app_dir(&self) -> PathBuf {
        let path = self
            .path()
            .app_data_dir()
            .expect("failed to get app config dir");
        match path.try_exists() {
            Ok(exists) => {
                if !exists {
                    // create the app config dir if it doesn't exist
                    fs::create_dir_all(path.clone()).expect("failed to create app config dir");
                }
            }
            Err(e) => {
                log::error!("Error checking app config dir: {:?}", e);
            }
        }
        path
    }

    fn get_file_path_from_app_dir(&self, file_name: FileName) -> PathBuf {
        self.get_app_dir().join(file_name.as_ref())
    }

    fn get_bookmarks_file_path(&self) -> PathBuf {
        self.get_file_path_from_app_dir(FileName::Bookmarks)
    }

    fn get_settings_file_path(&self) -> PathBuf {
        self.get_file_path_from_app_dir(FileName::Settings)
    }

    fn get_window_geometry_file_path(&self) -> PathBuf {
        self.get_file_path_from_app_dir(FileName::WindowGeometry)
    }

    fn load_user_settings(&self) -> UserSettings {
        let path = self.get_settings_file_path();
        match fs::File::open(path) {
            Ok(file) => {
                let reader = std::io::BufReader::new(file);
                match serde_json::from_reader(reader) {
                    Ok(settings) => settings,
                    Err(e) => {
                        log::warn!("Load default settings: {:?}", e);
                        UserSettings::default()
                    }
                }
            }
            Err(e) => {
                log::warn!("Load default settings: {:?}", e);
                UserSettings::default()
            }
        }
    }

    fn save_user_settings(&self) -> Result<(), AppError> {
        let state = self.state::<Mutex<UserSettings>>();
        let value = state
            .lock()
            .map_err(|_| AppError::Mutex("can't get settings".to_string()))?;
        let settings = UserSettings {
            language: value.language.clone(),
            theme: value.theme.clone(),
            gpu_acceleration_enabled: value.gpu_acceleration_enabled,
            incognito: value.incognito,
            start_page_url: value.start_page_url.clone(),
            pinned_urls: value.pinned_urls.clone(),
        };
        let path = self.get_settings_file_path();
        let file = fs::File::create(path)?;
        serde_json::to_writer_pretty(file, &settings)?;
        Ok(())
    }

    fn load_window_geometry(&self) -> WindowGeometry {
        let path = self.get_window_geometry_file_path();
        match fs::File::open(path) {
            Ok(file) => {
                let reader = std::io::BufReader::new(file);
                match serde_json::from_reader(reader) {
                    Ok(geometry) => geometry,
                    Err(e) => {
                        log::warn!("Load default window geometry: {:?}", e);
                        WindowGeometry::default()
                    }
                }
            }
            Err(e) => {
                log::warn!("Load default window geometry: {:?}", e);
                WindowGeometry::default()
            }
        }
    }

    fn save_window_geometry(&self) -> Result<(), AppError> {
        if let Some(window) = self.get_window(MAINWINDOW_LABEL) {
            let size = window.inner_size()?;
            let position = window.outer_position()?;
            let sidebar_width = 200.0;
            let header_height = 40.0;
            let geometry = WindowGeometry {
                width: size.width as f64,
                height: size.height as f64,
                x: position.x as f64,
                y: position.y as f64,
                sidebar_width,
                header_height,
            };
            let path = self.get_window_geometry_file_path();
            let file = fs::File::create(path)?;
            serde_json::to_writer(file, &geometry)?;
        }
        Ok(())
    }

    fn load_bookmark_arena(&self) -> BookmarkArena {
        let path = self.get_bookmarks_file_path();
        match BookmarkArena::create_arena_from_file(path) {
            Ok(v) => v,
            Err(e) => {
                log::warn!("Load default bookmarks: {:?}", e);
                BookmarkArena::default()
            }
        }
    }

    fn save_bookmark_arena(&self) -> Result<(), AppError> {
        let path = self.get_bookmarks_file_path();
        let mut file = fs::File::create(path)?;

        let state = self.state::<Mutex<BookmarkArena>>();
        let arena = state
            .lock()
            .map_err(|_| AppError::Mutex("can't lock bookmarks".to_string()))?;
        let json = arena.to_json()?;
        file.write_all(json.as_bytes())?;

        Ok(())
    }
}
