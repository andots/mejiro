mod commands;
mod models;

#[cfg(desktop)]
mod desktop;

#[cfg(desktop)]
use desktop::AppSettingsPlugin;

use parus_common::constants::MAINWINDOW_LABEL;
use tauri::Manager;

pub use models::{default_start_page_url, AppSettings};

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the app APIs.
pub trait AppSettingsPluginExt<R: tauri::Runtime> {
    fn app_settings_plugin(&self) -> &AppSettingsPlugin<R>;
}

impl<R: tauri::Runtime, T: tauri::Manager<R>> crate::AppSettingsPluginExt<R> for T {
    fn app_settings_plugin(&self) -> &AppSettingsPlugin<R> {
        self.state::<AppSettingsPlugin<R>>().inner()
    }
}

/// Initializes the plugin.
pub fn init<R: tauri::Runtime>() -> tauri::plugin::TauriPlugin<R> {
    tauri::plugin::Builder::new("app-settings")
        .invoke_handler(tauri::generate_handler![
            commands::get_app_settings,
            commands::update_app_settings
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
                let _ = app_handle.app_settings_plugin().save_app_settings();
                // app_handle.exit(0);
            }
            tauri::RunEvent::WindowEvent { label, event, .. } => {
                if label == MAINWINDOW_LABEL {
                    if let tauri::WindowEvent::CloseRequested { .. } = event {
                        let _ = app_handle.app_settings_plugin().sync_last_visited_url();
                    }
                }
            }
            _ => {}
        })
        .build()
}
