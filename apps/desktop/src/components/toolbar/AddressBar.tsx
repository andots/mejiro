import type { Component } from "solid-js";
import { Show, createEffect, createSignal, on } from "solid-js";

import {
  IcBaselineRefresh,
  OcticonLock24,
  OcticonStar24,
  OcticonStarFill24,
  OcticonUnlock24,
} from "@repo/ui/icons";
import { useBookmarkState } from "../../stores/bookmarks";
import { useUrlState } from "../../stores/url";
import { cn } from "../../utils";

const AddressBar: Component = () => {
  const url = useUrlState((state) => state.url);
  const title = useUrlState((state) => state.title);
  const navigateToUrl = useUrlState((state) => state.navigateToUrl);
  const addBookmark = useBookmarkState((state) => state.addBookmark);
  const [isHttps, setIsHttps] = createSignal<boolean>(true);
  const [isValidUrl, setIsValidUrl] = createSignal<boolean>(false);

  const [isStar, setIsStar] = createSignal(false);

  createEffect(
    on(url, (u) => {
      if (u === "") {
        return;
      }
      setIsStar(false);
      setIsHttps(u.toLowerCase().startsWith("https://"));
      try {
        const v = new URL(u);
        setIsValidUrl(true);
      } catch {
        setIsValidUrl(false);
      }
    }),
  );

  const handleClickStar = async () => {
    setIsStar(true);
    await addBookmark(title(), url());
    setTimeout(() => {
      setIsStar(false);
    }, 2000);
  };

  const handleRefresh = () => {
    navigateToUrl(url());
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLInputElement;
      navigateToUrl(target.value);
    }
  };

  return (
    <div class={cn("flex items-center h-[30px] w-full px-2 border rounded bg-background")}>
      {/* Security Icon */}
      {isHttps() ? <OcticonLock24 /> : <OcticonUnlock24 />}

      {/* URL Text */}
      <div class="flex-1 flex items-center">
        <input
          value={url()}
          class="w-full px-2 text-sm outline-none focus:outline-none"
          onKeyDown={(e) => handleKeyDown(e)}
        />
      </div>

      {/* Action Buttons */}
      <div class="flex items-center space-x-2">
        {/* Refresh Button */}
        <button
          onClick={() => handleRefresh()}
          class="p-1 hover:bg-sidebar-accent rounded-full transition-colors"
          title="Refresh page"
          type="button"
        >
          <IcBaselineRefresh />
        </button>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleClickStar}
          class="p-1 hover:bg-sidebar-accent rounded-full transition-colors"
        >
          <Show when={!isStar()}>
            <OcticonStar24 />
          </Show>
          <Show when={isStar()}>
            <OcticonStarFill24 class="text-yellow-500 fill-current" />
          </Show>
        </button>
      </div>
    </div>
  );
};

export default AddressBar;
