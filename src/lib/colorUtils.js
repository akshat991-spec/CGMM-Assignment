/**
 * colorUtils.js — Color Theory Utility Functions
 * 
 * This module provides foundational color manipulation functions used throughout
 * the brand identity generator. All transformations are based on the HSL (Hue,
 * Saturation, Lightness) color model, which maps more naturally to human color
 * perception than RGB.
 * 
 * KEY CONCEPTS:
 * - Hue (H): The color's position on the color wheel, 0-360 degrees
 *   (0=red, 120=green, 240=blue)
 * - Saturation (S): The color's intensity/purity, 0-100%
 *   (0=gray, 100=fully saturated)
 * - Lightness (L): The color's brightness, 0-100%
 *   (0=black, 50=pure color, 100=white)
 * 
 * COMPUTER GRAPHICS NOTE:
 * HSL is a cylindrical-coordinate representation of points in an RGB color model.
 * The conversion formulas below implement the standard algorithms described in
 * CSS Color Module Level 4 specification.
 */

/**
 * Convert a hex color string to HSL components.
 * 
 * Algorithm:
 * 1. Parse hex to RGB (0-255 per channel)
 * 2. Normalize RGB to 0-1 range
 * 3. Find min/max channel values to determine chroma
 * 4. Calculate Lightness = (max + min) / 2
 * 5. Calculate Saturation based on lightness and chroma
 * 6. Calculate Hue based on which channel is dominant
 * 
 * @param {string} hex - Hex color string (e.g., "#FF5733" or "FF5733")
 * @returns {{ h: number, s: number, l: number }} HSL object with h in [0,360], s and l in [0,100]
 */
export function hexToHSL(hex) {
  // Strip the '#' prefix if present
  hex = hex.replace(/^#/, '');

  // Parse the hex string into individual RGB channels (0-255)
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Find the minimum and maximum channel values
  // These determine the "chroma" (color range) of the input
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min; // Chroma

  // Calculate Lightness: the midpoint between max and min
  let l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (delta !== 0) {
    // Calculate Saturation
    // When lightness is below 0.5, saturation = chroma / (2 * lightness)
    // When lightness is at or above 0.5, saturation = chroma / (2 - 2 * lightness)
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    // Calculate Hue based on which RGB channel has the maximum value
    // Each case maps to a 60-degree segment of the color wheel
    switch (max) {
      case r:
        // Red is dominant: hue is between yellow and magenta
        h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        // Green is dominant: hue is between cyan and yellow
        h = ((b - r) / delta + 2) * 60;
        break;
      case b:
        // Blue is dominant: hue is between magenta and cyan
        h = ((r - g) / delta + 4) * 60;
        break;
    }
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Convert HSL components back to a hex color string.
 * 
 * Algorithm (reverse of hexToHSL):
 * 1. Normalize s and l to 0-1 range
 * 2. Calculate chroma: C = (1 - |2L - 1|) * S
 * 3. Calculate intermediate value X based on hue position
 * 4. Map to RGB based on which 60-degree segment the hue falls in
 * 5. Add lightness offset to get final RGB values
 * 
 * @param {number} h - Hue in degrees [0, 360]
 * @param {number} s - Saturation as percentage [0, 100]
 * @param {number} l - Lightness as percentage [0, 100]
 * @returns {string} Hex color string (e.g., "#FF5733")
 */
export function hslToHex(h, s, l) {
  // Normalize saturation and lightness to 0-1
  s /= 100;
  l /= 100;

  // Chroma: the "colorfulness" relative to brightness
  const c = (1 - Math.abs(2 * l - 1)) * s;

  // X: an intermediate value used to determine the second-largest RGB component
  // It varies based on the hue's position within its 60-degree segment
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));

  // m: a lightness offset added to all channels to achieve the desired lightness
  const m = l - c / 2;

  let r, g, b;

  // Map hue to the appropriate sextant of the color wheel
  // Each 60-degree segment has a specific RGB pattern
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  // Convert back to 0-255 range and format as hex
  const toHex = (val) => {
    const hex = Math.round((val + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Shift a hue value by a given number of degrees, wrapping around the 360° wheel.
 * This is the fundamental operation for creating color harmonies:
 * - Complementary: shift by 180°
 * - Triadic: shift by 120° and 240°
 * - Analogous: shift by ±30°
 * 
 * @param {number} h - Original hue [0, 360]
 * @param {number} degrees - Degrees to shift (can be negative)
 * @returns {number} New hue [0, 360)
 */
export function adjustHue(h, degrees) {
  return ((h + degrees) % 360 + 360) % 360;
}

/**
 * Clamp saturation to a new value while keeping it within valid range.
 * Used to mute colors (reduce saturation) or intensify them.
 * 
 * @param {number} s - Original saturation [0, 100]
 * @param {number} amount - Amount to add (negative to desaturate)
 * @returns {number} New saturation [0, 100]
 */
export function adjustSaturation(s, amount) {
  return Math.max(0, Math.min(100, s + amount));
}

/**
 * Adjust lightness while keeping it within valid range.
 * Used to create lighter tints or darker shades of a color.
 * 
 * @param {number} l - Original lightness [0, 100]
 * @param {number} amount - Amount to add (negative to darken)
 * @returns {number} New lightness [0, 100]
 */
export function adjustLightness(l, amount) {
  return Math.max(0, Math.min(100, l + amount));
}

/**
 * Calculate the relative luminance of a color for contrast checking.
 * Uses the WCAG 2.0 formula based on sRGB linearization.
 * 
 * This is important for ensuring text readability on colored backgrounds.
 * Luminance values range from 0 (black) to 1 (white).
 * 
 * @param {string} hex - Hex color string
 * @returns {number} Relative luminance [0, 1]
 */
export function getLuminance(hex) {
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // sRGB linearization: accounts for gamma correction in display devices
  const linearize = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  // Weighted sum reflects human eye sensitivity: most sensitive to green, least to blue
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/**
 * Determine whether to use light or dark text on a given background color.
 * Returns '#FFFFFF' for dark backgrounds, '#1A1A2E' for light backgrounds.
 * 
 * Uses a luminance threshold of 0.5 (WCAG recommends 0.179 for AA compliance,
 * but 0.5 gives better aesthetic results for brand design purposes).
 * 
 * @param {string} bgHex - Background color hex string
 * @returns {string} Text color hex string for optimal contrast
 */
export function getContrastText(bgHex) {
  return getLuminance(bgHex) > 0.5 ? '#1A1A2E' : '#FFFFFF';
}
