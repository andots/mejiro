import { type Component, For, Show } from "solid-js";

import type { Bookmark } from "../../types";

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

import { useAddFolderDialog, useDeleteConfirmDialog, useEditDialog } from "../../stores/dialogs";
import { useUrlState } from "../../stores/url";
import { useWindowState } from "../../stores/window";

import NavigationArrowIcon from "../icons/NavigationArrowIcon";
import FolderIcon from "../icons/FolderIcon";
import Favicon from "../icons/Favicon";
import { useBookmarkState } from "../../stores/bookmarks";
import { cn, isDev } from "../../utils";
import { useDragging } from "../../stores/dragging";
import { INDICATOR } from "../../constants";

type Props = {
  bookmark: Bookmark;
  level: number;
};

const BookmarkNode: Component<Props> = (props) => {
  const externalState = useWindowState((state) => state.externalState);
  const navigateToUrl = useUrlState((state) => state.navigateToUrl);
  const dragging = useDragging();

  // destructuring props as reactive
  const isOpen = () => props.bookmark.is_open;
  const hasChildren = () => props.bookmark.children?.length > 0;
  const isFolder = () =>
    props.bookmark.node_type === "Folder" || props.bookmark.node_type === "Root";
  const isBookmark = () => props.bookmark.node_type === "Bookmark";
  const title = () =>
    isDev() ? `${props.bookmark.index} - ${props.bookmark.title}` : props.bookmark.title;

  // for draggable
  const isRoot = () => props.bookmark.node_type === "Root";
  const isTopLevel = () => props.level === 0;
  const isDraggable = () => !isRoot() && !isTopLevel();
  const isDraggingInside = () =>
    dragging().destinationIndex === props.bookmark.index && dragging().mode === "inside";
  const shouldShowIndicator = () =>
    dragging().destinationIndex === props.bookmark.index && dragging().mode === "after";

  const handleNodeClick = (e: MouseEvent) => {
    e.preventDefault();
    if (hasChildren() && isFolder()) {
      // If the node has children and is folder, toggle the open state
      useBookmarkState.getState().toggleIsOpen(props.bookmark.index);
    } else if (props.bookmark.url && isBookmark()) {
      if (externalState() === "right") {
        // navigate to the bookmark url
        navigateToUrl(props.bookmark.url);
      } else if (externalState() === "hidden") {
        // show the external webview and navigate to the url
        useWindowState.getState().changeExternalState("right");
        navigateToUrl(props.bookmark.url);
      }
    }
  };

  const toggleIsOpen = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasChildren()) {
      useBookmarkState.getState().toggleIsOpen(props.bookmark.index);
    }
  };

  const handleKeydown = (e: KeyboardEvent) => {};

  const handleContextMenu = (isOpen: boolean) => {
    if (externalState() === "right" && isOpen) {
      useWindowState.getState().changeExternalState("hidden");
    }
  };

  const handleDragStart = (e: DragEvent) => {
    if (isDraggable()) {
      dragging().reset();
      dragging().setSource(e.target as HTMLDivElement);
    }
  };

  const handleDragEnd = (e: DragEvent) => {
    dragging().reset();
  };

  return (
    <li>
      <ContextMenu onOpenChange={(isOpen) => handleContextMenu(isOpen)}>
        <ContextMenuTrigger
          draggable={isDraggable()}
          id={`bookmark-${props.bookmark.index}`}
          class="dropzone"
          classList={{
            hasChildren: hasChildren(),
            isOpen: isOpen(),
          }}
          onClick={handleNodeClick}
          onKeyDown={handleKeydown}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div
            class={cn(
              "flex flex-col hover:bg-sidebar-accent transition-colors duration-150 cursor-pointer",
              "overflow-hidden whitespace-nowrap text-ellipsis",
            )}
            style={{ "padding-left": `${props.level * 8}px`, width: "180px" }}
          >
            {/* Empty fixed space for Indicator */}
            <div style={{ width: INDICATOR.WIDTH, height: INDICATOR.HEIGHT }} />

            <div class="flex flex-row">
              {/* Navigation Arrow */}
              <div class="w-[18px] h-[18px]">
                <Show when={hasChildren()} fallback={<div class="w-[18px] h-[18px]" />}>
                  <button
                    class="w-[18px] h-[18px] hover:bg-stone-300 rounded"
                    onClick={toggleIsOpen}
                    type="button"
                  >
                    <div>
                      <NavigationArrowIcon isOpen={isOpen()} size={16} />
                    </div>
                  </button>
                </Show>
              </div>

              {/* Folder/Favicon + Title */}
              <div class="flex items-center w-full">
                {/* Folder or Favicon */}
                <div class="flex items-center justify-center w-[18px] h-[18px]">
                  <Show when={isFolder()}>
                    <FolderIcon isOpen={isOpen()} size={18} />
                  </Show>
                  <Show when={isBookmark()}>
                    <div class="w-[18px] h-[18px]">
                      <Favicon url={`https://${props.bookmark.host}`} width="18" height="18" />
                    </div>
                  </Show>
                </div>

                {/* Title */}
                <div
                  class="pl-1 overflow-hidden whitespace-nowrap text-ellipsis"
                  style={{ "font-size": "13px", width: "100px" }}
                  classList={{
                    "bg-blue-300": isDraggingInside(),
                  }}
                >
                  {title()}
                </div>
              </div>
            </div>

            {/* After Indicator */}
            <Show
              when={shouldShowIndicator()}
              fallback={<div style={{ width: INDICATOR.WIDTH, height: INDICATOR.HEIGHT }} />}
            >
              <div
                class="border-b-2 border-blue-300"
                style={{ width: INDICATOR.WIDTH, height: INDICATOR.HEIGHT }}
              />
            </Show>
          </div>
        </ContextMenuTrigger>

        <BookmarkContextMenuPortal bookmark={props.bookmark} />
      </ContextMenu>

      <Show when={hasChildren() && isOpen()}>
        <ul>
          <For each={props.bookmark.children}>
            {(child) => <BookmarkNode bookmark={child} level={props.level + 1} />}
          </For>
        </ul>
      </Show>
    </li>
  );
};

