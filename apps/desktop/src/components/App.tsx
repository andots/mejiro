import type { Component } from "solid-js";

import AddFolderDialog from "./dialogs/AddFolderDialog";
import BookmarkEditDialog from "./dialogs/BookmarkEditDialog";
import DeleteConfirmDialog from "./dialogs/DeleteConfirmDialog";

import MainLayout from "./MainLayout";
import Header from "./Header";

const App: Component = () => {
  const handleContextMenu = (e: MouseEvent) => {
    // disable default browser right click context menu only inside main div
    // Ctrl + Shift + I will still work for opening dev tools
    e.preventDefault();
  };

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
    <div class="app w-full flex flex-col bg-sidebar text-sidebar-foreground">
      <Header />
      <MainLayout />

      {/* Dialogs */}
      <BookmarkEditDialog />
      <AddFolderDialog />
      <DeleteConfirmDialog />
    </div>
  );
};

export default App;
