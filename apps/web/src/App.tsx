import type { Component } from "solid-js";
import { Show, createEffect, on, onCleanup, onMount } from "solid-js";

import type { UnlistenFn } from "@tauri-apps/api/event";
import { listen } from "@tauri-apps/api/event";

import { debug } from "@tauri-apps/plugin-log";
import BookmarkTree from "./components/BookmarkTree";
import BookmarkTreeEditable from "./components/BookmarkTreeEditable";
import RootChildrenSelect from "./components/RootChildrenSelect";
import ToolBar from "./components/ToolBar";
import { AppEvent } from "./constants";
import { useBookmarkState } from "./stores/bookmarks";
import { useSettingsState } from "./stores/settings";
import { useUrlState } from "./stores/url";
import { useWindowState } from "./stores/window";

let unlistenSettingsUpdated: UnlistenFn | undefined;
let unlistenNavigation: UnlistenFn | undefined;
let unlistenPageLoaded: UnlistenFn | undefined;

const initializeApp = async () => {
  // notify frontend is ready and get settings managed by rust
  const syncSettings = useSettingsState((state) => state.syncSettings);
  syncSettings();

  // listen for settings updates on rust side
  unlistenSettingsUpdated = await listen<string>(AppEvent.SettingsUpdated, (event) => {
    debug(event.payload);
  });

  // listen for external navigation events on rust side
  unlistenNavigation = await listen<string>(AppEvent.ExternalNavigation, (event) => {
    const setUrl = useUrlState((state) => state.setUrl);
    setUrl(event.payload);
  });

  // listen for external page loaded events on rust side
  unlistenPageLoaded = await listen<string>(AppEvent.ExternalPageLoaded, (event) => {
    const setTitle = useUrlState((state) => state.setTitle);
    setTitle(event.payload);
  });
};

// Remove all event listeners
const removeEventListeners = () => {
  if (unlistenSettingsUpdated !== undefined) {
    unlistenSettingsUpdated();
  }
  if (unlistenNavigation !== undefined) {
    unlistenNavigation();
  }
  if (unlistenPageLoaded !== undefined) {
    unlistenPageLoaded();
  }
};

const App: Component = () => {
  const isExternalWebviewVisible = useWindowState((state) => state.isExternalWebviewVisible);

  onMount(async () => {
    await initializeApp();
  });

  onCleanup(() => {
    removeEventListeners();
  });

  return (
    <div class="w-full flex flex-col">
      <div class="sticky top-0 z-50 w-full h-[40px] border-b border-sidebar-border bg-sidebar text-sidebar-foreground">
        <ToolBar />
      </div>
      <main class="flex-col h-[calc(100vh_-_40px)] py-2 px-1 border border-border/40 bg-sidebar text-sidebar-foreground">
        <div class="mb-2">
          <RootChildrenSelect />
        </div>
        <Show when={isExternalWebviewVisible()}>
          <div class="w-[200px]">
            <BookmarkTree />
          </div>
        </Show>
        <Show when={!isExternalWebviewVisible()}>
          <div class="">
            <BookmarkTreeEditable />
          </div>
        </Show>
      </main>
    </div>
  );
};

export default App;

// createEffect(
//   on(theme, (t) => {
//     const root = document.documentElement;
//     if (
//       t === "dark" ||
//       (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
//     ) {
//       root.classList.add("dark");
//     } else {
//       root.classList.remove("dark");
//     }
//   }),
// );
