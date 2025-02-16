import { createWithSignal } from "solid-zustand";

type SelectedBookmark = {
  index: number;
  title: string;
};

interface DialogState {
  bookmarkEditOpen: boolean;
  setBookmarkEditOpen: (open: boolean) => void;
  selectedBookmark: SelectedBookmark;
  setSelectedBookmark: (bookmark: SelectedBookmark) => void;
}

export const useDialogState = createWithSignal<DialogState>((set) => ({
  selectedBookmark: { index: -1, title: "" },
  bookmarkEditOpen: false,
  setBookmarkEditOpen: (open) => set({ bookmarkEditOpen: open }),
  setSelectedBookmark: (bookmark) => set({ selectedBookmark: bookmark }),
}));
