import { createWithSignal } from "solid-zustand";

// Bookmark edit dialog
type Target = {
  index: number;
  title: string;
};

type EditDialogState = {
  // Bookmark edit dialog
  open: boolean;
  target: Target;
  setOpen: (open: boolean) => void;
  setTarget: (target: Target) => void;
};

export const useEditDialog = createWithSignal<EditDialogState>((set) => ({
  open: false,
  target: { index: -1, title: "" },
  setOpen: (open) => set({ open: open }),
  setTarget: (target) => set({ target }),
}));

// Add folder dialog
type AddFolderDialogState = {
  open: boolean;
  parentIndex: number;
  setOpen: (open: boolean) => void;
  setParentIndex: (parentIndex: number) => void;
};

export const useAddFolderDialog = createWithSignal<AddFolderDialogState>((set) => ({
  open: false,
  parentIndex: -1,
  setOpen: (open) => set({ open }),
  setParentIndex: (parentIndex) => set({ parentIndex }),
}));

type DeleteConfirmDialogState = {
  open: boolean;
  target: Target;
  setOpen: (open: boolean) => void;
  setTarget: (target: Target) => void;
};

export const useDeleteConfirmDialog = createWithSignal<DeleteConfirmDialogState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  target: { index: -1, title: "" },
  setTarget: (target) => set({ target }),
}));
