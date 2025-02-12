use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Ulid decode error: {0}")]
    UlidDecode(#[from] ulid::DecodeError),

    #[error("JSON serialization error: {0}")]
    JsonSerialization(#[from] serde_json::Error),
}

// impl From<AppError> for InvokeError {
//     fn from(error: AppError) -> Self {
//         Self::from(error.to_string())
//     }
// }
