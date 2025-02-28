import { type Component, createSignal } from "solid-js";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import type { FolderData } from "../../types";
import { SELECT_BOX_WIDTH } from "../../constants";

// https://kobalte.dev/docs/core/components/select/

type Props = {
  folders: FolderData[];
  value: FolderData | null;
  onChange: (val: FolderData | null) => void;
};

const RootChildrenSelect: Component<Props> = (props) => {
  return (
    <Select
      options={props.folders}
      optionValue="index"
      optionTextValue="title"
      value={props.value}
      onChange={(val) => props.onChange(val)}
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

export default RootChildrenSelect;
