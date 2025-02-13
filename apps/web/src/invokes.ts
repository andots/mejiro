import { invoke } from "@tauri-apps/api/core";
import type { PhysicalPosition, PhysicalSize } from "@tauri-apps/api/dpi";
import type { Bounds, Rect, UserSettings } from "./types";

const TauriCommand = {
  GetSettings: "get_settings",
  NavigateWebviewUrl: "navigate_webview_url",
  GetNestedJson: "get_nested_json",
  HideExternalWebview: "hide_external_webview",
  ShowExternalWebview: "show_external_webview",
  GetExternalWebviewSize: "get_external_webview_size",
  GetExternalWebviewPosition: "get_external_webview_position",
  GetExternalWebviewBounds: "get_external_webview_bounds",
  SetExternalWebviewBounds: "set_external_webview_bounds",
  GetAppWebviewBounds: "get_app_webview_bounds",
  AddBookmark: "add_bookmark",
  GetExternalWebviewUrl: "get_external_webview_url",
} as const;

export const invokeGetSettings = async () => {
  return await invoke<UserSettings>(TauriCommand.GetSettings, {});
};

export const invokeNavigateWebviewUrl = async (url: string) => {
  return await invoke(TauriCommand.NavigateWebviewUrl, { url });
};

export const invokeGetBookmarks = async () => {
  return await invoke<string>(TauriCommand.GetNestedJson, {});
};

export const invokeHideExternalWebview = async () => {
  return await invoke(TauriCommand.HideExternalWebview, {});
};

export const invokeShowExternalWebview = async () => {
  return await invoke(TauriCommand.ShowExternalWebview, {});
};

export const invokeGetExternalWebviewSize = async () => {
  return await invoke<PhysicalSize>(TauriCommand.GetExternalWebviewSize, {});
};

export const invokeGetExternalWebviewPosition = async () => {
  return await invoke<PhysicalPosition>(TauriCommand.GetExternalWebviewPosition, {});
};

export const invokeGetAppWebviewBounds = async () => {
  return await invoke<Bounds>(TauriCommand.GetAppWebviewBounds, {});
};

export const invokeGetExternalWebviewBounds = async () => {
  return await invoke<Bounds>(TauriCommand.GetExternalWebviewBounds, {});
};

export const invokeSetExternalWebviewBounds = async (bounds: Rect) => {
  return await invoke(TauriCommand.SetExternalWebviewBounds, { bounds });
};

export const invokeAddBookmark = async (url: string, title: string | null | undefined) => {
  return await invoke(TauriCommand.AddBookmark, { url, title });
};

export const invokeGetExternalWebviewUrl = async () => {
  return await invoke<string>(TauriCommand.GetExternalWebviewUrl, {});
};
