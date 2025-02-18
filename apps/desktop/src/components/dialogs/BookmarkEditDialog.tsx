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
import { useEditDialog } from "../../stores/dialogs";

const BookmarkEditDialog: Component = () => {
  const open = useEditDialog((state) => state.open);
  const setOpen = useEditDialog((state) => state.setOpen);
  const target = useEditDialog((state) => state.target);
  const setTarget = useEditDialog((state) => state.setTarget);
  const [title, setTitle] = createSignal(target().title);

  createEffect(on(target, () => setTitle(target().title)));

  const closeDialog = () => {
    setTarget({ index: -1, title: "" });
    setOpen(false);
  };

  const handleSave = () => {
    // update the title only if it's not empty and the index is not 0
    if (target().index > 0 && title() !== "") {
      const updateBookmarkTitle = useBookmarkState((state) => state.updateBookmarkTitle);
      updateBookmarkTitle(target().index, title());
    }
    closeDialog();
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <Dialog open={open()} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Title</DialogTitle>
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
          <Button type="button" variant={"outline"} onClick={closeDialog}>
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
