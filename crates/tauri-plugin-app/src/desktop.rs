use std::fs;
use std::path::{Path, PathBuf};
use std::sync::Mutex;

use serde::de::DeserializeOwned;
use serde::Deserialize;
use tauri::Manager;
use tauri::{plugin::PluginApi, AppHandle, Runtime};

use crate::constants::{DEFAULT_HEADER_HEIGHT, EXTERNAL_WEBVIEW_LABEL, MAINWINDOW_LABEL};
use crate::file::FileName;
use crate::models::*;
use crate::Error;
use crate::WindowGeometry;

pub fn init<R: Runtime, C: DeserializeOwned>(
    app_handle: &AppHandle<R>,
    _api: PluginApi<R, C>,
) -> Result<PluginApp<R>, Error> {
    let plugin = PluginApp {
        app_handle: app_handle.clone(),
    };
    let window_geometry = plugin.load_window_geometry();
    app_handle.manage(Mutex::new(window_geometry));
    Ok(plugin)
}

/// Access to the app APIs.
pub struct PluginApp<R: Runtime> {
    app_handle: AppHandle<R>,
}

impl<R: Runtime> PluginApp<R> {
    pub fn ping(&self, payload: PingRequest) -> Result<PingResponse, Error> {
        Ok(PingResponse {
            value: payload.value,
        })
    }

    pub fn window_geometry(&self) -> tauri::State<'_, Mutex<WindowGeometry>> {
        self.app_handle.state::<Mutex<WindowGeometry>>()
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
            .app_handle
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

    fn get_file_path(&self, file_name: FileName) -> PathBuf {
        self.get_app_dir().join(file_name.as_ref())
    }

    fn get_window_geometry_file_path(&self) -> PathBuf {
        self.get_file_path(FileName::WindowGeometry)
    }

    pub fn load_window_geometry(&self) -> WindowGeometry {
        let path = self.get_window_geometry_file_path();
        deserialize_from_file(path)
    }

    pub fn save_window_geometry(&self) -> Result<(), Error> {
        let (main_window, external) = match (
            self.app_handle.get_window(MAINWINDOW_LABEL),
            self.app_handle.get_webview(EXTERNAL_WEBVIEW_LABEL),
        ) {
            (Some(main_window), Some(external)) => (main_window, external),
            _ => return Err(Error::WebviewNotFound),
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
            header_height: DEFAULT_HEADER_HEIGHT,
        };
        let path = self.get_window_geometry_file_path();
        let file = fs::File::create(path)?;
        serde_json::to_writer(file, &geometry)?;
        Ok(())
    }
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
