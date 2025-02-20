import { type Component, For, Match, Show, Switch, createSignal } from "solid-js";

import type { Bookmark, Dragging } from "../../types";

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

type BookmarkNodeProps = {
  bookmark: Bookmark;
  level: number;
  dragging: Dragging;
};

const BookmarkNode: Component<BookmarkNodeProps> = (props) => {
  const externalState = useWindowState((state) => state.externalState);
  const navigateToUrl = useUrlState((state) => state.navigateToUrl);

  const [isOpen, setIsOpen] = createSignal(true);
  const hasChildren = () => props.bookmark.children?.length > 0;
  const isFolder = () =>
    props.bookmark.node_type === "Folder" || props.bookmark.node_type === "Root";
  const isBookmark = () => props.bookmark.node_type === "Bookmark";

  const handleNodeClick = (e: MouseEvent) => {
    // If the node has children and is not a bookmark, toggle the folder
    if (hasChildren() && !isBookmark()) {
      e.preventDefault();
      setIsOpen(!isOpen());
    }
    // If the node is a bookmark, navigate to the URL
    if (props.bookmark.url && isBookmark()) {
      if (externalState() === "right") {
        // Navigate to the URL
        // navigateToUrl(props.bookmark.url);
      } else if (externalState() === "hidden") {
        // Open the right panel and navigate to the URL
        useWindowState.getState().changeExternalState("right");
        // navigateToUrl(props.bookmark.url);
      }
    }
  };

  const toggleFolder = (e: MouseEvent) => {
    if (hasChildren()) {
      e.preventDefault();
      setIsOpen(!isOpen());
    }
  };

  const handleKeydown = (e: KeyboardEvent) => {};

  const handleContextMenu = (isOpen: boolean) => {
    if (externalState() === "right" && isOpen) {
      useWindowState.getState().changeExternalState("hidden");
    }
  };

  return (
    <>
      <ContextMenu onOpenChange={(isOpen) => handleContextMenu(isOpen)}>
        <ContextMenuTrigger draggable={true} id={`bookmark-${props.bookmark.index}`}>
          <div
            class={"flex flex-col hover:bg-sidebar-accent transition-colors duration-150"}
            style={{ "padding-left": `${props.level * 8}px` }}
          >
            {/* Empty fixed space for Indicator */}
            <div class="w-[200px] h-[4px]" />

            <div class="flex flex-row">
              {/* Navigation Arrow */}
              <div class="flex items-center justify-center">
                <div
                  class="w-[18px] flex items-center justify-center"
                  onClick={toggleFolder}
                  onKeyDown={handleKeydown}
                >
                  <Show when={hasChildren()}>
                    <div class="rounded hover:bg-stone-300 cursor-pointer">
                      <NavigationArrowIcon isOpen={isOpen()} size={16} />
                    </div>
                  </Show>
                </div>
              </div>

              <div
                class="flex items-center w-full cursor-pointer"
                onClick={handleNodeClick}
                onKeyDown={handleKeydown}
              >
                {/* Folder or Favicon */}
                <div class="flex items-center justify-center w-[20px] mr-0.5">
                  <Switch>
                    <Match when={isFolder()}>
                      <FolderIcon isOpen={isOpen()} size={18} />
                    </Match>
                    <Match when={isBookmark()}>
                      <Favicon url={`https://${props.bookmark.host}`} width="18" height="18" />
                    </Match>
                  </Switch>
                </div>

                {/* Title */}
                <div class="text-sm overflow-hidden whitespace-nowrap text-ellipsis">
                  {props.bookmark.index} - {props.bookmark.title}
                </div>
              </div>
            </div>

            {/* After Indicator */}
            <Show
              when={
                props.dragging.destinationIndex === props.bookmark.index &&
                props.dragging.state === "after"
              }
              fallback={<div class="w-[200px] h-[4px]" />}
            >
              <div class="w-[200px] h-[4px] border-b-2 border-blue-300" />
            </Show>
          </div>
        </ContextMenuTrigger>

        <BookmarkContextMenuPortal bookmark={props.bookmark} />
      </ContextMenu>

      <Show when={hasChildren() && isOpen()}>
        <For each={props.bookmark.children}>
          {(child) => (
            <BookmarkNode dragging={props.dragging} bookmark={child} level={props.level + 1} />
          )}
        </For>
      </Show>
    </>
  );
};

const BookmarkContextMenuPortal = (props: { bookmark: Bookmark }) => {
  const handleAddBookmark = (index: number) => {};

  const handleAddFolder = (index: number) => {
    useAddFolderDialog.getState().setParentIndex(index);
    useAddFolderDialog.getState().setOpen(true);
  };

  const handleEdit = (index: number) => {
    useEditDialog.getState().setTarget({ index, title: props.bookmark.title });
    useEditDialog.getState().setOpen(true);
  };

  const handleRemove = (index: number) => {
    useDeleteConfirmDialog.getState().setTarget({ index, title: props.bookmark.title });
    useDeleteConfirmDialog.getState().setOpen(true);
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

        <ContextMenuItem onClick={() => handleAddBookmark(props.bookmark.index)} disabled>
          <span>Add Bookmark (WIP)</span>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={() => handleEdit(props.bookmark.index)}>
          <span>Edit</span>
        </ContextMenuItem>

        <Show when={props.bookmark.node_type === "Bookmark"}>
          <ContextMenuItem onClick={() => handlePinToToolbar(props.bookmark.url)} disabled>
            <span>Pin to Toolbar (WIP)</span>
          </ContextMenuItem>
        </Show>

        <Show when={props.bookmark.node_type !== "Root"}>
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
