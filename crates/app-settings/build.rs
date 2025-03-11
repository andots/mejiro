const COMMANDS: &[&str] = &["get_app_settings", "update_app_settings"];

fn main() {
    tauri_plugin::Builder::new(COMMANDS).build();
}
