/**
 * businessCardRenderer.js — Business Card Composition Engine
 * 
 * Renders a professional business card mockup (front + back) using HTML5 Canvas.
 * The card uses the generated brand identity (logo, colors, fonts) to create
 * a realistic preview.
 * 
 * COMPUTER GRAPHICS CONCEPTS:
 * ===========================
 * - Canvas 2D rendering context: fillRect, fillText, drawImage
 * - Coordinate system: top-left origin (0,0), positive Y goes down
 * - Text rendering: font property syntax, text alignment, text measurement
 * - Image compositing: layering shapes and text on a single surface
 * - Color blending: using globalAlpha for transparency effects
 * 
 * LAYOUT SPECIFICATIONS:
 * - Standard business card: 3.5" × 2" (89mm × 51mm)
 * - Canvas size: 1050 × 600 px (3.5 × 2 at ~300dpi equivalent)
 * - We render FRONT and BACK side by side on a single canvas
 * - Total canvas: 2200 × 650 px (two cards + gap + margins)
 */

import { getContrastText } from '../colorUtils';
import { drawRoundedRect } from '../canvasUtils';

/**
 * Render a business card mockup on a canvas.
 * 
 * ALGORITHM:
 * 1. Create a canvas with space for front + back cards
 * 2. Draw subtle background with card shadows (depth illusion)
 * 3. Render FRONT face: logo area, business name, tagline, contact info area
 * 4. Render BACK face: branded background, centered logo, website
 * 5. Add decorative elements using brand colors
 * 
 * @param {Object} params - Rendering parameters
 * @param {string} params.businessName - Business name
 * @param {string} params.svgDataUrl - Logo as data URL for Canvas drawImage
 * @param {Object} params.palette - Color palette object
 * @param {Object} params.typography - Typography pairing object
 * @param {string} params.style - Brand style
 * @returns {HTMLCanvasElement} The rendered business card canvas
 */
