# Galileo Platform – Ways of Work Microsite

Interactive microsite for Galileo’s socio-technical operating system: Discovery–Delivery–Operations (DDO), Team Topologies, Residuality Theory overlays, customer value stream, and role perspectives. Runs entirely in the browser—no build step needed.

## Highlights
- Clean HTML with external CSS/JS, keyboard-friendly navigation, focus rings, and smooth reveal-on-scroll.
- SVG diagrams generated from config objects (tracks, feedback loops, residuality overlays) for WOW, POM, STA, and context map.
- Customer Value Stream: data-driven timeline + mobile accordion; modal shows 4ojos vs. casimirx perspectives, signals, exceptions, and DDO contribution map.
- Modes for insight/stability/residuality, team topology overlays, and behavioral states.
- Harmonized DDO color coding: Discovery (blue), Delivery (green), Operations (rose).
- Responsive for laptop, tablet, and mobile with scrollable diagrams and accessible focus states.

## Run locally
Open `index.html` directly or serve from the repo:
```bash
open index.html
# or
python -m http.server 8000
```

## Usage
- Switch views with the top nav (Ways of Work, POM, STA, POV).
- Use mode buttons to toggle loops/residuality overlays; hover/focus tracks for details.
- Tap any journey card (desktop or mobile accordion) to open the rich detail modal.
- Context map cards and role bubbles are keyboard-activatable (Enter/Space).
- Tooltips and reveal-on-scroll have graceful fallbacks for older browsers.

## Files
- `index.html` – Page structure, view containers, modal host, and CDN links.
- `style.css` – Custom theming (glass panels, gradients, spacing, focus rings, tooltips, responsive diagram shells).
- `script.js` – Config-driven SVG generation, interactivity, accessibility wiring, and data models for contexts, roles, and journey.

## Extending
Edit the config objects in `script.js` (`wowConfig`, `pomConfig`, `staLayers`, `contextData`, `journeyStepDetails`, `roleActivitiesData`) to update content or add tracks without touching HTML.
