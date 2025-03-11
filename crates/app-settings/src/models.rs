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
