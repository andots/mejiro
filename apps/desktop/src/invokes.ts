import { invoke } from "@tauri-apps/api/core";
import type {
  ToolbarBookmarkData,
  Bounds,
  FolderData,
  Rect,
  UserSettings,
  Bookmark,
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
    return invoke<Bookmark>("get_nested_json", { index });
  },
  AddBookmark: async (url: string, title: string | null | undefined, topLevelIndex: number) => {
    return invoke<Bookmark>("add_bookmark", { url, title, topLevelIndex });
  },
  AppendBookmarkToToolbar: async (title: string, url: string, topLevelIndex: number) => {
    return invoke<Bookmark>("append_bookmark_to_toolbar", { title, url, topLevelIndex });
  },
  RemoveBookmark: async (index: number, topLevelIndex: number) => {
    return invoke<Bookmark>("remove_bookmark", { index, topLevelIndex });
  },
  UpdateBookmarkTitle: async (index: number, title: string, topLevelIndex: number) => {
    return invoke<Bookmark>("update_bookmark_title", { index, title, topLevelIndex });
  },
  AddFolder: async (parentIndex: number, title: string, topLevelIndex: number) => {
    return invoke<Bookmark>("add_folder", { parentIndex, title, topLevelIndex });
  },
  InsertAfter: async (sourceIndex: number, destinationIndex: number, topLevelIndex: number) => {
    return invoke<Bookmark>("insert_after", {
      sourceIndex,
      destinationIndex,
      topLevelIndex,
    });
  },
  InsertBefore: async (sourceIndex: number, destinationIndex: number, topLevelIndex: number) => {
    return invoke<Bookmark>("insert_before", {
      sourceIndex,
      destinationIndex,
      topLevelIndex,
    });
  },
  AppendToChild: async (sourceIndex: number, destinationIndex: number, topLevelIndex: number) => {
    return invoke<Bookmark>("append_to_child", { sourceIndex, destinationIndex, topLevelIndex });
  },
  PrependToChild: async (sourceIndex: number, destinationIndex: number, topLevelIndex: number) => {
    return invoke<Bookmark>("prepend_to_child", { sourceIndex, destinationIndex, topLevelIndex });
  },
  SetIsOpen: async (index: number, isOpen: boolean, topLevelIndex: number) => {
    return invoke<Bookmark>("set_is_open", { index, isOpen, topLevelIndex });
  },
  ToggleIsOpen: async (index: number, topLevelIndex: number) => {
    return invoke<Bookmark>("toggle_is_open", { index, topLevelIndex });
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
