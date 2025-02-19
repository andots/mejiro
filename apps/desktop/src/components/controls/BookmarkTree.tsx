import { type Component, createEffect, createSignal, on, onMount } from "solid-js";

import { makeEventListener } from "@solid-primitives/event-listener";

import { useBookmarkState } from "../../stores/bookmarks";

import BookmarkNode from "./BookmarkNode";

const BookmarkTree: Component = () => {
  const bookmarks = useBookmarkState((state) => state.bookmarks);
  let ref!: HTMLDivElement;
  const [indicatorId, setIndicatorId] = createSignal<number>(0);

  const makeDragStartEventListener = (el: HTMLDivElement) => {
    makeEventListener(el, "dragstart", (ev) => {
      const origin = ev.target as HTMLDivElement;
      ev.dataTransfer?.setData("text/plain", origin.id);
      setTimeout(() => origin.classList.add("dragging"), 0);
    });
  };

  const makeDragEndEventListener = (el: HTMLDivElement) => {
    makeEventListener(el, "dragend", (ev) => {
      const origin = ev.target as HTMLDivElement;
      origin.classList.remove("dragging");
      setIndicatorId(0);
    });
  };

  const makeDragOverEventListener = (el: HTMLDivElement) => {
    makeEventListener(el, "dragover", (ev) => {
      ev.preventDefault();
      if (ev.dataTransfer) {
        ev.dataTransfer.dropEffect = "move";
        const draggingItem = el.querySelector(".dragging");
        if (draggingItem) {
          const sibilings = Array.from(el.children as HTMLCollectionOf<HTMLDivElement>);
          const target = sibilings.find((sibiling) => {
            const targetRect = sibiling.getBoundingClientRect();
            return ev.clientY < targetRect.bottom;
          });
          if (target) {
            const match = target.id.match(/bookmark-(\d+)/);
            if (match) {
              setIndicatorId(Number.parseInt(match[1]));
            }
          }
        }
      }
    });
  };

  const makeDragEnterEventListener = (el: HTMLDivElement) => {
    makeEventListener(el, "dragenter", (ev) => {
      ev.preventDefault();
    });
  };

  const makeDropEventListener = (el: HTMLDivElement) => {
    makeEventListener(el, "drop", (ev) => {
      ev.preventDefault();
      if (ev.dataTransfer) {
        const data = ev.dataTransfer.getData("text/plain");
        // TODO: move bookmark with backend
        console.log(`origin: ${data} - target: ${indicatorId()}`);
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
