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
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm">
            🎨
          </div>
          <h2 className="text-xl font-bold text-white">Color Palette</h2>
        </div>
        <span className="text-xs font-medium text-gray-400 bg-white/5 px-3 py-1 rounded-full">
          {palette.schemeName} Scheme
        </span>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        {/* Main Color Swatches */}
        <div className="flex rounded-xl overflow-hidden mb-6 shadow-lg">
          {colorEntries.map(({ key }) => (
            <div
              key={key}
              className="flex-1 h-24 cursor-pointer transition-all duration-200 hover:flex-[1.3] relative group"
              style={{ backgroundColor: palette.colors[key] }}
              onClick={() => handleCopy(palette.colors[key], key)}
              title={`Click to copy ${palette.colors[key]}`}
            >
              {/* Copy feedback overlay */}
              {copiedColor === key && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">Copied!</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Color Details Grid */}
        <div className="grid grid-cols-5 gap-3">
          {colorEntries.map(({ key, label }) => {
            const hex = palette.colors[key];
            const textColor = getContrastText(hex);
            return (
              <button
                key={key}
                onClick={() => handleCopy(hex, key)}
                className="text-center space-y-2 p-3 rounded-lg hover:bg-white/5 transition-all duration-200 cursor-pointer"
              >
                <div
                  className="w-full h-12 rounded-lg shadow-sm border border-white/10"
                  style={{ backgroundColor: hex }}
                />
                <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  {label}
                </div>
                <div className="text-xs font-mono text-gray-400">
                  {hex}
                </div>
              </button>
            );
          })}
        </div>

        {/* Color descriptions */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-xs text-gray-500 text-center">
            Click any swatch to copy the hex code • {palette.schemeName} scheme selected for {palette.scheme === 'monochromatic' ? 'cohesive, professional' : palette.scheme === 'triadic' ? 'vibrant, energetic' : palette.scheme === 'analogous' ? 'harmonious, sophisticated' : palette.scheme === 'analogous-muted' ? 'warm, nostalgic' : 'bold, high-contrast'} feel
          </p>
        </div>
      </div>
    </div>
  );
}
