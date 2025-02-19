import { Match, Switch } from "solid-js";

import {
  IcBaselineKeyboardArrowDown,
  IcBaselineKeyboardArrowRight,
  OcticonChevronDown24,
  OcticonChevronRight24,
} from "@repo/ui/icons";

const NavigationArrowIcon = (props: { isOpen: boolean; size: number }) => {
  return (
    <Switch>
      <Match when={props.isOpen}>
        <OcticonChevronDown24 width={props.size} height={props.size} />
      </Match>
      <Match when={!props.isOpen}>
        <OcticonChevronRight24 width={props.size} height={props.size} />
      </Match>
    </Switch>
  );
};

export default NavigationArrowIcon;
