use std::num::NonZero;

use thiserror::Error;

#[derive(Debug, Error)]
pub enum CoreError {
    #[error("Io error: {0}")]
    Io(#[from] std::io::Error),

    #[error("JSON error: {0}")]
    Json(#[from] serde_json::Error),

    #[error("Node error: {0}")]
    NodeError(#[from] indextree::NodeError),

    #[error("URL error: {0}")]
    InvalidUrl(#[from] url::ParseError),

    #[error("Node not found: {0}")]
    NestedNode(NonZero<usize>),

    #[error("Node not found: {0}")]
    NodeNotFound(usize),

    #[error("Not Web URL: {0}")]
    NotWebUrl(String),

    #[error("Cannot be a base")]
    CannotBeBase(),

    #[error("Cannnot remove root node")]
    CannotRemoveRoot(),

    #[error("Cannot move root")]
    CannotMoveRoot(),

    #[error("Source and destination are the same")]
    SameSourceAndDestination(),
}
