import { createWithSignal } from "solid-zustand";

type Mode = null | "inside" | "after";

type Dragging = {
  source: HTMLDivElement | null;
  sourceIndex: number;
  destination: HTMLDivElement | null;
  destinationIndex: number;
  mode: Mode;
  setSource: (el: HTMLDivElement | null) => void;
  setDestination: (el: HTMLDivElement | null) => void;
  setMode: (mode: Mode) => void;
  reset: () => void;
};

const MATCHER = /bookmark-(\d+)/;

export const useDraggingState = createWithSignal<Dragging>((set) => ({
  source: null,
  sourceIndex: -1,
  destination: null,
  destinationIndex: -1,
  mode: null,
  setSource: (el) => {
    if (el) {
      const maches = el.id.match(MATCHER);
      if (maches) {
        const sourceIndex = Number.parseInt(maches[1], 10);
        set(() => ({ source: el, sourceIndex }));
      }
    }
  },
  setDestination: (el) => {
    if (el) {
      const maches = el.id.match(MATCHER);
      if (maches) {
        const destinationIndex = Number.parseInt(maches[1], 10);
        set(() => ({ destination: el, destinationIndex }));
      }
    }
  },
  setMode: (mode) => set(() => ({ mode })),
  reset: () => {
    set(() => ({ source: null, destination: null, mode: null }));
  },
}));
