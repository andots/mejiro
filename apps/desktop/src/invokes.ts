import { invoke } from "@tauri-apps/api/core";
import type { PhysicalPosition, PhysicalSize } from "@tauri-apps/api/dpi";
import type { ToolbarBookmarkData, Bounds, FolderData, Rect, UserSettings } from "./types";

export const Invoke = {
  // Bookmarks commands
  GetNestedJson: async (index: number) => {
    return invoke<string>("get_nested_json", { index });
  },
  GetRootAndChildrenFolders: async () => {
    return invoke<FolderData[]>("get_root_and_children_folders", {});
  },
  GetToolbarBookmarks: async () => {
    return invoke<ToolbarBookmarkData[]>("get_toolbar_bookmarks", {});
  },
  AddBookmark: async (url: string, title: string | null | undefined, topLevelIndex: number) => {
    // returned json string is a nested tree of bookmarks
    return invoke<string>("add_bookmark", { url, title, topLevelIndex });
  },
  AppendBookmarkToToolbar: async (title: string, url: string, topLevelIndex: number) => {
    // returned json string is a nested tree of bookmarks
    return invoke<string>("append_bookmark_to_toolbar", { title, url, topLevelIndex });
  },
  RemoveBookmark: async (index: number, topLevelIndex: number) => {
    // returned json string is a nested tree of bookmarks
    return invoke<string>("remove_bookmark", { index, topLevelIndex });
  },
  UpdateBookmarkTitle: async (index: number, title: string, topLevelIndex: number) => {
    // returned json string is a nested tree of bookmarks
    return invoke<string>("update_bookmark_title", { index, title, topLevelIndex });
  },
  AddFolder: async (parentIndex: number, title: string, topLevelIndex: number) => {
    // returned json string is a nested tree of bookmarks
    return invoke<string>("add_folder", { parentIndex, title, topLevelIndex });
  },
  InsertAfter: async (sourceIndex: number, destinationIndex: number, topLevelIndex: number) => {
    // returned json string is a nested tree of bookmarks
    return invoke<string>("insert_after", {
      sourceIndex,
      destinationIndex,
      topLevelIndex,
    });
  },
  InsertBefore: async (sourceIndex: number, destinationIndex: number, topLevelIndex: number) => {
    // returned json string is a nested tree of bookmarks
    return invoke<string>("insert_before", {
      sourceIndex,
      destinationIndex,
      topLevelIndex,
    });
  },
  AppendToChild: async (sourceIndex: number, destinationIndex: number, topLevelIndex: number) => {
    // returned json string is a nested tree of bookmarks
    return invoke<string>("append_to_child", { sourceIndex, destinationIndex, topLevelIndex });
  },
  PrependToChild: async (sourceIndex: number, destinationIndex: number, topLevelIndex: number) => {
    // returned json string is a nested tree of bookmarks
    return invoke<string>("prepend_to_child", { sourceIndex, destinationIndex, topLevelIndex });
  },
  SetIsOpen: async (index: number, isOpen: boolean, topLevelIndex: number) => {
    // returned json string is a nested tree of Bookmarks
    return invoke<string>("set_is_open", { index, isOpen, topLevelIndex });
  },
  ToggleIsOpen: async (index: number, topLevelIndex: number) => {
    // returned json string is a nested tree of Bookmarks
    return invoke<string>("toggle_is_open", { index, topLevelIndex });
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
  GetSettings: async () => {
    return invoke<UserSettings>("get_settings", {});
  },
  UpdateSettings: async (settings: UserSettings) => {
    return invoke<UserSettings>("update_settings", { settings });
  },
} as const;
