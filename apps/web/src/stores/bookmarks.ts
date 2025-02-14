import { createWithSignal } from "solid-zustand";

import { invokeGetBookmarks } from "../invokes";
import type { Bookmark } from "../types";

interface BookmarkState {
  bookmarks: Bookmark;
  syncBookmarks: () => void;
  updateBookmarks: (data: string) => void;
}

export const useBookmarkState = createWithSignal<BookmarkState>((set) => ({
  bookmarks: {
    index: 0,
    title: "Root",
    url: null,
    host: null,
    node_type: "Root",
    date_added: 0,
    children: [],
  },
  syncBookmarks: async () => {
    const data = await invokeGetBookmarks();
    const tree = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks: tree }));
  },
  updateBookmarks: async (data) => {
    const tree = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks: tree }));
  },
}));
