import { type Component, For, Show, createSignal } from "solid-js";

import { useBookmarkState } from "../stores/bookmarks";
import { useUrlState } from "../stores/url";
import type { Bookmark } from "../types";
import Favicon from "./Favicon";

const BookmarkTree: Component = () => {
  const bookmarks = useBookmarkState((state) => state.bookmarks);

  return (
    <div class="pl-1 py-1">
      <ul class="list-none">
        <BookmarkNode bookmark={bookmarks()} level={0} />
      </ul>
    </div>
  );
};

type BookmarkNodeProps = {
  bookmark: Bookmark;
  level: number;
};

const BookmarkNode: Component<BookmarkNodeProps> = (props) => {
  const navigateToUrl = useUrlState((state) => state.navigateToUrl);

  const [isOpen, setIsOpen] = createSignal(props.level < 2);
  const hasChildren = () => props.bookmark.children?.length > 0;

  const toggleFolder = (e: MouseEvent) => {
    if (hasChildren()) {
      e.preventDefault();
      setIsOpen(!isOpen());
    }
    if (props.bookmark.url) {
      navigateToUrl(props.bookmark.url);
    }
  };

  const handleKeydown = (e: KeyboardEvent) => {};

  return (
    <li>
      <div
        class={
          "flex items-center text-left text-sm pb-1 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
        }
        onClick={toggleFolder}
        onKeyDown={handleKeydown}
        style={{ "padding-left": `${props.level}px` }}
      >
        <span class="w-5 h-5 flex items-center justify-center mr-1.5 text-gray-500">
          {props.bookmark.node_type === "Folder" || props.bookmark.node_type === "Root" ? (
            <FolderIcon isOpen={isOpen()} />
          ) : (
            <Favicon url={`https://${props.bookmark.host}`} width="17" height="17" />
          )}
        </span>
        {props.bookmark.node_type === "Bookmark" ? (
          <span class="p-0.5 text-blue-500 overflow-hidden whitespace-nowrap text-ellipsis">
            {props.bookmark.title}
          </span>
        ) : (
          <span class="text-gray-700 py-0.5">{props.bookmark.title}</span>
        )}
      </div>
      <Show when={hasChildren() && isOpen()}>
        <ul class="pl-2">
          <For each={props.bookmark.children}>
            {(child) => <BookmarkNode bookmark={child} level={props.level + 1} />}
          </For>
        </ul>
      </Show>
    </li>
  );
};

const FolderIcon = (props: { isOpen: boolean }) => (
  <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <title>folder</title>
    {props.isOpen ? (
      <path d="M1.5 3A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3h-13z" />
    ) : (
      <path d="M.5 3A1.5 1.5 0 0 0-1 4.5v7A1.5 1.5 0 0 0 .5 13h13a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 13.5 3h-13z" />
    )}
  </svg>
);

export default BookmarkTree;

// const LinkIcon = () => (
//   <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//     <title>link</title>
//     <path d="M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
//     <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 0 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 0 0-4.243-4.243L6.586 4.672z" />
//   </svg>
// );
