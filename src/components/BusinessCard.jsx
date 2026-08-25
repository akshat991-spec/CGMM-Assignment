/**
 * BusinessCard.jsx — Business Card Mockup Component
 * 
 * Renders the business card mockup using HTML5 Canvas and provides
 * a download button for the PNG export. The card is rendered once the
 * brand identity is generated and fonts are loaded.
 */

import { useRef, useEffect, useState } from 'react';
import { renderBusinessCard } from '../lib/generators/businessCardRenderer';
import { downloadPng } from '../lib/exportUtils';
import { loadGoogleFont } from '../lib/canvasUtils';

/**
 * BusinessCard Component
 * 
 * @param {Object} props
 * @param {string} props.businessName - Business name
 * @param {Object} props.palette - Color palette
 * @param {Object} props.typography - Typography pairing
 * @param {string} props.svgDataUrl - Logo data URL
 * @param {string} props.style - Brand style
 * @param {Function} props.onCanvasReady - Callback with canvas element for zip export
 */
export default function BusinessCard({ businessName, palette, typography, svgDataUrl, style, onCanvasReady }) {
  const canvasRef = useRef(null);
  const [isRendered, setIsRendered] = useState(false);

  /**
   * Render the business card when all dependencies are ready.
   * We wait for fonts to load before rendering to ensure
   * proper text rendering on the canvas.
   */
  useEffect(() => {
    if (!businessName || !palette || !typography) return;
    let isMounted = true;

    const render = async () => {
      setIsRendered(false);
      // Ensure fonts are loaded for canvas rendering
      await loadGoogleFont(typography.heading.family, typography.heading.weight);
      await loadGoogleFont(typography.body.family, typography.body.weight);
      
      // Small additional delay for font readiness
      await new Promise(resolve => setTimeout(resolve, 200));

      if (!isMounted || !canvasRef.current) return;

      renderBusinessCard({
        businessName,
        svgDataUrl,
        palette,
        typography,
        style
      }, canvasRef.current);

      setIsRendered(true);
      
      // Notify parent for zip export
      if (onCanvasReady) onCanvasReady(canvasRef.current);
    };

    render();
    return () => { isMounted = false; };
  }, [businessName, palette, typography, svgDataUrl, style]);

  const handleDownload = () => {
    if (canvasRef.current) {
      downloadPng(canvasRef.current, 'business-card.png');
    }
  };

  if (!businessName || !palette || !typography) return null;

  return (
    <div className="space-y-4 animate-on-mount stagger-4">
      {/* Section Header */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-sm shadow-[0_0_10px_rgba(245,158,11,0.1)]">
          💳
        </div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">Business Card</h2>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-8">
        {/* Canvas Container / Mockup Frame */}
        <div className="mb-6 bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-slate-700/50 shadow-inner relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
          
          <canvas
            ref={canvasRef}
            className={`w-full h-auto rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.4)] ring-1 ring-white/10 transition-all duration-700 ${isRendered ? 'opacity-100 transform translate-y-0 scale-100' : 'opacity-0 transform translate-y-4 scale-95'}`}
          />
          
          {!isRendered && (
            <div className="h-48 flex flex-col items-center justify-center text-slate-500 bg-slate-800/20 rounded-xl relative z-10">
              <svg className="animate-spin h-6 w-6 mb-3 text-amber-500/50" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Rendering Card...</span>
            </div>
          )}
        </div>

        {/* Download Button */}
        {isRendered && (
          <div className="flex justify-center">
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 rounded-xl 
                text-[13px] font-semibold text-white transition-all duration-200 cursor-pointer hover:shadow-lg flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PNG
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
