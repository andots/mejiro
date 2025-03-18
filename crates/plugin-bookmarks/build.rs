const COMMANDS: &[&str] = &[
    "get_nested_json",
    "get_root_and_children_folders",
    "get_toolbar_bookmarks",
    "add_bookmark",
    "append_bookmark_to_toolbar",
    "remove_bookmark",
    "update_bookmark_title",
    "add_folder",
    "insert_after",
    "insert_before",
    "append_to_child",
    "prepend_to_child",
    "set_is_open",
    "toggle_is_open",
];

fn main() {
    tauri_plugin::Builder::new(COMMANDS).build();
}
