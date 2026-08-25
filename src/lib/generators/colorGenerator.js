/**
 * colorGenerator.js — Color Palette Generation Engine
 * 
 * Generates a harmonious 5-color brand palette from a single base color
 * using established Color Theory principles. The color scheme type is
 * selected based on the brand style to ensure the palette matches the
 * desired aesthetic.
 * 
 * COLOR THEORY BACKGROUND:
 * ========================
 * Color harmonies are combinations of colors that are aesthetically pleasing.
 * They are derived from geometric relationships on the color wheel:
 * 
 * 1. MONOCHROMATIC: Same hue, varying saturation and lightness.
 *    Creates a cohesive, unified feel. Best for: Minimal, Modern/Tech
 * 
 * 2. ANALOGOUS: Colors adjacent on the wheel (±30°).
 *    Creates a harmonious, natural feel. Best for: Luxury, Vintage
 * 
 * 3. TRIADIC: Three colors equally spaced (120° apart).
 *    Creates vibrant, energetic feel. Best for: Playful
 * 
 * 4. COMPLEMENTARY: Colors opposite on the wheel (180° apart).
 *    Creates high contrast, bold feel. Best for: Bold
 * 
 * 5. SPLIT-COMPLEMENTARY: Base + two colors adjacent to its complement.
 *    Creates high contrast but less tension than complementary.
 */

import { hexToHSL, hslToHex, adjustHue, adjustSaturation, adjustLightness } from '../colorUtils';

/**
 * Style-to-scheme mapping.
 * Each brand style is associated with the color harmony scheme that
 * best represents its visual character.
 */
const STYLE_SCHEME_MAP = {
  'Minimal':     'monochromatic',
  'Playful':     'triadic',
  'Luxury':      'analogous',
  'Modern/Tech': 'monochromatic',
  'Vintage':     'analogous-muted',
  'Bold':        'split-complementary',
};

/**
 * Generate a 5-color brand palette from a base color and style.
 * 
 * ALGORITHM:
 * 1. Convert base hex color to HSL color space
 * 2. Select the appropriate color scheme based on brand style
 * 3. Apply color theory formulas to derive 5 harmonious colors
 * 4. Apply a random variation seed for the "Regenerate" feature
 * 5. Return palette with semantic names and hex values
 * 
 * @param {string} baseColor - User's preferred color as hex (e.g., "#3B82F6")
 * @param {string} style - Brand style (e.g., "Minimal", "Playful")
 * @param {number} [variationSeed=0] - Seed for generating variations (0-100)
 * @returns {Object} Palette object with colors, scheme name, and descriptions
 */
