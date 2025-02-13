import type { Component } from "solid-js";
import { createEffect, on, onCleanup, onMount } from "solid-js";

import { Button } from "@repo/ui/button";
import type { UnlistenFn } from "@tauri-apps/api/event";
import { listen } from "@tauri-apps/api/event";

import { debug } from "@tauri-apps/plugin-log";
import BookmarkTree from "./components/BookmarkTree";
import Header from "./components/Header";
import { AppEvent } from "./constants";
import { useBookmarkState } from "./stores/bookmarks";
import { useSettingsState } from "./stores/settings";
import { useUrlState } from "./stores/url";
import { useWindowState } from "./stores/window";

let unlistenSettingsUpdated: UnlistenFn | undefined;
let unlistenNavigation: UnlistenFn | undefined;
let unlistenPageLoaded: UnlistenFn | undefined;
let unlistenUpdateTree: UnlistenFn | undefined;

const initializeApp = async () => {
  const syncBookmarks = useBookmarkState((state) => state.getBookmarksFromBackend);
  syncBookmarks();
  const syncSettings = useSettingsState((state) => state.syncSettings);
  syncSettings();

  unlistenSettingsUpdated = await listen<string>(AppEvent.SettingsUpdated, (event) => {
    console.log(event.payload);
    debug(event.payload);
  });
  unlistenUpdateTree = await listen<string>(AppEvent.BookmarkUpdated, (event) => {
    const updateTree = useBookmarkState((state) => state.updateTree);
    updateTree(event.payload);
  });
  unlistenNavigation = await listen<string>(AppEvent.ExternalNavigation, (event) => {
    const setUrl = useUrlState((state) => state.setUrl);
    setUrl(event.payload);
  });
  unlistenPageLoaded = await listen<string>(AppEvent.ExternalPageLoaded, (event) => {
    const setTitle = useUrlState((state) => state.setTitle);
    setTitle(event.payload);
  });
};

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
  if (unlistenUpdateTree !== undefined) {
    unlistenUpdateTree();
  }
};

const App: Component = () => {
  const toggleExternalWebview = useWindowState((state) => state.toggleExternalWebview);

  onMount(async () => {
    await initializeApp();
  });

  onCleanup(() => {
    removeEventListeners();
  });

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

  return (
    <div class="w-full h-screen flex flex-col">
      <Header />
      <main class="flex-1 py-1 border border-border/40 bg-sidebar text-sidebar-foreground">
        <div class="h-full w-[200px]">
          <BookmarkTree />
          <div class="mt-8 ml-4">
            <Button onClick={() => toggleExternalWebview()}>Toggle</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
