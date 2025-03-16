mod commands;

use parus_common::constants::EXTERNAL_WEBVIEW_LABEL;

const PLUGIN_NAME: &str = "js-injection";

pub fn init<R: tauri::Runtime>() -> tauri::plugin::TauriPlugin<R> {
    tauri::plugin::Builder::new(PLUGIN_NAME)
        .invoke_handler(tauri::generate_handler![])
        .on_page_load(|webview, payload| {
            if webview.label() == EXTERNAL_WEBVIEW_LABEL {
                match payload.event() {
                    tauri::webview::PageLoadEvent::Started => {
                        // log::debug!("Started: {}", payload.url().as_str());
                    }
                    tauri::webview::PageLoadEvent::Finished => {
                        // log::debug!("Finished: {}", payload.url().as_str());
                    }
                }
            }
        })
        .build()
}
