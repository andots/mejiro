import type { Component } from "solid-js";

import RootChildrenSelect from "./RootChildrenSelect";

import BookmarkTreeEditable from "./BookmarkTreeEditable";

const BookmarksPage: Component = () => {
  return (
    <div>
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
