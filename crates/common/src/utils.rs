use std::{
    fs,
    path::{Path, PathBuf},
};

use serde::Deserialize;

/// Deserialize or return Default
pub fn deserialize_from_file_or_default<T, P>(path: P) -> T
where
    T: for<'de> Deserialize<'de> + Default,
    P: AsRef<Path>,
{
    match fs::File::open(path) {
        Ok(file) => {
            let reader = std::io::BufReader::new(file);
            match serde_json::from_reader(reader) {
                Ok(data) => data,
                Err(e) => {
                    log::warn!("Failed to deserialize, return Default: {:?}", e);
                    T::default()
                }
            }
        }
        Err(e) => {
            log::warn!("Failed to open file, return Default: {:?}", e);
            T::default()
        }
    }
}

pub fn create_dir_if_not_exists(path: &PathBuf) {
    match path.try_exists() {
        Ok(exists) => {
            if !exists {
                fs::create_dir_all(path)
                    .unwrap_or_else(|_| panic!("Failed to create directory: {}", path.display()));
                log::info!("Directory created: {:?}", path);
            }
        }
        Err(e) => {
            log::error!("Error checking directory: {:?}", e);
            panic!("Failed to check directory");
        }
    }
}
