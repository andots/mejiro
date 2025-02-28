import type { Component } from "solid-js";
import { Show, lazy } from "solid-js";

import ToolBar from "./components/controls/ToolBar";
import AddFolderDialog from "./components/dialogs/AddFolderDialog";
import BookmarkEditDialog from "./components/dialogs/BookmarkEditDialog";
import { useUrlState } from "./stores/url";
import { usePageState } from "./stores/pages";
import DeleteConfirmDialog from "./components/dialogs/DeleteConfirmDialog";

import LoadingBar from "@repo/top-loading-bar/index";
import { HEADER_HEIGHT } from "./constants";

const BookmarksPage = lazy(() => import("./components/BookmarksPage"));
const SettingsPage = lazy(() => import("./components/SettingsPage"));

const App: Component = () => {
  const page = usePageState((state) => state.page);
  const progress = useUrlState((state) => state.progress);
  const setProgress = useUrlState((state) => state.setProgress);

  return (
    <div class="app w-full flex flex-col bg-sidebar">
      <div
        style={{ height: `${HEADER_HEIGHT}px` }}
        class="sticky top-0 z-50 w-full border-b border-sidebar-border bg-sidebar text-sidebar-foreground"
      >
        <LoadingBar
          color="#8ec5ff"
          progress={progress()}
          onLoaderFinished={() => setProgress(0)}
          transitionTime={300}
          loaderSpeed={500}
          height={4}
        />
        <ToolBar />
      </div>
      <main class="bg-sidebar text-sidebar-foreground">
        <Show when={page() === "home"}>
          <BookmarksPage />
        </Show>
        <Show when={page() === "settings"}>
          <div class="h-full">
            <SettingsPage />
          </div>
        </Show>
      </main>
      <BookmarkEditDialog />
      <AddFolderDialog />
      <DeleteConfirmDialog />
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
