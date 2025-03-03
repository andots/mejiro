import { createEffect, createSignal, on, Show, type Component } from "solid-js";

import { RESIZE_HANDLE_WIDTH } from "../constants";

import { getFolders, useBookmarkState } from "../stores/bookmarks";
import { useWindowState } from "../stores/window";

import FolderSelect from "./sidebar/FolderSelect";
import BookmarkTree from "./sidebar/BookmarkTree";
import type { FolderData } from "../types";
import { isDev } from "../utils";

const Sidebar: Component = () => {
  const bookmarks = useBookmarkState((state) => state.bookmarks);
  const sidebarWidth = useWindowState((state) => state.sidebarWidth);
  const [folders, setFolders] = createSignal<FolderData[]>([]);

  createEffect(
    on(bookmarks, async () => {
      if (bookmarks() === null) {
        return;
      }
      // TODO: stop calling getFolders() every time bookmarks state change
      const folders = await getFolders();
      setFolders(folders);
      if (isDev()) console.log("createEffect on Sidebar to getFolders", folders);
    }),
  );

  // disable default browser right click context menu only inside main div
  // Ctrl + Shift + I will still work for opening dev tools
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div
      id="sidebar"
      class="flex flex-col h-full bg-sidebar text-sidebar-foreground"
      onContextMenu={handleContextMenu}
    >
      <div class="flex-none h-[40px] my-2 pl-2">
        <Show when={folders().length > 0}>
          <FolderSelect folders={folders()} />
        </Show>
      </div>
      <div
        style={{ width: `${sidebarWidth() - RESIZE_HANDLE_WIDTH}px`, "padding-left": "2px" }}
        class="overflow-x-hidden overflow-y-auto"
      >
        <Show when={bookmarks() !== null}>
          {/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
          <BookmarkTree bookmark={bookmarks()!} />
        </Show>
      </div>
    </div>
  );
};

export default Sidebar;
