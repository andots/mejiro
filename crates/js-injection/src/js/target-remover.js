(() => {
  // document.addEventListener("DOMContentLoaded", () => {
  function removeTargetAttributes() {
    const targets = document.querySelectorAll("a[target]");
    for (const target of targets) {
      target.removeAttribute("target");
    }
  }

  // Run immediately
  removeTargetAttributes();

  // Observe changes in the document and remove target attributes dynamically
  const observer = new MutationObserver(() => removeTargetAttributes());
  observer.observe(document.body, { childList: true, subtree: true });
  // });
})();
