import { lazy, onCleanup, onMount, Show, type Component } from "solid-js";

import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";

import { HEADER_HEIGHT } from "../constants";

import { AppEvent } from "../events";
import { Invoke } from "../invokes";

import { usePageState } from "../stores/pages";
import { useAppSettingsState, useUserSettingsState } from "../stores/settings";
import { useUrlState } from "../stores/url";
import { useWindowState } from "../stores/window";

import PageLoadingBar from "./PageLoadingBar";
import ToolBar from "./ToolBar";
import Sidebar from "./Sidebar";
import SidebarRisizer from "./SidebarResizer";
import { useBookmarkState } from "../stores/bookmarks";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

const App: Component = () => {
  const page = usePageState((state) => state.page);
  const useUserSettings = useUserSettingsState();
  const useAppSettings = useAppSettingsState();
  const useUrl = useUrlState();
  const useWindow = useWindowState();
  const useBookmark = useBookmarkState();

  let unlistenSettingsUpdated: UnlistenFn;
  let unlistenExternalNavigation: UnlistenFn;
  let unlistenExternalTitleChanged: UnlistenFn;
  let unlistenExternalUrlChanged: UnlistenFn;
  let unlistenResized: UnlistenFn;
  let unlistenCloseRequested: UnlistenFn;

  onMount(async () => {
    // get data from rust side for zustand stores
    await useWindow().setupWindowGeometry();
    await useUserSettings().get();
    await useAppSettings().get();
    await useBookmark().getBookmarks(1);

    // listen for settings updated events on rust side
    unlistenSettingsUpdated = await listen<string>(AppEvent.SettingsUpdated, (event) => {
      // debug(event.payload);
    });

    // listen for external navigation events on rust side
    unlistenExternalNavigation = await listen<string>(AppEvent.ExternalNavigation, (event) => {
      useUrl().setUrl(event.payload);
      useUrl().setProgress(30);
    });

    // listen for external url changed events on rust side
    unlistenExternalUrlChanged = await listen<string>(AppEvent.ExternalUrlChanged, (event) => {
      useUrl().setProgress(30);
      useUrl().setUrl(event.payload);
      useUrl().setProgress(100);
    });

    // listen for external title changed events on rust side
    unlistenExternalTitleChanged = await listen<string>(AppEvent.ExternalTitleChanged, (event) => {
      useUrl().setTitle(event.payload);
    });

    // listen for window resized events and update the external webview size
    unlistenResized = await getCurrentWindow().onResized(({ payload }) => {
      useWindow().setExternalSize(payload);
    });

    // listen for close requested events and update the start page url as the last visited url
    unlistenCloseRequested = await getCurrentWindow().onCloseRequested(async (event) => {
      const url = useUrl().url;
      if (url !== "") {
        await useAppSettings().update({
          ...useAppSettings().settings,
          start_page_url: url,
        });
      }
    });

    // Since the initial ExternalTitleChanged event for start_page_url emitted
    // from the Rust side occurs before the frontend initialization,
    // it is necessary to retrieve the external webview title here.
    // GetExternalWebviewTitle() executes a script on the Rust side to fetch the title,
    // which then emits the ExternalTitleChanged event that the above listener will handle.
    await Invoke.GetExternalWebviewTitle();
  });

  onCleanup(() => {
    unlistenSettingsUpdated();
    unlistenExternalNavigation();
    unlistenExternalTitleChanged();
    unlistenExternalUrlChanged();
    unlistenResized();
    unlistenCloseRequested();
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
    <div id="app" class="app w-full flex flex-col bg-sidebar text-sidebar-foreground">
      <div
        id="header"
        style={{ height: `${HEADER_HEIGHT}px` }}
        class="sticky top-0 z-50 w-full border-b border-sidebar-border bg-sidebar text-sidebar-foreground"
      >
        <PageLoadingBar />
        <ToolBar />
      </div>

      <div
        id="main-container"
        class="flex flex-row"
        style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
      >
        <Sidebar />

        <SidebarRisizer />

        <div id="content" class="flex-1 overflow-y-auto">
          <Show when={page() === "dashboard"}>
            <Dashboard />
          </Show>
          <Show when={page() === "settings"}>
            <SettingsPage />
          </Show>
        </div>
      </div>
    </div>
  );
};

export default App;
