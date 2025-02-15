import { Button } from "@repo/ui/button";
import { type Component, For, Show, createSignal } from "solid-js";

import {
  IcBaselineEditNote,
  IcOutlineSettings,
  OcticonPencil24,
  OcticonSidebarCollapse24,
  OcticonSidebarExpand24,
} from "@repo/ui/icons";
import { useSettingsState } from "../stores/settings";
import { useUrlState } from "../stores/url";
import { useWindowState } from "../stores/window";
import AddressBar from "./AddressBar";
import Favicon from "./icons/Favicon";

const ToolBar: Component = () => {
  const settings = useSettingsState((state) => state.settings);
  const navigateToUrl = useUrlState((state) => state.navigateToUrl);
  const sidebarVisible = useWindowState((state) => state.sidebarVisible);
  const toggleSidebar = useWindowState((state) => state.toggleSidebar);
  const toggleExternalWebview = useWindowState((state) => state.toggleExternalWebview);

  return (
    <div class="flex justify-center items-center w-full h-full px-2">
      {/* menu button */}
      <Button
        class="w-9 h-9 m-0 p-2 [&_svg]:size-6 [&_svg]:shrink-0"
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
      >
        <Show when={sidebarVisible()}>
          <OcticonSidebarExpand24 />
        </Show>
        <Show when={!sidebarVisible()}>
          <OcticonSidebarCollapse24 />
        </Show>
      </Button>

      {/* edit button */}
      <Button
        class="w-9 h-9 m-0 p-2 [&_svg]:size-6 [&_svg]:shrink-0"
        variant="ghost"
        size="icon"
        onClick={toggleExternalWebview}
      >
        <OcticonPencil24 />
      </Button>

      {/* pinned url favicons */}
      <div class="flex items-center ml-2">
        <For each={settings()?.pinned_urls}>
          {(url) => (
            <Button variant="ghost" class="w-9 h-9 p-2" onClick={() => navigateToUrl(url)}>
              <Favicon url={url} width="18" height="18" />
            </Button>
          )}
        </For>
      </div>

      {/* address bar */}
      <AddressBar />

      {/* settings button */}
      <Button class="w-9 h-9 m-0 p-2 [&_svg]:size-5 [&_svg]:shrink-0" variant="ghost" size="icon">
        <IcOutlineSettings />
      </Button>
    </div>
  );
};

export default ToolBar;
