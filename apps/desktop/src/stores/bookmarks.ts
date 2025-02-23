import { createWithSignal } from "solid-zustand";

import { Invoke } from "../invokes";
import type { Bookmark, FolderData, ToolbarBookmarkData } from "../types";

type BookmarkState = {
  folders: FolderData[];
  bookmarks: Bookmark | null;
  toolbarBookmarks: ToolbarBookmarkData[];
  getCurrentTopLevel: () => number;
  getFolders: () => Promise<void>;
  getBookmarks: (index: number) => Promise<void>;
  getToolbarBookmarks: () => Promise<void>;
  addBookmark: (url: string, title: string) => Promise<void>;
  removeBookmark: (index: number) => Promise<void>;
  updateBookmarkTitle: (index: number, title: string) => Promise<void>;
  addFolder: (parentIndex: number, title: string) => Promise<void>;
  insertAfter: (sourceIndex: number, destinationIndex: number) => Promise<void>;
  appendToChild: (sourceIndex: number, destinationIndex: number) => Promise<void>;
  toggleIsOpen: (index: number) => Promise<void>;
};

export const useBookmarkState = createWithSignal<BookmarkState>((set, get) => ({
  folders: [],
  bookmarks: null,
  toolbarBookmarks: [],
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
  getToolbarBookmarks: async () => {
    const toolbarBookmarks = await Invoke.GetToolbarBookmarks();
    set(() => ({ toolbarBookmarks }));
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
    const topLevelIndex = get().getCurrentTopLevel();
    const data = await Invoke.AddBookmark(url, title, topLevelIndex);
    const bookmarks = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks }));
    // update the folders list
    // TODO: this should be done in createEffect on bookmarks (RootChildrenSelect.tsx)
    get().getFolders();
  },
  removeBookmark: async (index) => {
    const topLevelIndex = get().getCurrentTopLevel();
    const data = await Invoke.RemoveBookmark(index, topLevelIndex);
    const bookmarks = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks }));
    // update the folders list
    get().getFolders();
  },
  updateBookmarkTitle: async (index, title) => {
    const topLevelIndex = get().getCurrentTopLevel();
    const data = await Invoke.UpdateBookmarkTitle(index, title, topLevelIndex);
    const bookmarks = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks }));
    // update the folders list
    get().getFolders();
  },
  addFolder: async (parentIndex, title) => {
    const topLevelIndex = get().getCurrentTopLevel();
    const data = await Invoke.AddFolder(parentIndex, title, topLevelIndex);
    const bookmarks = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks }));
    // update the folders list
    get().getFolders();
  },
  insertAfter: async (sourceIndex, destinationIndex) => {
    const topLevelIndex = get().getCurrentTopLevel();
    const data = await Invoke.InsertAfter(sourceIndex, destinationIndex, topLevelIndex);
    const bookmarks = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks }));
    // update the folders list
    get().getFolders();
  },
  appendToChild: async (sourceIndex, destinationIndex) => {
    const topLevelIndex = get().getCurrentTopLevel();
    const data = await Invoke.AppendToChild(sourceIndex, destinationIndex, topLevelIndex);
    const bookmarks = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks }));
    // update the folders list
    get().getFolders();
  },
  toggleIsOpen: async (index) => {
    const topLevelIndex = get().getCurrentTopLevel();
    const data = await Invoke.ToggleIsOpen(index, topLevelIndex);
    const bookmarks = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks }));
  },
}));
