import type { Component } from "solid-js";

import { useBookmarkState } from "../../stores/bookmarks";

import BookmarkNode from "./BookmarkNode";
import type { Bookmark } from "../../types";
import { isDev } from "../../utils";
import { useDraggingState } from "../../stores/dragging";

// Drag and drop events sequence:
// dragstart(node) -> dragenter(droppable) -> dragover(droppable) -> drop(droppable) -> dragend(node)

type Props = {
  bookmark: Bookmark;
};

const BookmarkTree: Component<Props> = (props) => {
  let droppableRef!: HTMLUListElement;
  const useDragging = useDraggingState();

  const handleDragEnter = (ev: DragEvent) => {
    const source = useDragging().source;
    const enterNode = ev.target as Node;
    if (source && enterNode) {
      if (!source.parentNode?.contains(enterNode)) {
        ev.preventDefault();
        if (ev.dataTransfer) {
          ev.dataTransfer.dropEffect = "move";
        }
      }
    }
  };

  const handleDragOver = (ev: DragEvent) => {
    const source = useDragging().source;
    const destNode = ev.target as Node;
    if (source && destNode) {
      if (!source.parentNode?.contains(destNode)) {
        // droppable, do ev.preventDefault() to allow drop
        ev.preventDefault();

        if (ev.dataTransfer) {
          ev.dataTransfer.dropEffect = "move";

          // TODO: memorize this?
          const elements = droppableRef.querySelectorAll(
            "div.dropzone",
          ) as NodeListOf<HTMLDivElement>;

          const closest = Array.from(elements).find((dest) => {
            const destRect = dest.getBoundingClientRect();
            return ev.clientY < destRect.bottom;
          });
          if (closest) {
            useDragging().setDestination(closest);
            const rect = closest.getBoundingClientRect();
            const isInside = ev.clientY <= rect.top + rect.height / 2;
            if (isInside) {
              // inside the destination
              useDragging().setMode("inside");
            } else {
              // after the destination
              useDragging().setMode("after");
            }
          }
        }
      } else {
        // dest is a descendant of source, so cannot droppable.
        // prohibit drop icon will be shown
        // dragging mode should be null here
        useDragging().setMode(null);
      }
    }
  };

  const handleDrop = (ev: DragEvent) => {
    ev.preventDefault();
    const mode = useDragging().mode;
    const sourceIndex = useDragging().sourceIndex;
    const destinationIndex = useDragging().destinationIndex;

    if (isDev()) console.log(`${mode}: ${sourceIndex} -> ${destinationIndex}`);

    if (sourceIndex >= 2 && destinationIndex >= 1 && sourceIndex !== destinationIndex) {
      if (mode === "inside") {
        // if mode is inside, append to the last child of destination
        useBookmarkState.getState().appendToChild(sourceIndex, destinationIndex);
      } else if (mode === "after") {
        const destination = useDragging().destination;
        const hasChildren = destination?.classList.contains("hasChildren");
        const isOpen = destination?.classList.contains("isOpen");
        if (hasChildren) {
          if (isOpen) {
            // if has children and is open, prepend to the first child
            useBookmarkState.getState().prependToChild(sourceIndex, destinationIndex);
          } else {
            // if has children and is closed, insert after the destination
            useBookmarkState.getState().insertAfter(sourceIndex, destinationIndex);
          }
        } else {
          // if not has children, insert after the destination
          useBookmarkState.getState().insertAfter(sourceIndex, destinationIndex);
        }
      }
    }
  };

  return (
    <ul
      id="bookmark-tree"
      ref={droppableRef}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <BookmarkNode bookmark={props.bookmark} level={0} />
    </ul>
  );
};

export default BookmarkTree;
