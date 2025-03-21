const COMMANDS: &[&str] = &[
    "send_page_title",
    "send_page_url",
    "get_external_webview_title",
    "history_back",
    "history_forward",
];

fn main() {
    tauri_plugin::Builder::new(COMMANDS).build();
}
