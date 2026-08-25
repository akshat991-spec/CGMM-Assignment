/**
 * SocialMediaTemplate.jsx — Social Media Post Template Component
 * 
 * Renders an Instagram-sized (1080×1080) social media post template
 * using HTML5 Canvas and the generated brand identity.
 */

import { useRef, useEffect, useState } from 'react';
import { renderSocialTemplate } from '../lib/generators/socialTemplateRenderer';
import { downloadPng } from '../lib/exportUtils';
import { loadGoogleFont } from '../lib/canvasUtils';

/**
 * SocialMediaTemplate Component
 * 
 * @param {Object} props
 * @param {string} props.businessName - Business name
 * @param {Object} props.palette - Color palette
 * @param {Object} props.typography - Typography pairing
 * @param {string} props.svgDataUrl - Logo data URL
 * @param {string} props.style - Brand style
 * @param {Function} props.onCanvasReady - Callback with canvas element for zip export
 */
export default function SocialMediaTemplate({ businessName, palette, typography, svgDataUrl, style, onCanvasReady }) {
  const canvasRef = useRef(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (!businessName || !palette || !typography) return;
    let isMounted = true;

    const render = async () => {
      setIsRendered(false);
      // Ensure fonts are loaded before canvas rendering
      await loadGoogleFont(typography.heading.family, typography.heading.weight);
      await loadGoogleFont(typography.body.family, typography.body.weight);
      await new Promise(resolve => setTimeout(resolve, 200));

      if (!isMounted || !canvasRef.current) return;

      renderSocialTemplate({
        businessName,
        svgDataUrl,
        palette,
        typography,
        style
      }, canvasRef.current);

      setIsRendered(true);
      
      if (onCanvasReady) onCanvasReady(canvasRef.current);
    };

    render();
    return () => { isMounted = false; };
  }, [businessName, palette, typography, svgDataUrl, style]);

  const handleDownload = () => {
    if (canvasRef.current) {
      downloadPng(canvasRef.current, 'social-media-template.png');
    }
  };

  if (!businessName || !palette || !typography) return null;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 text-sm">
          📱
        </div>
        <h2 className="text-xl font-bold text-white">Social Media Template</h2>
        <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">1080×1080</span>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        {/* Canvas Container */}
        <div className="mb-4 rounded-xl overflow-hidden max-w-lg mx-auto relative">
          <canvas
            ref={canvasRef}
            className={`w-full h-auto rounded-xl shadow-lg transition-opacity duration-300 ${isRendered ? 'opacity-100' : 'opacity-0'}`}
          />
          {!isRendered && (
            <div className="h-64 flex items-center justify-center text-gray-500 bg-white/5 rounded-xl">
              <svg className="animate-spin h-6 w-6 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Rendering social template...
            </div>
          )}
        </div>

        {/* Download Button */}
        {isRendered && (
          <div className="flex justify-center">
            <button
              onClick={handleDownload}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg 
                text-sm font-medium text-white transition-all duration-200 cursor-pointer
                hover:border-white/20"
            >
              ⬇ Download Social Template PNG
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
