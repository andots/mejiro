import { createWithSignal } from "solid-zustand";

import { Invoke } from "../invokes";
import type { Bookmark, FolderData } from "../types";

type BookmarkState = {
  folders: FolderData[];
  bookmarks: Bookmark;
  getFolders: () => Promise<void>;
  getBookmarks: (index: number) => Promise<void>;
  addBookmark: (url: string, title: string) => Promise<void>;
  removeBookmark: (index: number) => Promise<void>;
  updateBookmarkTitle: (index: number, title: string) => Promise<void>;
  addFolder: (parentIndex: number, title: string) => Promise<void>;
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
    const folders = await Invoke.GetRootAndChildrenFolders();
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
    const startingIndex = getCurrentStatingIndex();
    const data = await Invoke.AddBookmark(url, title, startingIndex);
    const tree = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks: tree }));
    // update the folders list
    useBookmarkState.getState().getFolders();
  },
  removeBookmark: async (index) => {
    // get current top of bookmark index that shown in the UI as a starting point
    const startingIndex = getCurrentStatingIndex();
    const data = await Invoke.RemoveBookmark(index, startingIndex);
    const tree = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks: tree }));
    // update the folders list
    useBookmarkState.getState().getFolders();
  },
  updateBookmarkTitle: async (index, title) => {
    // get current top of bookmark index that shown in the UI as a starting point
    const startingIndex = getCurrentStatingIndex();
    const data = await Invoke.UpdateBookmarkTitle(index, title, startingIndex);
    const bookmarks = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks }));
    // update the folders list
    useBookmarkState.getState().getFolders();
  },
  addFolder: async (parentIndex, title) => {
    // get current top of bookmark index that shown in the UI as a starting point
    const startingIndex = getCurrentStatingIndex();
    const data = await Invoke.AddFolder(parentIndex, title, startingIndex);
    const tree = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks: tree }));
    // update the folders list
    useBookmarkState.getState().getFolders();
  },
}));

const getCurrentStatingIndex = () => {
  const bookmarks = useBookmarkState((state) => state.bookmarks);
  return bookmarks().index;
};
