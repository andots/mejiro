import { type Component, createEffect, createSignal, on, onMount } from "solid-js";

import { makeEventListener } from "@solid-primitives/event-listener";

import { useBookmarkState } from "../../stores/bookmarks";

import BookmarkNode from "./BookmarkNode";

const BookmarkTree: Component = () => {
  let ref!: HTMLDivElement;

  const bookmarks = useBookmarkState((state) => state.bookmarks);
  const [indicatorId, setIndicatorId] = createSignal<number>(-1);

  // dragstart event
  const makeDragStartEventListener = (el: HTMLDivElement) => {
    makeEventListener(el, "dragstart", (ev) => {
      // TODO: use el, not ev.target?
      const source = ev.target as HTMLDivElement;
      const match = source.id.match(/bookmark-(\d+)/);
      if (match) {
        ev.dataTransfer?.setData("text/plain", match[1]);
        setTimeout(() => source.classList.add("dragging"), 0);
      }
    });
  };

  // dragend event
  const makeDragEndEventListener = (el: HTMLDivElement) => {
    makeEventListener(el, "dragend", (ev) => {
      const source = ev.target as HTMLDivElement;
      source.classList.remove("dragging");
      // reset indicator id
      setIndicatorId(-1);
    });
  };

  // dragover event
  const makeDragOverEventListener = (el: HTMLDivElement) => {
    makeEventListener(el, "dragover", (ev) => {
      ev.preventDefault();
      if (ev.dataTransfer) {
        ev.dataTransfer.dropEffect = "move";
        const draggingItem = el.querySelector(".dragging");
        if (draggingItem) {
          const sibilings = Array.from(el.children as HTMLCollectionOf<HTMLDivElement>);
          const destination = sibilings.find((sibiling) => {
            const destinationRect = sibiling.getBoundingClientRect();
            return ev.clientY < destinationRect.bottom;
          });
          if (destination) {
            const match = destination.id.match(/bookmark-(\d+)/);
            if (match) {
              setIndicatorId(Number.parseInt(match[1]));
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
      if (ev.dataTransfer) {
        const data = ev.dataTransfer.getData("text/plain");
        const source_index = Number.parseInt(data);
        const destination_index = indicatorId();
        if (source_index > 0 && destination_index > 0 && source_index !== destination_index) {
          console.log(`source: ${source_index}, destination: ${destination_index}`);
          // TODO: need to implement this
          // useBookmarkState.getState().detachAndInsertAfter(source_index, destination_index);
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
      <BookmarkNode indicatorId={indicatorId()} bookmark={bookmarks()} level={0} />
    </div>
  );
};

export default BookmarkTree;
