# Project Context — Coffee House

> This file provides context for AI assistants or developers continuing work on this project. It documents technical decisions, known issues, and current state.

## Project Type
Frontend-only portfolio project. No backend, no build tools, no frameworks — pure HTML, CSS, and vanilla JavaScript.

## File Structure
coffee-house/
├── landing.html # Entry point — drone-zoom hero, "Enter Shop" / "Urgent Order"
├── style.css # Landing page styles
├── shop-interior.html # Drone → POV crossfade, links to Coffee Builder
├── interior-style.css # Shop interior styles
├── index.html # Core ordering system
├── script.js # SHARED across all pages (see note below)
├── assets/ # Background images
└── README.md

## Important Architectural Notes

### Shared `script.js` Across All Pages
All three HTML pages link to the same `script.js`. This means DOM element lookups (e.g. `document.getElementById('addBtn')`) will return `null` on pages where that element doesn't exist. **Every `getElementById` call that's followed by `.addEventListener` must be wrapped in an `if (element)` check** to prevent runtime errors. This pattern is already applied — maintain it when adding new interactive elements.

### Page Transitions
Navigation between pages uses a custom fade-out/fade-in effect via JavaScript (`internalLinks` click handler in `script.js`), since these are separate HTML files (not a single-page app). `e.preventDefault()` delays navigation by 500ms to let the fade-out CSS transition complete before `window.location.href` changes.

### State Management (Coffee Builder)
- `currentCoffee` (object) — tracks the coffee currently being built
- `order` (array of objects) — tracks all coffees added to the order
- Price is calculated via a single `calculatePrice()` function reused across live preview, order list, and total — avoid duplicating this logic if extending pricing features

## Known Issues (Unresolved)

- **White flash on Interior → Builder navigation**: A brief white flash appears specifically on this transition, not on the reverse direction. Likely a FOUC (Flash of Unstyled Content) issue — CSS may be loading fractionally after HTML paint on this specific page. Attempted fixes (body background-color, inline critical CSS) did not fully resolve it. Needs further investigation — possibly related to image asset load timing.

## Design Decisions

- **Multi-page (not SPA)**: Intentional choice for this learning stage — easier to reason about than a single-page app with JS-driven view switching. May migrate to a framework-based SPA approach in a later phase, once React/Vue is learned.
- **Sparkle effect only on "Place Order"**: Deliberately not applied to other buttons (option selection, Add to Order) to preserve the sense of significance for order completion — a UX restraint decision, not an oversight.
- **Dark warm theme**: Consistent color palette (`#1a1410`, `#2a2118`, `#e6b464`, `#f0d9b5`) used across all three pages for visual continuity.

## Roadmap (Not Yet Built)

1. `.option.selected` visual state — partially implemented, verify still working after recent script.js consolidation
2. 2D character movement (Canvas-based) inside shop-interior
3. Backend (Node.js/Express) for real order persistence
4. Database integration
5. Three.js 3D conversion (long-term)
6. Live deployment (Vercel/Netlify)

## Author Context

Learner-built project — author is actively learning JS after completing HTML/CSS fundamentals. Code should remain readable and well-commented; avoid introducing patterns/abstractions beyond the author's current skill level without explanation.