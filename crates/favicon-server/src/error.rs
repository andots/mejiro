use axum::{http::StatusCode, response::IntoResponse, Json};
use serde::Serialize;

#[derive(thiserror::Error, Debug)]
pub enum ServerError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Address parse error: {0}")]
    AddrParse(#[from] std::net::AddrParseError),
}

#[derive(Serialize, Clone, Debug)]
struct ErrorDetail {
    #[serde(with = "http_serde::status_code")]
    pub code: StatusCode,
    pub message: String,
}

#[derive(Serialize, Clone, Debug)]
pub struct ApiError {
    error: ErrorDetail,
}

impl ApiError {
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

impl Default for ApiError {
    fn default() -> Self {
        Self {
            error: ErrorDetail {
                code: StatusCode::INTERNAL_SERVER_ERROR,
                message: "Unknown error".to_string(),
            },
        }
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> axum::response::Response {
        (self.error.code, self.to_json()).into_response()
    }
}

impl From<redb::TransactionError> for ApiError {
    fn from(err: redb::TransactionError) -> Self {
        Self::new(StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
    }
}

impl From<redb::TableError> for ApiError {
    fn from(err: redb::TableError) -> Self {
        Self::new(StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
    }
}

impl From<redb::StorageError> for ApiError {
    fn from(err: redb::StorageError) -> Self {
        Self::new(StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
    }
}

impl From<redb::CommitError> for ApiError {
    fn from(err: redb::CommitError) -> Self {
        Self::new(StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
    }
}

impl From<url::ParseError> for ApiError {
    fn from(err: url::ParseError) -> Self {
        Self::new(StatusCode::BAD_REQUEST, err.to_string())
    }
}

impl From<reqwest::Error> for ApiError {
    fn from(err: reqwest::Error) -> Self {
        Self::new(StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
    }
}
