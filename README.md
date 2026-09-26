# Genreid Isaiah Estrada — Portfolio

A static portfolio for applied AI, business technology, research, and game development. Plain HTML, CSS, JavaScript, and WebGL; no paid assets, frameworks, build step, or external runtime dependencies.

## Local preview

Serve the repository root with any static HTTP server. GitHub Pages serves the same files. `resume.html` is a printable professional overview; the original CV/resume PDFs and full postal address are not published.

## Project media

All 25 uploaded project files are represented in the gallery. The source files under `images/` are preserved. Optimized 900px WebP previews in `assets/gallery/` total approximately 497 KB. Full-resolution PNGs load when their gallery slide is selected. The two large Pong GIFs load **only** after selecting Play clip; Stop clip restores the still poster. Closing, navigating, hiding the tab, or enabling reduced motion stops playback. Game concept artwork is explicitly labeled as placeholder artwork, not gameplay.

| Project | Original folder | Media |
| --- | --- | --- |
| Deterministic Hierarchical Chunking | images/Deterministic Hierarchical Chunking | 4 screenshots |
| InsightBot | images/InsightBot | 2 screenshots |
| AI Knowledge Base | images/Knowledge_base | 4 screenshots |
| Learning through Pong | images/Pong | 2 animated GIFs |
| PROJECT ALFHA | images/Project ALFHA | 3 screenshots |
| SEO Sim | images/SEO | 2 screenshots |
| Corporate SWOT Advisor | images/SWOT Analyzer | 3 screenshots |
| Canada Trust Wealth | images/Trustwealth | 4 screenshots |
| VectorHire | images/VectorHire | 1 screenshot |
| Project AGIMAT / Project Arena | assets/agimat.svg / assets/arena.svg | 2 original vector placeholders |

Gallery metadata is in each card's `.gallery-items` links in `index.html`: `href` points to the original, `data-caption` names the scene, `data-kind` labels its provenance, and the nested image is the optimized preview. GIF entries have `data-animation="true"` and `data-poster`. Add media here to include it in per-project and all-project views automatically. Use the project's existing `data-gallery-id`; put verified source links in `.repo-link`. Only the three verified public project repositories are linked (chunking, Pong, ALFHA).

The gallery provides thumbnails, a project selector, previous/next, arrow/Home/End keys, swipe navigation, zoom with scrolling, original-file links, Escape-to-close, and focus restoration. Native details and original-image links remain usable without JavaScript.

## Interactive visual

`shader.js` renders an original fragment shader: four-octave fractional Brownian noise with domain warping, signed contour distance, radial terrain, and wave interference. Derivative-based antialiasing is used where supported. Flow, Terrain, and Signal modes, pointer movement, and a keyboard-operable intensity slider change the field.

Performance limits: one render pass, no textures or post-processing, 30fps cap, device pixel ratio capped at 1.25, backing resolution at most 800 × 520. Rendering stops when offscreen, in a hidden tab, or behind an open gallery. Pause freezes automatic motion. Reduced-motion preferences produce a static frame, while explicit style/intensity changes remain usable. Unsupported WebGL or failed compilation uses CSS artwork; lost contexts fall back and can restore.

## Editing

- `index.html`: concise portfolio copy, gallery metadata, game projects, research, experience.
- `resume.html`: professional overview and print/save-PDF action.
- `style.css`: layout, gallery, responsive and print styles.
- `script.js`: gallery, project filtering, and perspective controls.
- `shader.js`: optional procedural WebGL visual.

Both HTML pages use versioned CSS/JavaScript URLs. Change their version together when those files change so returning visitors do not combine new markup with old cached styles. The latest CV/resume supplied by the owner informs career content; current user instructions and project media inform game concepts and development updates. No performance or commercial outcomes are invented.
