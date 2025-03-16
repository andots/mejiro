(() => {
  console.info("Run: mouse-gesture");

  let isMouseMoved = false;

  const OVRELAY_ID = "mejiro-mouse-gesture-overlay";
  const CANVAS_ID = "mejiro-mouse-gesture-canvas";
  const STROKE_COLOR = "#22c55e";

  const overlay = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
  overlay.id = OVRELAY_ID;
  overlay.popover = "manual";
  overlay.style.cssText = `
    all: initial !important;
    position: fixed !important;
    inset: 0 !important;
    pointer-events: none !important;
    top: 0 !important;
    left: 0 !important;
    background: rgba(0, 0, 0, 0);
    border: none;
    overflow: hidden;
    margin: 0;
    padding: 0;
  `;

  const canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
  canvas.id = CANVAS_ID;
  canvas.style.cssText = `
    all: initial !important;
    pointer-events: none !important;
  `;

  const ctx = canvas.getContext("2d");

  function maximizeCanvas() {
    // TODO: don't hard-coded 20, 20 is for a margin of scrollbar
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 20;
  }

  maximizeCanvas();

  window.addEventListener("resize", maximizeCanvas, true);

  document.addEventListener("mousedown", (e) => {
    // Ignore if not right-click
    if (e.button !== 2) return;

    // Check document.body and namespaceURI
    if (
      !document.body &&
      document.documentElement.namespaceURI !== "http://www.w3.org/1999/xhtml"
    ) {
      return;
    }

    // Append overlay and canvas to body, then show it
    document.body.appendChild(overlay);
    overlay.appendChild(canvas);
    overlay.showPopover();

    const startX = e.clientX;
    const startY = e.clientY;
    let lastX = startX;
    let lastY = startY;
    let endX = startX;
    let endY = startY;

    // Write mouse move stroke on canvas
    const onMouseMove = (moveEvent) => {
      // TODO: need to check mouse move with margin, this is too sensitive
      isMouseMoved = true;

      endX = moveEvent.clientX;
      endY = moveEvent.clientY;

      ctx.strokeStyle = STROKE_COLOR;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      lastX = endX;
      lastY = endY;
    };

    // Execute Gesuture and cleanup all
    const onMouseUp = (e) => {
      e.preventDefault();
      executeGesture(startX, startY, endX, endY);
      cleanup();
    };

    function executeGesture(sx, sy, ex, ey) {
      const dx = ex - sx;
      const dy = ey - sy;

      // Compare dx and dy
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) {
          // Right drag → Go forward
          history.forward();
        } else if (dx < -30) {
          // Left drag → Go back
          history.back();
        }
      } else {
        if (dy > 30) {
          // Down drag → Scroll to bottom
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        } else if (dy < -30) {
          // Up drag → Scroll to top
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }

    function cleanup() {
      overlay.hidePopover();
      overlay.remove();
      canvas.remove();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      // Set isMouseMoved to false after 0.5s to prevent context menu opened
      setTimeout(() => {
        isMouseMoved = false;
      }, 500);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  // Prevent the right-click context menu from opening while mouse moving
  document.addEventListener("contextmenu", (e) => {
    if (isMouseMoved) {
      e.preventDefault();
    }
  });
})();
