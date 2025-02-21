import { type Component, createEffect, createSignal, onMount } from "solid-js";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { useBookmarkState } from "../../stores/bookmarks";
import type { FolderData } from "../../types";

// https://kobalte.dev/docs/core/components/select/

type Props = {
  folders: FolderData[];
};

const RootChildrenSelect: Component<Props> = (props) => {
  const [value, setValue] = createSignal<FolderData>(props.folders[0]);

  onMount(() => {
    if (value().index >= 1) {
      useBookmarkState.getState().getBookmarks(value().index);
    }
  });

  const handleOnChange = (val: FolderData | null) => {
    // console.log("RootChildrenSelect handleOnChange", val);
    if (val !== null && val.index >= 1) {
      setValue(val);
      useBookmarkState.getState().getBookmarks(val.index);
    }
  };

  return (
    <div class="flex-col h-[40px]">
      <Select
        options={props.folders}
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
    </div>
  );
};

export default RootChildrenSelect;
