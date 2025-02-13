use serde::{Deserialize, Serialize};
use tauri::EventTarget;
use tauri::{
    webview::PageLoadEvent, Emitter, LogicalPosition, LogicalSize, Url, WebviewBuilder, WebviewUrl,
    WindowBuilder,
};

use crate::app_handle_ext::AppHandleExt;
use crate::constants::{
    APP_WEBVIEW_LABEL, APP_WEBVIEW_URL, EXTERNAL_WEBVIEW_LABEL, MAINWINDOW_LABEL,
};
use crate::events::AppEvent;
use crate::settings::{default_start_page_url, UserSettings};

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
            width: 1000.0,
            height: 1000.0,
            x: 50.0,
            y: 50.0,
            sidebar_width: 200.0,
            header_height: 40.0,
        }
    }
}

pub fn create_window(app_handle: &tauri::AppHandle, settings: &UserSettings) -> tauri::Result<()> {
    // App webview
    let mut app_webview_builder = WebviewBuilder::<tauri::Wry>::new(
        APP_WEBVIEW_LABEL,
        WebviewUrl::App(APP_WEBVIEW_URL.into()),
    )
    .auto_resize();

    // External webview
    let url = match Url::parse(&settings.start_page_url) {
        Ok(url) => url,
        Err(_) => Url::parse(default_start_page_url().as_str()).unwrap(),
    };

    let handle = app_handle.clone();
    let mut external_webview_builder =
        WebviewBuilder::<tauri::Wry>::new(EXTERNAL_WEBVIEW_LABEL, WebviewUrl::External(url))
            .auto_resize()
            .on_navigation(move |url| {
                // log::debug!("{:?}: on_navigation", url.host());
                let _ = handle.emit_to(
                    EventTarget::webview(APP_WEBVIEW_LABEL),
                    AppEvent::ExternalNavigation.as_ref(),
                    url.to_string(),
                );
                true
            })
            .on_page_load(move |webview, payload| match payload.event() {
                PageLoadEvent::Started => {
                    // log::debug!("Page started loading: {:?}", payload.url().host());
                }
                PageLoadEvent::Finished => {
                    // log::debug!("{:?}: on_page_load", payload.url().host());
                    let _ = webview.eval(include_str!("../inject/eval.js"));
                }
            })
            .initialization_script(include_str!("../inject/init.js"));

    // disable gpu acceleration on windows if user settings is set
    if cfg!(target_os = "windows") && !settings.gpu_acceleration_enabled {
        app_webview_builder = app_webview_builder.additional_browser_args(
            "--disable-features=msWebOOUI,msPdfOOUI,msSmartScreenProtection --disable-gpu",
        );
        external_webview_builder = external_webview_builder.additional_browser_args(
            "--disable-features=msWebOOUI,msPdfOOUI,msSmartScreenProtection --disable-gpu",
        );
    }

    // incognito mode: default is true
    let incognito = settings.incognito;
    app_webview_builder = app_webview_builder.incognito(incognito);
    external_webview_builder = external_webview_builder.incognito(incognito);

    // Create main window and add webviews, load geometry from file
    let title = format!(
        "{} - v{}",
        app_handle.package_info().name,
        app_handle.package_info().version
    );
    let geometry = app_handle.load_window_geometry();
    let width = geometry.width;
    let height = geometry.height;
    let x = geometry.x;
    let y = geometry.y;
    let sidebar_width = geometry.sidebar_width;
    let header_height = geometry.header_height;

    let window = WindowBuilder::new(app_handle, MAINWINDOW_LABEL)
        .resizable(true)
        .fullscreen(false)
        .title(title)
        .position(x, y)
        .inner_size(width, height)
        .build()?;

    let _app_webview = window.add_child(
        app_webview_builder,
        LogicalPosition::new(0., 0.),
        LogicalSize::new(width, height),
    )?;

    // External webview is overlaid on top of the app webview
    let _external_webview = window.add_child(
        external_webview_builder,
        LogicalPosition::new(sidebar_width, header_height),
        LogicalSize::new(width - sidebar_width, height - header_height),
    )?;

    Ok(())
}
