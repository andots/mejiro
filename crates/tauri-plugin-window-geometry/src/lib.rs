#[cfg(desktop)]
mod desktop;

mod commands;
mod constants;
mod error;
mod models;

use tauri::{
    plugin::{Builder, TauriPlugin},
    Manager, Runtime,
};

use parus_common::MAINWINDOW_LABEL;

pub use error::Error;
pub use models::*;

#[cfg(desktop)]
use desktop::WindowGeometryPlugin;

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the app APIs.
pub trait WindowGeometryPluginExt<R: Runtime> {
    fn window_geometry_plugin(&self) -> &WindowGeometryPlugin<R>;
}

impl<R: Runtime, T: Manager<R>> crate::WindowGeometryPluginExt<R> for T {
    fn window_geometry_plugin(&self) -> &WindowGeometryPlugin<R> {
        self.state::<WindowGeometryPlugin<R>>().inner()
    }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("window-geometry")
        .invoke_handler(tauri::generate_handler![
            commands::ping,
            commands::get_window_geometry
        ])
        .setup(|app, api| {
            #[cfg(desktop)]
            let plugin = desktop::init(app, api)?;

            app.manage(plugin);

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
                            // let _ = app_handle.save_window_geometry();
                            let _ = app_handle.window_geometry_plugin().save_window_geometry();
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
