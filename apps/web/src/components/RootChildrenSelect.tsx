import { type Component, Show, createSignal, onMount } from "solid-js";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { useBookmarkState } from "../stores/bookmarks";
import type { FolderData } from "../types";

// https://kobalte.dev/docs/core/components/select/

const RootChildrenSelect: Component = () => {
  const folders = useBookmarkState((state) => state.folders);
  const [value, setValue] = createSignal<FolderData>({ index: 1, title: "All Bookmarks" });
  const { getFolders, getBookmarks } = useBookmarkState.getState();

  onMount(() => {
    getFolders();
    getBookmarks(1);
  });

  const handleOnChange = (value: FolderData | null) => {
    if (value !== null && value.index >= 1) {
      setValue(value);
      getBookmarks(value.index);
    }
  };

  return (
    <div class="flex-col h-[40px]">
      <Show when={folders().length > 0}>
        <Select
          options={folders()}
          optionValue="index"
          optionTextValue="title"
          value={value()}
          onChange={(val) => handleOnChange(val)}
          itemComponent={(props) => (
            <SelectItem item={props.item}>{props.item.rawValue.title}</SelectItem>
          )}
        >
          <SelectTrigger aria-label="child" class="w-[185px]">
            <SelectValue<FolderData>>{(state) => state.selectedOption().title}</SelectValue>
          </SelectTrigger>
          <SelectContent />
        </Select>
      </Show>
    </div>
  );
};

export default RootChildrenSelect;
