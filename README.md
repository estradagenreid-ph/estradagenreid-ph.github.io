# Genreid Isaiah Estrada — Portfolio

My portfolio for applied AI, business technology, research, and game development. Built with HTML, CSS, JavaScript, and an optional WebGL background.

[View the portfolio](https://estradagenreid-ph.github.io/)

**Instructions:**

1. Clone the repository and enter its folder:

```sh
git clone https://github.com/estradagenreid-ph/estradagenreid-ph.github.io.git
cd estradagenreid-ph.github.io
```

2. Start a local server from that folder. With Python installed:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

3. Open [localhost:8000](http://localhost:8000) in your browser. Stop the server with Ctrl+C.

There is no package installation or build step. Python is only needed for this preview command; any static HTTP server also works. GitHub Pages serves the same files.

**FILES:**

| File | What it does |
| --- | --- |
| `index.html` | Main portfolio, project descriptions, repository links, and gallery entries. |
| `resume.html` | Professional overview with a print/save-as-PDF action. |
| `style.css` | Layout, mobile styles, gallery styles, and print formatting. |
| `script.js` | Project filtering, gallery navigation, and perspective controls. |
| `shader.js` | Procedural WebGL background with a pause control and reduced-motion support. |
| `assets/` | Icons, vector artwork, portrait preview, and optimized WebP gallery images. |
| `images/` | Original project screenshots, portrait, and Pong GIFs. |

**TO UPDATE THE PORTFOLIO:**

Edit the copy and gallery links in `index.html`. Gallery entries live in each card's `.gallery-items` links: `href` points to the original image, `data-caption` describes it, and the nested image provides the lightweight preview. Keep the existing `data-gallery-id` for each project. GIF entries use `data-animation="true"` and `data-poster`.

When changing CSS or JavaScript, update the version in the matching asset URLs on both HTML pages. Keep project media in Git; these files are part of the site.

**ACCESSIBILITY:**

The gallery supports keyboard navigation, Escape-to-close, focus restoration, and original-image links. Reduced motion stops animation. Pong clips load only when Play clip is selected. If WebGL is unavailable, the site uses static backgrounds. Game concept artwork is labeled as placeholder artwork.

**TOOLS & ACKNOWLEDGMENTS:**

Codex helped me build this portfolio and revise its documentation. The site itself does not call an AI model or require an API key.

The academic apps shown in the portfolio—InsightBot, Canada Trust Wealth, VectorHire, SEO Sim, Corporate SWOT Advisor, and WealthMind AI—were built with Google AI Studio, as credited in their project cards. The Pong project uses Python, Pygame, and NEAT-Python, with its own credits in [the project README](https://github.com/estradagenreid-ph/neat_pong_power_up).

**LOCAL FILES:**

`.gitignore` excludes local environment files, credentials, editor files, and preview artifacts. Personal CV/resume PDFs and full postal addresses are not part of the published site.
