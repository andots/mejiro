export type Bookmark = {
  id: number;
  title: string;
  url: string | null;
  host: string | null;
  node_type: string; // "Folder" | "Bookmark" | "Separator";
  date_added: number;
  children?: Bookmark[];
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
