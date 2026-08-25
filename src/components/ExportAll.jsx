/**
 * ExportAll.jsx — Bulk Export Component
 * 
 * Provides a "Download All Assets" button that bundles all generated
 * brand identity assets into a single ZIP file for convenience.
 * 
 * Uses JSZip for client-side ZIP creation — no server needed.
 */

import { useState, useCallback } from 'react';
import { downloadAllAsZip } from '../lib/exportUtils';
import { renderSvgToCanvas } from '../lib/canvasUtils';

/**
 * ExportAll Component
 * 
 * @param {Object} props
 * @param {string} props.svgString - Logo SVG string
 * @param {Object} props.palette - Color palette
 * @param {HTMLCanvasElement} props.businessCardCanvas - Business card canvas
 * @param {HTMLCanvasElement} props.socialTemplateCanvas - Social template canvas
 * @param {string} props.businessName - Business name for zip filename
 */
export default function ExportAll({ svgString, palette, businessCardCanvas, socialTemplateCanvas, businessName }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportAll = useCallback(async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      // Get SVG element from the string
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
      const svgElement = svgDoc.documentElement;

      // Render logo to canvas for PNG export
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = svgString;
      const inlineSvg = tempContainer.querySelector('svg');
      
      let logoCanvas = null;
      if (inlineSvg) {
        logoCanvas = await renderSvgToCanvas(inlineSvg, 800, 800);
      }

      await downloadAllAsZip({
        svgElement,
        logoCanvas,
        palette,
        businessCardCanvas,
        socialTemplateCanvas,
        businessName
      });
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  }, [svgString, palette, businessCardCanvas, socialTemplateCanvas, businessName, isExporting]);

  const isReady = svgString && palette;

  if (!isReady) return null;

  return (
    <div className="mt-8">
      <button
        onClick={handleExportAll}
        disabled={isExporting}
        className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300
          ${isExporting
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98] cursor-pointer'
          }`}
      >
        {isExporting ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Creating ZIP...
          </span>
        ) : (
          '📦 Download All Assets (ZIP)'
        )}
      </button>
      <p className="text-xs text-gray-500 text-center mt-2">
        Includes: logo.svg, logo.png, color-palette.json, business-card.png, social-template.png
      </p>
    </div>
  );
}
