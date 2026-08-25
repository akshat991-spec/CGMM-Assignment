/**
 * logoGenerator.js — Rule-Based SVG Logo Generation Engine
 * 
 * Generates unique logos by composing geometric shapes with text,
 * using a rule-based system driven by industry and style inputs.
 * 
 * COMPUTER GRAPHICS CONCEPTS:
 * ===========================
 * - SVG (Scalable Vector Graphics): Resolution-independent 2D graphics format
 * - Geometric primitives: circles, rectangles, polygons, paths
 * - Affine transformations: translate, rotate, scale
 * - Coordinate systems: SVG uses a top-left origin (0,0) coordinate system
 * - Compositing: Layering shapes and text to create the final logo
 * 
 * LOGO COMPOSITION ALGORITHM:
 * ===========================
 * The logo is built from 3 layers:
 * 1. BACKGROUND SHAPE: Optional enclosure (circle, rectangle, badge)
 * 2. ICON: Industry-specific geometric symbol
 * 3. TEXT: Business name or initials
 * 
 * The specific shapes and their treatments are determined by a
 * 2D lookup: INDUSTRY × STYLE → visual parameters
 */

import { hexToHSL, hslToHex, adjustHue, getContrastText } from '../colorUtils';

// SVG namespace required for creating SVG elements programmatically
const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Industry-to-icon mapping.
 * Each industry has a set of geometric shape descriptors that symbolically
 * represent the industry. These are rendered as SVG paths/shapes.
 */
const INDUSTRY_ICONS = {
  'Tech': {
    shapes: ['hexagon', 'circuit', 'diamond-grid'],
    symbolism: 'Hexagons represent interconnection and networks; circuits represent technology'
  },
  'Food & Beverage': {
    shapes: ['circle', 'leaf', 'drop'],
    symbolism: 'Circles represent plates/wholeness; leaves represent freshness; drops represent beverages'
  },
  'Fashion': {
    shapes: ['diamond', 'abstract-line', 'triangle-pair'],
    symbolism: 'Diamonds represent luxury; abstract lines represent elegance and fabric'
  },
  'Healthcare': {
    shapes: ['cross', 'shield', 'heart'],
    symbolism: 'Crosses represent medical care; shields represent protection; hearts represent health'
  },
  'Finance': {
    shapes: ['triangle-up', 'bar-chart', 'arrow-up'],
    symbolism: 'Upward triangles represent growth; bar charts represent data; arrows represent progress'
  },
  'Education': {
    shapes: ['book', 'mortarboard', 'lightbulb'],
    symbolism: 'Books represent knowledge; mortarboards represent graduation; lightbulbs represent ideas'
  },
  'Fitness': {
    shapes: ['lightning', 'dumbbell', 'pulse'],
    symbolism: 'Lightning represents energy; dumbbells represent strength; pulses represent vitality'
  },
  'Beauty': {
    shapes: ['petal', 'mirror', 'star-burst'],
    symbolism: 'Petals represent natural beauty; mirrors represent reflection; starbursts represent radiance'
  },
  'Real Estate': {
    shapes: ['house', 'building', 'key'],
    symbolism: 'Houses represent homes; buildings represent property; keys represent ownership'
  },
  'Other': {
    shapes: ['abstract-geo', 'circle-ring', 'square-rotate'],
    symbolism: 'Generic geometric shapes for universal appeal'
  }
};

/**
 * Style treatment parameters.
 * Each style modifies how the icon shapes are rendered.
 */
