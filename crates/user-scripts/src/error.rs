#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),

    #[error(transparent)]
    Fs(#[from] parus_fs::Error),

    #[error("state is not managed")]
    StateNotManaged,

    #[error("Poison")]
    PoisonError,

    #[error("Invalid UTF-8")]
    InvalidUTF8,
}
