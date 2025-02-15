import { type Component, Show, createSignal, onMount } from "solid-js";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { Invoke } from "../invokes";
import { useBookmarkState } from "../stores/bookmarks";
import type { FolderData } from "../types";

// https://kobalte.dev/docs/core/components/select/

const RootChildrenSelect: Component = () => {
  const [options, setOptions] = createSignal<FolderData[]>([{ index: 1, title: "All Bookmarks" }]);
  const [value, setValue] = createSignal<FolderData | null>({ index: 1, title: "All Bookmarks" });
  const getBookmarks = useBookmarkState((state) => state.getBookmarks);

  onMount(async () => {
    const data = await Invoke.GetRootChildrenFolder();
    setOptions([...options(), ...data]);
    if (options().length > 0) {
      setValue(options()[0]);
    }
  });

  const handleOnChange = (value: FolderData | null) => {
    if (value !== null && value.index > 0) {
      setValue(value);
      getBookmarks(value.index);
    }
  };

  return (
    <div class="flex-col h-[40px]">
      <Show when={options().length > 0}>
        <Select
          options={options()}
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
