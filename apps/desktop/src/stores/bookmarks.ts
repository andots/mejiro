import { createWithSignal } from "solid-zustand";

import { Invoke } from "../invokes";
import type { Bookmark, FolderData } from "../types";

type BookmarkState = {
  folders: FolderData[];
  bookmarks: Bookmark | null;
  getCurrentTopLevel: () => number;
  getFolders: () => Promise<void>;
  getBookmarks: (index: number) => Promise<void>;
  addBookmark: (url: string, title: string) => Promise<void>;
  removeBookmark: (index: number) => Promise<void>;
  updateBookmarkTitle: (index: number, title: string) => Promise<void>;
  addFolder: (parentIndex: number, title: string) => Promise<void>;
  insertAfter: (sourceIndex: number, destinationIndex: number) => Promise<void>;
  appendToChild: (sourceIndex: number, destinationIndex: number) => Promise<void>;
};

export const useBookmarkState = createWithSignal<BookmarkState>((set, get) => ({
  folders: [],
  bookmarks: null,
  getCurrentTopLevel: () => {
    const bookmarks = get().bookmarks;
    if (bookmarks !== null) {
      return bookmarks.index;
    }
    return 1;
  },
  getFolders: async () => {
    const folders = await Invoke.GetRootAndChildrenFolders();
    set(() => ({ folders }));
  },
  getBookmarks: async (index) => {
    // can't accept index 0 because indextree starts from 1
    if (index >= 1) {
      const data = await Invoke.GetNestedJson(index);
      const bookmarks = JSON.parse(data) as Bookmark;
      set(() => ({ bookmarks }));
    }
  },
  addBookmark: async (url, title) => {
    // get current top of bookmark index that shown in the UI as a starting point
    const startingIndex = get().getCurrentTopLevel();
    const data = await Invoke.AddBookmark(url, title, startingIndex);
    const bookmarks = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks }));
    // update the folders list
    get().getFolders();
  },
  removeBookmark: async (index) => {
    const startingIndex = get().getCurrentTopLevel();
    const data = await Invoke.RemoveBookmark(index, startingIndex);
    const bookmarks = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks }));
    // update the folders list
    get().getFolders();
  },
  updateBookmarkTitle: async (index, title) => {
    const startingIndex = get().getCurrentTopLevel();
    const data = await Invoke.UpdateBookmarkTitle(index, title, startingIndex);
    const bookmarks = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks }));
    // update the folders list
    get().getFolders();
  },
  addFolder: async (parentIndex, title) => {
    const startingIndex = get().getCurrentTopLevel();
    const data = await Invoke.AddFolder(parentIndex, title, startingIndex);
    const bookmarks = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks }));
    // update the folders list
    get().getFolders();
  },
  insertAfter: async (sourceIndex, destinationIndex) => {
    const startingIndex = get().getCurrentTopLevel();
    const data = await Invoke.InsertAfter(sourceIndex, destinationIndex, startingIndex);
    const bookmarks = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks }));
    // update the folders list
    get().getFolders();
  },
  appendToChild: async (sourceIndex, destinationIndex) => {
    const startingIndex = get().getCurrentTopLevel();
    const data = await Invoke.AppendToChild(sourceIndex, destinationIndex, startingIndex);
    const bookmarks = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks }));
    // update the folders list
    get().getFolders();
  },
}));
