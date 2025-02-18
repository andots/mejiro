import type { Component } from "solid-js";

import RootChildrenSelect from "./RootChildrenSelect";

import BookmarkTreeEditable from "./BookmarkTreeEditable";
import { useWindowState } from "../stores/window";
import { cn } from "../utils";

const BookmarksPage: Component = () => {
  const externalState = useWindowState((state) => state.externalState);

  return (
    <div class={cn(externalState() === "right" ? "w-[200px]" : "w-full")}>
      <div class="mb-2">
        <RootChildrenSelect />
      </div>
      <div>
        <BookmarkTreeEditable />
      </div>
    </div>
  );
};

export default BookmarksPage;
