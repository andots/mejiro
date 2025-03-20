#![allow(dead_code)]

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),

    #[error("failed to parse as string: {0}")]
    Utf8(#[from] std::str::Utf8Error),

    #[error("webview not found")]
    WebviewNotFound,

    #[error(transparent)]
    Tauri(#[from] tauri::Error),

    #[error("Mutex Error: {0}")]
    Mutex(String),

    #[error("failed to parse as json: {0}")]
    Json(#[from] serde_json::Error),

    #[error(transparent)]
    Core(#[from] parus_bookmark::Error),

    #[error("other error: {0}")]
    Other(String),
}

#[derive(serde::Serialize)]
#[serde(tag = "kind", content = "message")]
#[serde(rename_all = "camelCase")]
pub enum ErrorKind {
    Io(String),
    Utf8(String),
    Json(String),
    WebviewNotFound(String),
    Tauri(String),
    Core(String),
    Mutex(String),
    Other(String),
}

impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        let error_message = self.to_string();
        let error_kind = match self {
            Self::Io(_) => ErrorKind::Io(error_message),
            Self::Utf8(_) => ErrorKind::Utf8(error_message),
            Self::Json(_) => ErrorKind::Json(error_message),
            Self::WebviewNotFound => ErrorKind::WebviewNotFound(error_message),
            Self::Tauri(_) => ErrorKind::Tauri(error_message),
            Self::Core(_) => ErrorKind::Core(error_message),
            Self::Mutex(_) => ErrorKind::Mutex(error_message),
            Self::Other(_) => ErrorKind::Other(error_message),
        };
        error_kind.serialize(serializer)
    }
}
