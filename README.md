# Blob Image Reveal

An interactive image reveal effect using an animated SVG blob mask that follows your cursor. Built with vanilla HTML, CSS, and JavaScript — no dependencies.

## Features

- **Animated blob mask** — Organic shape that morphs and rotates continuously
- **Cursor tracking** — Blob follows mouse position to reveal underlying image
- **Soft feathered edges** — SVG Gaussian blur creates smooth transitions
- **CSS Custom Properties** — Easy configuration via CSS variables
- **Fixed pixel sizing** — Blob size stays constant regardless of container size
- **Fully responsive** — Image scales while blob maintains its pixel dimensions
- **Zero dependencies** — Pure vanilla HTML, CSS, and JS

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/shaal/blob-image-reveal.git
   cd blob-image-reveal
   ```

2. Open `index.html` in your browser, or start a local server:
   ```bash
   python3 -m http.server 8080
   # Then visit http://localhost:8080
   ```

## Configuration

All blob settings are controlled via CSS custom properties in `styles.css`:

```css
:root {
  /* Blob controls */
  --blob-size: 250px;        /* Diameter in pixels (fixed, not relative) */
  --blob-morph-speed: 7s;    /* Shape morphing animation duration */
  --blob-rotate-speed: 53s;  /* Rotation animation duration */
  --blob-blur: 30;           /* Edge softness (0 = sharp, 30+ = very soft) */
  --blob-smoothing: 0.08;    /* Movement easing (0.01 = slow, 1 = instant) */
}
```

### Configuration Options

| Variable | Default | Description |
|----------|---------|-------------|
| `--blob-size` | `250px` | Blob diameter in pixels. Stays fixed regardless of image size. |
| `--blob-morph-speed` | `7s` | How fast the blob shape morphs between states. |
| `--blob-rotate-speed` | `53s` | How fast the blob rotates (use prime numbers to avoid repetition). |
| `--blob-blur` | `30` | Edge blur amount. Higher = softer, dreamier edges. |
| `--blob-smoothing` | `0.08` | Cursor follow easing. Lower = floaty, higher = snappy, 1 = instant. |

## How It Works

### Structure

```
image-container
├── base-image        (always visible)
└── blob-svg          (SVG overlay with masked reveal image)
    ├── mask
    │   └── blob-position    (JS controls translation)
    │       └── blob-scale   (JS controls size compensation)
    │           └── blob-rotation  (CSS animation)
    │               └── blob-path  (CSS morphing animation)
    └── image         (revealed through mask)
```

### Key Concepts

1. **SVG Mask** — The reveal image is masked by an SVG `<mask>` element. White areas in the mask are visible, black areas are hidden.

2. **Nested Groups** — Each transform (position, scale, rotation) is on a separate `<g>` element to avoid CSS transform conflicts.

3. **Fixed Pixel Sizing** — JavaScript calculates a compensation scale factor so the blob stays at the exact pixel size you specify, even when the container resizes:
   ```javascript
   scale = (desiredPixels / BASE_BLOB_SIZE) * (VIEWBOX_WIDTH / containerWidth)
   ```

4. **Smooth Movement** — The blob uses linear interpolation (lerping) to ease toward the cursor position, creating fluid motion:
   ```javascript
   position.current = lerp(position.current, position.target, smoothing)
   ```

5. **CSS Animations** — The blob shape morphs using CSS `d: path()` animation, while rotation uses a standard `transform: rotate()` animation.

## File Structure

```
svg-mask/
├── index.html    # HTML structure with SVG mask
├── styles.css    # Styles and CSS custom properties
├── script.js     # Mouse tracking and variable application
└── README.md     # This file
```

## Browser Support

- Chrome 89+
- Firefox 97+
- Safari 15.4+
- Edge 89+

Requires support for:
- CSS `d: path()` animation
- CSS custom properties
- SVG masks and filters

## Customization

### Using Different Images

Update the image sources in `index.html`:

```html
<!-- Base image (always visible) -->
<img src="your-base-image.jpg" class="base-image">

<!-- Reveal image (inside SVG) -->
<image href="your-reveal-image.jpg" ... />
```

### Creating Custom Blob Shapes

The blob path is defined in the `@keyframes blob` animation in `styles.css`. Generate new blob paths using tools like [Blobmaker](https://www.blobmaker.app/) or [Haikei](https://haikei.app/).

### Adjusting Container Size

Modify the `.image-container` in `styles.css`:

```css
.image-container {
  width: 800px;       /* Change max width */
  max-width: 90vw;    /* Responsive constraint */
  aspect-ratio: 4/3;  /* Change aspect ratio */
}
```

## License

MIT — feel free to use in personal and commercial projects.

## Credits

- Demo images from [Unsplash](https://unsplash.com)
