import { createWithSignal } from "solid-zustand";

import { Invoke } from "../invokes";
import type { Bookmark, FolderData } from "../types";

type BookmarkState = {
  folders: FolderData[];
  bookmarks: Bookmark;
  getFolders: () => void;
  getBookmarks: (index: number) => void;
  addBookmark: (url: string, title: string) => void;
  removeBookmark: (index: number) => void;
};

export const useBookmarkState = createWithSignal<BookmarkState>((set) => ({
  folders: [],
  bookmarks: {
    index: 1,
    title: "All Bookmarks",
    url: null,
    host: null,
    node_type: "Root",
    date_added: 0,
    children: [],
  },
  getFolders: async () => {
    const folders = await Invoke.GetRootChildrenFolder();
    set(() => ({ folders }));
  },
  getBookmarks: async (index) => {
    // can't accept index 0 because indextree starts from 1
    if (index >= 1) {
      const data = await Invoke.GetNestedJson(index);
      const tree = JSON.parse(data) as Bookmark;
      set(() => ({ bookmarks: tree }));
    }
  },
  addBookmark: async (url, title) => {
    // get current top of bookmark index that shown in the UI as a starting point
    const current = useBookmarkState((state) => state.bookmarks);
    const startingIndex = current().index;
    const data = await Invoke.AddBookmark(url, title, startingIndex);
    const tree = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks: tree }));
    // update the folders list
    useBookmarkState.getState().getFolders();
  },
  removeBookmark: async (index) => {
    // get current top of bookmark index that shown in the UI as a starting point
    const current = useBookmarkState((state) => state.bookmarks);
    const startingIndex = current().index;
    const data = await Invoke.RemoveBookmark(index, startingIndex);
    const tree = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks: tree }));
    // update the folders list
    useBookmarkState.getState().getFolders();
  },
}));
