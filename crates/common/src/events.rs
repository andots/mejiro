use strum::AsRefStr;

#[derive(AsRefStr)]
pub enum AppEvent {
    #[strum(serialize = "app://settings-updated")]
    SettingsUpdated,

    #[strum(serialize = "external://page-loaded")]
    ExternalPageLoaded,

    #[strum(serialize = "external://navigation")]
    ExternalNavigation,

    #[strum(serialize = "external://title-changed")]
    ExternalTitleChanged,

    #[strum(serialize = "external://url-changed")]
    ExternalUrlChanged,
}
