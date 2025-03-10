use serde::{Deserialize, Serialize};

use crate::constants::{
    DEFAUTL_HEADER_HEIGHT, DEFAUTL_SIDEBAR_WIDTH, DEFAUTL_WINDOW_HEIGHT, DEFAUTL_WINDOW_WIDTH,
    DEFAUTL_WINDOW_X, DEFAUTL_WINDOW_Y,
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
            width: DEFAUTL_WINDOW_WIDTH,
            height: DEFAUTL_WINDOW_HEIGHT,
            x: DEFAUTL_WINDOW_X,
            y: DEFAUTL_WINDOW_Y,
            sidebar_width: DEFAUTL_SIDEBAR_WIDTH,
            header_height: DEFAUTL_HEADER_HEIGHT,
        }
    }
}
