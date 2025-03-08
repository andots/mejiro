import { Button } from "@repo/ui/button";
import { type Component, createEffect, For, on } from "solid-js";

import { IcBaselineHome, IcBaselineMenu, OcticonGear24 } from "@repo/ui/icons";

import { useUrlState } from "../stores/url";
import { useWindowState } from "../stores/window";
import { usePageState } from "../stores/pages";
import { useBookmarkState } from "../stores/bookmarks";

import AddressBar from "./toolbar/AddressBar";
import Favicon from "./icons/Favicon";
import { useUserSettingsState } from "../stores/settings";
import { FAVICON_SIZE } from "../constants";

const ToolBar: Component = () => {
  const useUrl = useUrlState();
  const useWindow = useWindowState();
  const useUserSettings = useUserSettingsState();

  const bookmarks = useBookmarkState((state) => state.bookmarks);
  const toolbarBookmarks = useBookmarkState((state) => state.toolbarBookmarks);
  const externalState = useWindowState((state) => state.externalState);

  // TODO: do not call every time when change bookmarks state change
  createEffect(
    on(bookmarks, () => {
      useBookmarkState.getState().getToolbarBookmarks();
    }),
  );

  const page = usePageState((state) => state.page);
  const setPage = usePageState((state) => state.setPage);

  const handleMenu = () => {
    setPage("dashboard");
    if (externalState() === "right") {
      useWindow().changeExternalState("full");
    } else if (externalState() === "full") {
      useWindow().changeExternalState("right");
    } else if (externalState() === "hidden") {
      useWindow().changeExternalState("right");
    }
  };

  const handleHome = () => {
    setPage("dashboard");
    const url = useUserSettings().home_page_url;
    useUrl().navigateToUrl(url);
    if (externalState() === "hidden") {
      useWindow().changeExternalState("right");
    }
  };

  const handlePinnedUrl = (url: string) => {
    setPage("dashboard");
    useUrl().navigateToUrl(url);
    if (externalState() === "hidden") {
      useWindow().changeExternalState("right");
    }
  };

  const handleSettings = () => {
    if (page() === "settings") {
      useWindow().changeExternalState("right");
      setPage("dashboard");
    } else {
      useWindow().changeExternalState("hidden");
      setPage("settings");
    }
  };

  return (
    <div id="toolbar" class="flex items-center w-full h-full px-2">
      <div class="flex flex-row items-center">
        {/* Menu button */}
        <Button
          class="w-9 h-9 [&_svg]:size-6 [&_svg]:shrink-0"
          variant="ghost"
          size="icon"
          onClick={handleMenu}
        >
          <IcBaselineMenu />
        </Button>

        {/* Home button */}
        <Button
          class="w-9 h-9 [&_svg]:size-6 [&_svg]:shrink-0"
          variant="ghost"
          size="icon"
          onClick={handleHome}
        >
          <IcBaselineHome />
        </Button>

        {/* Pinned url favicons */}
        <div class="flex items-center ml-2">
          <For each={toolbarBookmarks()}>
            {(bookmark) => (
              <Button
                variant="ghost"
                class="w-9 h-9 p-2"
                onClick={() => handlePinnedUrl(bookmark.url)}
              >
                <Favicon url={bookmark.url} width={FAVICON_SIZE} height={FAVICON_SIZE} />
              </Button>
            )}
          </For>
        </div>
      </div>

      {/* Address bar */}
      <div class="flex-1 mx-8">
        <AddressBar />
      </div>

      <div class="flex-none">
        {/* Settings button */}
        <Button
          class="w-9 h-9 [&_svg]:size-5 [&_svg]:shrink-0"
          variant="ghost"
          size="icon"
          onClick={() => handleSettings()}
        >
          <OcticonGear24 />
        </Button>
      </div>
    </div>
  );
};

export default ToolBar;
