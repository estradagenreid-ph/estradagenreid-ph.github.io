# Genreid Isaiah Estrada — Portfolio

A recruiter-focused, responsive portfolio presenting applied AI, business applications, research, and people leadership. Built with plain HTML, CSS, and JavaScript, without paid assets, external fonts, runtime services, or a build dependency.

## Preview and edit

Serve this directory with any static server; GitHub Pages serves it from the repository root. Opening `index.html` directly also works.

- `index.html`: portfolio copy, project cards, project notes, research, and experience.
- `resume.html`: printable professional overview. It intentionally uses city-level contact information rather than the full postal address from the supplied résumé.
- `style.css`: responsive layout, colors, component styles, motion, and print layout.
- `script.js`: filters, accessible native-dialog project notes, perspective switcher, canvas illustration, and motion controls. Content and inline project details remain available without JavaScript.
- `assets/*.svg`: original, local placeholder project illustrations. They are labeled as concept previews and are not actual product screenshots or measured results. Replace with genuine captures and meaningful alt text when available. Video replacements should include poster images, captions where needed, and user-controlled playback.

The supplied CV and résumé are the source of the career content. Academic work, testing-stage personal projects, and planning-stage concepts are explicitly distinguished. No performance, revenue, accuracy, employment, or deployment outcomes have been invented. Public source links are included for hierarchical document processing and NEAT Pong. The Pong project notes retain disclosure of the repository's educational references and AI-assisted portions. There is no fabricated publication URL; research availability is described as listed in the CV.

## Asset caching

`index.html` and `resume.html` use versioned CSS and JavaScript URLs. Whenever either asset changes, update the version in both HTML files so returning visitors load the matching design. Versioning changes the requested cache key; a previously cached HTML page may still require a refresh.

## Motion and accessibility

- The global motion button pauses the decorative animation. The operating system's reduced-motion preference is respected immediately, including changes made while the page is open.
- Canvas rendering stops when its scene is outside the viewport or the tab is hidden. Device pixel ratio is capped at 2.
- Project filters expose pressed states and a live result count. Project notes use native dialog focus containment, Escape-to-close, and focus restoration; native details are the no-JavaScript fallback.
- All content remains readable without animation or JavaScript. Navigation uses real anchors, headings follow a logical outline, and keyboard focus is visible.
- The project previews and moving canvas are decorative and hidden from assistive technology.

## Content maintenance

Update dates and project stages as the underlying work progresses. Keep résumé and portfolio entries consistent. Link to a thesis only after obtaining a verified public URL. Replace preview images with authorized project media; do not present illustration values as evidence of results.