export function renderBusinessCard(params, targetCanvas = null) {
  const {
    businessName,
    svgDataUrl,
    palette,
    typography,
    style
  } = params;

  // Canvas dimensions: two 1050×600 cards side by side with padding
  const cardW = 1050;
  const cardH = 600;
  const gap = 100; // Gap between front and back
  const padding = 50;
  const totalW = cardW * 2 + gap + padding * 2;
  const totalH = cardH + padding * 2;

  const canvas = targetCanvas || document.createElement('canvas');
  canvas.width = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext('2d');

  // Background: subtle gray for contrast with white cards
  ctx.fillStyle = '#F0F0F5';
  ctx.fillRect(0, 0, totalW, totalH);

  // ============================
  // FRONT CARD
  // ============================
  const frontX = padding;
  const frontY = padding;

  // Card shadow (simulated depth via offset darker rectangle)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  drawRoundedRect(ctx, frontX + 6, frontY + 6, cardW, cardH, 16);
  ctx.fill();

  // Card background
  ctx.fillStyle = '#FFFFFF';
  drawRoundedRect(ctx, frontX, frontY, cardW, cardH, 16);
  ctx.fill();

  // Left accent bar — a vertical color strip showing brand identity
  const accentW = 12;
  ctx.fillStyle = palette.colors.primary;
  drawRoundedRect(ctx, frontX, frontY, accentW, cardH, 16);
  ctx.fill();
  // Cover the right side of the rounded rect to make it straight
  ctx.fillStyle = palette.colors.primary;
  ctx.fillRect(frontX + 8, frontY, accentW, cardH);

  // Business name — large, prominent
  ctx.fillStyle = palette.colors.dark;
  ctx.font = `bold 42px '${typography.heading.family}', sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(businessName, frontX + 60, frontY + 80);

  // Tagline placeholder
  ctx.fillStyle = palette.colors.secondary;
  ctx.font = `400 20px '${typography.body.family}', sans-serif`;
  ctx.fillText('Innovative Solutions for Tomorrow', frontX + 60, frontY + 115);

  // Divider line
  ctx.strokeStyle = palette.colors.light;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(frontX + 60, frontY + 140);
  ctx.lineTo(frontX + cardW - 60, frontY + 140);
  ctx.stroke();

  // Contact information section
  const contactY = frontY + 190;
  const contactItems = [
    { icon: '👤', text: 'John Doe, Founder & CEO' },
    { icon: '✉', text: `hello@${businessName.toLowerCase().replace(/\s+/g, '')}.com` },
    { icon: '📱', text: '+1 (555) 123-4567' },
    { icon: '🌐', text: `www.${businessName.toLowerCase().replace(/\s+/g, '')}.com` },
    { icon: '📍', text: '123 Business Ave, Suite 100, San Francisco, CA' }
  ];

  ctx.font = `400 18px '${typography.body.family}', sans-serif`;
  ctx.fillStyle = palette.colors.dark;
  contactItems.forEach((item, i) => {
    ctx.fillText(`${item.icon}  ${item.text}`, frontX + 65, contactY + i * 38);
  });

  // Bottom accent bar
  ctx.fillStyle = palette.colors.primary;
  ctx.fillRect(frontX + 60, frontY + cardH - 50, cardW - 120, 3);

  // Small colored dots as decorative element
  const dotColors = [palette.colors.primary, palette.colors.secondary, palette.colors.accent];
  dotColors.forEach((color, i) => {
    ctx.beginPath();
    ctx.arc(frontX + cardW - 100 + i * 25, frontY + cardH - 40, 6, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });

  // "FRONT" label
  ctx.fillStyle = '#999';
  ctx.font = '14px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FRONT', frontX + cardW / 2, frontY + cardH + 30);

  // ============================
  // BACK CARD
  // ============================
  const backX = padding + cardW + gap;
  const backY = padding;

  // Card shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  drawRoundedRect(ctx, backX + 6, backY + 6, cardW, cardH, 16);
  ctx.fill();

  // Card background — use primary color
  ctx.fillStyle = palette.colors.primary;
  drawRoundedRect(ctx, backX, backY, cardW, cardH, 16);
  ctx.fill();

  // Subtle pattern overlay — geometric shapes for visual interest
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(
      backX + 200 + i * 180,
      backY + 150 + (i % 2) * 200,
      80 + i * 15,
      0, Math.PI * 2
    );
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Centered business name on back
  const backTextColor = getContrastText(palette.colors.primary);
  ctx.fillStyle = backTextColor;
  ctx.font = `bold 48px '${typography.heading.family}', sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(businessName, backX + cardW / 2, backY + cardH / 2 - 20);

  // Tagline below name
  ctx.font = `400 22px '${typography.body.family}', sans-serif`;
  ctx.globalAlpha = 0.8;
  ctx.fillText('Innovative Solutions for Tomorrow', backX + cardW / 2, backY + cardH / 2 + 25);
  ctx.globalAlpha = 1;

  // Website at bottom
  ctx.font = `400 16px '${typography.body.family}', sans-serif`;
  ctx.globalAlpha = 0.6;
  ctx.fillText(`www.${businessName.toLowerCase().replace(/\s+/g, '')}.com`, backX + cardW / 2, backY + cardH - 40);
  ctx.globalAlpha = 1;

  // Decorative line above website
  ctx.strokeStyle = backTextColor;
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(backX + cardW / 2 - 100, backY + cardH - 60);
  ctx.lineTo(backX + cardW / 2 + 100, backY + cardH - 60);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Color palette strip at the very bottom
  const stripH = 8;
  const stripColors = [palette.colors.primary, palette.colors.secondary, palette.colors.accent, palette.colors.light, palette.colors.dark];
  const stripW = cardW / stripColors.length;
  stripColors.forEach((color, i) => {
    ctx.fillStyle = color;
    if (i === 0) {
      // First segment — rounded bottom-left
      drawRoundedRect(ctx, backX + i * stripW, backY + cardH - stripH, stripW, stripH, 0);
    } else {
      ctx.fillRect(backX + i * stripW, backY + cardH - stripH, stripW, stripH);
    }
    ctx.fill();
  });

  // "BACK" label
  ctx.fillStyle = '#999';
  ctx.font = '14px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BACK', backX + cardW / 2, backY + cardH + 30);

  return canvas;
}
