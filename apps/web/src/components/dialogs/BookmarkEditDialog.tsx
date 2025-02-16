import { type Component, createEffect, createSignal, on } from "solid-js";

import { Button } from "@repo/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/dialog";
import { TextField, TextFieldInput, TextFieldLabel } from "@repo/ui/text-field";
import { useBookmarkState } from "../../stores/bookmarks";
import { useDialogState } from "../../stores/dialog";

const BookmarkEditDialog: Component = () => {
  const open = useDialogState((state) => state.bookmarkEditOpen);
  const setOpen = useDialogState((state) => state.setBookmarkEditOpen);
  const selected = useDialogState((state) => state.selectedBookmark);
  const [title, setTitle] = createSignal(selected().title);

  createEffect(on(selected, () => setTitle(selected().title)));

  const handleSave = () => {
    // update the title only if it's not empty and the index is not 0
    if (selected().index > 0 && title() !== "") {
      const updateBookmarkTitle = useBookmarkState((state) => state.updateBookmarkTitle);
      updateBookmarkTitle(selected().index, title());
    }
    setOpen(false);
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Bookmark</DialogTitle>
        </DialogHeader>
        <DialogDescription>Edit the title of the bookmark</DialogDescription>
        <div class="grid gap-4 py-4">
          <TextField class="grid grid-cols-4 items-center gap-4">
            <TextFieldLabel class="text-right">Title</TextFieldLabel>
            <TextFieldInput
              value={title()}
              onInput={(e) => setTitle(e.currentTarget.value)}
              onKeyDown={(e) => handleKeydown(e)}
              class="col-span-3"
              type="text"
            />
          </TextField>
        </div>
        <DialogFooter>
          <Button type="button" variant={"outline"} onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookmarkEditDialog;
