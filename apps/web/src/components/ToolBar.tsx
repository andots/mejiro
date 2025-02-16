import { Button } from "@repo/ui/button";
import { type Component, For, Show } from "solid-js";

import {
  OcticonGear24,
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

  const externalState = useWindowState((state) => state.externalState);
  const changeExternalState = useWindowState((state) => state.changeExternalState);

  const handleSidebar = () => {
    if (externalState() === "right") {
      changeExternalState("full");
    } else if (externalState() === "full") {
      changeExternalState("right");
    } else if (externalState() === "hidden") {
      changeExternalState("right");
    }
  };

  const handleEditButton = () => {
    if (externalState() === "hidden") {
      changeExternalState("right");
    } else {
      changeExternalState("hidden");
    }
  };

  const handlePinnedUrl = (url: string) => {
    navigateToUrl(url);
    if (externalState() === "hidden") {
      changeExternalState("right");
    }
  };

  return (
    <div class="flex justify-center items-center w-full h-full px-2">
      {/* menu button */}
      <Button
        class="w-9 h-9 m-0 p-2 [&_svg]:size-6 [&_svg]:shrink-0"
        variant="ghost"
        size="icon"
        onClick={handleSidebar}
      >
        <Show when={externalState() === "right"}>
          <OcticonSidebarCollapse24 />
        </Show>
        <Show when={externalState() === "hidden"}>
          {/* <OcticonSidebar24 /> */}
          <OcticonSidebarCollapse24 />
        </Show>
        <Show when={externalState() === "full"}>
          <OcticonSidebarExpand24 />
        </Show>
      </Button>

      <Button
        class="w-9 h-9 m-0 p-2 [&_svg]:size-6 [&_svg]:shrink-0"
        variant="ghost"
        size="icon"
        onClick={handleEditButton}
      >
        <OcticonPencil24 />
      </Button>

      {/* pinned url favicons */}
      <div class="flex items-center ml-2">
        <For each={settings()?.pinned_urls}>
          {(url) => (
            <Button variant="ghost" class="w-9 h-9 p-2" onClick={() => handlePinnedUrl(url)}>
              <Favicon url={url} width="18" height="18" />
            </Button>
          )}
        </For>
      </div>

      {/* address bar */}
      <AddressBar />

      {/* settings button */}
      <Button class="w-9 h-9 m-0 p-2 [&_svg]:size-5 [&_svg]:shrink-0" variant="ghost" size="icon">
        <OcticonGear24 />
      </Button>
    </div>
  );
};

export default ToolBar;
