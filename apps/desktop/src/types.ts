//! Must sync with core/src/nested.rs
export type NestedBookmark = {
  index: number;
  title: string;
  url: string | null;
  host: string | null;
  node_type: "Root" | "Folder" | "Bookmark" | "Separator";
  date_added: number;
  is_open: boolean;
  children: NestedBookmark[];
};

export type AddFolderResponse = {
  index: number;
  bookmarks: NestedBookmark;
};

//! Must sync with core/src/data.rs
export type FolderData = {
  index: number;
  title: string;
};

export type ToolbarBookmarkData = {
  index: number;
  title: string;
  url: string;
  host: string;
};

//! Must sync with rust struct in app/settings.rs
export type UserSettings = {
  language: string;
  theme: string;
};

export type AppSettings = {
  gpu_acceleration_enabled: boolean;
  incognito: boolean;
  start_page_url: string;
};

export type WindowGeometry = {
  width: number;
  height: number;
  x: number;
  y: number;
  sidebar_width: number;
  header_height: number;
};

export type Rect = {
  size: { width: number; height: number };
  position: { x: number; y: number };
};

// Returnig type tauri window bounds
export type Bounds = {
  position: { Physical: { x: number; y: number } };
  size: { Physical: { width: number; height: number } };
};

export type Dragging = {
  sourceIndex: number;
  destinationIndex: number;
  state: "inside" | "after" | "none";
  source: HTMLDivElement | null;
  destination: HTMLDivElement | null;
};
