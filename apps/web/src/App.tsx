import type { Component } from "solid-js";
import { Show, createEffect, on, onCleanup, onMount } from "solid-js";

import type { UnlistenFn } from "@tauri-apps/api/event";
import { listen } from "@tauri-apps/api/event";

import { debug } from "@tauri-apps/plugin-log";
import BookmarkTree from "./components/BookmarkTree";
import BookmarkTreeEditable from "./components/BookmarkTreeEditable";
import ToolBar from "./components/ToolBar";
import { AppEvent } from "./constants";
import { useBookmarkState } from "./stores/bookmarks";
import { useSettingsState } from "./stores/settings";
import { useUrlState } from "./stores/url";
import { useWindowState } from "./stores/window";

let unlistenSettingsUpdated: UnlistenFn | undefined;
let unlistenNavigation: UnlistenFn | undefined;
let unlistenPageLoaded: UnlistenFn | undefined;
let unlistenBookmarkUpdated: UnlistenFn | undefined;

const initializeApp = async () => {
  // notify frontend is ready and get bookmarks managed by rust
  const syncBookmarks = useBookmarkState((state) => state.syncBookmarks);
  syncBookmarks();

  // notify frontend is ready and get settings managed by rust
  const syncSettings = useSettingsState((state) => state.syncSettings);
  syncSettings();

  // listen for settings updates on rust side
  unlistenSettingsUpdated = await listen<string>(AppEvent.SettingsUpdated, (event) => {
    debug(event.payload);
  });

  // listen for bookmark updates on rust side
  unlistenBookmarkUpdated = await listen<string>(AppEvent.BookmarkUpdated, (event) => {
    const updateBookmarks = useBookmarkState((state) => state.updateBookmarks);
    updateBookmarks(event.payload);
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
  if (unlistenBookmarkUpdated !== undefined) {
    unlistenBookmarkUpdated();
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
    <div class="w-full h-screen flex flex-col">
      <ToolBar />
      <main class="flex-1 py-1 border border-border/40 bg-sidebar text-sidebar-foreground">
        <Show when={isExternalWebviewVisible()}>
          <div class="h-full w-[200px]">
            <BookmarkTree />
          </div>
        </Show>
        <Show when={!isExternalWebviewVisible()}>
          <div class="h-full">
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
