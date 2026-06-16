# Case study: Middle East Pearl Diving

A design and development case study for the Middle East Pearl Diving website.
It started as coursework for CSCU9X5 UX Design at the University of Stirling and
was later reworked into a portfolio piece. This document covers the original
design thinking and the work done during the upgrade.

## The brief

Build a responsive multimedia website that preserves and explains the heritage of
pearl diving in the Gulf. Pearl diving was a major source of income for nations
such as the UAE, Bahrain, Kuwait and Qatar before it declined in the 1930s after
cultured pearls arrived. The site works as a small virtual museum: history,
culture, the modern industry, a photo gallery, and a way to get in touch.

## Who it is for

The design was built around two people:

- **Joshua, 24, history student.** Researching Middle Eastern heritage for a
  university assignment on a laptop. He needs clear, detailed text and images he
  can cite and learn from.
- **David, 35, tourist.** Planning a trip to the UAE and reading on his phone. He
  scans quickly and cares most about the Gallery and Modern Industry sections.

These two cover the wider audience: history and culture enthusiasts, students and
educators, maritime heritage researchers, and cultural tourism professionals.

## Design decisions

### Colour

The palette comes from the sea and the desert: deep teal-blue for the ocean, warm
sand/beige for content panels, and white. The blue sets a calm backdrop that ties
back to the diving theme, and the sand tones echo the coastlines where pearling
happened. Colours were chosen for high contrast against white text so the site
stays readable, including for users with low vision.

### Typography

Roboto is the primary typeface, with Arial and a generic sans-serif as fallbacks.
Roboto reads well on screens at a range of sizes, which suits Joshua reading long
passages and David scanning on a small phone. The fallback stack keeps the layout
consistent across devices.

### Layout

A grid-based layout keeps information structured and predictable from page to
page. Body text sits at 1.2rem for comfortable reading, and headings get enough
white space to avoid information overload.

### Imagery

Images do real work here, not just decoration. The History and Modern Industry
pages pair photos with the text they describe, so readers can picture what they
are reading about. The Gallery uses a carousel so visitors view one image at a
time with a short caption, rather than a crowded grid.

### Navigation

A clear top navigation bar links the five pages: Home, History & Culture, Modern
Industry, Gallery, and Contact. A navigation map drawn during design checked that
the main sections were easy to reach and logically grouped, which also helps
search engines understand the structure.

## Accessibility

Three guidelines shaped the build:

- **WCAG 2.1 AA** for functional and visual accessibility.
- **Nielsen's usability heuristics** for a friendly, low-friction design that
  meets user expectations.
- **Material Design** ideas for visual hierarchy and a consistent grid.

In practice this meant high-contrast colours, readable font sizes, and a layout
that adapts down to a mobile hamburger menu.

## Usability testing and evaluation

Given the scope of the assignment, feedback came from instructors, peers, and
group activities rather than a formal lab. The goals were to check navigation,
content clarity, cross-device behaviour, accessibility, and overall satisfaction.

Four methods were used:

1. **Instructor feedback.** Reviewed against Nielsen's heuristics and overall
   quality. Outcome: increase font size for readability, refine colour contrast,
   and improve the mobile toggle bar.
2. **Group activity testing.** Fellow students reviewed the wireframes, structure,
   navigation map, and colours. Outcome: make the main sections (Gallery, History
   & Culture) easier to reach, which led to the link containers on the home page.
3. **Peer walkthrough.** Classmates went through the site as typical users.
   Outcome: small navigation fixes, plus the auto-advancing carousel that moves to
   the next image every few seconds.
4. **Self-testing.** A pass focused on functionality. Outcome: found mobile
   formatting problems and updated the CSS so every page works on a phone.

Overall the testing showed the site met its audience's needs, and the rounds of
feedback drove concrete changes to readability, contrast, and navigation.

## The portfolio upgrade

The coursework version worked, but it had the rough edges of a first build:
duplicated header and footer markup on every page, hard-coded colours, a contact
form that did not send anything, and no real tooling. The upgrade kept the design
intent and the content, and improved how the site is built and how it performs:

- **Structure and tooling.** Split into `css/` and `js/`, added Prettier and
  Stylelint with config files, and formatted the whole codebase.
- **Shared components.** Header and footer are injected by a small script, so they
  live in one place instead of being copied into five files.
- **CSS design tokens.** A two-tier system (raw palette, then semantic roles) so
  colours, spacing, type, and shadows are defined once.
- **Accessibility pass.** Skip link, keyboard-accessible navigation and carousel,
  visible focus rings, reduced-motion support, and contrast fixes.
- **Working contact form.** Client-side validation with inline errors, plus
  submission through Formspree.
- **Standout features.** Dark mode with no flash on load, a keyboard-accessible
  gallery lightbox, scroll-reveal animations, and an interactive Leaflet map of
  the historic Gulf pearling nations.
- **Performance and SEO.** Per-page titles and meta descriptions, Open Graph and
  Twitter cards, lazy-loaded images, WebP versions through `<picture>`, a much
  smaller favicon, plus `sitemap.xml` and `robots.txt`.

## What I would do next

- Replace the gallery source images with higher-resolution versions so the
  lightbox stays sharp when zoomed.
- Add a dedicated social-share image sized for link previews.
- Run a full Lighthouse audit and close any remaining gaps.
