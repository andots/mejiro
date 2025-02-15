import { createWithSignal } from "solid-zustand";

import { Invoke } from "../invokes";
import type { Bookmark } from "../types";

interface BookmarkState {
  bookmarks: Bookmark;
  getBookmarks: (index: number) => void;
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
  getBookmarks: async (index) => {
    // can't accept index 0 because indextree starts from 1
    if (index >= 1) {
      const data = await Invoke.GetNestedJson(index);
      const tree = JSON.parse(data) as Bookmark;
      set(() => ({ bookmarks: tree }));
    }
  },
  updateBookmarks: async (data) => {
    const tree = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks: tree }));
  },
}));
