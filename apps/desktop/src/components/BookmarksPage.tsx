import { onMount, Show, type Component } from "solid-js";

import RootChildrenSelect from "./controls/RootChildrenSelect";

import BookmarkTree from "./controls/BookmarkTree";
import { useWindowState } from "../stores/window";
import { cn } from "../utils";
import { useBookmarkState } from "../stores/bookmarks";

const BookmarksPage: Component = () => {
  const externalState = useWindowState((state) => state.externalState);
  const folders = useBookmarkState((state) => state.folders);

  onMount(async () => {
    await useBookmarkState.getState().getFolders();
  });

  return (
    <Show when={folders().length > 0}>
      {/* TODO: determine sidebar width based on externalState */}
      <div class={cn(externalState() === "right" ? "w-full" : "w-full", "space-y-2")}>
        <RootChildrenSelect folders={folders()} />
        <BookmarkTree />
      </div>
    </Show>
  );
};

export default BookmarksPage;
