import type { Component } from "solid-js";
import { createEffect, createSignal, on } from "solid-js";
import { invokeAddBookmark } from "../invokes";
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
    invokeAddBookmark(url(), title());
    setIsFavorited(!isFavorited());
  };

  const refresh = () => {
    //
  };

  return (
    <div class="max-w-4xl mx-auto h-full flex items-center justify-center">
      <div
        class={`flex items-center w-[570px] h-[30px] px-4 bg-gray-100 border ${isValidUrl() ? "border-gray-300" : "border-red-300"} rounded-lg hover:bg-gray-50`}
      >
        {/* Security Icon */}
        {isHttps() ? (
          <svg
            class="w-4 h-4 text-green-600 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>icon</title>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        ) : (
          <svg
            class="w-4 h-4 text-gray-400 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>icon</title>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        )}

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
            class="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
            title="Refresh page"
            type="button"
          >
            <svg
              class="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>icon</title>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            class="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
            title="Add to favorites"
            type="button"
          >
            <svg
              class={`w-4 h-4 ${isFavorited() ? "text-yellow-500 fill-current" : "text-gray-600"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>icon</title>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressBar;
