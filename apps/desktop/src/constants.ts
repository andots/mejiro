export const ICON_SIZE = {
  SMALL: "22",
  NORMAL: "24",
  MEDIUM: "26",
  LARGE: "28",
} as const;

export const ROUTES = {
  HOME: "/",
} as const;

//! Must sync events.rs
export const AppEvent = {
  SettingsUpdated: "app://settings-updated",
  ExternalPageLoaded: "app://external-page-loaded",
  ExternalNavigation: "app://external-navigation",
  ExternalTitleChanged: "app://external-title-changed",
};
