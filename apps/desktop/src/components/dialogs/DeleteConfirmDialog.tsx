import type { Component } from "solid-js";

import { Button } from "@repo/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/dialog";
import { useDeleteConfirmDialog } from "../../stores/dialogs";
import { useBookmarkState } from "../../stores/bookmarks";

const DeleteConfirmDialog: Component = () => {
  const open = useDeleteConfirmDialog((state) => state.open);
  const setOpen = useDeleteConfirmDialog((state) => state.setOpen);
  const target = useDeleteConfirmDialog((state) => state.target);
  const removeBookmark = useBookmarkState((state) => state.removeBookmark);

  const handleDelete = () => {
    if (target().index >= 1) {
      removeBookmark(target().index);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Bookmark/Folder</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p>
            Are you sure you want to delete <span class="italic bold">"{target().title}"</span>?
          </p>
          <p>This action cannot be undone.</p>
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
