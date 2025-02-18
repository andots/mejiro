import { Match, Switch } from "solid-js";

import { IcBaselineKeyboardArrowDown, IcBaselineKeyboardArrowRight } from "@repo/ui/icons";

const NavigationArrowIcon = (props: { isOpen: boolean }) => {
  return (
    <Switch>
      <Match when={props.isOpen}>
        <IcBaselineKeyboardArrowDown width={20} height={20} />
      </Match>
      <Match when={!props.isOpen}>
        <IcBaselineKeyboardArrowRight width={20} height={20} />
      </Match>
    </Switch>
  );
};

export default NavigationArrowIcon;
