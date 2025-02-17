export type Bookmark = {
  index: number;
  title: string;
  url: string | null;
  host: string | null;
  node_type: "Root" | "Folder" | "Bookmark" | "Separator";
  date_added: number;
  children: Bookmark[];
};

//! Must sync with core/src/data.rs
export type BookmarkData = {
  title: string;
  url: string | null;
  host: string | null;
  node_type: "Root" | "Folder" | "Bookmark" | "Separator";
  date_added: number | null;
};

//! Must sync with core/src/data.rs
export type FolderData = {
  index: number;
  title: string;
};

//! Must sync with rust struct in app/settings.rs
export type UserSettings = {
  language: string;
  theme: string;
  gpu_acceleration_enabled: boolean;
  incognito: boolean;
  start_page_url: string;
  pinned_urls: string[];
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
