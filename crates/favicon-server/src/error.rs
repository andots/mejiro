use std::fmt::Display;

use axum::{http::StatusCode, response::IntoResponse, Json};
use serde::Serialize;

use crate::response::create_default_image_response;

#[derive(thiserror::Error, Debug)]
pub enum Error {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Address parse error: {0}")]
    AddrParse(#[from] std::net::AddrParseError),

    #[error("Reqwest error: {0}")]
    Reqwest(#[from] reqwest::Error),

    #[error("URL parse error: {0}")]
    UrlParse(#[from] url::ParseError),

    #[error("Redb error: {0}")]
    Redb(#[from] redb::Error),

    #[error("Redb transaction error: {0}")]
    TransactionError(#[from] redb::TransactionError),

    #[error("Redb table error: {0}")]
    TableError(#[from] redb::TableError),

    #[error("Redb storage error: {0}")]
    StorageError(#[from] redb::StorageError),

    #[error("Redb commit error: {0}")]
    CommitError(#[from] redb::CommitError),

    #[error("Other: {0}")]
    Other(String),
}

#[derive(Serialize, Clone, Debug)]
struct ErrorDetail {
    #[serde(with = "http_serde::status_code")]
    pub code: StatusCode,
    pub message: String,
}

#[derive(Serialize, Clone, Debug)]
pub struct ErrorResponse {
    error: ErrorDetail,
}

impl ErrorResponse {
    pub fn new(code: StatusCode, message: impl Into<String>) -> Self {
        Self {
            error: ErrorDetail {
                code,
                message: message.into(),
            },
        }
    }

    pub fn to_json(&self) -> Json<Self> {
        Json(self.clone())
    }
}

impl Default for ErrorResponse {
    fn default() -> Self {
        Self {
            error: ErrorDetail {
                code: StatusCode::INTERNAL_SERVER_ERROR,
                message: "Unknown error".to_string(),
            },
        }
    }
}

impl Display for ErrorResponse {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}: {}", self.error.code, self.error.message)
    }
}

impl IntoResponse for ErrorResponse {
    fn into_response(self) -> axum::response::Response {
        log::warn!("Error: {}", self);
        // (self.error.code, self.to_json()).into_response()
        // this service needs to return image even if there is an error, so we return default image
        create_default_image_response()
    }
}

impl From<Error> for ErrorResponse {
    fn from(err: Error) -> Self {
        match err {
            Error::Io(err) => Self::new(StatusCode::INTERNAL_SERVER_ERROR, err.to_string()),
            Error::AddrParse(err) => Self::new(StatusCode::BAD_REQUEST, err.to_string()),
            Error::Reqwest(err) => Self::new(StatusCode::INTERNAL_SERVER_ERROR, err.to_string()),
            Error::UrlParse(err) => Self::new(StatusCode::BAD_REQUEST, err.to_string()),
            Error::Redb(err) => Self::new(StatusCode::INTERNAL_SERVER_ERROR, err.to_string()),
            Error::TransactionError(err) => {
                Self::new(StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
            }
            Error::TableError(err) => Self::new(StatusCode::INTERNAL_SERVER_ERROR, err.to_string()),
            Error::StorageError(err) => {
                Self::new(StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
            }
            Error::CommitError(err) => {
                Self::new(StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
            }
            Error::Other(err) => Self::new(StatusCode::INTERNAL_SERVER_ERROR, err),
        }
    }
}

impl From<url::ParseError> for ErrorResponse {
    fn from(err: url::ParseError) -> Self {
        Self::new(StatusCode::BAD_REQUEST, err.to_string())
    }
}
