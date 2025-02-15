import { type Component, Show, createSignal, onMount } from "solid-js";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { invokeGetRootChildrenFolder } from "../invokes";
import type { FolderData } from "../types";

// https://kobalte.dev/docs/core/components/select/

const RootChildrenSelect: Component = () => {
  const [options, setOptions] = createSignal<FolderData[]>([{ index: 1, title: "All Bookmarks" }]);
  const [value, setValue] = createSignal<FolderData | null>({ index: 1, title: "All Bookmarks" });

  onMount(async () => {
    const data = await invokeGetRootChildrenFolder();
    setOptions([...options(), ...data]);
    if (options().length > 0) {
      setValue(options()[0]);
    }
  });

  const handleOnChange = (value: FolderData | null) => {
    // TODO: reload bookmarks tree based on selected folder
    if (value !== null) {
      console.log(value);
      setValue(value);
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
