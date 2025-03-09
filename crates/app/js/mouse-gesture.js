(() => {
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
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 20;
  }

  maximizeCanvas();

  window.addEventListener("resize", maximizeCanvas, true);

  document.addEventListener("mousedown", (e) => {
    e.preventDefault();

    if (e.button !== 2) return; // Ignore if not right-click

    if (
      !document.body &&
      document.documentElement.namespaceURI !== "http://www.w3.org/1999/xhtml"
    ) {
      return;
    }

    if (document.body.tagName.toUpperCase() === "FRAMESET") {
      document.documentElement.appendChild(overlay);
    } else {
      document.body.appendChild(overlay);
    }
    overlay.showPopover();

    if (!overlay.contains(canvas)) {
      overlay.appendChild(canvas);
    }

    const startX = e.clientX;
    const startY = e.clientY;
    let lastX = startX;
    let lastY = startY;
    let endX = startX;
    let endY = startY;

    // Clear previous lines
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // write mouse move stroke
    const onMouseMove = (moveEvent) => {
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

    const onMouseUp = (e) => {
      e.preventDefault();
      executeGesture(startX, startY, endX, endY);
      cleanup();
    };

    function executeGesture(sx, sy, ex, ey) {
      const dx = ex - sx;
      const dy = ey - sy;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) {
          history.forward(); // Right drag → Go forward
        } else if (dx < -30) {
          history.back(); // Left drag → Go back
        }
      } else {
        if (dy > 30) {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); // Down drag → Scroll to bottom
        } else if (dy < -30) {
          window.scrollTo({ top: 0, behavior: "smooth" }); // Up drag → Scroll to top
        }
      }
    }

    function cleanup() {
      overlay.hidePopover();
      overlay.remove();
      canvas.remove();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Remove the gesture line after 0.1s
      // setTimeout(() => ctx.clearRect(0, 0, canvasEl.width, canvasEl.height), 100);

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
