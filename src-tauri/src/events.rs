use strum::AsRefStr;

#[derive(AsRefStr)]
pub enum ExternalEvent {
    #[strum(serialize = "external://page-loaded")]
    PageLoaded,
    #[strum(serialize = "external://navigation")]
    Navigation,
}

#[derive(AsRefStr)]
pub enum BookmarkEvent {
    #[strum(serialize = "bookmark://update-tree")]
    UpdateTree,
}
