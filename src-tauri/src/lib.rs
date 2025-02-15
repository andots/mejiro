use std::sync::Mutex;

use app_handle_ext::AppHandleExt;
use constants::MAINWINDOW_LABEL;

use tauri::Manager;
use window::create_window;

mod app_handle_ext;
mod commands;
mod constants;
mod error;
mod events;
mod settings;
mod window;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .setup(|app| {
            // show debug log when debug build
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Debug)
                        .build(),
                )?;
            }

            let bookmarks = app.handle().load_bookmark_arena();
            app.manage(Mutex::new(bookmarks));

            let settings = app.handle().load_user_settings();
            create_window(app.handle(), &settings)?;
            app.manage(Mutex::new(settings));

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::webviews::navigate_webview_url,
            commands::webviews::get_app_webview_bounds,
            commands::webviews::hide_external_webview,
            commands::webviews::show_external_webview,
            commands::webviews::get_external_webview_size,
            commands::webviews::get_external_webview_position,
            commands::webviews::get_external_webview_bounds,
            commands::webviews::set_external_webview_bounds,
            commands::webviews::get_external_webview_url,
            commands::bookmarks::get_nested_json,
            commands::bookmarks::get_root_children_folder,
            commands::bookmarks::add_bookmark,
            commands::bookmarks::remove_bookmark,
            commands::injects::emit_page_params,
            commands::settings::get_settings,
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    app.run(|app_handle, event| match event {
        tauri::RunEvent::Ready => {}
        tauri::RunEvent::Exit => {
            // save settings before exit
            let _ = app_handle.save_user_settings();
            let _ = app_handle.save_bookmark_arena();
            app_handle.exit(0);
        }
        tauri::RunEvent::WindowEvent { label, event, .. } => {
            if label == MAINWINDOW_LABEL {
                match event {
                    tauri::WindowEvent::CloseRequested { .. } => {
                        let _ = app_handle.save_window_geometry();
                    }
                    tauri::WindowEvent::Resized(_physical_size) => {}
                    tauri::WindowEvent::Moved(_physical_position) => {}
                    _ => {}
                }
            }
        }
        _ => {}
    });
}