const STYLE_TREATMENTS = {
  'Minimal': {
    strokeWidth: 2,
    fill: false,
    cornerRadius: 0,
    rotation: 0,
    enclosure: 'none',
    opacity: 1,
    description: 'Thin strokes, no fills, clean lines'
  },
  'Playful': {
    strokeWidth: 3,
    fill: true,
    cornerRadius: 8,
    rotation: 5,
    enclosure: 'circle',
    opacity: 0.9,
    description: 'Rounded shapes, colorful fills, slight rotation for energy'
  },
  'Luxury': {
    strokeWidth: 1.5,
    fill: false,
    cornerRadius: 0,
    rotation: 0,
    enclosure: 'badge',
    opacity: 1,
    description: 'Fine strokes, symmetrical layout, badge enclosure for prestige'
  },
  'Modern/Tech': {
    strokeWidth: 2.5,
    fill: true,
    cornerRadius: 2,
    rotation: 0,
    enclosure: 'none',
    opacity: 1,
    description: 'Sharp angles, gradient fills, geometric precision'
  },
  'Vintage': {
    strokeWidth: 2,
    fill: false,
    cornerRadius: 4,
    rotation: 0,
    enclosure: 'badge',
    opacity: 0.85,
    description: 'Textured strokes, badge enclosure, warm feel'
  },
  'Bold': {
    strokeWidth: 4,
    fill: true,
    cornerRadius: 3,
    rotation: 0,
    enclosure: 'square',
    opacity: 1,
    description: 'Thick strokes, heavy fills, commanding presence'
  }
};

/**
 * Generate an SVG logo based on business parameters.
 * 
 * ALGORITHM STEPS:
 * 1. Extract business initials for text element
 * 2. Select icon shape based on industry (with variation cycling)
 * 3. Apply style treatment parameters
 * 4. Create SVG document with proper viewBox
 * 5. Render background/enclosure layer
 * 6. Render icon layer with transformations
 * 7. Render text layer
 * 8. Return SVG as string and metadata
 * 
 * @param {Object} params - Logo generation parameters
 * @param {string} params.businessName - Business name
 * @param {string} params.industry - Industry category
 * @param {string} params.style - Brand style
 * @param {string} params.primaryColor - Primary brand color (hex)
 * @param {string} params.accentColor - Accent brand color (hex)
 * @param {string} params.darkColor - Dark brand color (hex)
 * @param {string} params.headingFont - Font family for text
 * @param {number} [params.variationSeed=0] - Seed for generating variations
 * @returns {Object} { svgString, initials, iconName, styleTreatment }
 */
export function generateLogo(params) {
  const {
    businessName,
    industry,
    style,
    primaryColor,
    accentColor,
    darkColor,
    headingFont = 'sans-serif',
    variationSeed = 0
  } = params;

  // Step 1: Extract business initials (first letter of each word, max 3)
  const initials = businessName
    .split(/\s+/)
    .filter(w => w.length > 0)
    .map(w => w[0].toUpperCase())
    .slice(0, 3)
    .join('');

  // Step 2: Select icon shape based on industry + variation
  const industryConfig = INDUSTRY_ICONS[industry] || INDUSTRY_ICONS['Other'];
  const shapeIndex = variationSeed % industryConfig.shapes.length;
  const iconName = industryConfig.shapes[shapeIndex];

  // Step 3: Get style treatment
  const treatment = STYLE_TREATMENTS[style] || STYLE_TREATMENTS['Minimal'];

  // Step 4: Build the SVG
  const svgSize = 200; // ViewBox is 200x200, scales to any size
  const center = svgSize / 2;

  // Variation-based adjustments
  const rotationOffset = (variationSeed * 7) % 30 - 15; // ±15° variation
  const scaleVariation = 1 + ((variationSeed * 3) % 20 - 10) / 100; // ±10% scale

  let svgContent = '';

  // Step 5: Render enclosure (background shape)
  svgContent += renderEnclosure(treatment.enclosure, center, svgSize, primaryColor, darkColor, treatment, style);

  // Step 6: Render icon
  const iconColor = treatment.fill ? primaryColor : primaryColor;
  const iconStroke = treatment.fill ? 'none' : primaryColor;
  const iconFill = treatment.fill ? primaryColor : 'none';
  
  const iconRotation = treatment.rotation + rotationOffset * (treatment.rotation > 0 ? 0.5 : 0.1);
  
  svgContent += renderIcon(
    iconName, center, 
    treatment.enclosure !== 'none' ? 38 * scaleVariation : 45 * scaleVariation, 
    iconFill, iconStroke, treatment.strokeWidth,
    iconRotation, accentColor, style
  );

  // Step 7: Render text
  const textY = treatment.enclosure !== 'none' ? center + 55 : center + 55;
  const fontSize = businessName.length > 12 ? 14 : businessName.length > 8 ? 16 : 18;
  
  // Use dark color for text, or contrast text for enclosed styles
  const textColor = darkColor || '#1A1A2E';

  svgContent += `
    <text x="${center}" y="${textY}" 
      text-anchor="middle" 
      font-family="'${headingFont}', sans-serif" 
      font-weight="700"
      font-size="${fontSize}" 
      fill="${textColor}"
      letter-spacing="${style === 'Luxury' ? '3' : style === 'Minimal' ? '2' : '1'}"
    >${businessName.toUpperCase()}</text>`;

  // Assemble complete SVG
  const svgString = `<svg xmlns="${SVG_NS}" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">
  <defs>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${accentColor};stop-opacity:1" />
    </linearGradient>
  </defs>
  ${svgContent}
</svg>`;

  return {
    svgString,
    initials,
    iconName,
    styleTreatment: treatment.description,
    industry: industryConfig.symbolism
  };
}

