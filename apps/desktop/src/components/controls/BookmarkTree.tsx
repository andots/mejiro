import {
  type Component,
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createSignal,
  onMount,
} from "solid-js";

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
import { useBookmarkState } from "../../stores/bookmarks";
import { useWindowState } from "../../stores/window";

import NavigationArrowIcon from "../icons/NavigationArrowIcon";
import FolderIcon from "../icons/FolderIcon";
import Favicon from "../icons/Favicon";

import { makeEventListener } from "@solid-primitives/event-listener";

const BookmarkTree: Component = () => {
  const bookmarks = useBookmarkState((state) => state.bookmarks);
  let ref!: HTMLDivElement;

  onMount(() => {
    if (ref) {
      for (const child of ref.children) {
        makeEventListener(child as HTMLElement, "dragstart", (e) => {
          console.log("drag start");
          const target = e.target as HTMLElement;
          e.dataTransfer?.setData("text/plain", target.id);
          setTimeout(() => target.classList.add("dragging"), 0);
        });
        makeEventListener(child as HTMLElement, "dragend", (e) => {
          console.log("drag end");
          const target = e.target as HTMLElement;
          target.classList.remove("dragging");
        });
      }
      // dragOver
      makeEventListener(ref, "dragover", (e) => {
        e.preventDefault();
        if (ref && e.dataTransfer) {
          e.dataTransfer.dropEffect = "move";
          const draggingItem = ref.querySelector(".dragging");
          if (draggingItem) {
            const sibilings = Array.from(ref.children);
            const target = sibilings.find((sibiling) => {
              const targetRect = sibiling.getBoundingClientRect();
              // return e.clientY <= targetRect.top + targetRect.height / 2;
              return e.clientY <= targetRect.bottom;
            });
            if (target) {
              target.classList.add("border-b", "border-sidebar-accent");
            } else {
              // nextSibiling.classList.remove("border-b-2", "border-sidebar-accent");
            }
          }
        }
      });
      // dragEnter
      makeEventListener(ref, "dragenter", (e) => {
        e.preventDefault();
      });
      // dragDrop
      makeEventListener(ref, "drop", (e) => {
        e.preventDefault();
        if (e.dataTransfer) {
          const data = e.dataTransfer.getData("text/plain");
          console.log(`dropped: ${data}`);
        }
      });
    }
  });

  return (
    <div id="bookmark-tree" ref={ref}>
      <BookmarkNode bookmark={bookmarks()} level={0} />
    </div>
  );
};

type BookmarkNodeProps = {
  bookmark: Bookmark;
  level: number;
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

  const handleContextMenu = (isOpen: boolean) => {
    if (externalState() === "right" && isOpen) {
      useWindowState.getState().changeExternalState("hidden");
    }
  };

  const handlePinToToolbar = (url: string | null) => {
    //
  };

  return (
    <>
      <ContextMenu onOpenChange={(isOpen) => handleContextMenu(isOpen)}>
        <ContextMenuTrigger draggable={true} id={`bookmark-${props.bookmark.index}`}>
          <div
            class={
              "flex items-center text-left hover:bg-sidebar-accent transition-colors duration-150"
            }
            style={{ "padding-left": `${props.level * 8}px` }}
          >
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
              class="flex items-center w-full cursor-pointer py-0.5"
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
                {props.bookmark.title}
              </div>
            </div>
          </div>
        </ContextMenuTrigger>

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
      </ContextMenu>

      <Show when={hasChildren() && isOpen()}>
        <For each={props.bookmark.children}>
          {(child) => <BookmarkNode bookmark={child} level={props.level + 1} />}
        </For>
      </Show>
    </>
  );
};

export default BookmarkTree;
