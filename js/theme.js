/**
 * Applies the saved (or system-preferred) colour theme BEFORE the page paints,
 * so there's no flash of the wrong theme. Loaded as a blocking script in the
 * <head>. The toggle button itself is created and wired up in script.js.
 */
(function () {
  let stored = null;
  try {
    stored = localStorage.getItem("theme");
  } catch (e) {
    /* localStorage can be unavailable (e.g. private mode) - fall back below */
  }
  const prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
})();
