use std::num::NonZero;

use thiserror::Error;

#[derive(Debug, Error)]
pub enum CoreError {
    #[error("Io error: {0}")]
    Io(#[from] std::io::Error),

    #[error("JSON error: {0}")]
    Json(#[from] serde_json::Error),

    #[error("Node not found: {0}")]
    NodeNotFound(NonZero<usize>),

    #[error("Node error: {0}")]
    NodeError(#[from] indextree::NodeError),

    #[error("URL error: {0}")]
    InvalidUrl(#[from] url::ParseError),

    #[error("Not Web URL: {0}")]
    NotWebUrl(String),

    #[error("Cannot be a base")]
    CannotBeBase(),

    #[error("Something went wrong")]
    Other(),
}
