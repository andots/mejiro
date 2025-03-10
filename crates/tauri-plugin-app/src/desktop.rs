use std::sync::Mutex;

use serde::de::DeserializeOwned;
use tauri::Manager;
use tauri::{plugin::PluginApi, AppHandle, Runtime};

use crate::models::*;
use crate::Error;
use crate::WindowGeometry;

pub fn init<R: Runtime, C: DeserializeOwned>(
    app: &AppHandle<R>,
    _api: PluginApi<R, C>,
) -> Result<PluginApp<R>, Error> {
    Ok(PluginApp(app.clone()))
}

/// Access to the app APIs.
pub struct PluginApp<R: Runtime>(AppHandle<R>);

impl<R: Runtime> PluginApp<R> {
    pub fn ping(&self, payload: PingRequest) -> Result<PingResponse, Error> {
        Ok(PingResponse {
            value: payload.value,
        })
    }

    pub fn window_geometry(&self) -> tauri::State<'_, Mutex<WindowGeometry>> {
        self.0.state::<Mutex<WindowGeometry>>()
    }
}
