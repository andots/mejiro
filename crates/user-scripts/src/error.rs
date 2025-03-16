#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),

    #[error(transparent)]
    Fs(#[from] parus_fs::Error),

    #[error("No filename")]
    NoFileName(),

    #[error("No @name")]
    NoName(),
}
