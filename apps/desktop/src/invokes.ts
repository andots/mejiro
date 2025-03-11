import { invoke } from "@tauri-apps/api/core";
import type {
  ToolbarBookmarkData,
  Bounds,
  FolderData,
  Rect,
  UserSettings,
  NestedBookmark,
  AddFolderResponse,
  AppSettings,
  WindowGeometry,
} from "./types";

export const Invoke = {
  // Bookmarks commands
  GetRootAndChildrenFolders: async () => {
    return invoke<FolderData[]>("get_root_and_children_folders", {});
  },
  GetToolbarBookmarks: async () => {
    return invoke<ToolbarBookmarkData[]>("get_toolbar_bookmarks", {});
  },
  GetNestedJson: async (index: number) => {
    return invoke<NestedBookmark>("get_nested_json", { index });
  },
  AddBookmark: async (title: string, url: string, topLevelIndex: number) => {
    return invoke<NestedBookmark>("add_bookmark", { title, url, topLevelIndex });
  },
  AppendBookmarkToToolbar: async (title: string, url: string, topLevelIndex: number) => {
    return invoke<NestedBookmark>("append_bookmark_to_toolbar", { title, url, topLevelIndex });
  },
  RemoveBookmark: async (index: number, topLevelIndex: number) => {
    return invoke<NestedBookmark>("remove_bookmark", { index, topLevelIndex });
  },
  UpdateBookmarkTitle: async (index: number, title: string, topLevelIndex: number) => {
    return invoke<NestedBookmark>("update_bookmark_title", { index, title, topLevelIndex });
  },
  AddFolder: async (parentIndex: number, title: string, topLevelIndex: number) => {
    return invoke<AddFolderResponse>("add_folder", { parentIndex, title, topLevelIndex });
  },
  InsertAfter: async (sourceIndex: number, destinationIndex: number, topLevelIndex: number) => {
    return invoke<NestedBookmark>("insert_after", {
      sourceIndex,
      destinationIndex,
      topLevelIndex,
    });
  },
  InsertBefore: async (sourceIndex: number, destinationIndex: number, topLevelIndex: number) => {
    return invoke<NestedBookmark>("insert_before", {
      sourceIndex,
      destinationIndex,
      topLevelIndex,
    });
  },
  AppendToChild: async (sourceIndex: number, destinationIndex: number, topLevelIndex: number) => {
    return invoke<NestedBookmark>("append_to_child", {
      sourceIndex,
      destinationIndex,
      topLevelIndex,
    });
  },
  PrependToChild: async (sourceIndex: number, destinationIndex: number, topLevelIndex: number) => {
    return invoke<NestedBookmark>("prepend_to_child", {
      sourceIndex,
      destinationIndex,
      topLevelIndex,
    });
  },
  SetIsOpen: async (index: number, isOpen: boolean, topLevelIndex: number) => {
    return invoke<NestedBookmark>("set_is_open", { index, isOpen, topLevelIndex });
  },
  ToggleIsOpen: async (index: number, topLevelIndex: number) => {
    return invoke<NestedBookmark>("toggle_is_open", { index, topLevelIndex });
  },

  // App Webview commands
  GetAppWebviewBounds: async () => {
    return invoke<Bounds>("get_app_webview_bounds", {});
  },
  // External Webview commands
  NavigateWebviewUrl: async (url: string) => {
    return invoke("navigate_webview_url", { url });
  },
  GetExternalWebviewTitle: async () => {
    return invoke<string>("get_external_webview_title", {});
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

  // Settings commands
  GetUserSettings: async () => {
    return invoke<UserSettings>("get_user_settings", {});
  },
  UpdateUserSettings: async (settings: UserSettings) => {
    return invoke<UserSettings>("update_user_settings", { settings });
  },

  // Plugin
  GetWindowGeometry: async () => {
    return invoke<WindowGeometry>("plugin:window-geometry|get_window_geometry", {});
  },
  GetAppSettings: async () => {
    return invoke<AppSettings>("plugin:app-settings|get_app_settings", {});
  },
  UpdateAppSettings: async (settings: AppSettings) => {
    return invoke<AppSettings>("plugin:app-settings|update_app_settings", { settings });
  },
} as const;
