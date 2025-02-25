import type { Component } from "solid-js";

import { useBookmarkState } from "../../stores/bookmarks";

import BookmarkNode from "./BookmarkNode";
import type { Bookmark } from "../../types";
import { isDev } from "../../utils";
import { useDragging } from "../../stores/dragging";

type Props = {
  bookmark: Bookmark;
};

// DragEvent will be ...
// dragstart(node) -> dragenter(droppable) -> dragover(droppable) -> drop(droppable) -> dragend(node)

const BookmarkTree: Component<Props> = (props) => {
  let droppableRef!: HTMLUListElement;

  const dragging = useDragging();

  const handleDragEnter = (ev: DragEvent) => {
    const source = dragging().source;
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
    const source = dragging().source;
    const destNode = ev.target as Node;
    if (source && destNode) {
      if (!source.parentNode?.contains(destNode)) {
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
            dragging().setDestination(closest);
            const rect = closest.getBoundingClientRect();
            const isInside = ev.clientY <= rect.top + rect.height / 2;
            if (isInside) {
              // inside the destination
              dragging().setMode("inside");
            } else {
              // after the destination
              dragging().setMode("after");
            }
          }
        }
      }
    }
  };

  const handleDrop = (ev: DragEvent) => {
    ev.preventDefault();
    // const source = draggingState().source;
    const destination = dragging().destination;
    const mode = dragging().mode;
    const sourceIndex = dragging().sourceIndex;
    const destinationIndex = dragging().destinationIndex;

    // make sure souceId is not root and destinationId is over root, and sourceId is not equal to destinationId
    if (sourceIndex >= 2 && destinationIndex >= 1 && sourceIndex !== destinationIndex) {
      if (isDev()) {
        console.log(`${mode}: ${sourceIndex} -> ${destinationIndex}`);
      }
      if (mode === "inside") {
        // if state is inside, append to the last child of destination
        useBookmarkState.getState().appendToChild(sourceIndex, destinationIndex);
      } else if (mode === "after") {
        const hasChildren = destination?.classList.contains("hasChildren");
        const isOpen = destination?.classList.contains("isOpen");
        if (hasChildren) {
          if (isOpen) {
            useBookmarkState.getState().prependToChild(sourceIndex, destinationIndex);
          } else {
            useBookmarkState.getState().insertAfter(sourceIndex, destinationIndex);
          }
        } else {
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