/**
 * Render the enclosure/background shape.
 * Enclosures frame the icon to create a contained, badge-like appearance.
 */
function renderEnclosure(type, center, size, primaryColor, darkColor, treatment, style) {
  const { h, s, l } = hexToHSL(primaryColor);
  const lightBg = hslToHex(h, Math.max(s - 40, 5), Math.min(l + 35, 95));
  
  switch (type) {
    case 'circle':
      return `<circle cx="${center}" cy="${center - 10}" r="55" 
        fill="${lightBg}" stroke="${primaryColor}" stroke-width="${treatment.strokeWidth}" opacity="0.15"/>`;
    
    case 'badge':
      // Badge: rounded rectangle with decorative border
      return `
        <rect x="${center - 55}" y="${center - 55}" width="110" height="90" rx="8" ry="8"
          fill="none" stroke="${primaryColor}" stroke-width="${treatment.strokeWidth}" opacity="0.3"/>
        <line x1="${center - 45}" y1="${center - 25}" x2="${center + 45}" y2="${center - 25}" 
          stroke="${primaryColor}" stroke-width="0.5" opacity="0.3"/>`;
    
    case 'square':
      return `<rect x="${center - 55}" y="${center - 55}" width="110" height="90" rx="${treatment.cornerRadius}" ry="${treatment.cornerRadius}"
        fill="${primaryColor}" opacity="0.1"/>`;
    
    default:
      return '';
  }
}

/**
 * Render an industry-specific icon as SVG elements.
 * 
 * Each icon is built from basic geometric primitives (circles, paths, polygons)
 * positioned relative to the center point. This demonstrates key Computer Graphics
 * concepts: coordinate transformations, path construction, and shape composition.
 * 
 * @param {string} name - Icon identifier
 * @param {number} cx - Center X coordinate
 * @param {number} cy - Center Y coordinate (adjusted for layout)
 * @param {number} size - Icon size (radius or half-width)
 * @param {string} fill - Fill color
 * @param {string} stroke - Stroke color
 * @param {number} strokeWidth - Stroke width
 * @param {number} rotation - Rotation in degrees
 * @param {string} accentColor - Secondary color for multi-color icons
 * @param {string} style - Brand style for additional treatment
 */
