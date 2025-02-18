import { Match, Switch } from "solid-js";

import { IcOutlineFolder, IcOutlineFolderOpen } from "@repo/ui/icons";

const FolderIcon = (props: { isOpen: boolean }) => {
  return (
    <Switch>
      <Match when={props.isOpen}>
        <IcOutlineFolderOpen width={20} height={20} />
      </Match>
      <Match when={!props.isOpen}>
        <IcOutlineFolder width={20} height={20} />
      </Match>
    </Switch>
  );
};

export default FolderIcon;
