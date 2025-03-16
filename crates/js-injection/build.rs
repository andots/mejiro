const COMMANDS: &[&str] = &["send_page_title", "send_page_url"];

fn main() {
    tauri_plugin::Builder::new(COMMANDS).build();
}
