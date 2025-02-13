use serde::{Deserialize, Serialize};

use crate::constants::DEFAULT_START_PAGE_URL;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserSettings {
    #[serde(default = "default_language")]
    pub language: String,

    #[serde(default = "default_theme")]
    pub theme: String,

    #[serde(default = "default_gpu_acceleration_enabled")]
    pub gpu_acceleration_enabled: bool,

    #[serde(default = "default_incognito")]
    pub incognito: bool,

    #[serde(default = "default_start_page_url")]
    pub start_page_url: String,
}

fn default_language() -> String {
    "en".to_string()
}

fn default_theme() -> String {
    "light".to_string()
}

fn default_gpu_acceleration_enabled() -> bool {
    false
}

fn default_incognito() -> bool {
    true
}

pub fn default_start_page_url() -> String {
    DEFAULT_START_PAGE_URL.to_string()
}

impl Default for UserSettings {
    fn default() -> Self {
        Self {
            language: default_language(),
            theme: default_theme(),
            gpu_acceleration_enabled: default_gpu_acceleration_enabled(),
            incognito: default_incognito(),
            start_page_url: default_start_page_url(),
        }
    }
}
