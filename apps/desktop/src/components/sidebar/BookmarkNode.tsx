import { type Component, For, Match, Show, Switch } from "solid-js";

import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";

import type { NestedBookmark } from "../../types";

import {
  INDICATOR_WIDTH,
  INDICATOR_HEIGHT,
  RESIZE_HANDLE_WIDTH,
  NODE_ICON_SIZE,
} from "../../constants";

import { useUrlState } from "../../stores/url";
import { useWindowState } from "../../stores/window";
import { useBookmarkState } from "../../stores/bookmarks";
import { useDraggingState } from "../../stores/dragging";

import NavigationArrowIcon from "../icons/NavigationArrowIcon";
import FolderIcon from "../icons/FolderIcon";
import Favicon from "../icons/Favicon";
import EditableTitle from "./EditableTitle";

type Props = {
  bookmark: NestedBookmark;
  level: number;
  fontSize: number;
};

const BookmarkNode: Component<Props> = (props) => {
  const externalState = useWindowState((state) => state.externalState);
  const sidebarWidth = useWindowState((state) => state.sidebarWidth);
  const useDragging = useDraggingState();
  const useBookmark = useBookmarkState();
  const useUrl = useUrlState();

  // Tree locking status
  const isTreeLocked = useBookmarkState((state) => state.isTreeLocked);
  const setTreeLockState = useBookmarkState((state) => state.setTreeLockState);

  // Edit
  const isActive = () => useBookmark().activeIndex === props.bookmark.index;
  const isEditing = () => useBookmark().editingIndex === props.bookmark.index;

  // destructuring props as reactive
  const isOpen = () => props.bookmark.is_open;
  const hasChildren = () => props.bookmark.children?.length > 0;
  const isFolder = () =>
    props.bookmark.node_type === "Folder" || props.bookmark.node_type === "Root";
  const isBookmark = () => props.bookmark.node_type === "Bookmark";

  // size, width, height
  const height = () => props.fontSize + 10;
  const blockSize = () => props.fontSize + 5;
  const paddingLevel = () => props.level * 8;
  const titleWidth = () =>
    sidebarWidth() - paddingLevel() - RESIZE_HANDLE_WIDTH - blockSize() * 2 - 20;

  // for draggable
  const isRoot = () => props.bookmark.node_type === "Root";
  const isTopLevel = () => props.level === 0;
  const isDraggable = () => !isRoot() && !isTopLevel() && !isTreeLocked();

  // Highlight and Indicator
  const shouldHighLight = () =>
    useDragging().destinationIndex === props.bookmark.index && useDragging().mode === "inside";
  const shouldShowIndicator = () =>
    useDragging().destinationIndex === props.bookmark.index && useDragging().mode === "after";

  const handleNodeClick = (e: MouseEvent) => {
    e.preventDefault();
    if (isEditing()) {
      return;
    }
    if (hasChildren() && isFolder()) {
      // If the node has children and is folder, toggle the open state
      useBookmark().toggleIsOpen(props.bookmark.index);
      useBookmark().setActiveIndex(props.bookmark.index);
    } else if (props.bookmark.url && isBookmark()) {
      if (externalState() === "right") {
        // navigate to the bookmark url
        useUrl().navigateToUrl(props.bookmark.url);
      } else if (externalState() === "hidden") {
        // show the external webview and navigate to the url
        useWindowState.getState().changeExternalState("right");
        useUrl().navigateToUrl(props.bookmark.url);
      }
      useBookmark().setActiveIndex(props.bookmark.index);
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
      useBookmark().setActiveIndex(null);
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

    useBookmark().setActiveIndex(props.bookmark.index);

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
      action: async () => {
        await useBookmark().addFolder(props.bookmark.index, "New Folder");
      },
    });
    const editItem = await MenuItem.new({
      text: "Edit",
      action: () => {
        useBookmark().setEditingIndex(props.bookmark.index);
        setTreeLockState(true);
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
          items: [editItem, addFolderItem, separatorItem, openItem, separatorItem, deleteItem],
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
        class="dropzone flex flex-col hover:bg-sidebar-accent transition-colors duration-150 cursor-pointer"
        classList={{
          hasChildren: hasChildren(),
          isOpen: isOpen(),
          "bg-sidebar-accent": isActive(),
        }}
        style={{ "padding-left": `${paddingLevel()}px` }}
        onClick={handleNodeClick}
        onKeyDown={handleKeydown}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onContextMenu={handleContextMenu}
      >
        {/* Empty fixed space for Indicator */}
        <div style={{ width: INDICATOR_WIDTH, height: INDICATOR_HEIGHT }} />

        {/* NavigationArrow - Icon(favicon) - Title */}
        <div class="flex flex-row items-center" style={{ height: `${height()}px` }}>
          <NavigationArrow
            isOpen={isOpen()}
            hasChildren={hasChildren()}
            size={blockSize()}
            iconSize={NODE_ICON_SIZE}
            onClick={toggleIsOpen}
          />

          <div class="flex flex-row items-center" classList={{ "bg-blue-300": shouldHighLight() }}>
            <NodeIcon
              isOpen={isOpen()}
              isFolder={isFolder()}
              isBookmark={isBookmark()}
              size={blockSize()}
              host={props.bookmark.host}
              iconSize={NODE_ICON_SIZE}
            />

            {/* Title */}
            <EditableTitle
              index={props.bookmark.index}
              title={props.bookmark.title}
              width={titleWidth()}
              fontSize={props.fontSize}
              isEditing={isEditing()}
            />
          </div>
        </div>

        {/* After Indicator */}
        <div
          style={{ width: INDICATOR_WIDTH, height: INDICATOR_HEIGHT }}
          classList={{
            "bg-blue-300": shouldShowIndicator(),
          }}
        />
      </div>

      <Show when={hasChildren() && isOpen()}>
        <ul>
          <For each={props.bookmark.children}>
            {(child) => (
              <BookmarkNode bookmark={child} level={props.level + 1} fontSize={props.fontSize} />
            )}
          </For>
        </ul>
      </Show>
    </li>
  );
};

type NavigationArrowProps = {
  isOpen: boolean;
  hasChildren: boolean;
  size: number;
  iconSize: number;
  onClick: (e: MouseEvent) => void;
};

const NavigationArrow: Component<NavigationArrowProps> = (props) => {
  const size = () => `${props.size}px`;

  return (
    <div style={{ width: size(), height: size() }} class="flex items-center justify-center">
      <Show when={props.hasChildren}>
        <button
          style={{ width: size(), height: size() }}
          class="flex items-center justify-center hover:bg-stone-300 rounded"
          onClick={props.onClick}
          type="button"
        >
          <NavigationArrowIcon isOpen={props.isOpen} size={props.iconSize} />
        </button>
      </Show>
    </div>
  );
};

type NodeIconProps = {
  isOpen: boolean;
  isFolder: boolean;
  isBookmark: boolean;
  host: string | null;
  size: number;
  iconSize: number;
};

const NodeIcon: Component<NodeIconProps> = (props) => {
  const size = () => `${props.size}px`;

  return (
    <div style={{ width: size(), height: size() }} class="flex items-center justify-center">
      <Switch>
        <Match when={props.isFolder}>
          <FolderIcon isOpen={props.isOpen} size={props.iconSize} />
        </Match>
        <Match when={props.isBookmark && props.host}>
          <Favicon url={`https://${props.host}`} width={props.iconSize} height={props.iconSize} />
        </Match>
      </Switch>
    </div>
  );
};

export default BookmarkNode;
