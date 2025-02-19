import { Match, Switch } from "solid-js";

import {
  IcOutlineFolder,
  IcOutlineFolderOpen,
  OcticonFileDirectoryFill24,
  OcticonFileDirectoryOpenFill24,
} from "@repo/ui/icons";

const FolderIcon = (props: { isOpen: boolean; size: number }) => {
  return (
    <Switch>
      <Match when={props.isOpen}>
        <OcticonFileDirectoryOpenFill24 width={props.size} height={props.size} />
      </Match>
      <Match when={!props.isOpen}>
        <OcticonFileDirectoryFill24 width={props.size} height={props.size} />
      </Match>
    </Switch>
  );
};

export default FolderIcon;
