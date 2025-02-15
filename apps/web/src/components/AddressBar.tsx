import type { Component } from "solid-js";
import { Show, createEffect, createSignal, on } from "solid-js";

import {
  IcBaselineRefresh,
  IcOutlineLock,
  IcOutlineLockOpen,
  OcticonStar24,
  OcticonStarFill24,
} from "@repo/ui/icons";
import { Invoke } from "../invokes";
import { useUrlState } from "../stores/url";

const AddressBar: Component = () => {
  const url = useUrlState((state) => state.url);
  const title = useUrlState((state) => state.title);
  const navigateToUrl = useUrlState((state) => state.navigateToUrl);
  const [isHttps, setIsHttps] = createSignal<boolean>(true);
  const [isValidUrl, setIsValidUrl] = createSignal<boolean>(false);

  const [isFavorited, setIsFavorited] = createSignal(false);

  createEffect(
    on(url, (u) => {
      if (u === "") {
        return;
      }
      setIsFavorited(false);
      setIsHttps(u.toLowerCase().startsWith("https://"));
      try {
        const v = new URL(u);
        setIsValidUrl(true);
      } catch {
        setIsValidUrl(false);
      }
    }),
  );

  // TODO load favorites from data
  // お気に入りトグル
  const toggleFavorite = () => {
    Invoke.AddBookmark(url(), title());
    setIsFavorited(!isFavorited());
  };

  const refresh = () => {
    //
  };

  return (
    <div class="flex items-center justify-center max-w-4xl mx-auto h-full">
      <div
        class={`flex items-center w-[570px] h-[30px] px-4 bg-gray-100 border ${isValidUrl() ? "border-gray-300" : "border-red-300"} rounded-lg hover:bg-gray-50`}
      >
        {/* Security Icon */}
        {isHttps() ? <IcOutlineLock /> : <IcOutlineLockOpen />}

        {/* URL Text */}
        <div class="flex-1 flex items-center">
          <input
            value={url()}
            class="w-full px-2 text-sm bg-gray-100 text-gray-600 outline-none focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const target = e.target as HTMLInputElement;
                navigateToUrl(target.value);
              }
            }}
          />
        </div>

        {/* Action Buttons */}
        <div class="flex items-center space-x-2 ml-2">
          {/* Refresh Button */}
          <button
            onClick={() => refresh()}
            class="p-1 hover:bg-gray-200 rounded-full transition-colors"
            title="Refresh page"
            type="button"
          >
            <IcBaselineRefresh />
          </button>

          {/* Favorite Button */}
          <button
            type="button"
            onClick={toggleFavorite}
            class="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <Show when={isFavorited()}>
              <OcticonStarFill24 class="text-yellow-500 fill-current" />
            </Show>
            <Show when={!isFavorited()}>
              <OcticonStar24 />
            </Show>
          </button>
        </div>
      </div>

      {/* Star Button */}
      {/* <div class="ml-2">
        <Button
          onClick={toggleFavorite}
          class="w-9 h-9 m-0 p-2 [&_svg]:size-5 [&_svg]:shrink-0"
          variant="ghost"
          size="icon"
        >
          <Show when={isFavorited()}>
            <OcticonStarFill24 class="text-yellow-500 fill-current" />
          </Show>
          <Show when={!isFavorited()}>
            <OcticonStar24 />
          </Show>
        </Button>
      </div> */}
    </div>
  );
};

export default AddressBar;
