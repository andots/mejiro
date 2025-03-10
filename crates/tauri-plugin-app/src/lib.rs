#[cfg(desktop)]
mod desktop;

mod commands;
mod constants;
mod error;
mod file;
mod models;
mod window_geometry;

use std::{
    fs,
    path::{Path, PathBuf},
    sync::Mutex,
};

use constants::{DEFAUTL_HEADER_HEIGHT, EXTERNAL_WEBVIEW_LABEL, MAINWINDOW_LABEL};
use serde::Deserialize;
use tauri::{
    plugin::{Builder, TauriPlugin},
    Manager, Runtime,
};

pub use error::Error;
pub use models::*;

#[cfg(desktop)]
use desktop::PluginApp;

use file::FileName;
pub use window_geometry::WindowGeometry;

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the app APIs.
pub trait PluginAppExt<R: Runtime> {
    fn plugin_app(&self) -> &PluginApp<R>;
}

impl<R: Runtime, T: Manager<R>> crate::PluginAppExt<R> for T {
    fn plugin_app(&self) -> &PluginApp<R> {
        self.state::<PluginApp<R>>().inner()
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

pub trait AppHandleExt {
    fn get_app_dir(&self) -> PathBuf;
    fn get_file_path(&self, file_name: FileName) -> PathBuf;
    fn get_window_geometry_file_path(&self) -> PathBuf;
    fn load_window_geometry(&self) -> WindowGeometry;
    fn save_window_geometry(&self) -> Result<(), Error>;
}

impl<R: Runtime> AppHandleExt for tauri::AppHandle<R> {
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

    fn get_file_path(&self, file_name: FileName) -> PathBuf {
        self.get_app_dir().join(file_name.as_ref())
    }

    fn get_window_geometry_file_path(&self) -> PathBuf {
        self.get_file_path(FileName::WindowGeometry)
    }

    fn load_window_geometry(&self) -> WindowGeometry {
        let path = self.get_window_geometry_file_path();
        deserialize_from_file(path)
    }

    fn save_window_geometry(&self) -> Result<(), Error> {
        let (main_window, external) = match (
            self.get_window(MAINWINDOW_LABEL),
            self.get_webview(EXTERNAL_WEBVIEW_LABEL),
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
            header_height: DEFAUTL_HEADER_HEIGHT,
        };
        let path = self.get_window_geometry_file_path();
        let file = fs::File::create(path)?;
        serde_json::to_writer(file, &geometry)?;
        Ok(())
    }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("app")
        .invoke_handler(tauri::generate_handler![
            commands::ping,
            commands::get_window_geometry
        ])
        .setup(|app, api| {
            #[cfg(desktop)]
            let plugin = desktop::init(app, api)?;

            app.manage(plugin);

            let window_geometry = app.load_window_geometry();
            app.manage(Mutex::new(window_geometry));

            Ok(())
        })
        .on_event(|app_handle, event| match event {
            tauri::RunEvent::Ready => {}
            tauri::RunEvent::Exit => {
                // save settings before exit
                // let _ = app_handle.save_app_settings();
                // let _ = app_handle.save_user_settings();
                // let _ = app_handle.save_bookmarks();
                app_handle.exit(0);
            }
            tauri::RunEvent::WindowEvent { label, event, .. } => {
                if label == MAINWINDOW_LABEL {
                    match event {
                        tauri::WindowEvent::CloseRequested { .. } => {
                            // let _ = app_handle.sync_last_visited_url();
                            let _ = app_handle.save_window_geometry();
                        }
                        tauri::WindowEvent::Resized(_physical_size) => {}
                        tauri::WindowEvent::Moved(_physical_position) => {}
                        _ => {}
                    }
                }
            }
            _ => {}
        })
        .build()
}
