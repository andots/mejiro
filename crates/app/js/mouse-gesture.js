document.addEventListener("DOMContentLoaded", () => {
  // Create a canvas and add it to the page
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  // Set canvas styles
  canvas.id = "mejiro-mouse-gesture-canvas";
  canvas.style.zIndex = "9999";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.pointerEvents = "none"; // Ignore mouse events
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Resize the canvas when the window size changes
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const strokeColor = "#16a34a";
  let isMouseMoved = false;

  document.addEventListener("mousedown", (e) => {
    if (e.button !== 2) return; // Ignore if not right-click

    e.preventDefault();

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

      // Draw a red gesture line
      ctx.strokeStyle = strokeColor;
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
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      // Remove the gesture line after 0.1s
      setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 100);
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
});
