import { lazy, Show, type Component } from "solid-js";

import { HEADER_HEIGHT } from "../constants";

import PageLoadingBar from "./PageLoadingBar";
import ToolBar from "./ToolBar";
import Sidebar from "./Sidebar";
import SidebarRisizer from "./SidebarResizer";

import AddFolderDialog from "./dialogs/AddFolderDialog";
import BookmarkEditDialog from "./dialogs/BookmarkEditDialog";
import DeleteConfirmDialog from "./dialogs/DeleteConfirmDialog";
import { usePageState } from "../stores/pages";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

const App: Component = () => {
  const page = usePageState((state) => state.page);

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

      {/* Dialogs */}
      <BookmarkEditDialog />
      <AddFolderDialog />
      <DeleteConfirmDialog />
    </div>
  );
};

export default App;