const BookmarkContextMenuPortal = (props: { bookmark: Bookmark }) => {
  const currentTopLevel = useBookmarkState((state) => state.getCurrentTopLevel());

  const isRoot = () => props.bookmark.node_type === "Root";
  const isRemovable = () =>
    !isRoot() && currentTopLevel() !== -1 && currentTopLevel() !== props.bookmark.index;

  // const handleAddBookmark = (index: number) => {};

  const handleAddFolder = (index: number) => {
    useAddFolderDialog.getState().setParentIndex(index);
    useAddFolderDialog.getState().setOpen(true);
  };

  const handleEdit = (index: number) => {
    useEditDialog.getState().setTarget({ index, title: props.bookmark.title });
    useEditDialog.getState().setOpen(true);
  };

  const handleRemove = (index: number) => {
    if (isRemovable()) {
      useDeleteConfirmDialog.getState().setTarget({ index, title: props.bookmark.title });
      useDeleteConfirmDialog.getState().setOpen(true);
    }
  };

  const handlePinToToolbar = (url: string | null) => {
    //
  };

  return (
    <ContextMenuPortal>
      <ContextMenuContent class="w-48">
        <ContextMenuItem onClick={() => handleAddFolder(props.bookmark.index)}>
          <span>Add Folder</span>
        </ContextMenuItem>

        {/* <ContextMenuItem onClick={() => handleAddBookmark(props.bookmark.index)} disabled>
          <span>Add Bookmark (WIP)</span>
        </ContextMenuItem> */}

        <ContextMenuSeparator />

        <ContextMenuItem onClick={() => handleEdit(props.bookmark.index)}>
          <span>Edit</span>
        </ContextMenuItem>

        <Show when={props.bookmark.node_type === "Bookmark"}>
          <ContextMenuItem onClick={() => handlePinToToolbar(props.bookmark.url)} disabled>
            <span>Pin to Toolbar (WIP)</span>
          </ContextMenuItem>
        </Show>

        <Show when={isRemovable()}>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => handleRemove(props.bookmark.index)}>
            <span class="text-destructive">Delete</span>
          </ContextMenuItem>
        </Show>
      </ContextMenuContent>
    </ContextMenuPortal>
  );
};

export default BookmarkNode;
