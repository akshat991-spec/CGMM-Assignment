/**
 * typographyGenerator.js — Typography Pairing Engine
 * 
 * Selects harmonious heading + body font pairings from a curated list
 * of Google Fonts, mapped to brand style categories.
 * 
 * TYPOGRAPHY PAIRING PRINCIPLES:
 * ==============================
 * Good font pairing relies on CONTRAST + HARMONY:
 * 
 * 1. CONTRAST: The heading and body fonts should look distinctly different
 *    (e.g., serif heading + sans-serif body) to create visual hierarchy.
 * 
 * 2. HARMONY: Despite contrast, the fonts should share similar "mood" or
 *    proportions so they feel intentional together.
 * 
 * 3. HIERARCHY: The heading font should be more expressive/distinctive,
 *    while the body font prioritizes readability at small sizes.
 * 
 * Each style category maps to a pairing that embodies its aesthetic:
 * - Minimal → Clean geometric sans-serifs
 * - Playful → Rounded, friendly typefaces
 * - Luxury → Elegant serifs with refined sans-serifs
 * - Modern/Tech → Geometric/monospace-inspired fonts
 * - Vintage → Classic display serifs with traditional body text
 * - Bold → High-impact, heavy-weight typefaces
 */

/**
 * Curated font pairing database.
 * Each style has multiple options to support the "Regenerate" feature.
 * 
 * Structure: style → [{ heading, body, headingWeight, bodyWeight, rationale }]
 */
