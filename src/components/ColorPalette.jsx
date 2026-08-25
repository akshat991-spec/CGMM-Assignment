/**
 * ColorPalette.jsx — Color Palette Display Component
 * 
 * Displays the generated 5-color brand palette with:
 * - Visual swatches with hex codes
 * - Color role labels (Primary, Secondary, etc.)
 * - Color scheme name (Monochromatic, Triadic, etc.)
 * - Click-to-copy hex value functionality
 */

import { useState } from 'react';
import { getContrastText } from '../lib/colorUtils';

/**
 * ColorPalette Component
 * 
 * @param {Object} props
 * @param {Object} props.palette - Generated palette from colorGenerator
 */
export default function ColorPalette({ palette }) {
  const [copiedColor, setCopiedColor] = useState(null);

  if (!palette) return null;

  const colorEntries = [
    { key: 'primary', label: 'Primary' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'accent', label: 'Accent' },
    { key: 'light', label: 'Light' },
    { key: 'dark', label: 'Dark' },
  ];

  /**
   * Copy hex value to clipboard with visual feedback.
   */
  const handleCopy = async (hex, key) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedColor(key);
      setTimeout(() => setCopiedColor(null), 1500);
    } catch {
      // Fallback for clipboard API failure
    }
  };

  return (
    <div className="space-y-4 animate-on-mount stagger-2">
      {/* Section Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-sm shadow-[0_0_10px_rgba(168,85,247,0.1)]">
            🎨
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Color Palette</h2>
        </div>
        <span className="text-[11px] font-bold text-slate-400 bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 rounded-full uppercase tracking-wider">
          {palette.schemeName} Scheme
        </span>
      </div>

      <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
        {/* Main Color Swatches */}
        <div className="flex rounded-2xl overflow-hidden mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.2)] h-28 border border-white/5">
          {colorEntries.map(({ key }) => (
            <div
              key={key}
              className="flex-1 cursor-pointer transition-all duration-300 ease-out hover:flex-[1.5] relative group"
              style={{ backgroundColor: palette.colors[key] }}
              onClick={() => handleCopy(palette.colors[key], key)}
              title={`Click to copy ${palette.colors[key]}`}
            >
              {/* Copy feedback overlay */}
              <div className={`absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-200 ${copiedColor === key ? 'opacity-100' : 'opacity-0'}`}>
                <span className="text-white text-xs font-bold tracking-wider uppercase">Copied!</span>
              </div>
            </div>
          ))}
        </div>

        {/* Color Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {colorEntries.map(({ key, label }) => {
            const hex = palette.colors[key];
            const textColor = getContrastText(hex);
            return (
              <button
                key={key}
                onClick={() => handleCopy(hex, key)}
                className="text-left sm:text-center space-y-3 p-4 rounded-2xl bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/50 transition-all duration-300 cursor-pointer group flex items-center sm:flex-col gap-4 sm:gap-0"
              >
                <div
                  className="w-12 h-12 sm:w-full sm:h-16 rounded-xl shadow-inner border border-white/10 group-hover:scale-105 transition-transform duration-300 flex-shrink-0"
                  style={{ backgroundColor: hex }}
                />
                <div className="flex-1 sm:w-full">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                    {label}
                  </div>
                  <div className="text-[13px] font-mono text-slate-200 group-hover:text-white transition-colors">
                    {hex.toUpperCase()}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Color descriptions */}
        <div className="mt-6 pt-4 border-t border-slate-700/50">
          <p className="text-[12px] font-medium text-slate-500 text-center">
            Click any swatch to copy the hex code • {palette.schemeName} scheme selected for a {palette.scheme === 'monochromatic' ? 'cohesive, professional' : palette.scheme === 'triadic' ? 'vibrant, energetic' : palette.scheme === 'analogous' ? 'harmonious, sophisticated' : palette.scheme === 'analogous-muted' ? 'warm, nostalgic' : 'bold, high-contrast'} feel
          </p>
        </div>
      </div>
    </div>
  );
}
