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
import { TextField, TextFieldInput, TextFieldLabel } from "@repo/ui/text-field";
import { useDialogState } from "../../stores/dialog";

const BookmarkEditDialog: Component = (props) => {
  const open = useDialogState((state) => state.bookmarkEditOpen);
  const setOpen = useDialogState((state) => state.setBookmarkEditOpen);

  const handleSave = () => {
    //
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
            <TextFieldInput value="" class="col-span-3" type="text" />
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
