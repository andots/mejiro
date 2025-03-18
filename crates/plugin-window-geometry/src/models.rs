use serde::{Deserialize, Serialize};

use parus_common::constants::{
    DEFAULT_HEADER_HEIGHT, DEFAULT_SIDEBAR_WIDTH, DEFAULT_WINDOW_HEIGHT, DEFAULT_WINDOW_WIDTH,
    DEFAULT_WINDOW_X, DEFAULT_WINDOW_Y,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WindowGeometry {
    pub width: f64,
    pub height: f64,
    pub x: f64,
    pub y: f64,
    pub sidebar_width: f64,
    pub header_height: f64,
}

impl Default for WindowGeometry {
    fn default() -> Self {
        Self {
            width: DEFAULT_WINDOW_WIDTH,
            height: DEFAULT_WINDOW_HEIGHT,
            x: DEFAULT_WINDOW_X,
            y: DEFAULT_WINDOW_Y,
            sidebar_width: DEFAULT_SIDEBAR_WIDTH,
            header_height: DEFAULT_HEADER_HEIGHT,
        }
    }
}
