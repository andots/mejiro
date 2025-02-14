import { type Component, createSignal, onMount } from "solid-js";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { invokeGetRootChildrenFolder } from "../invokes";
import type { FolderData } from "../types";

// https://kobalte.dev/docs/core/components/select/

const RootChildrenSelect: Component = () => {
  const [options, setOptions] = createSignal<FolderData[]>([]);
  const [value, setValue] = createSignal<FolderData | null>(null);

  onMount(async () => {
    const data = await invokeGetRootChildrenFolder();
    setOptions(data);
    if (data.length > 0) {
      setValue(data[0]);
    }
  });

  return (
    <div class="flex-col">
      <Select
        options={options()}
        optionValue="index"
        optionTextValue="title"
        value={value()}
        onChange={setValue}
        itemComponent={(props) => (
          <SelectItem item={props.item}>{props.item.rawValue.title}</SelectItem>
        )}
      >
        <SelectTrigger aria-label="child" class="w-[180px]">
          <SelectValue<FolderData>>{(state) => state.selectedOption().title}</SelectValue>
        </SelectTrigger>
        <SelectContent />
      </Select>
    </div>
  );
};

export default RootChildrenSelect;
