export const ICON_SIZE = {
  SMALL: "22",
  NORMAL: "24",
  MEDIUM: "26",
  LARGE: "28",
} as const;

export const ROUTES = {
  HOME: "/",
} as const;

// from rust event
export const ExternalEvent = {
  PageLoaded: "external://page-loaded",
  Navigation: "external://navigation",
} as const;

export const BookmarkEvent = {
  UpdateTree: "bookmark://update-tree",
} as const;

export const AppEvent = {
  SettingsUpdated: "app://settings-updated",
  ExternalPageLoaded: "app://external-page-loaded",
  ExternalNavigation: "app://external-navigation",
  BookmarkUpdated: "app://bookmark-updated",
};
