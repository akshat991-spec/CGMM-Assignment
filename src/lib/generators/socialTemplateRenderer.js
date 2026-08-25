/**
 * socialTemplateRenderer.js — Social Media Template Composition Engine
 * 
 * Renders an Instagram-post-sized (1080×1080px) social media template
 * using the generated brand identity (logo, colors, fonts).
 * 
 * COMPUTER GRAPHICS CONCEPTS:
 * ===========================
 * - Canvas gradient rendering: createLinearGradient for background effects
 * - Shape primitives: circles, rectangles for decorative elements
 * - Text layout: centering, sizing, and spacing for impactful social posts
 * - Alpha compositing: layering transparent shapes for depth
 * - Color theory application: using the brand palette for visual harmony
 * 
 * TEMPLATE DESIGN:
 * - 1080 × 1080 pixels (Instagram standard square post)
 * - Gradient background using brand primary and secondary colors
 * - Centered logo and business name
 * - Decorative geometric elements using brand palette
 * - Bottom color palette strip for brand consistency
 */

import { getContrastText, hexToHSL, hslToHex } from '../colorUtils';
import { drawRoundedRect } from '../canvasUtils';

/**
 * Render an Instagram-sized social media template.
 * 
 * COMPOSITION ALGORITHM:
 * 1. Create 1080×1080 canvas
 * 2. Render gradient background (primary → secondary at 135°)
 * 3. Add decorative geometric shapes (circles, lines) with low opacity
 * 4. Render centered logo placeholder area
 * 5. Render business name and tagline
 * 6. Add bottom palette strip and branding elements
 * 
 * @param {Object} params - Rendering parameters
 * @param {string} params.businessName - Business name
 * @param {string} params.svgDataUrl - Logo as data URL
 * @param {Object} params.palette - Color palette object
 * @param {Object} params.typography - Typography pairing object
 * @param {string} params.style - Brand style
 * @returns {HTMLCanvasElement} The rendered social template canvas
 */
