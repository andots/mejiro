import { createWithSignal } from "solid-zustand";

type SelectedBookmark = {
  index: number;
  title: string;
};

type DialogState = {
  // Bookmark edit dialog
  bookmarkEditOpen: boolean;
  selectedBookmark: SelectedBookmark;
  setBookmarkEditOpen: (open: boolean) => void;
  setSelectedBookmark: (bookmark: SelectedBookmark) => void;
};

export const useDialogState = createWithSignal<DialogState>((set) => ({
  // Bookmark edit dialog
  bookmarkEditOpen: false,
  selectedBookmark: { index: -1, title: "" },
  setBookmarkEditOpen: (open) => set({ bookmarkEditOpen: open }),
  setSelectedBookmark: (bookmark) => set({ selectedBookmark: bookmark }),
}));

// Add folder dialog
type AddFolderDialogState = {
  open: boolean;
  parentIndex: number;
  setOpen: (open: boolean) => void;
  setParentIndex: (parentIndex: number) => void;
};

export const useAddFolderDialogState = createWithSignal<AddFolderDialogState>((set) => ({
  open: false,
  parentIndex: -1,
  setOpen: (open) => set({ open }),
  setParentIndex: (parentIndex) => set({ parentIndex }),
}));
