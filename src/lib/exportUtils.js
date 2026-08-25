/**
 * exportUtils.js — Export & Download Utilities
 * 
 * This module handles the conversion and download of generated brand assets.
 * It supports three export formats:
 * - SVG (vector): Resolution-independent, ideal for print and scaling
 * - PNG (raster): Pixel-based, universal compatibility
 * - ZIP (bundle): All assets packaged together for convenience
 * 
 * Uses JSZip for client-side zip generation (no server needed) and
 * FileSaver.js for cross-browser file download triggering.
 */

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { canvasToPngBlob } from './canvasUtils';

/**
 * Download a canvas element as a PNG file.
 * 
 * Process:
 * 1. Convert canvas pixel data to PNG blob using Canvas API
 * 2. Create a temporary object URL pointing to the blob
 * 3. Programmatically click a download link
 * 
 * @param {HTMLCanvasElement} canvas - The canvas to export
 * @param {string} filename - Desired filename (e.g., "logo.png")
 */
export function downloadPng(canvas, filename) {
  canvas.toBlob((blob) => {
    saveAs(blob, filename);
  }, 'image/png');
}

/**
 * Download an SVG element as an .svg file.
 * 
 * Process:
 * 1. Serialize the SVG DOM node to XML string
 * 2. Wrap in a Blob with SVG MIME type
 * 3. Trigger download via FileSaver
 * 
 * SVG is preferred for logos because it's resolution-independent —
 * it can be scaled to any size without quality loss (vector graphics).
 * 
 * @param {SVGElement} svgElement - The SVG DOM element to export
 * @param {string} filename - Desired filename (e.g., "logo.svg")
 */
export function downloadSvg(svgElement, filename) {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  saveAs(blob, filename);
}

/**
 * Bundle all brand assets into a ZIP file and trigger download.
 * 
 * Uses JSZip to create a ZIP archive entirely in the browser.
 * This avoids the need for any server-side processing.
 * 
 * The ZIP structure:
 * ├── logo.svg          (vector logo)
 * ├── logo.png          (rasterized logo)
 * ├── color-palette.json (palette data with hex codes)
 * ├── business-card.png  (front and back card mockup)
 * └── social-template.png (Instagram-sized template)
 * 
 * @param {Object} assets - Object containing all brand assets
 * @param {SVGElement} assets.svgElement - Logo SVG element
 * @param {HTMLCanvasElement} assets.logoCanvas - Logo rasterized to canvas
 * @param {Object} assets.palette - Color palette object
 * @param {HTMLCanvasElement} assets.businessCardCanvas - Business card canvas
 * @param {HTMLCanvasElement} assets.socialTemplateCanvas - Social template canvas
 * @param {string} assets.businessName - The business name for the zip filename
 */
export async function downloadAllAsZip(assets) {
  const zip = new JSZip();

  // 1. Add logo SVG (vector format)
  if (assets.svgElement) {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(assets.svgElement);
    zip.file('logo.svg', svgString);
  }

  // 2. Add logo PNG (raster format)
  if (assets.logoCanvas) {
    const logoBlob = await canvasToPngBlob(assets.logoCanvas);
    zip.file('logo.png', logoBlob);
  }

  // 3. Add color palette as JSON (machine-readable)
  if (assets.palette) {
    const paletteJson = JSON.stringify(assets.palette, null, 2);
    zip.file('color-palette.json', paletteJson);
  }

  // 4. Add business card PNG
  if (assets.businessCardCanvas) {
    const cardBlob = await canvasToPngBlob(assets.businessCardCanvas);
    zip.file('business-card.png', cardBlob);
  }

  // 5. Add social media template PNG
  if (assets.socialTemplateCanvas) {
    const socialBlob = await canvasToPngBlob(assets.socialTemplateCanvas);
    zip.file('social-template.png', socialBlob);
  }

  // Generate the ZIP and trigger download
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const safeName = (assets.businessName || 'brand-kit').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  saveAs(zipBlob, `${safeName}-brand-kit.zip`);
}
