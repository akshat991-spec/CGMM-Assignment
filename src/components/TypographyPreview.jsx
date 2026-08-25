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
    <div className="space-y-4 animate-on-mount stagger-3">
      {/* Section Header */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-sm shadow-[0_0_10px_rgba(16,185,129,0.1)]">
          🔤
        </div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">Typography</h2>
      </div>

      <div className="glass-card rounded-3xl p-8 space-y-8">
        {/* Font Pairing Preview */}
        <div className="bg-slate-50 rounded-2xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200">
          {/* Heading font preview */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-1 bg-slate-200 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-widest">Heading</span>
              <span className="text-xs font-mono text-slate-400">{typography.heading.family} ({typography.heading.weight})</span>
            </div>
            <h3
              className="text-5xl text-slate-900 leading-[1.1] tracking-tight"
              style={{
                fontFamily: `'${typography.heading.family}', sans-serif`,
                fontWeight: typography.heading.weight
              }}
            >
              {businessName}
            </h3>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 my-8"></div>

          {/* Body font preview */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-1 bg-slate-200 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-widest">Body</span>
              <span className="text-xs font-mono text-slate-400">{typography.body.family} ({typography.body.weight})</span>
            </div>
            <p
              className="text-lg text-slate-600 leading-relaxed max-w-lg"
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
          <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-200 shadow-sm">
            <h4
              className="text-2xl text-slate-900 mb-3"
              style={{
                fontFamily: `'${typography.heading.family}', sans-serif`,
                fontWeight: typography.heading.weight
              }}
            >
              Why Choose {businessName}?
            </h4>
            <p
              className="text-base text-slate-600 leading-relaxed"
              style={{
                fontFamily: `'${typography.body.family}', sans-serif`,
                fontWeight: typography.body.weight
              }}
            >
              Our team of experts combines creativity with strategy to deliver 
              results that exceed expectations. Every project tells a unique story 
              and we are here to help you tell yours with clarity and purpose.
            </p>
          </div>
        </div>

        {/* Rationale & Info Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/30 rounded-2xl p-5 border border-slate-700/50">
            <p className="text-[11px] text-slate-400 uppercase tracking-widest mb-2 font-bold flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Why this pairing?
            </p>
            <p className="text-[13px] text-slate-300 leading-relaxed font-medium">
              {typography.rationale}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/30 rounded-2xl p-5 border border-slate-700/50 hover:bg-slate-700/40 transition-colors group">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Heading Font</p>
              <p className="text-slate-100 font-bold group-hover:text-emerald-400 transition-colors truncate" title={typography.heading.family}>{typography.heading.family}</p>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">W: {typography.heading.weight}</p>
            </div>
            <div className="bg-slate-800/30 rounded-2xl p-5 border border-slate-700/50 hover:bg-slate-700/40 transition-colors group">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Body Font</p>
              <p className="text-slate-100 font-bold group-hover:text-emerald-400 transition-colors truncate" title={typography.body.family}>{typography.body.family}</p>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">W: {typography.body.weight}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
