use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    #[serde(default = "default_gpu_acceleration_enabled")]
    pub gpu_acceleration_enabled: bool,

    #[serde(default = "default_incognito")]
    pub incognito: bool,

    #[serde(default = "default_start_page_url")]
    pub start_page_url: String,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            gpu_acceleration_enabled: default_gpu_acceleration_enabled(),
            incognito: default_incognito(),
            start_page_url: default_start_page_url(),
        }
    }
}

fn default_gpu_acceleration_enabled() -> bool {
    false
}

fn default_incognito() -> bool {
    true
}

pub fn default_start_page_url() -> String {
    "https://search.brave.com/".to_string()
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserSettings {
    #[serde(default = "default_language")]
    pub language: String,

    #[serde(default = "default_theme")]
    pub theme: String,

    #[serde(default = "default_home_page_url")]
    pub home_page_url: String,

    #[serde(default = "default_sidebar_font_size")]
    pub sidebar_font_size: f32,
}

impl Default for UserSettings {
    fn default() -> Self {
        Self {
            language: default_language(),
            theme: default_theme(),
            home_page_url: default_home_page_url(),
            sidebar_font_size: default_sidebar_font_size(),
        }
    }
}

fn default_home_page_url() -> String {
    "https://search.brave.com/".to_string()
}

fn default_language() -> String {
    "en".to_string()
}

fn default_theme() -> String {
    "light".to_string()
}

fn default_sidebar_font_size() -> f32 {
    13.0
}
