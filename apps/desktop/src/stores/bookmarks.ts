import { createWithSignal } from "solid-zustand";

import { Invoke } from "../invokes";
import type { Bookmark, FolderData, ToolbarBookmarkData } from "../types";

type BookmarkState = {
  folders: FolderData[];
  bookmarks: Bookmark | null;
  toolbarBookmarks: ToolbarBookmarkData[];
  isTreeLocked: boolean;
  setTreeLockState: (value: boolean) => void;
  getCurrentTopLevel: () => number;
  getFolders: () => Promise<void>;
  getBookmarks: (index: number) => Promise<void>;
  getToolbarBookmarks: () => Promise<void>;
  addBookmark: (url: string, title: string) => Promise<void>;
  appendBookmarkToToolbar: (title: string, url: string) => Promise<void>;
  removeBookmark: (index: number) => Promise<void>;
  updateBookmarkTitle: (index: number, title: string) => Promise<void>;
  addFolder: (parentIndex: number, title: string) => Promise<void>;
  insertAfter: (sourceIndex: number, destinationIndex: number) => Promise<void>;
  insertBefore: (sourceIndex: number, destinationIndex: number) => Promise<void>;
  appendToChild: (sourceIndex: number, destinationIndex: number) => Promise<void>;
  prependToChild: (sourceIndex: number, destinationIndex: number) => Promise<void>;
  toggleIsOpen: (index: number) => Promise<void>;
};

export const useBookmarkState = createWithSignal<BookmarkState>((set, get) => ({
  folders: [],
  bookmarks: null,
  toolbarBookmarks: [],
  isTreeLocked: false,
  setTreeLockState: (value) => {
    set(() => ({ isTreeLocked: value }));
  },
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
      const bookmarks = await Invoke.GetNestedJson(index);
      set(() => ({ bookmarks }));
    }
  },
  addBookmark: async (url, title) => {
    // get current top of bookmark index that shown in the UI as a starting point
    const topLevelIndex = get().getCurrentTopLevel();
    const data = await Invoke.AddBookmark(url, title, topLevelIndex);
    const bookmarks = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks }));
  },
  appendBookmarkToToolbar: async (title, url) => {
    const topLevelIndex = get().getCurrentTopLevel();
    const data = await Invoke.AppendBookmarkToToolbar(title, url, topLevelIndex);
    const bookmarks = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks }));
  },
  removeBookmark: async (index) => {
    const topLevelIndex = get().getCurrentTopLevel();
    const data = await Invoke.RemoveBookmark(index, topLevelIndex);
    const bookmarks = JSON.parse(data) as Bookmark;
    set(() => ({ bookmarks }));
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
  insertBefore: async (sourceIndex, destinationIndex) => {
    const topLevelIndex = get().getCurrentTopLevel();
    const data = await Invoke.InsertBefore(sourceIndex, destinationIndex, topLevelIndex);
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
  prependToChild: async (sourceIndex, destinationIndex) => {
    const topLevelIndex = get().getCurrentTopLevel();
    const data = await Invoke.PrependToChild(sourceIndex, destinationIndex, topLevelIndex);
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
