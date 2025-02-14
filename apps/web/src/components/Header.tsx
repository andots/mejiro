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

const Header: Component = () => {
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

  const settings = useSettingsState((state) => state.settings);
  const navigateToUrl = useUrlState((state) => state.navigateToUrl);

  return (
    <header class="sticky top-0 z-50 w-full h-[40px] border-b border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div class="flex justify-center items-center w-full h-full">
        {/* menu button */}
        <Button
          class="w-9 h-9 m-2 p-2 [&_svg]:size-6 [&_svg]:shrink-0"
          variant="ghost"
          onClick={handleMenuClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
            <title>menu</title>
            <path fill="currentColor" d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z" />
          </svg>
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
        <AddressBar />
      </div>
    </header>
  );
};

export default Header;
