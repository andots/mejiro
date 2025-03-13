#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),

    #[error("No filename")]
    NoFileName(),

    #[error("No @name")]
    NoName(),

    #[error(transparent)]
    Glob(#[from] glob::GlobError),

    #[error(transparent)]
    GlobPattern(#[from] glob::PatternError),

    #[error("Invalid UTF-8 characters")]
    InvalidUTF8(),
}
