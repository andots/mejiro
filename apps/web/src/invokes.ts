import { invoke } from "@tauri-apps/api/core";
import type { PhysicalPosition, PhysicalSize } from "@tauri-apps/api/dpi";
import type { Bounds, FolderData, Rect, UserSettings } from "./types";

export const Invoke = {
  // Bookmarks commands
  GetNestedJson: async (index: number) => {
    return invoke<string>("get_nested_json", { index });
  },
  GetRootChildrenFolder: async () => {
    return invoke<FolderData[]>("get_root_children_folder", {});
  },
  AddBookmark: async (url: string, title: string | null | undefined, startingIndex: number) => {
    // returned json string is a nested tree of bookmarks
    return invoke<string>("add_bookmark", { url, title, startingIndex });
  },
  RemoveBookmark: async (index: number, startingIndex: number) => {
    // returned json string is a nested tree of bookmarks
    return invoke<string>("remove_bookmark", { index, startingIndex });
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

  // App Webview commands
  GetAppWebviewBounds: async () => {
    return invoke<Bounds>("get_app_webview_bounds", {});
  },
} as const;
