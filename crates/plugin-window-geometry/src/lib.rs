mod commands;
mod models;

pub use models::WindowGeometry;

use std::{fs, sync::Mutex};

use tauri::Manager;

use parus_common::{
    constants::{DEFAULT_HEADER_HEIGHT, EXTERNAL_WEBVIEW_LABEL, MAINWINDOW_LABEL},
    utils::deserialize_from_file_or_default,
    AppHandlePathExt, Error,
};

const PLUGIN_NAME: &str = "window-geometry";

trait AppHandleExt {
    fn load_window_geometry(&self) -> WindowGeometry;
    fn save_window_geometry(&self) -> Result<(), Error>;
}

impl<R: tauri::Runtime> AppHandleExt for tauri::AppHandle<R> {
    fn load_window_geometry(&self) -> WindowGeometry {
        let path = self.window_geometry_path();
        deserialize_from_file_or_default(path)
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
            header_height: DEFAULT_HEADER_HEIGHT,
        };
        let path = self.window_geometry_path();
        let file = fs::File::create(path)?;
        serde_json::to_writer(file, &geometry)?;
        Ok(())
    }
}

/// Initializes the plugin.
pub fn init<R: tauri::Runtime>() -> tauri::plugin::TauriPlugin<R> {
    tauri::plugin::Builder::new(PLUGIN_NAME)
        .invoke_handler(tauri::generate_handler![commands::get_window_geometry])
        .setup(|app, _api| {
            let window_geometry = app.load_window_geometry();
            app.manage(Mutex::new(window_geometry));

            Ok(())
        })
        .on_event(|app_handle, event| match event {
            tauri::RunEvent::Ready => {}
            tauri::RunEvent::Exit => {}
            tauri::RunEvent::WindowEvent { label, event, .. } => {
                if label == MAINWINDOW_LABEL {
                    if let tauri::WindowEvent::CloseRequested { .. } = event {
                        let _ = app_handle.save_window_geometry();
                    }
                }
            }
            _ => {}
        })
        .build()
}
