import { Button } from "@repo/ui/button";
import { type Component, For } from "solid-js";
import {
  invokeGetAppWebviewBounds,
  invokeGetExternalWebviewBounds,
  invokeSetExternalWebviewBounds,
} from "../invokes";
import { useSettingsState } from "../stores/settings";
import { useUrlState } from "../stores/url";
import AddressBar from "./AddressBar";
import Favicon from "./icons/Favicon";
import { IcBaselineEditNote, IcBaselineMenuOpen, IcOutlineSettings } from "./icons/Icons";

const Header: Component = () => {
  const settings = useSettingsState((state) => state.settings);
  const navigateToUrl = useUrlState((state) => state.navigateToUrl);

  const handleMenuClick = async () => {
    const appBounds = await invokeGetAppWebviewBounds();
    const externalBounds = await invokeGetExternalWebviewBounds();
    // TODO: must be user defined state
    const headerHeight = 40;
    const sidebarWidth = 200;
    if (externalBounds.position.Physical.x === 0) {
      // 全画面状態なので、サイドバー分の幅を引く
      await invokeSetExternalWebviewBounds({
        size: {
          width: appBounds.size.Physical.width - sidebarWidth,
          height: appBounds.size.Physical.height - headerHeight,
        },
        position: { x: sidebarWidth, y: headerHeight },
      });
    } else {
      await invokeSetExternalWebviewBounds({
        size: {
          width: appBounds.size.Physical.width,
          height: appBounds.size.Physical.height - headerHeight,
        },
        position: { x: 0, y: headerHeight },
      });
    }
  };

  return (
    <header class="sticky top-0 z-50 w-full h-[40px] border-b border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div class="flex justify-center items-center w-full h-full px-1">
        {/* menu button */}
        <Button
          class="w-9 h-9 m-0 mr-3 p-2 [&_svg]:size-6 [&_svg]:shrink-0"
          variant="ghost"
          size="icon"
          onClick={handleMenuClick}
        >
          <IcBaselineMenuOpen />
        </Button>

        {/* pinned url favicons */}
        <div class="flex items-center">
          <For each={settings()?.pinned_urls}>
            {(url) => (
              <Button variant="ghost" class="w-9 h-9 p-2" onClick={() => navigateToUrl(url)}>
                <Favicon url={url} width="20" height="20" />
              </Button>
            )}
          </For>
        </div>
        {/* address bar */}
        <AddressBar />

        {/* edit button */}
        <Button class="w-9 h-9 m-0 p-2 [&_svg]:size-6 [&_svg]:shrink-0" variant="ghost" size="icon">
          <IcBaselineEditNote />
        </Button>

        {/* settings button */}
        <Button
          class="w-9 h-9 m-0 p-2 [&_svg]:size-5 [&_svg]:shrink-0"
          variant="ghost"
          size="icon"
          onClick={handleMenuClick}
        >
          <IcOutlineSettings />
        </Button>
      </div>
    </header>
  );
};

export default Header;
