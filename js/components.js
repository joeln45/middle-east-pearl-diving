/**
 * Shared site chrome (header + footer).
 *
 * The header (logo + navigation) and footer are identical on every page, so
 * instead of copy-pasting them into all five HTML files we define them ONCE
 * here and inject them into a small placeholder on each page. Editing the
 * navigation now means editing a single file instead of five.
 */

// Single source of truth for the navigation links.
const NAV_LINKS = [
  { href: "index.html", label: "Home" },
  { href: "history-culture.html", label: "History & Culture" },
  { href: "techniques.html", label: "Modern Industry" },
  { href: "gallery.html", label: "Gallery" },
  { href: "contact.html", label: "Contact" },
];

// Which page are we on? Used to highlight the active link.
// e.g. "/site/techniques.html" -> "techniques.html"; a bare "/" -> "index.html".
const currentPage = window.location.pathname.split("/").pop() || "index.html";

function buildNavLinks() {
  return NAV_LINKS.map(({ href, label }) => {
    const isActive = href === currentPage;
    const activeClass = isActive ? " nav__link--active" : "";
    const ariaCurrent = isActive ? ' aria-current="page"' : "";
    return `<li><a href="${href}" class="nav__link${activeClass}"${ariaCurrent}>${label}</a></li>`;
  }).join("\n          ");
}

function siteHeader() {
  return `
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <header>
      <div class="container">
        <h1 class="logo"><a href="index.html">Middle East Pearl Diving</a></h1>
        <button
          class="menu-toggle"
          aria-label="Toggle navigation"
          aria-controls="primary-nav"
          aria-expanded="false"
        >
          <span class="menu-icon"><span></span></span>
        </button>
        <nav class="nav" id="primary-nav" aria-label="Primary">
          <ul class="nav__list">
          ${buildNavLinks()}
          </ul>
        </nav>
      </div>
    </header>`;
}

function siteFooter() {
  const year = new Date().getFullYear();
  return `
    <footer>
      <div class="container">
        <p>&copy; ${year} Middle East Pearl Diving. All rights reserved.</p>
      </div>
    </footer>`;
}

// Swap the lightweight placeholders for the real markup.
const headerMount = document.getElementById("site-header");
const footerMount = document.getElementById("site-footer");
if (headerMount) headerMount.outerHTML = siteHeader();
if (footerMount) footerMount.outerHTML = siteFooter();
