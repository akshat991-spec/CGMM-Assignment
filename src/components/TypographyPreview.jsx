/**
 * TypographyPreview.jsx — Typography Pairing Preview Component
 * 
 * Displays the selected heading + body font pairing with:
 * - Live preview of fonts applied to the business name
 * - Font family names and weights
 * - Pairing rationale explanation
 * - Dynamic Google Font loading
 */

import { useEffect } from 'react';
import { loadGoogleFont } from '../lib/canvasUtils';

/**
 * TypographyPreview Component
 * 
 * @param {Object} props
 * @param {Object} props.typography - Typography pairing from typographyGenerator
 * @param {string} props.businessName - Business name for preview text
 */
export default function TypographyPreview({ typography, businessName }) {
  /**
   * Dynamically load Google Fonts when the typography selection changes.
   * This ensures fonts are available for both DOM rendering and Canvas usage.
   */
  useEffect(() => {
    if (typography) {
      loadGoogleFont(typography.heading.family, typography.heading.weight);
      loadGoogleFont(typography.body.family, typography.body.weight);
    }
  }, [typography]);

  if (!typography) return null;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 text-sm">
          🔤
        </div>
        <h2 className="text-xl font-bold text-white">Typography</h2>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-6">
        {/* Font Pairing Preview */}
        <div className="bg-white rounded-xl p-8 space-y-4">
          {/* Heading font preview */}
          <div>
            <p className="text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">
              Heading — {typography.heading.family} ({typography.heading.weight})
            </p>
            <h3
              className="text-4xl text-gray-900 leading-tight"
              style={{
                fontFamily: `'${typography.heading.family}', sans-serif`,
                fontWeight: typography.heading.weight
              }}
            >
              {businessName}
            </h3>
          </div>

          {/* Divider */}
          <hr className="border-gray-200" />

          {/* Body font preview */}
          <div>
            <p className="text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">
              Body — {typography.body.family} ({typography.body.weight})
            </p>
            <p
              className="text-lg text-gray-700 leading-relaxed"
              style={{
                fontFamily: `'${typography.body.family}', sans-serif`,
                fontWeight: typography.body.weight
              }}
            >
              Building innovative solutions for tomorrow's challenges. 
              We believe in the power of great design to transform businesses 
              and create lasting impressions.
            </p>
          </div>

          {/* Combined preview */}
          <div className="bg-gray-50 rounded-lg p-6 mt-4">
            <h4
              className="text-2xl text-gray-900 mb-2"
              style={{
                fontFamily: `'${typography.heading.family}', sans-serif`,
                fontWeight: typography.heading.weight
              }}
            >
              Why Choose {businessName}?
            </h4>
            <p
              className="text-base text-gray-600"
              style={{
                fontFamily: `'${typography.body.family}', sans-serif`,
                fontWeight: typography.body.weight
              }}
            >
              Our team of experts combines creativity with strategy to deliver 
              results that exceed expectations. Every project tells a unique story.
            </p>
          </div>
        </div>

        {/* Rationale */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">
            Why this pairing?
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            {typography.rationale}
          </p>
        </div>

        {/* Font Info Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Heading Font</p>
            <p className="text-white font-semibold">{typography.heading.family}</p>
            <p className="text-xs text-gray-400 mt-1">Weight: {typography.heading.weight}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Body Font</p>
            <p className="text-white font-semibold">{typography.body.family}</p>
            <p className="text-xs text-gray-400 mt-1">Weight: {typography.body.weight}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
