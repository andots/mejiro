import { createWithSignal } from "solid-zustand";

type SelectedBookmark = {
  index: number;
  title: string;
};

interface DialogState {
  // Bookmark edit dialog
  bookmarkEditOpen: boolean;
  selectedBookmark: SelectedBookmark;
  setBookmarkEditOpen: (open: boolean) => void;
  setSelectedBookmark: (bookmark: SelectedBookmark) => void;

  // Add folder dialog
  addFolderOpen: boolean;
  selectedFolder: SelectedBookmark;
  setAddFolderOpen: (open: boolean) => void;
  setSelectedFolder: (index: number) => void;
}

export const useDialogState = createWithSignal<DialogState>((set) => ({
  // Bookmark edit dialog
  bookmarkEditOpen: false,
  selectedBookmark: { index: -1, title: "" },
  setBookmarkEditOpen: (open) => set({ bookmarkEditOpen: open }),
  setSelectedBookmark: (bookmark) => set({ selectedBookmark: bookmark }),

  // Add folder dialog
  addFolderOpen: false,
  selectedFolder: { index: -1, title: "" },
  setAddFolderOpen: (open) => set({ addFolderOpen: open }),
  setSelectedFolder: (index) => set({ selectedFolder: { index, title: "" } }),
}));
