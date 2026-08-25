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
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      
      {/* Business Name & Industry Row (Responsive) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Business Name */}
        <div className="flex flex-col gap-2.5">
          <label htmlFor="businessName" className="text-[13px] font-bold text-slate-300 uppercase tracking-widest pl-1">
            Business Name
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-0 group-focus-within:opacity-30 transition duration-500"></div>
            <input
              id="businessName"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. NovaTech"
              className="relative w-full px-5 py-4 bg-slate-900/80 border border-slate-700/60 rounded-2xl text-slate-100 placeholder-slate-600 
                focus:outline-none focus:border-blue-500/80 transition-all duration-300 text-lg font-medium shadow-inner"
              required
              maxLength={30}
            />
          </div>
        </div>

        {/* Industry */}
        <div className="flex flex-col gap-2.5">
          <label htmlFor="industry" className="text-[13px] font-bold text-slate-300 uppercase tracking-widest pl-1">
            Industry
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-0 group-focus-within:opacity-30 transition duration-500"></div>
            <select
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="relative w-full px-5 py-4 bg-slate-900/80 border border-slate-700/60 rounded-2xl text-slate-100 
                focus:outline-none focus:border-blue-500/80 transition-all duration-300 text-lg font-medium appearance-none cursor-pointer shadow-inner"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394A3B8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 20px center', backgroundSize: '24px' }}
            >
              {INDUSTRIES.map(ind => (
                <option key={ind.value} value={ind.value} className="bg-slate-900 text-slate-100 font-medium py-2">{ind.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Style Selection */}
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between pl-1">
          <label className="text-[13px] font-bold text-slate-300 uppercase tracking-widest">
            Aesthetic Style
          </label>
          <span className="text-[11px] font-medium text-slate-500">Select the vibe of your brand</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {STYLES.map(s => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStyle(s.value)}
              className={`relative flex flex-col p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer overflow-hidden group
                ${style === s.value
                  ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                  : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/60'
                }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className={`font-bold text-[15px] ${style === s.value ? 'text-blue-400' : 'text-slate-200 group-hover:text-white'}`}>
                  {s.label}
                </div>
                {/* Active Indicator */}
                <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${style === s.value ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-slate-700'}`} />
              </div>
              <div className="text-[12px] leading-relaxed text-slate-400">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div className="flex flex-col gap-4">
        <label className="text-[13px] font-bold text-slate-300 uppercase tracking-widest pl-1">
          Brand Color Signature
        </label>
        
        <div className="flex flex-wrap items-center gap-3 bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50">
          <div className="flex flex-wrap gap-2.5 flex-1">
            {COLOR_PRESETS.map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => setColor(preset)}
                className={`w-9 h-9 rounded-full transition-all duration-300 cursor-pointer shadow-sm relative
                  ${color === preset 
                    ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-900 z-10' 
                    : 'hover:scale-110 hover:z-10 ring-1 ring-white/10 ring-inset opacity-80 hover:opacity-100'
                  }`}
                style={{ backgroundColor: preset }}
                title={preset}
              />
            ))}
          </div>
          
          {/* Custom Hex Input */}
          <div className="h-10 w-[1px] bg-slate-700/50 mx-2 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <div className="relative overflow-hidden rounded-xl w-9 h-9 flex-shrink-0 cursor-pointer ring-1 ring-white/10 shadow-inner group">
               <div className="absolute inset-0 transition-transform group-hover:scale-110" style={{ backgroundColor: color }} />
               <input
                 type="color"
                 value={color}
                 onChange={(e) => setColor(e.target.value)}
                 className="opacity-0 absolute inset-[-10px] w-20 h-20 cursor-pointer"
               />
            </div>
            <div className="relative w-28">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">#</span>
              <input
                type="text"
                value={color.replace('#', '').toUpperCase()}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^[0-9A-Fa-f]{0,6}$/.test(val)) setColor('#' + val);
                }}
                className="w-full pl-7 pr-3 py-2 bg-slate-900/60 border border-slate-600 rounded-lg text-slate-200 font-mono text-sm
                  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all uppercase"
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
        className={`relative w-full py-5 rounded-2xl font-bold text-[16px] tracking-wide transition-all duration-300 flex items-center justify-center gap-3 mt-4 overflow-hidden group
          ${!businessName.trim() || isGenerating
            ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_8px_30px_rgba(79,70,229,0.3)] active:scale-[0.98] cursor-pointer border border-white/10'
          }`}
      >
        {/* Button hover glow */}
        {(!(!businessName.trim() || isGenerating)) && (
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out pointer-events-none"></div>
        )}

        {isGenerating ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white/70" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span className="relative z-10">Crafting Your Identity...</span>
          </>
        ) : (
          <>
            <span className="relative z-10">Generate Brand Identity</span>
            <svg className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
