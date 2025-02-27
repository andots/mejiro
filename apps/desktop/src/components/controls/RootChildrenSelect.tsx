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
        <SelectItem item={props.item}>{props.item.rawValue.title}</SelectItem>
      )}
    >
      <SelectTrigger aria-label="child" style={{ width: SELECT_BOX_WIDTH }}>
        <SelectValue<FolderData>>{(state) => state.selectedOption().title}</SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
};

export default RootChildrenSelect;
