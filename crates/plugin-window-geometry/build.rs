const COMMANDS: &[&str] = &["get_window_geometry"];

fn main() {
    tauri_plugin::Builder::new(COMMANDS).build();
}
