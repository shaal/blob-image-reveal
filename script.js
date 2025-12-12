// Blob Mask Image Reveal
// This script creates an animated blob shape that follows the cursor
// and reveals a hidden image underneath

class BlobMask {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`BlobMask: Container with id "${containerId}" not found`);
      return;
    }

    this.blobPath = document.getElementById('blobPath');
    this.svg = this.container.querySelector('.blob-svg');

    // Configurable options with defaults
    this.config = {
      blobRadius: options.blobRadius ?? 60,
      numPoints: options.numPoints ?? 8,
      wobbleAmount: options.wobbleAmount ?? 15,
      wobbleSpeed: options.wobbleSpeed ?? 0.0015,
      easing: options.easing ?? 0.08,
    };

    // Container dimensions (will be updated dynamically)
    this.width = 800;
    this.height = 600;

    // Mouse position (start at center)
    this.mouseX = this.width / 2;
    this.mouseY = this.height / 2;
    this.targetX = this.width / 2;
    this.targetY = this.height / 2;

    // Cached bounding rect (updated on resize)
    this.rect = null;

    // Animation state
    this.time = 0;
    this.isHovering = false;
    this.isVisible = true;
    this.animationId = null;

    // Bind methods to preserve context
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.animate = this.animate.bind(this);

    this.init();
  }

  init() {
    // Set initial dimensions
    this.updateDimensions();

    // Use ResizeObserver for more accurate container size tracking
    this.resizeObserver = new ResizeObserver(
      this.debounce(() => this.updateDimensions(), 100)
    );
    this.resizeObserver.observe(this.container);

    // Mouse events
    this.container.addEventListener('mousemove', this.handleMouseMove);
    this.container.addEventListener('mouseenter', this.handleEnter);
    this.container.addEventListener('mouseleave', this.handleLeave);

    // Touch events for mobile support
    this.container.addEventListener('touchmove', this.handleTouchMove, { passive: true });
    this.container.addEventListener('touchstart', this.handleEnter, { passive: true });
    this.container.addEventListener('touchend', this.handleLeave);

    // Pause animation when tab is hidden
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    // Start animation loop
    this.animate();
  }

  // Debounce utility to limit function calls
  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  updateDimensions() {
    this.rect = this.container.getBoundingClientRect();
    this.width = this.rect.width;
    this.height = this.rect.height;
    // Update SVG viewBox to match container's actual pixel dimensions
    this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
  }

  handleMouseMove(e) {
    // Use cached rect for better performance
    if (!this.rect) this.updateDimensions();
    this.targetX = e.clientX - this.rect.left;
    this.targetY = e.clientY - this.rect.top;
  }

  handleTouchMove(e) {
    if (e.touches.length > 0) {
      if (!this.rect) this.updateDimensions();
      this.targetX = e.touches[0].clientX - this.rect.left;
      this.targetY = e.touches[0].clientY - this.rect.top;
    }
  }

  handleEnter() {
    this.isHovering = true;
    // Update rect on enter in case of scroll
    this.updateDimensions();
  }

  handleLeave() {
    this.isHovering = false;
  }

  handleVisibilityChange() {
    this.isVisible = !document.hidden;
    if (this.isVisible && !this.animationId) {
      this.animate();
    }
  }

  // Generate blob path with organic wobble animation
  generateBlobPath() {
    const { blobRadius, numPoints, wobbleAmount } = this.config;
    const points = [];

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;

      // Add multiple sine waves for organic wobble
      const wobble1 = Math.sin(this.time + i * 0.8) * wobbleAmount;
      const wobble2 = Math.cos(this.time * 1.3 + i * 0.5) * (wobbleAmount * 0.5);
      const wobble3 = Math.sin(this.time * 0.7 + i * 1.2) * (wobbleAmount * 0.3);

      const radius = blobRadius + wobble1 + wobble2 + wobble3;

      const x = this.mouseX + Math.cos(angle) * radius;
      const y = this.mouseY + Math.sin(angle) * radius;

      points.push({ x, y });
    }

    return this.pointsToSmoothPath(points);
  }

  // Convert points to a smooth bezier curve path
  pointsToSmoothPath(points) {
    if (points.length < 3) return '';

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length; i++) {
      const p0 = points[(i - 1 + points.length) % points.length];
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      const p3 = points[(i + 2) % points.length];

      // Calculate control points for smooth curve
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    path += ' Z';
    return path;
  }

  animate() {
    // Stop animation if tab is hidden
    if (!this.isVisible) {
      this.animationId = null;
      return;
    }

    // Smooth mouse following with easing
    this.mouseX += (this.targetX - this.mouseX) * this.config.easing;
    this.mouseY += (this.targetY - this.mouseY) * this.config.easing;

    // Update time for wobble animation
    this.time += this.config.wobbleSpeed * 16; // Approximate 60fps timing

    // Generate and apply blob path
    const pathData = this.generateBlobPath();
    this.blobPath.setAttribute('d', pathData);

    // Continue animation loop
    this.animationId = requestAnimationFrame(this.animate);
  }

  // Clean up all event listeners and observers
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    this.resizeObserver?.disconnect();

    this.container.removeEventListener('mousemove', this.handleMouseMove);
    this.container.removeEventListener('mouseenter', this.handleEnter);
    this.container.removeEventListener('mouseleave', this.handleLeave);
    this.container.removeEventListener('touchmove', this.handleTouchMove);
    this.container.removeEventListener('touchstart', this.handleEnter);
    this.container.removeEventListener('touchend', this.handleLeave);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Create instance with optional custom configuration
  const blobMask = new BlobMask('imageContainer', {
    // Customize these values as needed:
    // blobRadius: 60,
    // numPoints: 8,
    // wobbleAmount: 15,
    // wobbleSpeed: 0.0015,
    // easing: 0.08,
  });

  // Make instance available globally for debugging
  window.blobMask = blobMask;
});
