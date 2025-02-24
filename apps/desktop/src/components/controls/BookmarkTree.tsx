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
  let ref!: HTMLDivElement;

  const [dragging, setDragging] = createSignal<Dragging>({
    sourceIndex: -1,
    destinationIndex: -1,
    state: "none",
    source: null,
    destination: null,
  });

  // props.bookmark should be reactive, and when it changes, we need to re-attach event listeners
  const bookmark = () => props.bookmark;
  createEffect(
    on(bookmark, () => {
      if (ref) {
        if (isDev()) {
          console.log("createEffect: bookmarks changed: ", ref);
        }
        for (const child of ref.children) {
          dragStartEventListener(child as HTMLDivElement);
          dragEndEventListener(child as HTMLDivElement);
        }
        dragEnterEventListener(ref);
        dragOverEventListener(ref);
        dropEventListener(ref);
      }
    }),
  );

  // DragEvent will be ...
  // dragstart -> dragenter -> dragover -> drop -> dragend

  // dragstart event
  const dragStartEventListener = (el: HTMLDivElement) => {
    makeEventListener(el, "dragstart", (ev) => {
      const source = ev.target as HTMLDivElement;
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

  // dragenter event
  const dragEnterEventListener = (el: HTMLDivElement) => {
    makeEventListener(el, "dragenter", (ev) => {
      ev.preventDefault();
    });
  };

  // dragover event
  const dragOverEventListener = (el: HTMLDivElement) => {
    makeEventListener(el, "dragover", (ev) => {
      ev.preventDefault();
      if (ev.dataTransfer && dragging().source) {
        ev.dataTransfer.dropEffect = "move";
        // find the closest destination by ev.clientY from children
        const children = Array.from(el.children as HTMLCollectionOf<HTMLDivElement>);
        const closest = children.find((dest) => {
          const destinationRect = dest.getBoundingClientRect();
          return ev.clientY < destinationRect.bottom;
        });
        if (closest) {
          const match = closest.id.match(/bookmark-(\d+)/);
          if (match) {
            const destinationIndex = Number.parseInt(match[1]);
            const rect = closest.getBoundingClientRect();
            const isInside = ev.clientY <= rect.top + rect.height / 2;
            if (isInside) {
              // inside the destination
              setDragging({
                sourceIndex: dragging().sourceIndex,
                destinationIndex,
                state: "inside",
                source: dragging().source,
                destination: closest,
              });
            } else {
              // after the destination
              setDragging({
                sourceIndex: dragging().sourceIndex,
                destinationIndex,
                state: "after",
                source: dragging().source,
                destination: closest,
              });
            }
          }
        }
      }
    });
  };

  // drop event
  const dropEventListener = (el: HTMLDivElement) => {
    makeEventListener(el, "drop", (ev) => {
      ev.preventDefault();
      if (isDev()) {
        console.log(
          `${dragging().state}: ${dragging().sourceIndex} -> ${dragging().destinationIndex}`,
        );
      }
      // make sure souceId is not root and destinationId is over root, and sourceId is not equal to destinationId
      if (
        dragging().sourceIndex >= 2 &&
        dragging().destinationIndex >= 1 &&
        dragging().sourceIndex !== dragging().destinationIndex
      ) {
        if (dragging().state === "inside") {
          useBookmarkState
            .getState()
            .appendToChild(dragging().sourceIndex, dragging().destinationIndex);
        } else if (dragging().state === "after") {
          const hasChildren = dragging().destination?.classList.contains("hasChildren");
          if (hasChildren) {
            useBookmarkState
              .getState()
              .prependToChild(dragging().sourceIndex, dragging().destinationIndex);
          } else {
            useBookmarkState
              .getState()
              .insertAfter(dragging().sourceIndex, dragging().destinationIndex);
          }
        }
      }
    });
  };

  // dragend event
  const dragEndEventListener = (el: HTMLDivElement) => {
    makeEventListener(el, "dragend", (ev) => {
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

  return (
    <div id="bookmark-tree" ref={ref}>
      <BookmarkNode dragging={dragging()} bookmark={props.bookmark} level={0} />
    </div>
  );
};

export default BookmarkTree;
