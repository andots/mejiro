import { invoke } from "@tauri-apps/api/core";
import type { PhysicalPosition, PhysicalSize } from "@tauri-apps/api/dpi";
import type { Bounds, Rect, UserSettings } from "./types";

const AppCommands = {
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
  RemoveBookmark: "remove_bookmark",
  GetExternalWebviewUrl: "get_external_webview_url",
} as const;

export const invokeGetSettings = async () => {
  return await invoke<UserSettings>(AppCommands.GetSettings, {});
};

export const invokeNavigateWebviewUrl = async (url: string) => {
  return await invoke(AppCommands.NavigateWebviewUrl, { url });
};

export const invokeGetBookmarks = async () => {
  return await invoke<string>(AppCommands.GetNestedJson, {});
};

export const invokeHideExternalWebview = async () => {
  return await invoke(AppCommands.HideExternalWebview, {});
};

export const invokeShowExternalWebview = async () => {
  return await invoke(AppCommands.ShowExternalWebview, {});
};

export const invokeGetExternalWebviewSize = async () => {
  return await invoke<PhysicalSize>(AppCommands.GetExternalWebviewSize, {});
};

export const invokeGetExternalWebviewPosition = async () => {
  return await invoke<PhysicalPosition>(AppCommands.GetExternalWebviewPosition, {});
};

export const invokeGetAppWebviewBounds = async () => {
  return await invoke<Bounds>(AppCommands.GetAppWebviewBounds, {});
};

export const invokeGetExternalWebviewBounds = async () => {
  return await invoke<Bounds>(AppCommands.GetExternalWebviewBounds, {});
};

export const invokeSetExternalWebviewBounds = async (bounds: Rect) => {
  return await invoke(AppCommands.SetExternalWebviewBounds, { bounds });
};

export const invokeAddBookmark = async (url: string, title: string | null | undefined) => {
  return await invoke(AppCommands.AddBookmark, { url, title });
};

export const invokeRemoveBookmark = async (index: number) => {
  return await invoke(AppCommands.RemoveBookmark, { index });
};

export const invokeGetExternalWebviewUrl = async () => {
  return await invoke<string>(AppCommands.GetExternalWebviewUrl, {});
};
