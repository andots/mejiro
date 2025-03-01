import { type Component, createSignal, For, Show } from "solid-js";

import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";

import { autofocus } from "@solid-primitives/autofocus";

import type { Bookmark } from "../../types";

import {
  BLOCK_SIZE_PX,
  INDICATOR_WIDTH,
  INDICATOR_HEIGHT,
  RESIZE_HANDLE_WIDTH,
  BLOCK_SIZE,
  BOOKMARK_NODE_FONT_SIZE,
} from "../../constants";
import { isDev } from "../../utils";

import { useUrlState } from "../../stores/url";
import { useWindowState } from "../../stores/window";
import { useBookmarkState } from "../../stores/bookmarks";
import { useDraggingState } from "../../stores/dragging";

import NavigationArrowIcon from "../icons/NavigationArrowIcon";
import FolderIcon from "../icons/FolderIcon";
import Favicon from "../icons/Favicon";

type Props = {
  bookmark: Bookmark;
  level: number;
};

const BookmarkNode: Component<Props> = (props) => {
  const externalState = useWindowState((state) => state.externalState);
  const sidebarWidth = useWindowState((state) => state.sidebarWidth);
  const useDragging = useDraggingState();
  const useBookmark = useBookmarkState();
  const useUrl = useUrlState();

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
    useDragging().destinationIndex === props.bookmark.index && useDragging().mode === "inside";
  const shouldShowIndicator = () =>
    useDragging().destinationIndex === props.bookmark.index && useDragging().mode === "after";

  // Edit
  const [isEditing, setIsEditing] = createSignal(false);

  const handleNodeClick = (e: MouseEvent) => {
    e.preventDefault();
    if (isEditing()) {
      return;
    }
    if (hasChildren() && isFolder()) {
      // If the node has children and is folder, toggle the open state
      useBookmark().toggleIsOpen(props.bookmark.index);
    } else if (props.bookmark.url && isBookmark()) {
      if (externalState() === "right") {
        // navigate to the bookmark url
        useUrl().navigateToUrl(props.bookmark.url);
      } else if (externalState() === "hidden") {
        // show the external webview and navigate to the url
        useWindowState.getState().changeExternalState("right");
        useUrl().navigateToUrl(props.bookmark.url);
      }
    }
  };

  const toggleIsOpen = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isEditing()) return;
    if (hasChildren()) {
      useBookmark().toggleIsOpen(props.bookmark.index);
    }
  };

  const handleDragStart = (e: DragEvent) => {
    if (isEditing()) return;
    if (isDraggable()) {
      useDragging().reset();
      useDragging().setSource(e.target as HTMLDivElement);
    }
  };

  const handleDragEnd = (e: DragEvent) => {
    useDragging().reset();
  };

  const handleKeydown = (e: KeyboardEvent) => {};

  const handleContextMenu = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const separatorItem = await PredefinedMenuItem.new({ item: "Separator" });
    const openItem = await MenuItem.new({
      text: "Open Bookmark",
      action: () => {
        if (props.bookmark.url) {
          useUrl().navigateToUrl(props.bookmark.url);
        }
      },
    });
    const addFolderItem = await MenuItem.new({
      text: "Add Folder",
      action: () => {
        // TODO: add folder by using dialog/sheet in sidebar
        console.log("Add Folder clicked");
      },
    });
    const editItem = await MenuItem.new({
      text: "Edit",
      action: () => {
        setIsEditing(true);
      },
    });
    const deleteItem = await MenuItem.new({
      text: "Delete",
      action: () => {
        // TODO: need confirmation??
        useBookmark().removeBookmark(props.bookmark.index);
      },
    });

    if (isRoot() || isTopLevel()) {
      const menu = await Menu.new({
        items: [editItem, addFolderItem],
      });
      await menu.popup();
    } else {
      if (isBookmark()) {
        const menu = await Menu.new({
          items: [openItem, separatorItem, editItem, addFolderItem, separatorItem, deleteItem],
        });
        await menu.popup();
      } else if (isFolder()) {
        const menu = await Menu.new({
          items: [editItem, addFolderItem, separatorItem, deleteItem],
        });
        await menu.popup();
      }
    }
  };

  return (
    <li>
      <div
        id={`bookmark-${props.bookmark.index}`}
        draggable={isDraggable()}
        class="dropzone"
        classList={{
          hasChildren: hasChildren(),
          isOpen: isOpen(),
        }}
        onClick={handleNodeClick}
        onKeyDown={handleKeydown}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onContextMenu={handleContextMenu}
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
              <Show when={isEditing()}>
                <EditBox
                  index={props.bookmark.index}
                  title={props.bookmark.title}
                  width={titleWidth()}
                  setIsEditing={setIsEditing}
                />
              </Show>
              <Show when={!isEditing()}>
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
              </Show>
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
      </div>

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

type EditBoxProps = {
  index: number;
  title: string;
  width: number;
  setIsEditing: (value: boolean) => void;
};

const EditBox: Component<EditBoxProps> = (props) => {
  const [value, setValue] = createSignal<string>(props.title);
  const useBookmark = useBookmarkState();

  const handleFocus = (e: FocusEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget as HTMLInputElement;
    target.select();
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      props.setIsEditing(false);
      useBookmark().updateBookmarkTitle(props.index, value());
    }
  };

  const handleFocusOut = (e: FocusEvent) => {
    props.setIsEditing(false);
    useBookmark().updateBookmarkTitle(props.index, value());
  };

  return (
    <input
      autofocus
      ref={autofocus}
      value={value()}
      onFocus={handleFocus}
      onFocusOut={handleFocusOut}
      onInput={(e) => setValue(e.currentTarget.value)}
      onKeyDown={handleKeydown}
      style={{
        "font-size": `${BOOKMARK_NODE_FONT_SIZE}px`,
        width: `${props.width}px`,
      }}
      class="flex border bg-background px-1 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
    />
  );
};

export default BookmarkNode;
