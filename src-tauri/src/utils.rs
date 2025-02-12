// use std::{fs, path::PathBuf};

// use strum::AsRefStr;
// use tauri::Manager;

// #[derive(AsRefStr)]
// pub enum FileName {
//     #[strum(serialize = "bookmarks.json")]
//     Bookmarks,
//     #[strum(serialize = "settings.json")]
//     Settings,
// }

// /// Get the app directory and create it if not exists.
// /// Resolves to data_dir/${bundle_identifier}.
// /// This function will panic if it fails to get the app config dir.
// /// - **Linux**: `$HOME/.config`
// /// - **Windows**: `%APPDATA%`
// /// - **Mac**: `$HOME/Library/Preferences`
// pub fn get_app_dir(app: &tauri::App) -> PathBuf {
//     let path = app
//         .path()
//         .app_config_dir()
//         .expect("failed to get app config dir");
//     match path.try_exists() {
//         Ok(exists) => {
//             if !exists {
//                 // create the app config dir if it doesn't exist
//                 fs::create_dir_all(path.clone()).expect("failed to create app config dir");
//             }
//         }
//         Err(e) => {
//             log::error!("Error checking app config dir: {:?}", e);
//         }
//     }
//     path
// }

// fn get_file_path_from_app_dir(app: &tauri::App, file_name: FileName) -> PathBuf {
//     get_app_dir(app).join(file_name.as_ref())
// }

// pub fn get_bookmarks_file_path(app: &tauri::App) -> PathBuf {
//     get_file_path_from_app_dir(app, FileName::Bookmarks)
// }

// pub fn get_settings_file_path(app: &tauri::App) -> PathBuf {
//     get_file_path_from_app_dir(app, FileName::Settings)
// }
