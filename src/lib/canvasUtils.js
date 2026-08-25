/**
 * canvasUtils.js — HTML5 Canvas Utility Functions
 * 
 * This module provides helper functions for working with HTML5 Canvas,
 * which is a key technology in Computer Graphics for rasterized rendering.
 * 
 * COMPUTER GRAPHICS CONCEPTS USED:
 * - Rasterization: Converting vector SVG graphics to pixel-based canvas images
 * - Image compositing: Layering multiple graphical elements on a single canvas
 * - Font rendering: Loading and measuring text for precise layout
 * - Blob generation: Converting canvas pixel data to downloadable image files
 */

/**
 * Render an SVG element onto an HTML5 Canvas.
 * 
 * ALGORITHM:
 * 1. Serialize the SVG DOM element to an XML string
 * 2. Create a data URL from the SVG XML (base64 encoding)
 * 3. Load the data URL into an Image object
 * 4. Use canvas.drawImage() to rasterize the vector image onto the canvas
 * 
 * This is a core Computer Graphics operation: vector → raster conversion.
 * The SVG (resolution-independent) is converted to a bitmap at the canvas resolution.
 * 
 * @param {SVGElement} svgElement - The SVG DOM element to render
 * @param {number} width - Target width in pixels
 * @param {number} height - Target height in pixels
 * @returns {Promise<HTMLCanvasElement>} Canvas element with the rendered SVG
 */
export async function renderSvgToCanvas(svgElement, width, height) {
  // Step 1: Clone the SVG and ensure it has proper dimensions
  const svgClone = svgElement.cloneNode(true);
  svgClone.setAttribute('width', width);
  svgClone.setAttribute('height', height);

  // Step 2: Serialize SVG to XML string
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgClone);

  // Step 3: Create a data URL for the Image element
  // We use encodeURIComponent to safely handle special characters in the SVG
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  // Step 4: Load into Image and draw onto Canvas
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      // drawImage performs the actual rasterization
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url); // Free memory
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Convert a canvas to a PNG Blob for downloading.
 * 
 * Uses the Canvas API's toBlob() method which encodes the pixel data
 * to PNG format (lossless compression using DEFLATE algorithm).
 * 
 * @param {HTMLCanvasElement} canvas - Canvas element to convert
 * @returns {Promise<Blob>} PNG blob
 */
export function canvasToPngBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

/**
 * Dynamically load a Google Font by injecting a <link> element.
 * 
 * Uses the Google Fonts CSS2 API to load fonts on-demand.
 * The document.fonts.load() call ensures the font is fully downloaded
 * and available for Canvas text rendering before we try to use it.
 * 
 * @param {string} fontName - Google Font name (e.g., "Playfair Display")
 * @param {string} [weights='400;700;900'] - Font weights to load
 * @returns {Promise<void>} Resolves when font is loaded and ready
 */
export async function loadGoogleFont(fontName, weights = '400;700;900') {
  // Check if this font is already loaded to avoid duplicate requests
  const linkId = `font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(linkId)) {
    // Font link already exists, just wait for it to be ready
    try {
      await document.fonts.load(`16px "${fontName}"`);
    } catch (e) {
      // Font may already be loaded
    }
    return;
  }

  // Create and inject the Google Fonts stylesheet link
  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@${weights}&display=swap`;
  document.head.appendChild(link);

  // Wait for the font to actually load (important for Canvas rendering)
  // Canvas needs fonts to be loaded before fillText() or it falls back to default
  try {
    await document.fonts.load(`16px "${fontName}"`);
    // Small delay to ensure font is fully registered
    await new Promise(resolve => setTimeout(resolve, 100));
  } catch (e) {
    console.warn(`Font "${fontName}" may not have loaded correctly:`, e);
  }
}

/**
 * Draw text on a canvas with word wrapping.
 * 
 * Canvas doesn't natively support multi-line text, so we implement
 * our own word-wrap algorithm:
 * 1. Split text into words
 * 2. Measure each word's width using ctx.measureText()
 * 3. Accumulate words on a line until maxWidth is exceeded
 * 4. Start a new line and continue
 * 
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {string} text - Text to render
 * @param {number} x - X position
 * @param {number} y - Starting Y position
 * @param {number} maxWidth - Maximum line width before wrapping
 * @param {number} lineHeight - Vertical spacing between lines
 * @returns {number} The Y position after the last line (for layout chaining)
 */
export function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    // measureText returns TextMetrics with the width of the rendered text
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && i > 0) {
      // Current line is full — render it and start a new line
      ctx.fillText(line.trim(), x, currentY);
      line = words[i] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  // Render the last line
  ctx.fillText(line.trim(), x, currentY);
  return currentY + lineHeight;
}

/**
 * Draw a rounded rectangle on canvas.
 * 
 * Canvas doesn't have a built-in rounded rectangle in older APIs,
 * so we construct it using Bézier curves at the corners.
 * This is a common Computer Graphics primitive for UI elements.
 * 
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {number} x - Top-left X
 * @param {number} y - Top-left Y
 * @param {number} width - Rectangle width
 * @param {number} height - Rectangle height
 * @param {number} radius - Corner radius
 */
export function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
