import type { Component } from "solid-js";

import RootChildrenSelect from "./controls/RootChildrenSelect";

import BookmarkTree from "./controls/BookmarkTree";
import { useWindowState } from "../stores/window";
import { cn } from "../utils";

const BookmarksPage: Component = () => {
  const externalState = useWindowState((state) => state.externalState);

  return (
    // TODO: determine sidebar width based on externalState
    <div class={cn(externalState() === "right" ? "w-full" : "w-full")}>
      <div class="mb-2">
        <RootChildrenSelect />
      </div>
      <div>
        <BookmarkTree />
      </div>
    </div>
  );
};

export default BookmarksPage;
