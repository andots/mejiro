import type { Component } from "solid-js";
import { createEffect, on, onCleanup, onMount } from "solid-js";

import { Button } from "@repo/ui/button";
import type { UnlistenFn } from "@tauri-apps/api/event";
import { listen } from "@tauri-apps/api/event";

import BookmarkTree from "./components/BookmarkTree";
import Header from "./components/Header";
import { BookmarkEvent, ExternalEvent } from "./constants";
import { useBookmarkState } from "./stores/bookmarks";
import { useThemeState } from "./stores/theme";
import { useUrlState } from "./stores/url";
import { useWindowState } from "./stores/window";

const App: Component = () => {
  const theme = useThemeState((state) => state.theme);

  const bookmarks = useBookmarkState((state) => state.bookmarks);
  const getBookmarksFromBackend = useBookmarkState((state) => state.getBookmarksFromBackend);

  const toggleExternalWebview = useWindowState((state) => state.toggleExternalWebview);

  onMount(() => {
    getBookmarksFromBackend();
  });

  let unlistenNavigation: UnlistenFn | undefined;
  let unlistenPageLoaded: UnlistenFn | undefined;
  let unlistenUpdateTree: UnlistenFn | undefined;

  onMount(async () => {
    unlistenNavigation = await listen<string>(ExternalEvent.Navigation, (event) => {
      const setUrl = useUrlState((state) => state.setUrl);
      setUrl(event.payload);
    });
    unlistenPageLoaded = await listen<string>(ExternalEvent.PageLoaded, (event) => {
      const setTitle = useUrlState((state) => state.setTitle);
      setTitle(event.payload);
    });
    unlistenUpdateTree = await listen<string>(BookmarkEvent.UpdateTree, (event) => {
      const updateTree = useBookmarkState((state) => state.updateTree);
      updateTree(event.payload);
    });
  });

  onCleanup(() => {
    if (unlistenNavigation !== undefined) {
      unlistenNavigation();
    }
    if (unlistenPageLoaded !== undefined) {
      unlistenPageLoaded();
    }
    if (unlistenUpdateTree !== undefined) {
      unlistenUpdateTree();
    }
  });

  createEffect(
    on(theme, (t) => {
      const root = document.documentElement;
      if (
        t === "dark" ||
        (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }),
  );

  return (
    <div class="w-full h-screen flex flex-col">
      <Header />

      <main class="flex-1 py-1 border border-border/40 bg-sidebar text-sidebar-foreground">
        <div class="h-full">
          <BookmarkTree bookmarks={bookmarks()} />
          <div class="mt-8 ml-4">
            <Button onClick={() => toggleExternalWebview()}>Toggle</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
