import { createWithSignal } from "solid-zustand";

import { invokeGetBookmarks } from "../invokes";
import type { Bookmark } from "../types";

interface BookmarkState {
  bookmarks: Bookmark | undefined;
  getBookmarksFromBackend: () => void;
  updateTree: (data: string) => void;
}

export const useBookmarkState = createWithSignal<BookmarkState>((set) => ({
  bookmarks: undefined,
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