export function generateColorPalette(baseColor, style, variationSeed = 0) {
  const { h, s, l } = hexToHSL(baseColor);
  const scheme = STYLE_SCHEME_MAP[style] || 'monochromatic';
  
  // Apply variation: slightly shift the base hue for "Regenerate" feature
  // The seed shifts hue by up to ±15° and saturation by ±10%
  const hueShift = (variationSeed % 30) - 15;
  const satShift = (variationSeed % 20) - 10;
  
  const baseH = adjustHue(h, hueShift);
  const baseS = adjustSaturation(s, satShift);
  const baseL = l;
  
  let colors;
  
  switch (scheme) {
    case 'monochromatic':
      /**
       * MONOCHROMATIC SCHEME
       * All colors share the same hue but vary in saturation and lightness.
       * This creates a clean, professional look ideal for Minimal and Modern/Tech.
       * 
       * Formula:
       * - Primary: base color
       * - Secondary: same hue, reduced saturation, higher lightness
       * - Accent: same hue, increased saturation, slightly different lightness
       * - Light: very high lightness (tint)
       * - Dark: very low lightness (shade)
       */
      colors = {
        primary:   hslToHex(baseH, baseS, baseL),
        secondary: hslToHex(baseH, adjustSaturation(baseS, -20), adjustLightness(baseL, 20)),
        accent:    hslToHex(baseH, adjustSaturation(baseS, 15), adjustLightness(baseL, -10)),
        light:     hslToHex(baseH, adjustSaturation(baseS, -40), Math.min(95, adjustLightness(baseL, 35))),
        dark:      hslToHex(baseH, adjustSaturation(baseS, 10), Math.max(10, adjustLightness(baseL, -30))),
      };
      break;
      
    case 'triadic':
      /**
       * TRIADIC SCHEME
       * Three colors equally spaced at 120° intervals on the color wheel.
       * Creates a vibrant, energetic palette perfect for Playful brands.
       * 
       * Formula:
       * - Primary: base color
       * - Secondary: base hue + 120°
       * - Accent: base hue + 240°
       * - Light: lightened primary
       * - Dark: darkened primary
       */
      colors = {
        primary:   hslToHex(baseH, baseS, baseL),
        secondary: hslToHex(adjustHue(baseH, 120), baseS, baseL),
        accent:    hslToHex(adjustHue(baseH, 240), adjustSaturation(baseS, -10), baseL),
        light:     hslToHex(baseH, adjustSaturation(baseS, -30), Math.min(92, adjustLightness(baseL, 30))),
        dark:      hslToHex(baseH, adjustSaturation(baseS, 10), Math.max(15, adjustLightness(baseL, -25))),
      };
      break;
      
    case 'analogous':
      /**
       * ANALOGOUS SCHEME
       * Colors adjacent on the wheel (±30° from base).
       * Creates a sophisticated, harmonious palette for Luxury brands.
       * The warm-toned palette with desaturated accents evokes premium quality.
       * 
       * Formula:
       * - Primary: base color
       * - Secondary: base hue + 30° (adjacent warm)
       * - Accent: base hue - 30° (adjacent cool), with gold-toned saturation
       * - Light: very light tint of base
       * - Dark: deep shade of base
       */
      colors = {
        primary:   hslToHex(baseH, baseS, baseL),
        secondary: hslToHex(adjustHue(baseH, 30), adjustSaturation(baseS, -10), baseL),
        accent:    hslToHex(adjustHue(baseH, -30), adjustSaturation(baseS, -15), adjustLightness(baseL, 5)),
        light:     hslToHex(baseH, adjustSaturation(baseS, -45), Math.min(95, adjustLightness(baseL, 35))),
        dark:      hslToHex(baseH, adjustSaturation(baseS, 15), Math.max(8, adjustLightness(baseL, -35))),
      };
      break;
      
    case 'analogous-muted':
      /**
       * ANALOGOUS-MUTED SCHEME
       * Similar to analogous but with reduced saturation across all colors.
       * Creates the warm, faded aesthetic associated with Vintage design.
       * 
       * Formula:
       * - All colors have saturation reduced by 25-30%
       * - Slight warmth bias (positive hue shifts lean toward yellows)
       */
      colors = {
        primary:   hslToHex(baseH, adjustSaturation(baseS, -25), baseL),
        secondary: hslToHex(adjustHue(baseH, 25), adjustSaturation(baseS, -30), adjustLightness(baseL, 10)),
        accent:    hslToHex(adjustHue(baseH, -20), adjustSaturation(baseS, -20), adjustLightness(baseL, -5)),
        light:     hslToHex(adjustHue(baseH, 10), adjustSaturation(baseS, -50), Math.min(90, adjustLightness(baseL, 30))),
        dark:      hslToHex(baseH, adjustSaturation(baseS, -15), Math.max(15, adjustLightness(baseL, -30))),
      };
      break;
      
    case 'split-complementary':
      /**
       * SPLIT-COMPLEMENTARY SCHEME
       * Uses base color plus two colors flanking its complement.
       * Provides strong visual contrast without the harshness of pure complementary.
       * Ideal for Bold brands that want to stand out.
       * 
       * Formula:
       * - Primary: base color
       * - Secondary: complement + 30° (i.e., base + 150°)
       * - Accent: complement - 30° (i.e., base + 210°)
       * - Light: light tint of base
       * - Dark: dark shade of base
       */
      colors = {
        primary:   hslToHex(baseH, baseS, baseL),
        secondary: hslToHex(adjustHue(baseH, 150), baseS, baseL),
        accent:    hslToHex(adjustHue(baseH, 210), adjustSaturation(baseS, -5), adjustLightness(baseL, 5)),
        light:     hslToHex(baseH, adjustSaturation(baseS, -35), Math.min(93, adjustLightness(baseL, 33))),
        dark:      hslToHex(baseH, adjustSaturation(baseS, 10), Math.max(12, adjustLightness(baseL, -32))),
      };
      break;
      
    default:
      colors = {
        primary:   baseColor,
        secondary: hslToHex(adjustHue(baseH, 30), baseS, baseL),
        accent:    hslToHex(adjustHue(baseH, 60), baseS, baseL),
        light:     hslToHex(baseH, adjustSaturation(baseS, -40), 90),
        dark:      hslToHex(baseH, baseS, 15),
      };
  }
  
  return {
    colors,
    scheme,
    schemeName: getSchemeDisplayName(scheme),
    descriptions: {
      primary:   'Primary brand color — used for main elements, CTAs, and key UI',
      secondary: 'Secondary color — supports the primary, used for accents and highlights',
      accent:    'Accent color — draws attention to special elements and decorations',
      light:     'Light color — backgrounds, cards, and negative space',
      dark:      'Dark color — text, headers, and high-contrast elements',
    }
  };
}

/**
 * Get a human-readable name for the color scheme.
 * Used in the UI to educate users about the color theory behind their palette.
 */
function getSchemeDisplayName(scheme) {
  const names = {
    'monochromatic':      'Monochromatic',
    'triadic':            'Triadic',
    'analogous':          'Analogous',
    'analogous-muted':    'Analogous (Muted)',
    'split-complementary': 'Split-Complementary',
  };
  return names[scheme] || scheme;
}