const FONT_PAIRINGS = {
  'Minimal': [
    {
      heading: 'Manrope',
      body: 'Inter',
      headingWeight: '700',
      bodyWeight: '400',
      rationale: 'Clean geometric sans-serifs. Manrope\'s subtle personality in headlines pairs with Inter\'s supreme readability for body text.'
    },
    {
      heading: 'Outfit',
      body: 'Inter',
      headingWeight: '600',
      bodyWeight: '400',
      rationale: 'Outfit brings geometric precision with warmth. Inter remains the gold standard for readable body text.'
    },
    {
      heading: 'Plus Jakarta Sans',
      body: 'DM Sans',
      headingWeight: '700',
      bodyWeight: '400',
      rationale: 'Modern, balanced sans-serif pair with excellent x-height for clarity at all sizes.'
    }
  ],
  
  'Playful': [
    {
      heading: 'Fredoka',
      body: 'Nunito',
      headingWeight: '700',
      bodyWeight: '400',
      rationale: 'Fredoka\'s rounded, bubbly shapes create a friendly, approachable heading. Nunito\'s rounded terminals maintain the playful feel in body text.'
    },
    {
      heading: 'Baloo 2',
      body: 'Quicksand',
      headingWeight: '700',
      bodyWeight: '400',
      rationale: 'Baloo 2\'s exuberant character contrasts with Quicksand\'s geometric roundness for an energetic, fun feel.'
    },
    {
      heading: 'Lilita One',
      body: 'Nunito Sans',
      headingWeight: '400',
      bodyWeight: '400',
      rationale: 'Lilita One\'s bold, playful presence grabs attention while Nunito Sans provides comfortable readability.'
    }
  ],
  
  'Luxury': [
    {
      heading: 'Playfair Display',
      body: 'Lora',
      headingWeight: '700',
      bodyWeight: '400',
      rationale: 'Playfair Display\'s high contrast and elegant serifs evoke editorial luxury. Lora\'s calligraphic roots provide refined body text.'
    },
    {
      heading: 'Cormorant Garamond',
      body: 'Montserrat',
      headingWeight: '700',
      bodyWeight: '400',
      rationale: 'Cormorant\'s delicate, high-contrast serifs suggest premium quality. Montserrat\'s geometric shapes provide modern readability.'
    },
    {
      heading: 'DM Serif Display',
      body: 'DM Sans',
      headingWeight: '400',
      bodyWeight: '400',
      rationale: 'A matched superfamily pair — DM Serif Display for elegant headlines, DM Sans for clean body text. Same design DNA, perfect harmony.'
    }
  ],
  
  'Modern/Tech': [
    {
      heading: 'Space Grotesk',
      body: 'Inter',
      headingWeight: '700',
      bodyWeight: '400',
      rationale: 'Space Grotesk\'s monospace-inspired shapes signal technology. Inter\'s neutrality lets the content breathe.'
    },
    {
      heading: 'Syne',
      body: 'Plus Jakarta Sans',
      headingWeight: '700',
      bodyWeight: '400',
      rationale: 'Syne\'s bold, futuristic character captures innovation. Plus Jakarta Sans keeps body text crisp and professional.'
    },
    {
      heading: 'JetBrains Mono',
      body: 'Inter',
      headingWeight: '700',
      bodyWeight: '400',
      rationale: 'JetBrains Mono\'s developer-centric design signals tech authenticity. Combined with Inter for maximum clarity.'
    }
  ],
  
  'Vintage': [
    {
      heading: 'Abril Fatface',
      body: 'Merriweather',
      headingWeight: '400',
      bodyWeight: '400',
      rationale: 'Abril Fatface\'s bold Didone style evokes 19th-century poster art. Merriweather\'s sturdy serifs provide classic readability.'
    },
    {
      heading: 'Fraunces',
      body: 'Outfit',
      headingWeight: '700',
      bodyWeight: '400',
      rationale: 'Fraunces\' "wonky" old-style serifs bring nostalgic charm. Outfit\'s modern geometry provides comfortable reading.'
    },
    {
      heading: 'Libre Baskerville',
      body: 'Source Sans 3',
      headingWeight: '700',
      bodyWeight: '400',
      rationale: 'Libre Baskerville\'s transitional serifs evoke classic publishing. Source Sans 3 provides contemporary readability.'
    }
  ],
  
  'Bold': [
    {
      heading: 'Montserrat',
      body: 'Roboto',
      headingWeight: '900',
      bodyWeight: '400',
      rationale: 'Montserrat at Black weight commands attention. Roboto\'s mechanical precision provides a sturdy, dependable body.'
    },
    {
      heading: 'Oswald',
      body: 'Open Sans',
      headingWeight: '700',
      bodyWeight: '400',
      rationale: 'Oswald\'s condensed, impactful shapes create powerful headlines. Open Sans\'s friendly neutrality balances the intensity.'
    },
    {
      heading: 'Anton',
      body: 'Roboto',
      headingWeight: '400',
      bodyWeight: '400',
      rationale: 'Anton\'s ultra-bold, condensed design makes a strong statement. Roboto grounds the brand with dependable body text.'
    }
  ]
};

/**
 * Select a typography pairing based on brand style and variation.
 * 
 * @param {string} style - Brand style (e.g., "Minimal", "Playful")
 * @param {number} [variationSeed=0] - Seed for selecting alternate pairings
 * @returns {Object} Typography pairing with heading/body fonts, weights, and rationale
 */
export function generateTypography(style, variationSeed = 0) {
  const pairings = FONT_PAIRINGS[style] || FONT_PAIRINGS['Minimal'];
  
  // Use variation seed to cycle through available pairings for this style
  const index = variationSeed % pairings.length;
  const selected = pairings[index];
  
  return {
    heading: {
      family: selected.heading,
      weight: selected.headingWeight,
      // Google Fonts URL for dynamic loading
      url: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(selected.heading)}:wght@${selected.headingWeight}&display=swap`
    },
    body: {
      family: selected.body,
      weight: selected.bodyWeight,
      url: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(selected.body)}:wght@${selected.bodyWeight}&display=swap`
    },
    rationale: selected.rationale,
    style: style
  };
}

/**
 * Get all available typography options for display or debugging.
 * @returns {Object} The complete font pairings database
 */
export function getAllPairings() {
  return FONT_PAIRINGS;
}
