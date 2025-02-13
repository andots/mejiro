import { type Component, For, Match, Show, Switch, createSignal } from "solid-js";

import { useBookmarkState } from "../stores/bookmarks";
import { useUrlState } from "../stores/url";
import type { Bookmark } from "../types";
import Favicon from "./Favicon";

const BookmarkTree: Component = () => {
  const bookmarks = useBookmarkState((state) => state.bookmarks);

  return (
    <div class="pl-1">
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

  const [isOpen, setIsOpen] = createSignal(true);
  const hasChildren = () => props.bookmark.children?.length > 0;

  const toggle = (e: MouseEvent) => {
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
          "flex items-center text-left text-sm py-1 hover:bg-sidebar-accent cursor-pointer transition-colors duration-150"
        }
        onClick={toggle}
        onKeyDown={handleKeydown}
        style={{ "padding-left": `${props.level}px` }}
      >
        {/* Folder icon or Favicon */}
        <span class="flex items-center justify-center mr-1">
          <Switch>
            <Match
              when={props.bookmark.node_type === "Folder" || props.bookmark.node_type === "Root"}
            >
              <Arrow isOpen={isOpen()} />
              <Folder isOpen={isOpen()} />
            </Match>
            <Match when={props.bookmark.node_type === "Bookmark" && hasChildren()}>
              <Arrow isOpen={isOpen()} />
              <Favicon url={`https://${props.bookmark.host}`} width="17" height="17" />
            </Match>
            <Match when={props.bookmark.node_type === "Bookmark" && !hasChildren()}>
              <span class="pl-3 pr-1">-</span>
            </Match>
          </Switch>
        </span>
        {props.bookmark.node_type === "Bookmark" ? (
          <span class="text-blue-500 overflow-hidden whitespace-nowrap text-ellipsis">
            {props.bookmark.title}
          </span>
        ) : (
          <span class="text-sidebar-foreground overflow-hidden whitespace-nowrap text-ellipsis">
            {props.bookmark.title}
          </span>
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

// https://icon-sets.iconify.design/ic/page-2.html?icon-filter=folder
const Folder = (props: { isOpen: boolean }) => (
  <svg class="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <title>folder</title>
    {props.isOpen ? (
      <path
        fill="currentColor"
        d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2m0 12H4V8h16z"
      />
    ) : (
      <path
        fill="currentColor"
        d="m9.17 6l2 2H20v10H4V6zM10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8z"
      />
    )}
  </svg>
);

// https://icon-sets.iconify.design/ic/page-2.html?icon-filter=arrow&prefixes=Baseline
const Arrow = (props: { isOpen: boolean }) => (
  <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
    <title>ic:baseline-keyboard-arrow-right</title>
    {props.isOpen ? (
      <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6l-6-6z" />
    ) : (
      <path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6z" />
    )}
  </svg>
);

export default BookmarkTree;
