import { invoke } from "@tauri-apps/api/core";
import type {
  ToolbarBookmarkData,
  Bounds,
  BookmarkResponse,
  FolderData,
  Rect,
  UserSettings,
  NestedBookmark,
  AppSettings,
  WindowGeometry,
} from "./types";

export const Invoke = {
  // Bookmarks commands
  GetRootAndChildrenFolders: async () => {
    return invoke<FolderData[]>("plugin:bookmarks|get_root_and_children_folders", {});
  },
  GetToolbarBookmarks: async () => {
    return invoke<ToolbarBookmarkData[]>("plugin:bookmarks|get_toolbar_bookmarks", {});
  },
  GetNestedJson: async (index: number) => {
    return invoke<NestedBookmark>("plugin:bookmarks|get_nested_json", { index });
  },
  AddBookmark: async (title: string, url: string, topLevelIndex: number) => {
    return invoke<BookmarkResponse>("plugin:bookmarks|add_bookmark", { title, url, topLevelIndex });
  },
  AppendBookmarkToToolbar: async (title: string, url: string, topLevelIndex: number) => {
    return invoke<NestedBookmark>("plugin:bookmarks|append_bookmark_to_toolbar", {
      title,
      url,
      topLevelIndex,
    });
  },
  RemoveBookmark: async (index: number, topLevelIndex: number) => {
    return invoke<NestedBookmark>("plugin:bookmarks|remove_bookmark", { index, topLevelIndex });
  },
  UpdateBookmarkTitle: async (index: number, title: string, topLevelIndex: number) => {
    return invoke<NestedBookmark>("plugin:bookmarks|update_bookmark_title", {
      index,
      title,
      topLevelIndex,
    });
  },
  AddFolder: async (parentIndex: number, title: string, topLevelIndex: number) => {
    return invoke<BookmarkResponse>("plugin:bookmarks|add_folder", {
      parentIndex,
      title,
      topLevelIndex,
    });
  },
  InsertAfter: async (sourceIndex: number, destinationIndex: number, topLevelIndex: number) => {
    return invoke<NestedBookmark>("plugin:bookmarks|insert_after", {
      sourceIndex,
      destinationIndex,
      topLevelIndex,
    });
  },
  InsertBefore: async (sourceIndex: number, destinationIndex: number, topLevelIndex: number) => {
    return invoke<NestedBookmark>("plugin:bookmarks|insert_before", {
      sourceIndex,
      destinationIndex,
      topLevelIndex,
    });
  },
  AppendToChild: async (sourceIndex: number, destinationIndex: number, topLevelIndex: number) => {
    return invoke<NestedBookmark>("plugin:bookmarks|append_to_child", {
      sourceIndex,
      destinationIndex,
      topLevelIndex,
    });
  },
  PrependToChild: async (sourceIndex: number, destinationIndex: number, topLevelIndex: number) => {
    return invoke<NestedBookmark>("plugin:bookmarks|prepend_to_child", {
      sourceIndex,
      destinationIndex,
      topLevelIndex,
    });
  },
  SetIsOpen: async (index: number, isOpen: boolean, topLevelIndex: number) => {
    return invoke<NestedBookmark>("plugin:bookmarks|set_is_open", { index, isOpen, topLevelIndex });
  },
  ToggleIsOpen: async (index: number, topLevelIndex: number) => {
    return invoke<NestedBookmark>("plugin:bookmarks|toggle_is_open", { index, topLevelIndex });
  },

  // js-injection
  GetExternalWebviewTitle: async () => {
    return invoke<string>("plugin:js-injection|get_external_webview_title", {});
  },
  HistoryBack: async () => {
    return invoke("plugin:js-injection|history_back", {});
  },
  HistoryForward: async () => {
    return invoke("plugin:js-injection|history_forward", {});
  },

  // Settings commands
  GetWindowGeometry: async () => {
    return invoke<WindowGeometry>("plugin:window-geometry|get_window_geometry", {});
  },
  GetUserSettings: async () => {
    return invoke<UserSettings>("plugin:user-settings|get_user_settings", {});
  },
  UpdateUserSettings: async (settings: UserSettings) => {
    return invoke<UserSettings>("plugin:user-settings|update_user_settings", { settings });
  },
  GetAppSettings: async () => {
    return invoke<AppSettings>("plugin:app-settings|get_app_settings", {});
  },
  UpdateAppSettings: async (settings: AppSettings) => {
    return invoke<AppSettings>("plugin:app-settings|update_app_settings", { settings });
  },

  // App Webview commands
  GetAppWebviewBounds: async () => {
    return invoke<Bounds>("get_app_webview_bounds", {});
  },
  // External Webview commands
  NavigateWebviewUrl: async (url: string) => {
    return invoke("navigate_webview_url", { url });
  },
  SetExternalWebviewBounds: async (bounds: Rect) => {
    return invoke("set_external_webview_bounds", { bounds });
  },
  ShowExternalWebview: async () => {
    return invoke("show_external_webview", {});
  },
  HideExternalWebview: async () => {
    return invoke("hide_external_webview", {});
  },
} as const;
