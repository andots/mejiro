mod commands;

use parus_common::constants::EXTERNAL_WEBVIEW_LABEL;

const PLUGIN_NAME: &str = "js-injection";

pub fn init<R: tauri::Runtime>() -> tauri::plugin::TauriPlugin<R> {
    tauri::plugin::Builder::new(PLUGIN_NAME)
        .invoke_handler(tauri::generate_handler![
            commands::send_page_title,
            commands::send_page_url,
            commands::get_external_webview_title,
        ])
        .on_page_load(|webview, payload| {
            if webview.label() == EXTERNAL_WEBVIEW_LABEL {
                match payload.event() {
                    tauri::webview::PageLoadEvent::Started => {
                        // log::debug!("Started: {}", payload.url().as_str());
                    }
                    tauri::webview::PageLoadEvent::Finished => {
                        // log::debug!("Finished: {}", payload.url().as_str());
                        let _ = webview.eval(include_str!("js/title-observer.js"));
                        let _ = webview.eval(include_str!("js/url-observer.js"));
                        let _ = webview.eval(include_str!("js/target-remover.js"));
                        let _ = webview.eval(include_str!("js/mouse-gesture.js"));
                    }
                }
            }
        })
        .build()
}
