import { createWithSignal } from "solid-zustand";

interface DialogState {
  bookmarkEditOpen: boolean;
  setBookmarkEditOpen: (open: boolean) => void;
}

export const useDialogState = createWithSignal<DialogState>((set) => ({
  bookmarkEditOpen: false,
  setBookmarkEditOpen: (open) => set({ bookmarkEditOpen: open }),
}));