function renderIcon(name, cx, cy, size, fill, stroke, strokeWidth, rotation, accentColor, style) {
  // Adjust cy to center the icon above the text
  cy = cy - 15;
  
  // Apply rotation transform to the group
  const transform = rotation !== 0 ? `transform="rotate(${rotation}, ${cx}, ${cy})"` : '';
  const useGradient = style === 'Modern/Tech';
  const fillAttr = useGradient ? 'url(#logoGradient)' : fill;
  
  let iconSvg = '';

  switch (name) {
    // ===== TECH INDUSTRY ICONS =====
    case 'hexagon': {
      /**
       * HEXAGON: Six-sided regular polygon
       * Points calculated using parametric circle equation:
       *   x = cx + r * cos(angle), y = cy + r * sin(angle)
       * where angle = (60° × i) - 30° for flat-top orientation
       */
      const points = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6; // Start at -30° for flat top
        points.push(`${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`);
      }
      iconSvg = `<polygon points="${points.join(' ')}" fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      // Inner detail: smaller hexagon
      const innerPoints = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        innerPoints.push(`${cx + size * 0.5 * Math.cos(angle)},${cy + size * 0.5 * Math.sin(angle)}`);
      }
      iconSvg += `<polygon points="${innerPoints.join(' ')}" fill="none" stroke="${stroke || fillAttr}" stroke-width="${strokeWidth * 0.5}" ${transform} opacity="0.5"/>`;
      break;
    }
    
    case 'circuit': {
      /**
       * CIRCUIT NODE: A central circle with radiating lines
       * Represents connectivity and technology networks
       */
      iconSvg = `<circle cx="${cx}" cy="${cy}" r="${size * 0.3}" fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      // Radiating connection lines
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i + Math.PI / 4;
        const x2 = cx + size * 0.85 * Math.cos(angle);
        const y2 = cy + size * 0.85 * Math.sin(angle);
        iconSvg += `<line x1="${cx + size * 0.35 * Math.cos(angle)}" y1="${cy + size * 0.35 * Math.sin(angle)}" x2="${x2}" y2="${y2}" stroke="${stroke || fillAttr}" stroke-width="${strokeWidth}" ${transform}/>`;
        iconSvg += `<circle cx="${x2}" cy="${y2}" r="${size * 0.08}" fill="${accentColor}" ${transform}/>`;
      }
      break;
    }
    
    case 'diamond-grid': {
      /**
       * DIAMOND GRID: Rotated squares arranged in a pattern
       * Represents data structure and digital systems
       */
      const s2 = size * 0.35;
      iconSvg = `<rect x="${cx - s2}" y="${cy - s2}" width="${s2 * 2}" height="${s2 * 2}" fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" transform="rotate(45, ${cx}, ${cy})"/>`;
      iconSvg += `<rect x="${cx - s2 * 0.5}" y="${cy - s2 * 0.5}" width="${s2}" height="${s2}" fill="none" stroke="${stroke || accentColor}" stroke-width="${strokeWidth * 0.7}" transform="rotate(45, ${cx}, ${cy})" opacity="0.6"/>`;
      break;
    }

    // ===== FOOD & BEVERAGE ICONS =====
    case 'circle': {
      iconSvg = `<circle cx="${cx}" cy="${cy}" r="${size * 0.7}" fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      iconSvg += `<circle cx="${cx}" cy="${cy}" r="${size * 0.45}" fill="none" stroke="${stroke || accentColor}" stroke-width="${strokeWidth * 0.7}" ${transform} opacity="0.5"/>`;
      break;
    }
    
    case 'leaf': {
      /**
       * LEAF: Organic curve using quadratic Bézier curves
       * Q command: quadratic Bézier with one control point
       * Creates a natural, organic form representing freshness
       */
      const ls = size * 0.8;
      iconSvg = `<path d="M${cx} ${cy - ls} Q${cx + ls} ${cy - ls * 0.3} ${cx} ${cy + ls * 0.5} Q${cx - ls} ${cy - ls * 0.3} ${cx} ${cy - ls}" 
        fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      // Leaf vein (center line)
      iconSvg += `<line x1="${cx}" y1="${cy - ls * 0.7}" x2="${cx}" y2="${cy + ls * 0.3}" stroke="${stroke || accentColor}" stroke-width="${strokeWidth * 0.5}" ${transform} opacity="0.5"/>`;
      break;
    }
    
    case 'drop': {
      /**
       * DROP: Water drop shape using cubic Bézier curves
       * Represents beverages and fluidity
       */
      const ds = size * 0.75;
      iconSvg = `<path d="M${cx} ${cy - ds} Q${cx + ds * 0.6} ${cy} ${cx} ${cy + ds * 0.7} Q${cx - ds * 0.6} ${cy} ${cx} ${cy - ds}" 
        fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      break;
    }

    // ===== FASHION ICONS =====
    case 'diamond': {
      const ds = size * 0.7;
      iconSvg = `<polygon points="${cx},${cy - ds} ${cx + ds * 0.6},${cy} ${cx},${cy + ds} ${cx - ds * 0.6},${cy}" 
        fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      break;
    }
    
    case 'abstract-line': {
      /**
       * ABSTRACT LINES: Flowing curves representing fabric/elegance
       * Uses cubic Bézier curves (C command) for smooth, sweeping lines
       */
      const al = size * 0.8;
      iconSvg = `<path d="M${cx - al} ${cy - al * 0.3} C${cx - al * 0.3} ${cy - al} ${cx + al * 0.3} ${cy + al} ${cx + al} ${cy + al * 0.3}" 
        fill="none" stroke="${stroke || fillAttr}" stroke-width="${strokeWidth * 1.5}" stroke-linecap="round" ${transform}/>`;
      iconSvg += `<path d="M${cx - al * 0.7} ${cy + al * 0.2} C${cx - al * 0.1} ${cy - al * 0.5} ${cx + al * 0.1} ${cy + al * 0.5} ${cx + al * 0.7} ${cy - al * 0.2}" 
        fill="none" stroke="${accentColor}" stroke-width="${strokeWidth}" stroke-linecap="round" ${transform} opacity="0.6"/>`;
      break;
    }
    
    case 'triangle-pair': {
      const ts = size * 0.5;
      iconSvg = `<polygon points="${cx - ts},${cy + ts * 0.7} ${cx},${cy - ts} ${cx + ts},${cy + ts * 0.7}" 
        fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      iconSvg += `<polygon points="${cx - ts * 0.5},${cy + ts * 0.35} ${cx},${cy - ts * 0.5} ${cx + ts * 0.5},${cy + ts * 0.35}" 
        fill="none" stroke="${accentColor}" stroke-width="${strokeWidth * 0.6}" ${transform} opacity="0.5"/>`;
      break;
    }

    // ===== HEALTHCARE ICONS =====
    case 'cross': {
      /**
       * MEDICAL CROSS: Two overlapping rectangles
       * Universal healthcare symbol built from rectangle primitives
       */
      const cs = size * 0.25;
      const cl = size * 0.7;
      iconSvg = `<rect x="${cx - cs}" y="${cy - cl}" width="${cs * 2}" height="${cl * 2}" rx="${strokeWidth}" fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      iconSvg += `<rect x="${cx - cl}" y="${cy - cs}" width="${cl * 2}" height="${cs * 2}" rx="${strokeWidth}" fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      break;
    }
    
    case 'shield': {
      const ss = size * 0.7;
      iconSvg = `<path d="M${cx} ${cy - ss} L${cx + ss * 0.7} ${cy - ss * 0.4} L${cx + ss * 0.7} ${cy + ss * 0.2} Q${cx + ss * 0.5} ${cy + ss} ${cx} ${cy + ss} Q${cx - ss * 0.5} ${cy + ss} ${cx - ss * 0.7} ${cy + ss * 0.2} L${cx - ss * 0.7} ${cy - ss * 0.4} Z" 
        fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      break;
    }
    
    case 'heart': {
      const hs = size * 0.6;
      iconSvg = `<path d="M${cx} ${cy + hs * 0.8} C${cx - hs * 1.5} ${cy - hs * 0.2} ${cx - hs * 0.5} ${cy - hs * 1.2} ${cx} ${cy - hs * 0.3} C${cx + hs * 0.5} ${cy - hs * 1.2} ${cx + hs * 1.5} ${cy - hs * 0.2} ${cx} ${cy + hs * 0.8} Z" 
        fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      break;
    }

    // ===== FINANCE ICONS =====
    case 'triangle-up': {
      const ts = size * 0.7;
      iconSvg = `<polygon points="${cx},${cy - ts} ${cx + ts * 0.85},${cy + ts * 0.5} ${cx - ts * 0.85},${cy + ts * 0.5}" 
        fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      iconSvg += `<polygon points="${cx},${cy - ts * 0.45} ${cx + ts * 0.45},${cy + ts * 0.25} ${cx - ts * 0.45},${cy + ts * 0.25}" 
        fill="none" stroke="${stroke || accentColor}" stroke-width="${strokeWidth * 0.5}" ${transform} opacity="0.5"/>`;
      break;
    }
    
    case 'bar-chart': {
      const bw = size * 0.2;
      const gap = size * 0.08;
      const heights = [0.5, 0.8, 0.6, 1.0];
      const startX = cx - (heights.length * (bw + gap)) / 2;
      heights.forEach((h, i) => {
        const barH = size * h;
        const bx = startX + i * (bw + gap);
        iconSvg += `<rect x="${bx}" y="${cy + size * 0.5 - barH}" width="${bw}" height="${barH}" rx="2"
          fill="${i === 3 ? accentColor : fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth * 0.5}" ${transform}/>`;
      });
      break;
    }
    
    case 'arrow-up': {
      const as = size * 0.7;
      iconSvg = `<path d="M${cx} ${cy - as} L${cx + as * 0.5} ${cy} L${cx + as * 0.2} ${cy} L${cx + as * 0.2} ${cy + as * 0.6} L${cx - as * 0.2} ${cy + as * 0.6} L${cx - as * 0.2} ${cy} L${cx - as * 0.5} ${cy} Z" 
        fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      break;
    }

    // ===== EDUCATION ICONS =====
    case 'book': {
      const bs = size * 0.6;
      iconSvg = `<path d="M${cx - bs} ${cy - bs * 0.8} L${cx} ${cy - bs * 0.5} L${cx + bs} ${cy - bs * 0.8} L${cx + bs} ${cy + bs * 0.5} L${cx} ${cy + bs * 0.8} L${cx - bs} ${cy + bs * 0.5} Z" 
        fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      iconSvg += `<line x1="${cx}" y1="${cy - bs * 0.5}" x2="${cx}" y2="${cy + bs * 0.8}" stroke="${stroke || accentColor}" stroke-width="${strokeWidth}" ${transform}/>`;
      break;
    }
    
    case 'mortarboard': {
      const ms = size * 0.8;
      iconSvg = `<polygon points="${cx},${cy - ms * 0.3} ${cx + ms},${cy} ${cx},${cy + ms * 0.3} ${cx - ms},${cy}" 
        fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      iconSvg += `<line x1="${cx + ms * 0.6}" y1="${cy}" x2="${cx + ms * 0.6}" y2="${cy + ms * 0.6}" stroke="${stroke || fillAttr}" stroke-width="${strokeWidth}" ${transform}/>`;
      iconSvg += `<circle cx="${cx + ms * 0.6}" cy="${cy + ms * 0.65}" r="${ms * 0.06}" fill="${accentColor}" ${transform}/>`;
      break;
    }
    
    case 'lightbulb': {
      const ls = size * 0.5;
      iconSvg = `<circle cx="${cx}" cy="${cy - ls * 0.2}" r="${ls}" fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      iconSvg += `<rect x="${cx - ls * 0.35}" y="${cy + ls * 0.6}" width="${ls * 0.7}" height="${ls * 0.4}" rx="2" fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      // Filament lines
      iconSvg += `<path d="M${cx - ls * 0.2} ${cy + ls * 0.5} Q${cx} ${cy - ls * 0.3} ${cx + ls * 0.2} ${cy + ls * 0.5}" fill="none" stroke="${accentColor}" stroke-width="${strokeWidth * 0.5}" ${transform} opacity="0.6"/>`;
      break;
    }

    // ===== FITNESS ICONS =====
    case 'lightning': {
      const ls = size * 0.8;
      iconSvg = `<polygon points="${cx + ls * 0.1},${cy - ls} ${cx - ls * 0.3},${cy} ${cx + ls * 0.05},${cy} ${cx - ls * 0.1},${cy + ls} ${cx + ls * 0.3},${cy - ls * 0.1} ${cx - ls * 0.05},${cy - ls * 0.1}" 
        fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      break;
    }
    
    case 'dumbbell': {
      const ds = size * 0.8;
      iconSvg += `<rect x="${cx - ds}" y="${cy - ds * 0.25}" width="${ds * 0.3}" height="${ds * 0.5}" rx="3" fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      iconSvg += `<rect x="${cx + ds * 0.7}" y="${cy - ds * 0.25}" width="${ds * 0.3}" height="${ds * 0.5}" rx="3" fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      iconSvg += `<rect x="${cx - ds * 0.65}" y="${cy - ds * 0.08}" width="${ds * 1.3}" height="${ds * 0.16}" rx="2" fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth * 0.5}" ${transform}/>`;
      break;
    }
    
    case 'pulse': {
      const ps = size * 0.8;
      iconSvg = `<polyline points="${cx - ps},${cy} ${cx - ps * 0.5},${cy} ${cx - ps * 0.3},${cy - ps * 0.6} ${cx},${cy + ps * 0.4} ${cx + ps * 0.2},${cy - ps * 0.3} ${cx + ps * 0.4},${cy} ${cx + ps},${cy}" 
        fill="none" stroke="${stroke || fillAttr}" stroke-width="${strokeWidth * 1.5}" stroke-linecap="round" stroke-linejoin="round" ${transform}/>`;
      break;
    }

    // ===== BEAUTY ICONS =====
    case 'petal': {
      /**
       * FLOWER PETALS: Multiple ellipses rotated around center
       * Uses CSS transform-origin for rotation around the center point
       * Each petal is an ellipse rotated by 60° increments
       */
      for (let i = 0; i < 6; i++) {
        const angle = i * 60;
        iconSvg += `<ellipse cx="${cx}" cy="${cy - size * 0.35}" rx="${size * 0.15}" ry="${size * 0.35}" 
          fill="${i % 2 === 0 ? fillAttr : accentColor}" stroke="${stroke}" stroke-width="${strokeWidth * 0.5}" 
          transform="rotate(${angle}, ${cx}, ${cy})" opacity="${i % 2 === 0 ? 0.8 : 0.5}"/>`;
      }
      iconSvg += `<circle cx="${cx}" cy="${cy}" r="${size * 0.12}" fill="${accentColor}" stroke="${stroke}" stroke-width="${strokeWidth * 0.5}"/>`;
      break;
    }
    
    case 'mirror': {
      const ms = size * 0.5;
      iconSvg = `<ellipse cx="${cx}" cy="${cy - ms * 0.3}" rx="${ms * 0.7}" ry="${ms}" fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      iconSvg += `<line x1="${cx}" y1="${cy + ms * 0.7}" x2="${cx}" y2="${cy + ms * 1.3}" stroke="${stroke || fillAttr}" stroke-width="${strokeWidth * 1.5}" ${transform}/>`;
      iconSvg += `<line x1="${cx - ms * 0.4}" y1="${cy + ms * 1.3}" x2="${cx + ms * 0.4}" y2="${cy + ms * 1.3}" stroke="${stroke || fillAttr}" stroke-width="${strokeWidth}" ${transform}/>`;
      break;
    }
    
    case 'star-burst': {
      const rs = size * 0.7;
      const innerR = rs * 0.4;
      const points = [];
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI / 4) * i - Math.PI / 2;
        const r = i % 2 === 0 ? rs : innerR;
        points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
      }
      iconSvg = `<polygon points="${points.join(' ')}" fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      break;
    }

    // ===== REAL ESTATE ICONS =====
    case 'house': {
      const hs = size * 0.6;
      // Roof (triangle)
      iconSvg = `<polygon points="${cx},${cy - hs} ${cx + hs},${cy} ${cx - hs},${cy}" fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      // Body (rectangle)
      iconSvg += `<rect x="${cx - hs * 0.7}" y="${cy}" width="${hs * 1.4}" height="${hs}" fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      // Door
      iconSvg += `<rect x="${cx - hs * 0.2}" y="${cy + hs * 0.35}" width="${hs * 0.4}" height="${hs * 0.65}" fill="${accentColor}" stroke="${stroke}" stroke-width="${strokeWidth * 0.5}" ${transform} opacity="0.5"/>`;
      break;
    }
    
    case 'building': {
      const bs = size * 0.5;
      iconSvg = `<rect x="${cx - bs * 0.8}" y="${cy - bs * 1.2}" width="${bs * 0.9}" height="${bs * 2.2}" fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
      iconSvg += `<rect x="${cx + bs * 0.05}" y="${cy - bs * 0.6}" width="${bs * 0.7}" height="${bs * 1.6}" fill="${accentColor}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform} opacity="0.7"/>`;
      // Windows
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 2; c++) {
          iconSvg += `<rect x="${cx - bs * 0.6 + c * bs * 0.35}" y="${cy - bs + r * bs * 0.5}" width="${bs * 0.2}" height="${bs * 0.25}" fill="${stroke || accentColor}" opacity="0.3" ${transform}/>`;
        }
      }
      break;
    }
    
    case 'key': {
      const ks = size * 0.6;
      iconSvg = `<circle cx="${cx - ks * 0.3}" cy="${cy - ks * 0.1}" r="${ks * 0.5}" fill="none" stroke="${stroke || fillAttr}" stroke-width="${strokeWidth * 1.2}" ${transform}/>`;
      iconSvg += `<line x1="${cx}" y1="${cy - ks * 0.1}" x2="${cx + ks}" y2="${cy - ks * 0.1}" stroke="${stroke || fillAttr}" stroke-width="${strokeWidth}" ${transform}/>`;
      iconSvg += `<line x1="${cx + ks * 0.7}" y1="${cy - ks * 0.1}" x2="${cx + ks * 0.7}" y2="${cy + ks * 0.2}" stroke="${stroke || fillAttr}" stroke-width="${strokeWidth}" ${transform}/>`;
      iconSvg += `<line x1="${cx + ks}" y1="${cy - ks * 0.1}" x2="${cx + ks}" y2="${cy + ks * 0.25}" stroke="${stroke || fillAttr}" stroke-width="${strokeWidth}" ${transform}/>`;
      break;
    }

    // ===== OTHER / GENERIC ICONS =====
    case 'abstract-geo': {
      const gs = size * 0.5;
      iconSvg = `<rect x="${cx - gs}" y="${cy - gs}" width="${gs * 1.3}" height="${gs * 1.3}" fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" transform="rotate(15, ${cx}, ${cy})"/>`;
      iconSvg += `<circle cx="${cx + gs * 0.3}" cy="${cy + gs * 0.2}" r="${gs * 0.5}" fill="${accentColor}" stroke="${stroke}" stroke-width="${strokeWidth * 0.5}" opacity="0.6"/>`;
      break;
    }
    
    case 'circle-ring': {
      iconSvg = `<circle cx="${cx}" cy="${cy}" r="${size * 0.65}" fill="none" stroke="${stroke || fillAttr}" stroke-width="${strokeWidth * 2}" ${transform}/>`;
      iconSvg += `<circle cx="${cx}" cy="${cy}" r="${size * 0.35}" fill="${fillAttr || accentColor}" stroke="none" ${transform} opacity="0.3"/>`;
      break;
    }
    
    case 'square-rotate': {
      const sr = size * 0.45;
      iconSvg = `<rect x="${cx - sr}" y="${cy - sr}" width="${sr * 2}" height="${sr * 2}" fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" transform="rotate(45, ${cx}, ${cy})"/>`;
      iconSvg += `<rect x="${cx - sr * 0.5}" y="${cy - sr * 0.5}" width="${sr}" height="${sr}" fill="none" stroke="${stroke || accentColor}" stroke-width="${strokeWidth * 0.7}" transform="rotate(45, ${cx}, ${cy})" opacity="0.5"/>`;
      break;
    }
    
    default: {
      // Fallback: simple circle
      iconSvg = `<circle cx="${cx}" cy="${cy}" r="${size * 0.5}" fill="${fillAttr}" stroke="${stroke}" stroke-width="${strokeWidth}" ${transform}/>`;
    }
  }

  return iconSvg;
}
