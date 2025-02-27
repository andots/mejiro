import { createSignal, onMount, Show, type Component } from "solid-js";

import RootChildrenSelect from "./controls/RootChildrenSelect";

import BookmarkTree from "./controls/BookmarkTree";
import { useWindowState } from "../stores/window";
import { cn, isDev } from "../utils";
import { useBookmarkState } from "../stores/bookmarks";
import type { FolderData } from "../types";
import { RESIZE_HANDLE_WIDTH } from "../constants";

const BookmarksPage: Component = () => {
  const bookmarks = useBookmarkState((state) => state.bookmarks);
  const folders = useBookmarkState((state) => state.folders);

  const externalState = useWindowState((state) => state.externalState);
  const sidebarWidth = useWindowState((state) => state.sidebarWidth);

  const [selectValue, setSelectValue] = createSignal<FolderData | null>(null);

  onMount(async () => {
    if (folders().length > 0) {
      setSelectValue(folders()[0]);
      await useBookmarkState.getState().getBookmarks(folders()[0].index);
    }
  });

  const handleSelectChange = (val: FolderData | null) => {
    if (val !== null && val.index >= 1) {
      if (isDev()) console.log("handleSelectChange Folder: ", val);

      setSelectValue(val);
      useBookmarkState.getState().getBookmarks(val.index);
    }
  };

  return (
    <div class="flex flex-row h-[calc(100vh_-_40px)]">
      <div class={cn("flex flex-col h-full bg-sidebar text-sidebar-foreground")}>
        <div class="flex-none h-[40px] my-2 m-auto">
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
          class="overflow-x-hidden"
        >
          <Show when={bookmarks() !== null}>
            {/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
            <BookmarkTree bookmark={bookmarks()!} />
          </Show>
        </div>
      </div>
      <div
        class="cursor-col-resize bg-sidebar-accent hover:bg-sidebar-ring transition-colors duration-150"
        style={{ width: `${RESIZE_HANDLE_WIDTH}px` }}
      />
      <div class="w-full bg-white" />
    </div>
  );
};

export default BookmarksPage;
