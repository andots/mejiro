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
import {
  BLOCK_SIZE_PX,
  INDICATOR_WIDTH,
  INDICATOR_HEIGHT,
  RESIZE_HANDLE_WIDTH,
  BLOCK_SIZE,
  BOOKMARK_NODE_FONT_SIZE,
} from "../../constants";

type Props = {
  bookmark: Bookmark;
  level: number;
};

const BookmarkNode: Component<Props> = (props) => {
  const externalState = useWindowState((state) => state.externalState);
  const sidebarWidth = useWindowState((state) => state.sidebarWidth);
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
  // const title = () => (isDev() ? `${props.bookmark.title}` : props.bookmark.title);

  // width
  const paddingLevel = () => props.level * 8;
  const titleWidth = () =>
    sidebarWidth() - paddingLevel() - RESIZE_HANDLE_WIDTH - BLOCK_SIZE * 2 - 20;

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
            class="flex flex-col hover:bg-sidebar-accent transition-colors duration-150 cursor-pointer"
            style={{ "padding-left": `${paddingLevel()}px` }}
          >
            {/* Empty fixed space for Indicator */}
            <div style={{ width: INDICATOR_WIDTH, height: INDICATOR_HEIGHT }} />

            <div class="flex flex-row">
              {/* Navigation Arrow */}
              <div style={{ width: BLOCK_SIZE_PX, height: BLOCK_SIZE_PX }}>
                <Show when={hasChildren()}>
                  <button
                    style={{ width: BLOCK_SIZE_PX, height: BLOCK_SIZE_PX }}
                    class="flex items-center justify-center hover:bg-stone-300 rounded"
                    onClick={toggleIsOpen}
                    type="button"
                  >
                    <NavigationArrowIcon isOpen={isOpen()} size={16} />
                  </button>
                </Show>
              </div>

              {/* Folder/Favicon + Title */}
              <div class="flex flex-row items-center">
                {/* Folder or Favicon */}
                <div style={{ width: BLOCK_SIZE_PX, height: BLOCK_SIZE_PX }}>
                  <div class="flex items-center justify-center">
                    <Show when={isFolder()}>
                      <FolderIcon isOpen={isOpen()} size={16} />
                    </Show>
                    <Show when={isBookmark()}>
                      <Favicon url={`https://${props.bookmark.host}`} width="16" height="16" />
                    </Show>
                  </div>
                </div>

                {/* Title */}
                <div
                  class="pl-1 overflow-hidden whitespace-nowrap text-ellipsis"
                  style={{
                    "font-size": `${BOOKMARK_NODE_FONT_SIZE}px`,
                    width: `${titleWidth()}px`,
                  }}
                  classList={{
                    "bg-blue-300": isDraggingInside(),
                  }}
                >
                  {title()}
                </div>
              </div>
            </div>

            {/* After Indicator */}
            <div
              style={{ width: INDICATOR_WIDTH, height: INDICATOR_HEIGHT }}
              classList={{
                "border-b-2": shouldShowIndicator(),
                "bg-blue-300": shouldShowIndicator(),
              }}
            />
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
