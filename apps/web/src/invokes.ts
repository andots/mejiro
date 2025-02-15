import { invoke } from "@tauri-apps/api/core";
import type { PhysicalPosition, PhysicalSize } from "@tauri-apps/api/dpi";
import type { Bounds, FolderData, Rect, UserSettings } from "./types";

export const Invoke = {
  // Bookmarks commands
  GetNestedJson: async () => {
    return await invoke<string>("get_nested_json", {});
  },
  GetRootChildrenFolder: async () => {
    return await invoke<FolderData[]>("get_root_children_folder", {});
  },
  AddBookmark: async (url: string, title: string | null | undefined) => {
    return await invoke("add_bookmark", { url, title });
  },
  RemoveBookmark: async (index: number) => {
    return await invoke("remove_bookmark", { index });
  },

  // External Webview commands
  NavigateWebviewUrl: async (url: string) => {
    return await invoke("navigate_webview_url", { url });
  },
  GetExternalWebviewUrl: async () => {
    return await invoke<string>("get_external_webview_url", {});
  },
  HideExternalWebview: async () => {
    return await invoke("hide_external_webview", {});
  },
  ShowExternalWebview: async () => {
    return await invoke("show_external_webview", {});
  },
  GetExternalWebviewSize: async () => {
    return await invoke<PhysicalSize>("get_external_webview_size", {});
  },
  GetExternalWebviewPosition: async () => {
    return await invoke<PhysicalPosition>("get_external_webview_position", {});
  },
  GetExternalWebviewBounds: async () => {
    return await invoke<Bounds>("get_external_webview_bounds", {});
  },
  SetExternalWebviewBounds: async (bounds: Rect) => {
    return await invoke("set_external_webview_bounds", { bounds });
  },

  // Settings commands
  GetSettings: async () => {
    return await invoke<UserSettings>("get_settings", {});
  },

  // App Webview commands
  GetAppWebviewBounds: async () => {
    return await invoke<Bounds>("get_app_webview_bounds", {});
  },
} as const;
