import type { Component } from "solid-js";

import ToolBar from "./components/controls/ToolBar";
import AddFolderDialog from "./components/dialogs/AddFolderDialog";
import BookmarkEditDialog from "./components/dialogs/BookmarkEditDialog";
import { useUrlState } from "./stores/url";
import DeleteConfirmDialog from "./components/dialogs/DeleteConfirmDialog";

import LoadingBar from "@repo/top-loading-bar/index";
import { HEADER_HEIGHT } from "./constants";
import MainLayout from "./components/MainLayout";

const App: Component = () => {
  const progress = useUrlState((state) => state.progress);
  const setProgress = useUrlState((state) => state.setProgress);

  const handleContextMenu = (e: MouseEvent) => {
    // disable default browser right click context menu only inside main div
    // Ctrl + Shift + I will still work for opening dev tools
    e.preventDefault();
  };

  return (
    <div class="app w-full flex flex-col bg-sidebar">
      {/* Header Toolbar */}
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

      {/* Main Content */}
      <div class="bg-sidebar text-sidebar-foreground" onContextMenu={handleContextMenu}>
        <MainLayout />
      </div>

      {/* Dialogs */}
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
