const COMMANDS: &[&str] = &["get_user_settings", "update_user_settings"];

fn main() {
    tauri_plugin::Builder::new(COMMANDS).build();
}
