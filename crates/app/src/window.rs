use std::sync::Mutex;

use serde::{Deserialize, Serialize};
use tauri::{
    webview::PageLoadEvent, Emitter, LogicalPosition, LogicalSize, Url, WebviewBuilder, WebviewUrl,
    WindowBuilder,
};
use tauri::{EventTarget, Manager};

use crate::app_handle_ext::AppHandleExt;
use crate::constants::{
    APP_WEBVIEW_LABEL, APP_WEBVIEW_URL, DEFAUTL_HEADER_HEIGHT, DEFAUTL_SIDEBAR_WIDTH,
    DEFAUTL_WINDOW_HEIGHT, DEFAUTL_WINDOW_WIDTH, DEFAUTL_WINDOW_X, DEFAUTL_WINDOW_Y,
    EXTERNAL_WEBVIEW_LABEL, MAINWINDOW_LABEL, MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH,
};
use crate::events::AppEvent;
use crate::settings::{default_start_page_url, AppSettings};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WindowGeometry {
    pub width: f64,
    pub height: f64,
    pub x: f64,
    pub y: f64,
    pub sidebar_width: f64,
    pub header_height: f64,
}

impl Default for WindowGeometry {
    fn default() -> Self {
        Self {
            width: DEFAUTL_WINDOW_WIDTH,
            height: DEFAUTL_WINDOW_HEIGHT,
            x: DEFAUTL_WINDOW_X,
            y: DEFAUTL_WINDOW_Y,
            sidebar_width: DEFAUTL_SIDEBAR_WIDTH,
            header_height: DEFAUTL_HEADER_HEIGHT,
        }
    }
}

/// Create the main window with the app and external webviews.
/// The app webview is the main webview that loads the app.
/// The external webview is a webview that loads external URLs and placed on the right side of the app webview (overlayed).
pub fn create_window(app_handle: &tauri::AppHandle) -> tauri::Result<()> {
    let state = app_handle.state::<Mutex<AppSettings>>();
    let settings = state.lock().map_err(|e| anyhow::anyhow!("{:?}", e))?;

    let geometry = app_handle.load_window_geometry();
    let window = create_main_window(app_handle, &geometry)?;

    let app_webview = create_app_webview(app_handle, &settings)?;
    let external_webview = create_external_webview(app_handle, &settings)?;

    add_webviews_to_window(&window, app_webview, external_webview, &geometry)?;

    Ok(())
}

fn create_main_window(
    app_handle: &tauri::AppHandle,
    geometry: &WindowGeometry,
) -> tauri::Result<tauri::Window> {
    WindowBuilder::new(app_handle, MAINWINDOW_LABEL)
        .resizable(true)
        .fullscreen(false)
        .title(app_handle.get_default_app_title())
        .position(geometry.x, geometry.y)
        .inner_size(geometry.width, geometry.height)
        .min_inner_size(MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT)
        .build()
}

fn create_app_webview(
    app_handle: &tauri::AppHandle,
    settings: &AppSettings,
) -> tauri::Result<WebviewBuilder<tauri::Wry>> {
    // auto resize is enabled
    // data directory is set to the app directory
    // disable tauri's drag and drop handler
    // incognito mode is enabled if the user settings is set to incognito
    let mut builder =
        WebviewBuilder::new(APP_WEBVIEW_LABEL, WebviewUrl::App(APP_WEBVIEW_URL.into()))
            .auto_resize()
            .data_directory(app_handle.get_app_dir())
            .disable_drag_drop_handler()
            .incognito(settings.incognito);

    #[cfg(target_os = "windows")]
    {
        if !settings.gpu_acceleration_enabled {
            builder = builder.additional_browser_args(
                "--disable-features=msWebOOUI,msPdfOOUI,msSmartScreenProtection --disable-gpu",
            );
        }
        // enable devtools on windows for release builds (need cargo feature `devtools`)
        builder = builder.devtools(true);
    }

    Ok(builder)
}

fn create_external_webview(
    app_handle: &tauri::AppHandle,
    settings: &AppSettings,
) -> tauri::Result<WebviewBuilder<tauri::Wry>> {
    let url = Url::parse(&settings.start_page_url)
        .unwrap_or_else(|_| Url::parse(default_start_page_url().as_str()).unwrap());

    let handle = app_handle.clone();

    // data directory is set to the app directory
    // disable tauri's drag and drop handler
    // incognito mode is enabled if the user settings is set to incognito
    let mut builder = WebviewBuilder::new(EXTERNAL_WEBVIEW_LABEL, WebviewUrl::External(url))
        .data_directory(app_handle.get_app_dir())
        .disable_drag_drop_handler()
        .incognito(settings.incognito)
        .on_navigation(move |url| {
            // This happens when the first navigation only, SPA navigations can't be captured by this
            handle
                .emit_to(
                    EventTarget::webview(APP_WEBVIEW_LABEL),
                    AppEvent::ExternalNavigation.as_ref(),
                    url.to_string(),
                )
                .ok();
            true
        })
        .on_page_load(|webview, payload| {
            if let PageLoadEvent::Finished = payload.event() {
                // This happens when the page is loaded
                // Inject the title observer and url observer scripts
                let _ = webview.eval(include_str!("../js/title-observer.js"));
                let _ = webview.eval(include_str!("../js/url-observer.js"));
            }
        });

    #[cfg(target_os = "windows")]
    if !settings.gpu_acceleration_enabled {
        builder = builder.additional_browser_args(
            "--disable-features=msWebOOUI,msPdfOOUI,msSmartScreenProtection --disable-gpu",
        );
    }

    Ok(builder)
}

fn add_webviews_to_window(
    window: &tauri::Window,
    app_webview: WebviewBuilder<tauri::Wry>,
    external_webview: WebviewBuilder<tauri::Wry>,
    geometry: &WindowGeometry,
) -> tauri::Result<()> {
    window.add_child(
        app_webview,
        LogicalPosition::new(0., 0.),
        LogicalSize::new(geometry.width, geometry.height),
    )?;

    window.add_child(
        external_webview,
        LogicalPosition::new(geometry.sidebar_width, geometry.header_height),
        LogicalSize::new(
            geometry.width - geometry.sidebar_width,
            geometry.height - geometry.header_height,
        ),
    )?;

    Ok(())
}
