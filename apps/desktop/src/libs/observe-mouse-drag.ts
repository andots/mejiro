type DragHandler = {
  onMouseMove?: (e: MouseEvent) => void;
  onMouseUp?: (e: MouseEvent) => void;
  onClick?: (e: MouseEvent) => void;
};

export const observeMouseDrag = ({ onMouseMove, onMouseUp, onClick }: DragHandler) => {
  let isMoved = false;

  const onDocumentMouseMove = (e: MouseEvent) => {
    isMoved = true;
    onMouseMove?.(e);
  };

  const onDocumentMouseUp = (e: MouseEvent) => {
    onMouseUp?.(e);

    if (!isMoved) {
      onClick?.(e);
    }

    document.removeEventListener("mousemove", onDocumentMouseMove);
    document.removeEventListener("mouseup", onDocumentMouseUp);
  };

  document.addEventListener("mousemove", onDocumentMouseMove);
  document.addEventListener("mouseup", onDocumentMouseUp);
};
