use std::sync::Mutex;

use tauri::Manager;
use tauri_plugin_updater::UpdaterExt;

use app_handle_ext::AppHandleExt;
use constants::MAINWINDOW_LABEL;
use window::create_window;

mod app_handle_ext;
mod commands;
mod constants;
mod error;
mod events;
mod settings;
mod updater;
mod window;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .setup(|app| {
            #[cfg(desktop)]
            {
                app.handle()
                    .plugin(tauri_plugin_single_instance::init(|_app, _args, _cwd| {}))?;
            }

            // show debug log when debug build
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Debug)
                        .build(),
                )?;
            }

            #[cfg(desktop)]
            {
                // setup tauri plugin updater
                app.handle()
                    .plugin(tauri_plugin_updater::Builder::new().build())?;
                // setup tauri plugin dialog
                app.handle().plugin(tauri_plugin_dialog::init())?;

                // setup updater
                let updater = app.updater_builder().build().unwrap();

                // check for updates
                let app_handle = app.handle().clone();
                tauri::async_runtime::spawn_blocking(|| {
                    tauri::async_runtime::block_on(async {
                        updater::check_and_install_updates(app_handle, updater).await;
                    })
                });
            };

            let bookmarks = app.handle().load_bookmarks();
            app.manage(Mutex::new(bookmarks));

            let user_settings = app.handle().load_user_settings();
            app.manage(Mutex::new(user_settings));

            let app_settings = app.handle().load_app_settings();
            app.manage(Mutex::new(app_settings));

            // create_window() must be called after app.manage() because frontend might call getting
            // bookmarks and settings from tauri state before they are managed. (especially in relaese build)
            create_window(app.handle())?;

            // Open devtools when debug build
            #[cfg(debug_assertions)]
            {
                use constants::APP_WEBVIEW_LABEL;
                app.get_webview(APP_WEBVIEW_LABEL)
                    .expect("failed to get webview")
                    .open_devtools();
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::webviews::get_app_webview_bounds,
            commands::webviews::navigate_webview_url,
            commands::webviews::get_external_webview_title,
            commands::webviews::set_external_webview_bounds,
            commands::webviews::show_external_webview,
            commands::webviews::hide_external_webview,
            commands::bookmarks::get_nested_json,
            commands::bookmarks::get_root_and_children_folders,
            commands::bookmarks::get_toolbar_bookmarks,
            commands::bookmarks::add_bookmark,
            commands::bookmarks::append_bookmark_to_toolbar,
            commands::bookmarks::remove_bookmark,
            commands::bookmarks::update_bookmark_title,
            commands::bookmarks::add_folder,
            commands::bookmarks::insert_after,
            commands::bookmarks::insert_before,
            commands::bookmarks::append_to_child,
            commands::bookmarks::prepend_to_child,
            commands::bookmarks::set_is_open,
            commands::bookmarks::toggle_is_open,
            commands::settings::get_user_settings,
            commands::settings::update_user_settings,
            commands::settings::get_app_settings,
            commands::settings::update_app_settings,
            commands::external::send_page_title,
            commands::external::send_page_url,
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    app.run(|app_handle, event| match event {
        tauri::RunEvent::Ready => {}
        tauri::RunEvent::Exit => {
            // save settings before exit
            let _ = app_handle.save_user_settings();
            let _ = app_handle.save_bookmarks();
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
