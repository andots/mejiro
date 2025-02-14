import { type Component, For, Match, Show, Switch, createSignal } from "solid-js";

import { useBookmarkState } from "../stores/bookmarks";
import { useUrlState } from "../stores/url";
import type { Bookmark } from "../types";
import Favicon from "./icons/Favicon";
import IconFolder from "./icons/IconFolder";
import IconKeyboardArrow from "./icons/IconKeyboardArrow";

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
              <span class="flex w-[40px]">
                <IconKeyboardArrow isOpen={isOpen()} />
                <IconFolder isOpen={isOpen()} />
              </span>
            </Match>
            <Match when={props.bookmark.node_type === "Bookmark" && hasChildren()}>
              <span class="flex w-[40px]">
                <IconKeyboardArrow isOpen={isOpen()} />
                <Favicon url={`https://${props.bookmark.host}`} width="18" height="18" />
              </span>
            </Match>
            <Match when={props.bookmark.node_type === "Bookmark" && !hasChildren()}>
              <span class="flex w-[24px] ml-[20px]">
                <Favicon url={`https://${props.bookmark.host}`} width="18" height="18" />
              </span>
            </Match>
          </Switch>
        </span>
        {/* Title */}
        <span class="w-full overflow-hidden whitespace-nowrap text-ellipsis">
          {props.bookmark.node_type === "Bookmark" ? (
            <span class="text-blue-500">{props.bookmark.title}</span>
          ) : (
            <span class="text-sidebar-foreground">{props.bookmark.title}</span>
          )}
        </span>
      </div>
      <Show when={hasChildren() && isOpen()}>
        <ul class="ml-2">
          <For each={props.bookmark.children}>
            {(child) => <BookmarkNode bookmark={child} level={props.level + 1} />}
          </For>
        </ul>
      </Show>
    </li>
  );
};

export default BookmarkTree;
