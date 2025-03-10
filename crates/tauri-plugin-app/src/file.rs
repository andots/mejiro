#![allow(unused)]

use strum::AsRefStr;

/// The file names are defined as an enum to prevent typos and to provide a centralized list of all data files.
/// Different file names should be used for debug and release builds to separate development and production data.
#[cfg(debug_assertions)]
#[derive(AsRefStr)]
pub enum FileName {
    #[strum(serialize = "dev-bookmarks.json")]
    Bookmarks,
    #[strum(serialize = "dev-app_settings.json")]
    AppSettings,
    #[strum(serialize = "dev-window_geometry.json")]
    WindowGeometry,
    #[strum(serialize = "dev-settings.json")]
    UserSettings,
    #[strum(serialize = "dev-favicons.db")]
    FaviconDatabase,
}

/// File names for release builds.
/// Bookmarks and window geometry data are stored in JSON format, but with a dot prefix and no extension name
/// to prevent accidental deletion or modification by users.
#[cfg(not(debug_assertions))]
#[derive(AsRefStr)]
pub enum FileName {
    #[strum(serialize = ".bookmarks")]
    Bookmarks,
    #[strum(serialize = ".app_settings")]
    AppSettings,
    #[strum(serialize = ".window_geometry")]
    WindowGeometry,
    #[strum(serialize = "settings.json")]
    UserSettings,
    #[strum(serialize = "favicons.db")]
    FaviconDatabase,
}
