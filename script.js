/**
 * Blob Image Reveal - Mouse Tracking & CSS Variable Application
 *
 * This script handles:
 * 1. Applying CSS custom properties to SVG attributes (blur, size)
 * 2. Tracking pointer position and moving the blob mask
 * 3. Maintaining fixed pixel size for the blob regardless of container size
 */

const container = document.querySelector('.image-container');
const blobPosition = document.querySelector('.blob-position');
const blobScale = document.querySelector('.blob-scale');
const blurFilter = document.querySelector('#blobBlur feGaussianBlur');

// Guard: exit early if required elements are missing
if (!container || !blobPosition || !blobScale) {
  console.warn('[blob-image-reveal] Required DOM elements not found');
}

// Constants matching the SVG viewBox and blob path coordinates
const BASE_BLOB_SIZE = 400;  // Blob path coords range roughly -200 to +200
const VIEWBOX_WIDTH = 800;
const VIEWBOX_HEIGHT = 600;

// Cached smoothing value (refreshed on resize)
let smoothing = 0.08;

// Read CSS variables and cache values
function readCSSVariables() {
  const styles = getComputedStyle(document.documentElement);
  smoothing = parseFloat(styles.getPropertyValue('--blob-smoothing').trim()) || 0.08;
}

// Apply blur from CSS variable
function applyBlur() {
  const blur = getComputedStyle(document.documentElement).getPropertyValue('--blob-blur').trim();
  if (blur && blurFilter) {
    blurFilter.setAttribute('stdDeviation', blur);
  }
}

// Calculate and apply blob scale to maintain fixed pixel size
function applyBlobSize() {
  if (!container || !blobScale) return;

  const styles = getComputedStyle(document.documentElement);
  const sizeValue = styles.getPropertyValue('--blob-size').trim();
  const desiredPixels = parseFloat(sizeValue);

  if (!desiredPixels) return;

  const containerWidth = container.getBoundingClientRect().width;
  if (!containerWidth) return;  // Guard against zero-width

  // Scale factor: compensate for SVG scaling to maintain fixed pixel size
  const scale = (desiredPixels / BASE_BLOB_SIZE) * (VIEWBOX_WIDTH / containerWidth);

  // Guard against invalid scale values
  if (!Number.isFinite(scale) || scale <= 0) return;

  blobScale.style.transform = `scale(${scale})`;
}

// Initialize
readCSSVariables();
applyBlur();
applyBlobSize();

// Recalculate on resize and refresh cached CSS values
window.addEventListener('resize', () => {
  readCSSVariables();
  applyBlobSize();
});

// Blob position tracking for smooth movement
const position = {
  current: { x: VIEWBOX_WIDTH / 2, y: VIEWBOX_HEIGHT / 2 },  // Start centered
  target: { x: VIEWBOX_WIDTH / 2, y: VIEWBOX_HEIGHT / 2 }
};

// Linear interpolation helper
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

// Animation loop for smooth movement
function animate() {
  if (!blobPosition) {
    requestAnimationFrame(animate);
    return;
  }

  // Lerp current position toward target
  position.current.x = lerp(position.current.x, position.target.x, smoothing);
  position.current.y = lerp(position.current.y, position.target.y, smoothing);

  // Apply position to SVG
  blobPosition.setAttribute('transform', `translate(${position.current.x}, ${position.current.y})`);

  requestAnimationFrame(animate);
}

// Start animation loop
animate();

// Track pointer (mouse/touch/pen) and update target position
if (container) {
  container.addEventListener('pointermove', (e) => {
    const rect = container.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    // Calculate pointer position as percentage of container
    const xPercent = (e.clientX - rect.left) / rect.width;
    const yPercent = (e.clientY - rect.top) / rect.height;

    // Map to SVG viewBox coordinates and set as target
    position.target.x = xPercent * VIEWBOX_WIDTH;
    position.target.y = yPercent * VIEWBOX_HEIGHT;
  }, { passive: true });
}
