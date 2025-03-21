import { createWithSignal } from "solid-zustand";

import { Invoke } from "../invokes";
import type { NestedBookmark, ToolbarBookmarkData } from "../types";

export const getFolders = async () => {
  const folders = await Invoke.GetRootAndChildrenFolders();
  return folders;
};

type BookmarkState = {
  bookmarks: NestedBookmark | null;
  toolbarBookmarks: ToolbarBookmarkData[];
  isTreeLocked: boolean;
  activeIndex: number | null;
  editingIndex: number | null;
  setTreeLockState: (value: boolean) => void;
  setActiveIndex: (index: number | null) => void;
  setEditingIndex: (index: number | null) => void;
  getCurrentTopLevel: () => number;
  getBookmarks: (index: number) => Promise<void>;
  getToolbarBookmarks: () => Promise<void>;
  addBookmark: (title: string, url: string) => Promise<void>;
  appendBookmarkToToolbar: (title: string, url: string) => Promise<void>;
  removeBookmark: (index: number) => Promise<void>;
  updateBookmarkTitle: (index: number, title: string) => Promise<void>;
  addFolder: (parentIndex: number, title: string) => Promise<void>;
  insertAfter: (sourceIndex: number, destinationIndex: number) => Promise<void>;
  insertBefore: (sourceIndex: number, destinationIndex: number) => Promise<void>;
  appendToChild: (sourceIndex: number, destinationIndex: number) => Promise<void>;
  prependToChild: (sourceIndex: number, destinationIndex: number) => Promise<void>;
  setIsOpen(index: number, isOpen: boolean): void;
  toggleIsOpen: (index: number) => Promise<void>;
};

export const useBookmarkState = createWithSignal<BookmarkState>((set, get) => ({
  bookmarks: null,
  toolbarBookmarks: [],
  isTreeLocked: false,
  activeIndex: null,
  editingIndex: null,
  setTreeLockState: (value) => {
    set(() => ({ isTreeLocked: value }));
  },
  setActiveIndex: (index) => {
    set(() => ({ activeIndex: index }));
  },
  setEditingIndex: (index) => {
    set(() => ({ editingIndex: index }));
  },
  getCurrentTopLevel: () => {
    const bookmarks = get().bookmarks;
    if (bookmarks !== null) {
      return bookmarks.index;
    }
    return 1;
  },
  getToolbarBookmarks: async () => {
    const toolbarBookmarks = await Invoke.GetToolbarBookmarks();
    set(() => ({ toolbarBookmarks }));
  },
  getBookmarks: async (index) => {
    // can't accept index 0 because indextree starts from 1
    if (index >= 1) {
      // SetIsOpen returns the updated bookmarks that open top level folder
      const topLevelIndex = index;
      const bookmarks = await Invoke.SetIsOpen(index, true, topLevelIndex);
      set(() => ({ bookmarks }));
    }
  },
  addBookmark: async (title, url) => {
    const topLevelIndex = get().getCurrentTopLevel();
    const res = await Invoke.AddBookmark(title, url, topLevelIndex);
    set(() => ({ bookmarks: res.bookmarks }));
  },
  appendBookmarkToToolbar: async (title, url) => {
    const topLevelIndex = get().getCurrentTopLevel();
    const bookmarks = await Invoke.AppendBookmarkToToolbar(title, url, topLevelIndex);
    set(() => ({ bookmarks }));
  },
  removeBookmark: async (index) => {
    const topLevelIndex = get().getCurrentTopLevel();
    const bookmarks = await Invoke.RemoveBookmark(index, topLevelIndex);
    set(() => ({ bookmarks }));
  },
  updateBookmarkTitle: async (index, title) => {
    const topLevelIndex = get().getCurrentTopLevel();
    const bookmarks = await Invoke.UpdateBookmarkTitle(index, title, topLevelIndex);
    set(() => ({ bookmarks }));
  },
  addFolder: async (parentIndex, title) => {
    const topLevelIndex = get().getCurrentTopLevel();
    const res = await Invoke.AddFolder(parentIndex, title, topLevelIndex);
    set(() => ({ bookmarks: res.bookmarks, editingIndex: res.index }));
  },
  insertAfter: async (sourceIndex, destinationIndex) => {
    const topLevelIndex = get().getCurrentTopLevel();
    const bookmarks = await Invoke.InsertAfter(sourceIndex, destinationIndex, topLevelIndex);
    set(() => ({ bookmarks }));
  },
  insertBefore: async (sourceIndex, destinationIndex) => {
    const topLevelIndex = get().getCurrentTopLevel();
    const bookmarks = await Invoke.InsertBefore(sourceIndex, destinationIndex, topLevelIndex);
    set(() => ({ bookmarks }));
  },
  appendToChild: async (sourceIndex, destinationIndex) => {
    const topLevelIndex = get().getCurrentTopLevel();
    const bookmarks = await Invoke.AppendToChild(sourceIndex, destinationIndex, topLevelIndex);
    set(() => ({ bookmarks }));
  },
  prependToChild: async (sourceIndex, destinationIndex) => {
    const topLevelIndex = get().getCurrentTopLevel();
    const bookmarks = await Invoke.PrependToChild(sourceIndex, destinationIndex, topLevelIndex);
    set(() => ({ bookmarks }));
  },
  setIsOpen: async (index, isOpen) => {
    const topLevelIndex = get().getCurrentTopLevel();
    const bookmarks = await Invoke.SetIsOpen(index, isOpen, topLevelIndex);
    set(() => ({ bookmarks }));
  },
  toggleIsOpen: async (index) => {
    const topLevelIndex = get().getCurrentTopLevel();
    const bookmarks = await Invoke.ToggleIsOpen(index, topLevelIndex);
    set(() => ({ bookmarks }));
  },
}));
