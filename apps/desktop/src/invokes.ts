import { invoke } from "@tauri-apps/api/core";
import type { PhysicalPosition, PhysicalSize } from "@tauri-apps/api/dpi";
import type { Bounds, FolderData, Rect, UserSettings } from "./types";

export const Invoke = {
  // Bookmarks commands
  GetNestedJson: async (index: number) => {
    return invoke<string>("get_nested_json", { index });
  },
  GetRootAndChildrenFolders: async () => {
    return invoke<FolderData[]>("get_root_and_children_folders", {});
  },
  AddBookmark: async (url: string, title: string | null | undefined, topLevelIndex: number) => {
    // returned json string is a nested tree of bookmarks
    return invoke<string>("add_bookmark", { url, title, topLevelIndex });
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
  AppendToChild: async (sourceIndex: number, destinationIndex: number, topLevelIndex: number) => {
    // returned json string is a nested tree of bookmarks
    return invoke<string>("append_to_child", { sourceIndex, destinationIndex, topLevelIndex });
  },
  SetIsOpen: async (index: number, isOpen: boolean, topLevelIndex: number) => {
    // returned json string is a nested tree of Bookmarks
    return invoke<string>("set_is_open", { index, isOpen, topLevelIndex });
  },
  ToggleIsOpen: async (index: number, topLevelIndex: number) => {
    // returned json string is a nested tree of Bookmarks
    return invoke<string>("toggle_is_open", { index, topLevelIndex });
  },

  // External Webview commands
  NavigateWebviewUrl: async (url: string) => {
    return invoke("navigate_webview_url", { url });
  },
  GetExternalWebviewUrl: async () => {
    return invoke<string>("get_external_webview_url", {});
  },
  HideExternalWebview: async () => {
    return invoke("hide_external_webview", {});
  },
  ShowExternalWebview: async () => {
    return invoke("show_external_webview", {});
  },
  GetExternalWebviewSize: async () => {
    return invoke<PhysicalSize>("get_external_webview_size", {});
  },
  GetExternalWebviewPosition: async () => {
    return invoke<PhysicalPosition>("get_external_webview_position", {});
  },
  GetExternalWebviewBounds: async () => {
    return invoke<Bounds>("get_external_webview_bounds", {});
  },
  SetExternalWebviewBounds: async (bounds: Rect) => {
    return invoke("set_external_webview_bounds", { bounds });
  },

  // Settings commands
  GetSettings: async () => {
    return invoke<UserSettings>("get_settings", {});
  },
  UpdateSettings: async (settings: UserSettings) => {
    return invoke<UserSettings>("update_settings", { settings });
  },

  // App Webview commands
  GetAppWebviewBounds: async () => {
    return invoke<Bounds>("get_app_webview_bounds", {});
  },
} as const;
