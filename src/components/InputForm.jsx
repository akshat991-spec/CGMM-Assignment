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
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
      
      {/* Business Name & Industry Row */}
      <div className="flex flex-col sm:flex-row gap-6 w-full">
        {/* Business Name */}
        <div className="flex-1 flex flex-col gap-2">
          <label htmlFor="businessName" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">
            Business Name
          </label>
          <input
            id="businessName"
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g., NovaTech"
            className="w-full px-5 py-4 bg-white/5 border-none rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-lg font-medium"
            required
            maxLength={30}
          />
        </div>

        {/* Industry */}
        <div className="flex-1 flex flex-col gap-2">
          <label htmlFor="industry" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">
            Industry
          </label>
          <select
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full px-5 py-4 bg-white/5 border-none rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-lg font-medium appearance-none cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394A3B8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 20px center', backgroundSize: '24px' }}
          >
            {INDUSTRIES.map(ind => (
              <option key={ind.value} value={ind.value} className="bg-slate-900 text-slate-100 font-medium">{ind.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Style Selection */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pl-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Aesthetic Style
          </label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {STYLES.map(s => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStyle(s.value)}
              className={`flex flex-col p-5 rounded-xl text-left transition-all duration-200 cursor-pointer h-full min-h-[110px]
                ${style === s.value
                  ? 'bg-blue-500/20 ring-2 ring-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  : 'bg-white/5 hover:bg-white/10 ring-1 ring-transparent hover:ring-white/10'
                }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`font-bold text-[15px] ${style === s.value ? 'text-blue-400' : 'text-slate-200'}`}>
                  {s.label}
                </div>
                <div className={`w-2.5 h-2.5 rounded-full transition-colors ${style === s.value ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-slate-700'}`} />
              </div>
              <div className="text-[12px] leading-relaxed text-slate-400 mt-auto">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">
          Brand Color Signature
        </label>
        
        <div className="flex flex-col sm:flex-row gap-5 bg-white/5 p-5 rounded-xl items-center">
          <div className="flex flex-wrap gap-3 flex-1 justify-center sm:justify-start">
            {COLOR_PRESETS.map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => setColor(preset)}
                className={`w-9 h-9 rounded-full transition-transform cursor-pointer shadow-sm
                  ${color === preset 
                    ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900 z-10' 
                    : 'hover:scale-110 ring-1 ring-white/10 ring-inset'
                  }`}
                style={{ backgroundColor: preset }}
                title={preset}
              />
            ))}
          </div>
          
          <div className="hidden sm:block w-px h-10 bg-white/10"></div>
          
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg shadow-inner ring-1 ring-white/20 overflow-hidden flex-shrink-0 cursor-pointer">
               <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: color }} />
               <input
                 type="color"
                 value={color}
                 onChange={(e) => setColor(e.target.value)}
                 className="absolute -inset-4 w-24 h-24 opacity-0 cursor-pointer"
               />
            </div>
            
            <div className="relative w-32">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">#</span>
              <input
                type="text"
                value={color.replace('#', '').toUpperCase()}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^[0-9A-Fa-f]{0,6}$/.test(val)) setColor('#' + val);
                }}
                className="w-full pl-7 pr-3 py-2.5 bg-white/5 border-none rounded-lg text-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all uppercase"
                placeholder="3B82F6"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        type="submit"
        disabled={!businessName.trim() || isGenerating}
        className={`w-full py-5 rounded-xl font-bold text-[16px] tracking-wide transition-all duration-300 flex items-center justify-center gap-3 mt-4
          ${!businessName.trim() || isGenerating
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_8px_30px_rgba(37,99,235,0.3)] active:scale-[0.98] cursor-pointer'
          }`}
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white/70" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span>Crafting Your Identity...</span>
          </>
        ) : (
          <>
            <span>Generate Brand Identity</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
