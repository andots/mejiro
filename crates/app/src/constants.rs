pub const MAINWINDOW_LABEL: &str = "main";
pub const APP_WEBVIEW_LABEL: &str = "app";
pub const APP_WEBVIEW_URL: &str = "index.html";
pub const EXTERNAL_WEBVIEW_LABEL: &str = "external";

pub const MIN_WINDOW_WIDTH: f64 = 360.0;
pub const MIN_WINDOW_HEIGHT: f64 = 200.0;

pub const FAVICON_SERVER_PORT: u16 = 7853;
pub const FAVICON_SERVER_ALLOW_ORIGINS: [&str; 3] = [
    "http://localhost/",
    "http://tauri.localhost/",
    "http://localhost:1420/",
];
