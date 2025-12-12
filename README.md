# Blob Image Reveal

An interactive image reveal effect using an animated, organic blob shape that follows your cursor. Built with vanilla HTML, CSS, and JavaScript — no dependencies.

![Demo](https://raw.githubusercontent.com/shaal/blob-image-reveal/main/demo.gif)

## Features

- **Animated blob mask** — Organic, wobbly shape that continuously morphs
- **Smooth cursor tracking** — Configurable easing for natural movement
- **Soft feathered edges** — SVG Gaussian blur creates dreamy transitions
- **Fully responsive** — Works at any screen size
- **Mobile support** — Touch events for phones and tablets
- **Performance optimized** — Pauses when tab is hidden, debounced resize
- **Zero dependencies** — Pure vanilla JS, ~230 lines of code
- **Customizable** — Easy configuration via options object

## Demo

[Live Demo](https://shaal.github.io/blob-image-reveal/)

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

## Usage

### Basic Setup

Include the HTML structure:

```html
<div class="image-container" id="imageContainer">
  <!-- Base image (visible by default) -->
  <img src="your-base-image.jpg" alt="Base" class="base-image">

  <!-- Reveal image (shown through blob mask) -->
  <div class="reveal-layer">
    <img src="your-reveal-image.jpg" alt="Reveal" class="reveal-image">
  </div>

  <!-- SVG blob mask -->
  <svg class="blob-svg" viewBox="0 0 800 600" preserveAspectRatio="none">
    <defs>
      <filter id="blobBlur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
      </filter>
      <mask id="blobMask">
        <rect width="100%" height="100%" fill="black" />
        <path id="blobPath" d="M 0 0" fill="white" filter="url(#blobBlur)" />
      </mask>
    </defs>
  </svg>
</div>
```

Initialize the blob mask:

```html
<script src="script.js"></script>
```

### Configuration Options

Customize the blob behavior by passing options:

```javascript
const blobMask = new BlobMask('imageContainer', {
  blobRadius: 60,      // Size of the blob (default: 60)
  numPoints: 8,        // Number of points defining the blob shape (default: 8)
  wobbleAmount: 15,    // Intensity of the wobble animation (default: 15)
  wobbleSpeed: 0.0015, // Speed of the wobble animation (default: 0.0015)
  easing: 0.08,        // Cursor follow smoothness, 1 = instant (default: 0.08)
});
```

### Customizing the Blur

Adjust the blur amount in the HTML by changing `stdDeviation`:

```html
<!-- Sharper edges -->
<feGaussianBlur in="SourceGraphic" stdDeviation="10" />

<!-- Softer, dreamier edges -->
<feGaussianBlur in="SourceGraphic" stdDeviation="40" />
```

### API

```javascript
// Access the instance
const blob = window.blobMask;

// Clean up (removes all event listeners)
blob.destroy();

// Reinitialize with new options
window.blobMask = new BlobMask('imageContainer', { blobRadius: 100 });
```

## How It Works

1. **SVG Mask** — The reveal image is masked using an SVG `<mask>` element with a blurred path
2. **Dynamic Path** — JavaScript generates a smooth blob shape using Catmull-Rom to Bézier curve conversion
3. **Organic Animation** — Multiple overlapping sine waves create natural, non-repeating wobble
4. **Responsive ViewBox** — The SVG viewBox dynamically matches the container's pixel dimensions

## Browser Support

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

Requires support for:
- CSS `mask` / `-webkit-mask`
- SVG filters
- ResizeObserver
- ES6 classes

## License

[MIT](LICENSE) — feel free to use in personal and commercial projects.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Credits

- Demo images from [Unsplash](https://unsplash.com)
- Inspired by creative mask effects in modern web design
