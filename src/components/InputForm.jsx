/**
 * InputForm.jsx — Brand Identity Input Form Component
 * 
 * This component collects all user inputs needed for brand identity generation:
 * - Business name
 * - Industry category
 * - Design style preference
 * - Base color selection
 * 
 * It features a modern glassmorphism design with smooth animations.
 */

import { useState } from 'react';

// Industry options mapped to semantic icons for visual feedback
const INDUSTRIES = [
  { value: 'Tech', label: '💻 Tech' },
  { value: 'Food & Beverage', label: '🍽️ Food & Beverage' },
  { value: 'Fashion', label: '👗 Fashion' },
  { value: 'Healthcare', label: '🏥 Healthcare' },
  { value: 'Finance', label: '💰 Finance' },
  { value: 'Education', label: '📚 Education' },
  { value: 'Fitness', label: '💪 Fitness' },
  { value: 'Beauty', label: '✨ Beauty' },
  { value: 'Real Estate', label: '🏠 Real Estate' },
  { value: 'Other', label: '🔮 Other' },
];

// Style options with descriptions
const STYLES = [
  { value: 'Minimal', label: 'Minimal', desc: 'Clean, simple, and refined' },
  { value: 'Playful', label: 'Playful', desc: 'Fun, energetic, and colorful' },
  { value: 'Luxury', label: 'Luxury', desc: 'Elegant, premium, and prestigious' },
  { value: 'Modern/Tech', label: 'Modern/Tech', desc: 'Sharp, innovative, and cutting-edge' },
  { value: 'Vintage', label: 'Vintage', desc: 'Classic, nostalgic, and timeless' },
  { value: 'Bold', label: 'Bold', desc: 'Strong, impactful, and commanding' },
];

// Preset color swatches for quick selection
const COLOR_PRESETS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#84CC16', // Lime
  '#A855F7', // Violet
];

/**
 * InputForm Component
 * 
 * @param {Object} props
 * @param {Function} props.onGenerate - Callback when form is submitted with all inputs
 * @param {boolean} props.isGenerating - Whether generation is in progress
 */
export default function InputForm({ onGenerate, isGenerating }) {
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('Tech');
  const [style, setStyle] = useState('Modern/Tech');
  const [color, setColor] = useState('#3B82F6');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    onGenerate({ businessName: businessName.trim(), industry, style, color });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Business Name Input */}
      <div className="space-y-2">
        <label htmlFor="businessName" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Business Name
        </label>
        <input
          id="businessName"
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="e.g., NovaTech, Bloom Café"
          className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
            transition-all duration-300 text-lg"
          required
          maxLength={30}
        />
      </div>

      {/* Industry Dropdown */}
      <div className="space-y-2">
        <label htmlFor="industry" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Industry
        </label>
        <select
          id="industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white 
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
            transition-all duration-300 text-lg appearance-none cursor-pointer"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239CA3AF'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '24px' }}
        >
          {INDUSTRIES.map(ind => (
            <option key={ind.value} value={ind.value} className="bg-gray-900">{ind.label}</option>
          ))}
        </select>
      </div>

      {/* Style Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Design Style
        </label>
        <div className="grid grid-cols-2 gap-3">
          {STYLES.map(s => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStyle(s.value)}
              className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer
                ${style === s.value
                  ? 'border-blue-500 bg-blue-500/15 ring-1 ring-blue-500/30'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
                }`}
            >
              <div className={`font-semibold text-sm ${style === s.value ? 'text-blue-400' : 'text-gray-200'}`}>
                {s.label}
              </div>
              <div className="text-xs text-gray-500 mt-1">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Picker */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Brand Color
        </label>
        
        {/* Color swatches */}
        <div className="flex flex-wrap gap-2 mb-3">
          {COLOR_PRESETS.map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => setColor(preset)}
              className={`w-9 h-9 rounded-lg transition-all duration-200 cursor-pointer
                ${color === preset 
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' 
                  : 'hover:scale-110'
                }`}
              style={{ backgroundColor: preset }}
              title={preset}
            />
          ))}
        </div>
        
        {/* Custom color picker */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              id="colorPicker"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-14 h-14 rounded-xl cursor-pointer border-2 border-white/10"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={color.toUpperCase()}
              onChange={(e) => {
                const val = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) setColor(val);
              }}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="#3B82F6"
            />
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        type="submit"
        disabled={!businessName.trim() || isGenerating}
        className={`w-full py-4 px-8 rounded-xl font-bold text-lg tracking-wide transition-all duration-300
          ${!businessName.trim() || isGenerating
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] cursor-pointer'
          }`}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Generating...
          </span>
        ) : (
          '✨ Generate Brand Identity'
        )}
      </button>
    </form>
  );
}
