use tauri::{
    plugin::{Builder, TauriPlugin},
    Manager, Runtime,
};

pub use models::*;

#[cfg(desktop)]
mod desktop;

mod commands;
mod error;
mod models;

pub use error::{Error, Result};

#[cfg(desktop)]
use desktop::PluginApp;

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the app APIs.
pub trait PluginAppExt<R: Runtime> {
    fn plugin_app(&self) -> &PluginApp<R>;
}

impl<R: Runtime, T: Manager<R>> crate::PluginAppExt<R> for T {
    fn plugin_app(&self) -> &PluginApp<R> {
        self.state::<PluginApp<R>>().inner()
    }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("app")
        .invoke_handler(tauri::generate_handler![commands::ping])
        .setup(|app, api| {
            #[cfg(desktop)]
            let plugin = desktop::init(app, api)?;

            app.manage(plugin);

            Ok(())
        })
        .build()
}
