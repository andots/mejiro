import { type Component, createEffect, createSignal, on, Show } from "solid-js";

import { makeEventListener } from "@solid-primitives/event-listener";

import { useBookmarkState } from "../../stores/bookmarks";

import BookmarkNode from "./BookmarkNode";
import type { Dragging } from "../../types";

const BookmarkTree: Component = () => {
  let ref!: HTMLDivElement;

  const bookmarks = useBookmarkState((state) => state.bookmarks);
  const getCurrentTopLevel = useBookmarkState((state) => state.getCurrentTopLevel);

  const [dragging, setDragging] = createSignal<Dragging>({
    sourceIndex: -1,
    destinationIndex: -1,
    state: "none",
    source: null,
  });

  createEffect(
    on(bookmarks, () => {
      if (bookmarks() !== null && ref) {
        console.log("createEffect: bookmarks changed");
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
      // TODO: use el, not ev.target?
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
      if (ev.dataTransfer) {
        ev.dataTransfer.dropEffect = "move";
        if (dragging().source) {
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

              // if the destination is the current top level, then force to be inside
              if (destinationIndex === getCurrentTopLevel()) {
                setDragging({
                  sourceIndex: dragging().sourceIndex,
                  destinationIndex,
                  state: "inside",
                  source: dragging().source,
                });
                return;
              }

              const rect = closest.getBoundingClientRect();
              const isInside = ev.clientY <= rect.top + rect.height / 2;
              if (isInside) {
                // inside the destination
                setDragging({
                  sourceIndex: dragging().sourceIndex,
                  destinationIndex,
                  state: "inside",
                  source: dragging().source,
                });
              } else {
                // after the destination
                setDragging({
                  sourceIndex: dragging().sourceIndex,
                  destinationIndex,
                  state: "after",
                  source: dragging().source,
                });
              }
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
      // make sure souceId is not root and destinationId is over root, and sourceId is not equal to destinationId
      if (
        dragging().sourceIndex >= 2 &&
        dragging().destinationIndex >= 1 &&
        dragging().sourceIndex !== dragging().destinationIndex
      ) {
        if (dragging().state === "inside") {
          // console.log(`inside: ${dragging().sourceIndex} -> ${dragging().destinationIndex}`);
          useBookmarkState
            .getState()
            .appendToChild(dragging().sourceIndex, dragging().destinationIndex);
        } else if (dragging().state === "after") {
          // console.log(`after: ${dragging().sourceIndex} -> ${dragging().destinationIndex}`);
          useBookmarkState
            .getState()
            .insertAfter(dragging().sourceIndex, dragging().destinationIndex);
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
      });
    });
  };

  return (
    <div id="bookmark-tree" ref={ref}>
      <Show when={bookmarks() !== null}>
        {/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
        <BookmarkNode dragging={dragging()} bookmark={bookmarks()!} level={0} />
      </Show>
    </div>
  );
};

export default BookmarkTree;
