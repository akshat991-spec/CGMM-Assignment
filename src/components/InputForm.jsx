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
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Business Name Input */}
      <div className="flex flex-col gap-2">
        <label htmlFor="businessName" className="text-sm font-medium text-slate-400 ml-1">
          Business Name
        </label>
        <div className="relative">
          <input
            id="businessName"
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g., NovaTech, Bloom Café"
            className="w-full px-4 py-3.5 bg-slate-900/40 border border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-500 
              focus:outline-none focus:bg-slate-900/80 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 
              transition-all duration-200 text-base shadow-inner"
            required
            maxLength={30}
          />
        </div>
      </div>

      {/* Industry Dropdown */}
      <div className="flex flex-col gap-2">
        <label htmlFor="industry" className="text-sm font-medium text-slate-400 ml-1">
          Industry
        </label>
        <div className="relative">
          <select
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full px-4 py-3.5 bg-slate-900/40 border border-slate-700/50 rounded-xl text-slate-100 
              focus:outline-none focus:bg-slate-900/80 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 
              transition-all duration-200 text-base appearance-none cursor-pointer shadow-inner"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748B'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '20px' }}
          >
            {INDUSTRIES.map(ind => (
              <option key={ind.value} value={ind.value} className="bg-slate-800 text-slate-200">{ind.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Style Selection */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-slate-400 ml-1">
          Design Style
        </label>
        <div className="grid grid-cols-2 gap-3">
          {STYLES.map(s => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStyle(s.value)}
              className={`relative flex flex-col gap-1 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer overflow-hidden
                ${style === s.value
                  ? 'border-blue-500/60 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.1)] ring-1 ring-blue-500/30'
                  : 'border-slate-700/50 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-800/50'
                }`}
            >
              {/* Active Indicator Dot */}
              {style === s.value && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}
              <div className={`font-medium text-base ${style === s.value ? 'text-blue-400' : 'text-slate-200'}`}>
                {s.label}
              </div>
              <div className="text-[13px] leading-snug text-slate-500 pr-4">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Picker */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-slate-400 ml-1">
          Brand Color
        </label>
        
        {/* Color swatches */}
        <div className="flex flex-wrap gap-2.5">
          {COLOR_PRESETS.map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => setColor(preset)}
              className={`w-8 h-8 rounded-full transition-all duration-200 cursor-pointer shadow-sm
                ${color === preset 
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' 
                  : 'hover:scale-110 ring-1 ring-white/10 ring-inset'
                }`}
              style={{ backgroundColor: preset }}
              title={preset}
            />
          ))}
        </div>
        
        {/* Custom color picker */}
        <div className="flex items-center gap-3 mt-1">
          <div className="relative group overflow-hidden rounded-xl border border-slate-700/50 shadow-inner w-12 h-12 flex-shrink-0 cursor-pointer transition-all hover:border-slate-500">
             {/* Styled wrapper for the ugly native color input */}
             <div 
               className="absolute inset-0 pointer-events-none" 
               style={{ backgroundColor: color }} 
             />
             <input
               id="colorPicker"
               type="color"
               value={color}
               onChange={(e) => setColor(e.target.value)}
               className="opacity-0 absolute inset-[-10px] w-20 h-20 cursor-pointer"
             />
          </div>
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono">#</div>
            <input
              type="text"
              value={color.replace('#', '').toUpperCase()}
              onChange={(e) => {
                const val = e.target.value;
                if (/^[0-9A-Fa-f]{0,6}$/.test(val)) setColor('#' + val);
              }}
              className="w-full pl-8 pr-4 py-3 bg-slate-900/40 border border-slate-700/50 rounded-xl text-slate-100 font-mono text-sm
                focus:outline-none focus:bg-slate-900/80 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner uppercase"
              placeholder="3B82F6"
            />
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        type="submit"
        disabled={!businessName.trim() || isGenerating}
        className={`w-full py-4 px-8 mt-2 rounded-xl font-semibold text-[15px] tracking-wide transition-all duration-300 flex items-center justify-center gap-3
          ${!businessName.trim() || isGenerating
            ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] cursor-pointer'
          }`}
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-5 w-5 opacity-70" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Generating Identity...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate Brand Identity
          </>
        )}
      </button>
    </form>
  );
}
