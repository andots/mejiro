/* @refresh reload */
import { render } from "solid-js/web";

import App from "./App";
import "./globals.css";

import { useBookmarkState } from "./stores/bookmarks";
import { useSettingsState } from "./stores/settings";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

const initApp = async () => {
  console.log("Initializing app");
  // get data from rust side for zustand stores
  await useBookmarkState.getState().getFolders();
  await useSettingsState.getState().getSettings();
};

initApp().then(() => {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  render(() => <App />, root!);
});
