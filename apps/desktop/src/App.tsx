import type { Component } from "solid-js";
import { Show, createEffect, lazy, on, onCleanup, onMount } from "solid-js";

import type { UnlistenFn } from "@tauri-apps/api/event";
import { listen } from "@tauri-apps/api/event";

import { debug } from "@tauri-apps/plugin-log";

import ToolBar from "./components/ToolBar";
import AddFolderDialog from "./components/dialogs/AddFolderDialog";
import BookmarkEditDialog from "./components/dialogs/BookmarkEditDialog";
import { AppEvent } from "./constants";
import { useBookmarkState } from "./stores/bookmarks";
import { useSettingsState } from "./stores/settings";
import { useUrlState } from "./stores/url";
import { usePageState } from "./stores/pages";

let unlistenSettingsUpdated: UnlistenFn | undefined;
let unlistenNavigation: UnlistenFn | undefined;
let unlistenPageLoaded: UnlistenFn | undefined;

const initializeApp = async () => {
  // get data from rust side for zustand stores
  useBookmarkState.getState().getFolders();
  useBookmarkState.getState().getBookmarks(1);
  useSettingsState.getState().getSettings();

  // listen for settings updates on rust side
  unlistenSettingsUpdated = await listen<string>(AppEvent.SettingsUpdated, (event) => {
    debug(event.payload);
  });

  // listen for external navigation events on rust side
  unlistenNavigation = await listen<string>(AppEvent.ExternalNavigation, (event) => {
    useUrlState.getState().setUrl(event.payload);
  });

  // listen for external page loaded events on rust side
  unlistenPageLoaded = await listen<string>(AppEvent.ExternalPageLoaded, (event) => {
    useUrlState.getState().setTitle(event.payload);
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

const BookmarksPage = lazy(() => import("./components/BookmarksPage"));
const SettingsPage = lazy(() => import("./components/SettingsPage"));

const App: Component = () => {
  const page = usePageState((state) => state.page);

  onMount(async () => {
    await initializeApp();
    // disable right click context menu
    document.oncontextmenu = () => true;
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
        <Show when={page() === "home"}>
          <BookmarksPage />
        </Show>
        <Show when={page() === "settings"}>
          <SettingsPage />
        </Show>
      </main>
      <BookmarkEditDialog />
      <AddFolderDialog />
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
