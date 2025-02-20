import { type Component, createEffect, createSignal, on, onMount } from "solid-js";

import { makeEventListener } from "@solid-primitives/event-listener";

import { useBookmarkState } from "../../stores/bookmarks";

import BookmarkNode from "./BookmarkNode";
import type { Dragging } from "../../types";

const BookmarkTree: Component = () => {
  let ref!: HTMLDivElement;

  const bookmarks = useBookmarkState((state) => state.bookmarks);

  const [dragging, setDragging] = createSignal<Dragging>({
    sourceId: -1,
    destinationId: -1,
    state: "none",
  });

  // dragstart event
  const makeDragStartEventListener = (el: HTMLDivElement) => {
    makeEventListener(el, "dragstart", (ev) => {
      // TODO: use el, not ev.target?
      const source = ev.target as HTMLDivElement;
      const match = source.id.match(/bookmark-(\d+)/);
      if (match) {
        ev.dataTransfer?.setData("text/plain", match[1]);
        setTimeout(() => source.classList.add("dragging"), 0);

        // Set sourceId
        setDragging({
          sourceId: Number.parseInt(match[1]),
          destinationId: -1,
          state: "none",
        });
      }
    });
  };

  // dragend event
  // dragstart -> dragenter -> dragover -> drop -> dragend
  const makeDragEndEventListener = (el: HTMLDivElement) => {
    makeEventListener(el, "dragend", (ev) => {
      const source = ev.target as HTMLDivElement;
      source.classList.remove("dragging");

      // Reset dragging state
      setDragging({
        sourceId: -1,
        destinationId: -1,
        state: "none",
      });
    });
  };

  // dragover event
  const makeDragOverEventListener = (el: HTMLDivElement) => {
    makeEventListener(el, "dragover", (ev) => {
      ev.preventDefault();
      if (ev.dataTransfer) {
        ev.dataTransfer.dropEffect = "move";
        const draggingItem = el.querySelector(".dragging") as HTMLDivElement;
        if (draggingItem) {
          // find the closest destination by ev.clientY from children
          const children = Array.from(el.children as HTMLCollectionOf<HTMLDivElement>);
          const closest = children.find((dest) => {
            const destinationRect = dest.getBoundingClientRect();
            return ev.clientY < destinationRect.bottom;
          });
          if (closest) {
            const match = closest.id.match(/bookmark-(\d+)/);
            if (match) {
              const id = Number.parseInt(match[1]);
              const rect = closest.getBoundingClientRect();
              const isInside = ev.clientY <= rect.top + rect.height / 2;
              if (isInside) {
                // inside the destination
                setDragging({
                  sourceId: dragging().sourceId,
                  destinationId: id,
                  state: "inside",
                });
              } else {
                // after the destination
                setDragging({
                  sourceId: dragging().sourceId,
                  destinationId: id,
                  state: "after",
                });
              }
            }
          }
        }
      }
    });
  };

  // dragenter event
  const makeDragEnterEventListener = (el: HTMLDivElement) => {
    makeEventListener(el, "dragenter", (ev) => {
      ev.preventDefault();
    });
  };

  // drop event
  const makeDropEventListener = (el: HTMLDivElement) => {
    makeEventListener(el, "drop", (ev) => {
      ev.preventDefault();
      // make sure souceId is not root and destinationId is over root, and sourceId is not equal to destinationId
      if (
        dragging().sourceId >= 2 &&
        dragging().destinationId >= 1 &&
        dragging().sourceId !== dragging().destinationId
      ) {
        console.log(
          `Dropped: {sourceId: ${dragging().sourceId}, destinationId: ${dragging().destinationId}, state: ${dragging().state}}`,
        );
        if (dragging().state === "inside") {
          // TODO: move tree with append
        } else if (dragging().state === "after") {
          // TODO: move tree with insertAfter
          // useBookmarkState.getState().detachAndInsertAfter(
          //   draggingState().sourceId,
          //   draggingState().destinationId,
          // );
        }
      }
    });
  };

  createEffect(
    on(bookmarks, () => {
      if (ref) {
        for (const child of ref.children) {
          makeDragStartEventListener(child as HTMLDivElement);
          makeDragEndEventListener(child as HTMLDivElement);
        }
        makeDragOverEventListener(ref);
        makeDragEnterEventListener(ref);
        makeDropEventListener(ref);
      }
    }),
  );

  return (
    <div id="bookmark-tree" ref={ref}>
      <BookmarkNode dragging={dragging()} bookmark={bookmarks()} level={0} />
    </div>
  );
};

export default BookmarkTree;

// if (ev.dataTransfer) {
//   const data = ev.dataTransfer.getData("text/plain");
//   const source_index = Number.parseInt(data);
//   const destination_index = indicatorId();
//   if (source_index > 0 && destination_index > 0 && source_index !== destination_index) {
//     console.log(`source: ${source_index}, destination: ${destination_index}`);
//     // TODO: need to implement this
//     // useBookmarkState.getState().detachAndInsertAfter(source_index, destination_index);
//   }
// }