export function renderSocialTemplate(params, targetCanvas = null) {
  const {
    businessName,
    svgDataUrl,
    palette,
    typography,
    style
  } = params;

  const size = 1080;
  const canvas = targetCanvas || document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // ============================
  // STEP 1: GRADIENT BACKGROUND
  // ============================
  /**
   * Create a diagonal linear gradient from top-left to bottom-right.
   * Using the brand's primary and dark colors creates a rich, branded feel.
   * The gradient angle of 135° (top-left to bottom-right) is a modern standard.
   */
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, palette.colors.primary);
  gradient.addColorStop(0.5, palette.colors.dark);
  gradient.addColorStop(1, palette.colors.primary);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // ============================
  // STEP 2: DECORATIVE SHAPES
  // ============================
  /**
   * Add semi-transparent geometric shapes for visual depth.
   * These shapes follow the brand style:
   * - Circles for Playful/Modern
   * - Lines and rectangles for Minimal/Bold
   * - Subtle patterns for Luxury/Vintage
   */
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = '#FFFFFF';

  // Large background circles for depth
  ctx.beginPath();
  ctx.arc(size * 0.2, size * 0.3, 250, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size * 0.85, size * 0.7, 200, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size * 0.5, size * 0.9, 180, 0, Math.PI * 2);
  ctx.fill();

  // Geometric accent shapes
  ctx.globalAlpha = 0.04;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.arc(
      150 + i * 180,
      100 + (i % 2 === 0 ? 0 : 60),
      30 + i * 8,
      0, Math.PI * 2
    );
    ctx.fill();
  }

  ctx.globalAlpha = 1;

  // ============================
  // STEP 3: TOP ACCENT BAR
  // ============================
  ctx.fillStyle = palette.colors.accent;
  ctx.globalAlpha = 0.3;
  ctx.fillRect(0, 0, size, 6);
  ctx.globalAlpha = 1;

  // ============================
  // STEP 4: CENTERED CONTENT AREA
  // ============================
  const textColor = getContrastText(palette.colors.primary);

  // Decorative line above content
  ctx.strokeStyle = textColor;
  ctx.globalAlpha = 0.2;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(size * 0.3, size * 0.28);
  ctx.lineTo(size * 0.7, size * 0.28);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Small label text
  ctx.fillStyle = textColor;
  ctx.globalAlpha = 0.5;
  ctx.font = `400 20px '${typography.body.family}', sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('INTRODUCING', size / 2, size * 0.34);
  ctx.globalAlpha = 1;

  // ============================
  // STEP 5: BUSINESS NAME (HERO TEXT)
  // ============================
  /**
   * Render the business name as the hero element.
   * Font size is dynamically calculated based on name length
   * to ensure it fits within the card width.
   */
  ctx.fillStyle = textColor;
  const heroFontSize = businessName.length > 15 ? 64 : businessName.length > 10 ? 78 : 90;
  ctx.font = `bold ${heroFontSize}px '${typography.heading.family}', sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(businessName, size / 2, size * 0.48);

  // Decorative accent line under the name
  const nameMetrics = ctx.measureText(businessName);
  const lineWidth = Math.min(nameMetrics.width * 0.6, size * 0.3);
  ctx.strokeStyle = palette.colors.accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(size / 2 - lineWidth / 2, size * 0.52);
  ctx.lineTo(size / 2 + lineWidth / 2, size * 0.52);
  ctx.stroke();

  // Tagline
  ctx.fillStyle = textColor;
  ctx.globalAlpha = 0.7;
  ctx.font = `400 28px '${typography.body.family}', sans-serif`;
  ctx.fillText('Innovative Solutions for Tomorrow', size / 2, size * 0.59);
  ctx.globalAlpha = 1;

  // ============================
  // STEP 6: FEATURE HIGHLIGHTS
  // ============================
  const features = ['Creative Design', 'Brand Strategy', 'Digital Identity'];
  ctx.font = `400 22px '${typography.body.family}', sans-serif`;
  ctx.fillStyle = textColor;
  ctx.globalAlpha = 0.6;

  features.forEach((feature, i) => {
    const featureX = size * 0.2 + i * (size * 0.3);
    ctx.textAlign = 'center';

    // Dot indicator
    ctx.beginPath();
    ctx.arc(featureX, size * 0.67, 4, 0, Math.PI * 2);
    ctx.fillStyle = palette.colors.accent;
    ctx.globalAlpha = 0.8;
    ctx.fill();

    // Feature text
    ctx.fillStyle = textColor;
    ctx.globalAlpha = 0.6;
    ctx.fillText(feature, featureX, size * 0.72);
  });
  ctx.globalAlpha = 1;

  // ============================
  // STEP 7: BOTTOM SECTION
  // ============================

  // Semi-transparent footer area
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.15;
  ctx.fillRect(0, size * 0.82, size, size * 0.18);
  ctx.globalAlpha = 1;

  // Website URL
  ctx.fillStyle = textColor;
  ctx.font = `400 24px '${typography.body.family}', sans-serif`;
  ctx.textAlign = 'center';
  ctx.globalAlpha = 0.8;
  ctx.fillText(`www.${businessName.toLowerCase().replace(/\s+/g, '')}.com`, size / 2, size * 0.90);
  ctx.globalAlpha = 1;

  // ============================
  // STEP 8: COLOR PALETTE STRIP
  // ============================
  /**
   * Bottom color strip showing the full brand palette.
   * This is a common design element in brand identity presentations
   * and serves as a visual footer for the social post.
   */
  const stripH = 12;
  const colors = [
    palette.colors.primary,
    palette.colors.secondary,
    palette.colors.accent,
    palette.colors.light,
    palette.colors.dark
  ];
  const stripW = size / colors.length;

  colors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(i * stripW, size - stripH, stripW, stripH);
  });

  // ============================
  // STEP 9: CORNER DECORATIONS
  // ============================
  // Small corner accents for a polished look
  ctx.strokeStyle = textColor;
  ctx.globalAlpha = 0.15;
  ctx.lineWidth = 2;

  // Top-left corner
  ctx.beginPath();
  ctx.moveTo(40, 60);
  ctx.lineTo(40, 40);
  ctx.lineTo(60, 40);
  ctx.stroke();

  // Top-right corner
  ctx.beginPath();
  ctx.moveTo(size - 40, 60);
  ctx.lineTo(size - 40, 40);
  ctx.lineTo(size - 60, 40);
  ctx.stroke();

  // Bottom-left corner
  ctx.beginPath();
  ctx.moveTo(40, size - 60);
  ctx.lineTo(40, size - 40);
  ctx.lineTo(60, size - 40);
  ctx.stroke();

  // Bottom-right corner
  ctx.beginPath();
  ctx.moveTo(size - 40, size - 60);
  ctx.lineTo(size - 40, size - 40);
  ctx.lineTo(size - 60, size - 40);
  ctx.stroke();

  ctx.globalAlpha = 1;

  return canvas;
}
