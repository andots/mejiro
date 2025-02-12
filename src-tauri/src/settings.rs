use serde::{Deserialize, Serialize};

pub const DEFAULT_SEARCH_ENGINE_URL: &str = "https://search.brave.com/";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserSettings {
    pub language: Option<String>,
    pub theme: Option<String>,
    pub gpu_acceleration_enabled: Option<bool>,
    pub incognito: Option<bool>,
    pub start_page_url: Option<String>,
}

impl Default for UserSettings {
    fn default() -> Self {
        Self {
            language: Some("en".to_string()),
            theme: Some("light".to_string()),
            gpu_acceleration_enabled: Some(false),
            incognito: Some(true),
            start_page_url: Some(DEFAULT_SEARCH_ENGINE_URL.to_string()),
        }
    }
}
