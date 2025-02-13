import { createWithSignal } from "solid-zustand";

import { invokeGetBookmarks } from "../invokes";
import type { Bookmark } from "../types";

interface BookmarkState {
  bookmarks: Bookmark;
  getBookmarksFromBackend: () => void;
  updateTree: (data: string) => void;
}

export const useBookmarkState = createWithSignal<BookmarkState>((set) => ({
  bookmarks: {
    title: "Root",
    url: null,
    host: null,
    id: 0,
    node_type: "Root",
    date_added: 0,
    children: [],
  },
  getBookmarksFromBackend: async () => {
    const data = await invokeGetBookmarks();
    const tree = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks: tree }));
  },
  updateTree: async (data) => {
    const tree = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks: tree }));
  },
}));
