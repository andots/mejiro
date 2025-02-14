import { type Component, createSignal, onMount } from "solid-js";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { invokeGetRootChildren } from "../invokes";
import type { BookmarkData } from "../types";

// https://kobalte.dev/docs/core/components/select/

const RootChildrenSelect: Component = () => {
  const [options, setOptions] = createSignal<BookmarkData[]>([]);
  const [value, setValue] = createSignal<BookmarkData | null>(null);

  onMount(async () => {
    const data = await invokeGetRootChildren();
    setOptions(data);
    if (data.length > 0) {
      setValue(data[0]);
    }
  });

  return (
    <div class="flex-col mb-2">
      <Select
        options={options()}
        optionValue="title"
        optionTextValue="title"
        value={value()}
        onChange={setValue}
        itemComponent={(props) => (
          <SelectItem item={props.item}>{props.item.rawValue.title}</SelectItem>
        )}
      >
        <SelectTrigger aria-label="child" class="w-[180px]">
          <SelectValue<BookmarkData>>{(state) => state.selectedOption().title}</SelectValue>
        </SelectTrigger>
        <SelectContent />
      </Select>
    </div>
  );
};

export default RootChildrenSelect;
