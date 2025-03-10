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
use desktop::App;

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the app APIs.
pub trait AppExt<R: Runtime> {
    fn app(&self) -> &App<R>;
}

impl<R: Runtime, T: Manager<R>> crate::AppExt<R> for T {
    fn app(&self) -> &App<R> {
        self.state::<App<R>>().inner()
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
