import { type Component, createSignal } from "solid-js";

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

const AddFolderDialog: Component = () => {
  const open = useDialogState((state) => state.addFolderOpen);
  const setOpen = useDialogState((state) => state.setAddFolderOpen);
  const selected = useDialogState((state) => state.selectedFolder);
  const [title, setTitle] = createSignal("");

  const handleSave = () => {
    // update the title only if it's not empty and the index is not 0
    if (selected().index > 0 && title() !== "") {
      const addFolder = useBookmarkState((state) => state.addFolder);
      addFolder(selected().index, title());
    }
    setOpen(false);
    setTitle("");
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setTitle("");
  };

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Folder</DialogTitle>
        </DialogHeader>
        <DialogDescription>Enter title for the new folder</DialogDescription>
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
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFolderDialog;
