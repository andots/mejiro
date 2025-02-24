import { type Component, createEffect, createSignal, on } from "solid-js";

import { makeEventListener } from "@solid-primitives/event-listener";

import { useBookmarkState } from "../../stores/bookmarks";

import BookmarkNode from "./BookmarkNode";
import type { Bookmark, Dragging } from "../../types";
import { isDev } from "../../utils";

type Props = {
  bookmark: Bookmark;
};

const BookmarkTree: Component<Props> = (props) => {
  let droppableRef!: HTMLUListElement;

  const [dragging, setDragging] = createSignal<Dragging>({
    sourceIndex: -1,
    destinationIndex: -1,
    state: "none",
    source: null,
    destination: null,
  });

  // DragEvent will be ...
  // dragstart -> dragenter -> dragover -> drop -> dragend

  // props.bookmark should be reactive, and when it changes, we need to re-attach event listeners
  const bookmark = () => props.bookmark;
  createEffect(
    on(bookmark, () => {
      if (droppableRef) {
        if (isDev()) {
          console.log("createEffect: bookmarks changed: ", droppableRef);
        }
        for (const el of droppableRef.querySelectorAll('li[draggable="true"]')) {
          dragStartEventListener(el as HTMLLIElement);
          dragEndEventListener(el as HTMLLIElement);
        }
        dragEnterEventListener(droppableRef);
        dragOverEventListener(droppableRef);
        dropEventListener(droppableRef);
      }
    }),
  );

  // dragstart event
  const dragStartEventListener = (draggableElement: HTMLLIElement) => {
    makeEventListener(draggableElement, "dragstart", (ev) => {
      const source = ev.target as HTMLLIElement;
      const match = source.id.match(/bookmark-(\d+)/);
      if (match) {
        ev.dataTransfer?.setData("text/plain", match[1]);

        // Set sourceId
        setDragging({
          sourceIndex: Number.parseInt(match[1]),
          destinationIndex: -1,
          state: "none",
          source,
          destination: null,
        });
      }
    });
  };

  // dragend event
  const dragEndEventListener = (draggableElement: HTMLLIElement) => {
    makeEventListener(draggableElement, "dragend", (ev) => {
      // make sure to clear the data, but is this necessary??
      ev.dataTransfer?.clearData();
      // Reset dragging state
      setDragging({
        sourceIndex: -1,
        destinationIndex: -1,
        state: "none",
        source: null,
        destination: null,
      });
    });
  };

  // dragenter event
  const dragEnterEventListener = (droppableElement: HTMLUListElement) => {
    makeEventListener(droppableElement, "dragenter", (ev) => {
      // blocking dragenter event if the source contains the destination
      const source = dragging().source;
      const enterNode = ev.target as Node;
      if (source && enterNode) {
        if (!source.contains(enterNode)) {
          ev.preventDefault();
        }
      }
    });
  };

  // dragover event
  const dragOverEventListener = (droppableElement: HTMLUListElement) => {
    makeEventListener(droppableElement, "dragover", (ev) => {
      // blocking dragover event if the source contains the destination
      const source = dragging().source;
      const destNode = ev.target as Node;
      if (source && destNode) {
        if (!source.contains(destNode)) {
          ev.preventDefault();
        }
      }

      // if (ev.dataTransfer && dragging().source) {
      //   ev.dataTransfer.dropEffect = "move";
      //   // find the closest destination by ev.clientY from children
      //   const children = Array.from(droppableElement.children as HTMLCollectionOf<HTMLDivElement>);
      //   const closest = children.find((dest) => {
      //     const destinationRect = dest.getBoundingClientRect();
      //     return ev.clientY < destinationRect.bottom;
      //   });
      //   if (closest) {
      //     const match = closest.id.match(/bookmark-(\d+)/);
      //     if (match) {
      //       const destinationIndex = Number.parseInt(match[1]);
      //       const rect = closest.getBoundingClientRect();
      //       const isInside = ev.clientY <= rect.top + rect.height / 2;
      //       if (isInside) {
      //         // inside the destination
      //         setDragging({
      //           sourceIndex: dragging().sourceIndex,
      //           destinationIndex,
      //           state: "inside",
      //           source: dragging().source,
      //           destination: closest,
      //         });
      //       } else {
      //         // after the destination
      //         setDragging({
      //           sourceIndex: dragging().sourceIndex,
      //           destinationIndex,
      //           state: "after",
      //           source: dragging().source,
      //           destination: closest,
      //         });
      //       }
      //     }
      //   }
      // }
    });
  };

  // drop event
  const dropEventListener = (droppableElement: HTMLUListElement) => {
    makeEventListener(droppableElement, "drop", (ev) => {
      ev.preventDefault();
      const { source, destination, sourceIndex, destinationIndex, state } = dragging();
      // make sure souceId is not root and destinationId is over root, and sourceId is not equal to destinationId
      if (sourceIndex >= 2 && destinationIndex >= 1 && sourceIndex !== destinationIndex) {
        if (isDev()) {
          console.log(`${state}: ${sourceIndex} -> ${destinationIndex}`);
        }
        if (state === "inside") {
          // if state is inside, append to the last child of destination
          // console.log("appendToChild");
          // useBookmarkState.getState().appendToChild(sourceIndex, destinationIndex);
        } else if (state === "after") {
          const hasChildren = destination?.classList.contains("hasChildren");
          if (hasChildren) {
            // if destination has children, prepend to the first child
            // console.log("prependToChild");
            // useBookmarkState.getState().prependToChild(sourceIndex, destinationIndex);
          } else {
            // if destination has no children, insert after the destination
            // console.log("insertAfter");
            // useBookmarkState.getState().insertAfter(sourceIndex, destinationIndex);
          }
        }
      }
    });
  };

  return (
    <ul id="bookmark-tree" ref={droppableRef}>
      <BookmarkNode dragging={dragging()} bookmark={props.bookmark} level={0} />
    </ul>
  );
};

export default BookmarkTree;
