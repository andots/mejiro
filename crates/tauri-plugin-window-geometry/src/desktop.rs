use std::fs;
use std::sync::Mutex;

use serde::de::DeserializeOwned;
use tauri::Manager;
use tauri::{plugin::PluginApi, AppHandle, Runtime};

use parus_common::{
    constants::{EXTERNAL_WEBVIEW_LABEL, MAINWINDOW_LABEL},
    utils::deserialize_from_file,
    AppHandlePathExt, Error,
};

use crate::constants::DEFAULT_HEADER_HEIGHT;
use crate::models::*;
use crate::WindowGeometry;

pub fn init<R: Runtime, C: DeserializeOwned>(
    app_handle: &AppHandle<R>,
    _api: PluginApi<R, C>,
) -> Result<WindowGeometryPlugin<R>, Error> {
    let plugin = WindowGeometryPlugin {
        app_handle: app_handle.clone(),
    };
    let window_geometry = plugin.load_window_geometry();
    app_handle.manage(Mutex::new(window_geometry));
    Ok(plugin)
}

/// Access to the window-geometry-plugin APIs.
pub struct WindowGeometryPlugin<R: Runtime> {
    app_handle: AppHandle<R>,
}

impl<R: Runtime> WindowGeometryPlugin<R> {
    pub fn ping(&self, payload: PingRequest) -> Result<PingResponse, Error> {
        Ok(PingResponse {
            value: payload.value,
        })
    }

    pub fn window_geometry(&self) -> tauri::State<'_, Mutex<WindowGeometry>> {
        self.app_handle.state::<Mutex<WindowGeometry>>()
    }

    pub fn load_window_geometry(&self) -> WindowGeometry {
        let path = self.app_handle.window_geometry_path();
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
        let path = self.app_handle.window_geometry_path();
        let file = fs::File::create(path)?;
        serde_json::to_writer(file, &geometry)?;
        Ok(())
    }
}
