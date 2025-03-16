use std::path::Path;

pub fn check_path_is_user_js(path: &Path) -> bool {
    if let (Some(stem), Some(extension)) = (path.file_stem(), path.extension()) {
        if let Some(stem_str) = stem.to_str() {
            return stem_str.ends_with(".user") && extension == "js";
        }
    }
    false
}
