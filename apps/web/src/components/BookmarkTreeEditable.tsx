import { type Component, For, Match, Show, Switch, createSignal } from "solid-js";

import {
  IcBaselineKeyboardArrowDown,
  IcBaselineKeyboardArrowRight,
  IcOutlineFolder,
  IcOutlineFolderOpen,
} from "@repo/ui/icons";
import { useBookmarkState } from "../stores/bookmarks";
import type { Bookmark } from "../types";
import Favicon from "./icons/Favicon";

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuGroupLabel,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@repo/ui/context-menu";

const BookmarkTreeEditable: Component = () => {
  const bookmarks = useBookmarkState((state) => state.bookmarks);

  return (
    <div class="pl-1">
      <BookmarkNode bookmark={bookmarks()} level={0} />
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
    const removeBookmark = useBookmarkState((state) => state.removeBookmark);
    removeBookmark(index);
  };

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger class="">
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
                  when={
                    props.bookmark.node_type === "Folder" || props.bookmark.node_type === "Root"
                  }
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
          </div>
        </ContextMenuTrigger>

        <ContextMenuPortal>
          <ContextMenuContent class="w-48">
            <ContextMenuItem>
              <span>Edit</span>
            </ContextMenuItem>

            <ContextMenuSeparator />

            <ContextMenuItem>
              <span>Add Folder</span>
            </ContextMenuItem>
            <ContextMenuItem>
              <span>Add Bookmark</span>
            </ContextMenuItem>

            <Show when={props.bookmark.node_type !== "Root"}>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => handleRemove(props.bookmark.index)}>
                <span class="text-destructive">Delete</span>
              </ContextMenuItem>
            </Show>
          </ContextMenuContent>
        </ContextMenuPortal>
      </ContextMenu>

      <Show when={hasChildren() && isOpen()}>
        <div class="ml-2">
          <For each={props.bookmark.children}>
            {(child) => <BookmarkNode bookmark={child} level={props.level + 1} />}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default BookmarkTreeEditable;
