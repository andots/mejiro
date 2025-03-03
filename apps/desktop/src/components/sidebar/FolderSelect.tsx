import { type Component, createSignal } from "solid-js";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";

import type { FolderData } from "../../types";

import { SELECT_BOX_WIDTH } from "../../constants";
import { isDev } from "../../utils";
import { useBookmarkState } from "../../stores/bookmarks";

// https://kobalte.dev/docs/core/components/select/

type Props = {
  folders: FolderData[];
};

const FolderSelect: Component<Props> = (props) => {
  const [value, setValue] = createSignal<FolderData>(props.folders[0]);

  const handleChange = (selected: FolderData | null) => {
    if (selected === null) {
      return;
    }
    if (isDev()) console.log("FolderSelect handleChange", selected);
    setValue(selected);
    useBookmarkState.getState().getBookmarks(selected.index);
  };

  return (
    <Select
      options={props.folders}
      optionValue="index"
      optionTextValue="title"
      value={value()}
      onChange={(v) => handleChange(v)}
      allowDuplicateSelectionEvents={false}
      itemComponent={(props) => (
        <SelectItem item={props.item}>
          <div
            style={{ width: `${SELECT_BOX_WIDTH - 50}px` }}
            class="overflow-hidden whitespace-nowrap text-ellipsis"
          >
            {props.item.rawValue.title}
          </div>
        </SelectItem>
      )}
    >
      <SelectTrigger aria-label="child" style={{ width: `${SELECT_BOX_WIDTH}px` }}>
        <SelectValue<FolderData>>
          {(state) => (
            <div
              style={{ width: `${SELECT_BOX_WIDTH - 50}px` }}
              class="text-left overflow-hidden whitespace-nowrap text-ellipsis"
            >
              {state.selectedOption().title}
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
};

export default FolderSelect;
