import { type Component, For, Match, Show, Switch, createSignal } from "solid-js";

import { Button } from "@repo/ui/button";
import { Invoke } from "../invokes";
import { useBookmarkState } from "../stores/bookmarks";
import type { Bookmark } from "../types";
import Favicon from "./icons/Favicon";
import {
  IcBaselineEdit,
  IcBaselineKeyboardArrowDown,
  IcBaselineKeyboardArrowRight,
  IcOutlineDeleteOutline,
  IcOutlineFolder,
  IcOutlineFolderOpen,
} from "./icons/Icons";

const BookmarkTreeEditable: Component = () => {
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
  const [isOpen, setIsOpen] = createSignal(true);
  const hasChildren = () => props.bookmark.children?.length > 0;

  const toggle = (e: MouseEvent) => {
    if (hasChildren()) {
      e.preventDefault();
      setIsOpen(!isOpen());
    }
  };

  const handleKeydown = (e: KeyboardEvent) => {};

  const handleEdit = (index: number) => {
    console.log("Edit", index);
  };

  const handleRemove = (index: number) => {
    Invoke.RemoveBookmark(index);
  };

  return (
    <li>
      <div
        class={
          "flex items-center text-left text-sm py-1 hover:bg-sidebar-accent transition-colors duration-150"
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
                <Show when={isOpen()}>
                  <IcBaselineKeyboardArrowDown width={20} height={20} />
                  <IcOutlineFolderOpen width={20} height={20} />
                </Show>
                <Show when={!isOpen()}>
                  <IcBaselineKeyboardArrowRight width={20} height={20} />
                  <IcOutlineFolder width={20} height={20} />
                </Show>
              </span>
            </Match>
            <Match when={props.bookmark.node_type === "Bookmark" && hasChildren()}>
              <span class="flex w-[40px]">
                <Show when={isOpen()}>
                  <IcBaselineKeyboardArrowDown width={20} height={20} />
                </Show>
                <Show when={!isOpen()}>
                  <IcBaselineKeyboardArrowRight width={20} height={20} />
                </Show>
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
        <span class="text-sidebar-foreground overflow-hidden whitespace-nowrap text-ellipsis">
          {props.bookmark.title}
        </span>

        <Show when={props.bookmark.node_type !== "Root"}>
          {/* Edit button */}
          <Button
            class="w-8 h-8 ml-3"
            variant="outline"
            size="icon"
            onClick={() => handleEdit(props.bookmark.index)}
          >
            <IcBaselineEdit />
          </Button>

          {/* Remove button */}
          <Button
            class="w-8 h-8 ml-3"
            variant="outline"
            size="icon"
            onClick={() => handleRemove(props.bookmark.index)}
          >
            <IcOutlineDeleteOutline />
          </Button>
        </Show>
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

export default BookmarkTreeEditable;
