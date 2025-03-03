import { createSignal, onMount, Show, type Component } from "solid-js";

import type { FolderData } from "../types";

import { RESIZE_HANDLE_WIDTH } from "../constants";
import { isDev } from "../utils";

import { useBookmarkState } from "../stores/bookmarks";
import { useWindowState } from "../stores/window";

import RootChildrenSelect from "./sidebar/RootChildrenSelect";
import BookmarkTree from "./sidebar/BookmarkTree";

const Sidebar: Component = () => {
  const useBookmark = useBookmarkState();
  const bookmarks = useBookmarkState((state) => state.bookmarks);
  const folders = useBookmarkState((state) => state.folders);
  const sidebarWidth = useWindowState((state) => state.sidebarWidth);

  const [selectValue, setSelectValue] = createSignal<FolderData | null>(null);

  onMount(async () => {
    await useBookmark().getFolders();
    if (folders().length > 0) {
      setSelectValue(folders()[0]);
      await useBookmark().getBookmarks(folders()[0].index);
    }
  });

  const handleSelectChange = (val: FolderData | null) => {
    // TODO: control handle on change only it's required for rendering
    // if (val !== null && val.index >= 1) {
    //   if (isDev()) console.log("handleSelectChange Folder: ", val);
    //   setSelectValue(val);
    //   useBookmark().getBookmarks(val.index);
    // }
  };

  const handleContextMenu = (e: MouseEvent) => {
    // disable default browser right click context menu only inside main div
    // Ctrl + Shift + I will still work for opening dev tools
    e.preventDefault();
  };

  return (
    <div
      id="sidebar"
      class="flex flex-col h-full bg-sidebar text-sidebar-foreground"
      onContextMenu={handleContextMenu}
    >
      <div class="flex-none h-[40px] my-2 pl-2">
        <Show when={folders().length > 0 && selectValue() !== null}>
          <RootChildrenSelect
            folders={folders()}
            value={selectValue()}
            onChange={(val) => handleSelectChange(val)}
          />
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
