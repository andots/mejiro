/* @refresh reload */
import { render } from "solid-js/web";

import App from "./App";
import "./globals.css";

import { listen } from "@tauri-apps/api/event";

import { useBookmarkState } from "./stores/bookmarks";
import { useSettingsState } from "./stores/settings";
import { useUrlState } from "./stores/url";

import { AppEvent } from "./constants";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

const initApp = async () => {
  console.log("Initializing app");

  // disable default browser right click context menu
  // Ctrl + Shift + I will still work for opening dev tools
  document.oncontextmenu = () => false;

  // get data from rust side for zustand stores
  await useBookmarkState.getState().getFolders();
  await useSettingsState.getState().getSettings();

  // listen for settings updates on rust side
  await listen<string>(AppEvent.SettingsUpdated, (event) => {
    // debug(event.payload);
  });

  // listen for external navigation events on rust side
  await listen<string>(AppEvent.ExternalNavigation, (event) => {
    useUrlState.getState().setProgress(0);
    useUrlState.getState().setUrl(event.payload);
    useUrlState.getState().setProgress(100);
  });

  // listen for external page loaded events on rust side
  await listen<string>(AppEvent.ExternalTitleChanged, (event) => {
    useUrlState.getState().setTitle(event.payload);
  });
};

initApp().then(() => {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  render(() => <App />, root!);
});
