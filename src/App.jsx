/**
 * App.jsx — Main Application Component
 * 
 * This is the root component of the AI-Based Logo and Brand Identity Generator.
 * It orchestrates the entire generation pipeline:
 * 
 * 1. Collect user inputs (business name, industry, style, color)
 * 2. Run generation engines (logo, palette, typography)
 * 3. Display outputs in organized sections
 * 4. Provide export functionality
 * 
 * STATE MANAGEMENT:
 * All state is managed at this level using React useState hooks.
 * Generated assets (canvases) are tracked via refs for export.
 */

import { useState, useRef, useCallback } from 'react';
import InputForm from './components/InputForm';
import LogoPreview from './components/LogoPreview';
import ColorPalette from './components/ColorPalette';
import TypographyPreview from './components/TypographyPreview';
import BusinessCard from './components/BusinessCard';
import SocialMediaTemplate from './components/SocialMediaTemplate';
import ExportAll from './components/ExportAll';

import { generateColorPalette } from './lib/generators/colorGenerator';
import { generateTypography } from './lib/generators/typographyGenerator';
import { generateLogo } from './lib/generators/logoGenerator';
import { loadGoogleFont } from './lib/canvasUtils';

export default function App() {
  // ===== STATE =====
  const [brandKit, setBrandKit] = useState(null);       // Complete generated brand kit
  const [isGenerating, setIsGenerating] = useState(false);
  const [variationSeed, setVariationSeed] = useState(0);  // For "Regenerate" feature
  const [inputParams, setInputParams] = useState(null);    // Last used input parameters

  // Canvas refs for export
  const businessCardCanvasRef = useRef(null);
  const socialTemplateCanvasRef = useRef(null);

  /**
   * Main generation pipeline.
   * Runs all generation engines in sequence and updates state.
   * 
   * @param {Object} inputs - User inputs from InputForm
   * @param {number} seed - Variation seed (0 for first generation)
   */
  const generateBrandKit = useCallback(async (inputs, seed = 0) => {
    setIsGenerating(true);
    setInputParams(inputs);

    // Small delay for UI feedback
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      // Step 1: Generate color palette using HSL color theory
      const palette = generateColorPalette(inputs.color, inputs.style, seed);

      // Step 2: Generate typography pairing
      const typography = generateTypography(inputs.style, seed);

      // Step 3: Load fonts before logo generation (needed for text measurement)
      await loadGoogleFont(typography.heading.family, typography.heading.weight);
      await loadGoogleFont(typography.body.family, typography.body.weight);

      // Step 4: Generate logo SVG
      const logoResult = generateLogo({
        businessName: inputs.businessName,
        industry: inputs.industry,
        style: inputs.style,
        primaryColor: palette.colors.primary,
        accentColor: palette.colors.accent,
        darkColor: palette.colors.dark,
        headingFont: typography.heading.family,
        variationSeed: seed
      });

      // Assemble complete brand kit
      const kit = {
        inputs,
        palette,
        typography,
        logo: logoResult,
        seed
      };

      setBrandKit(kit);
      setVariationSeed(seed);
      
      // Reset canvas refs for new generation
      businessCardCanvasRef.current = null;
      socialTemplateCanvasRef.current = null;
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  /**
   * Regenerate with a new variation seed.
   * Increments the seed to cycle through alternate logos, fonts, and color shifts.
   */
  const handleRegenerate = useCallback(() => {
    if (inputParams) {
      const newSeed = variationSeed + 1;
      generateBrandKit(inputParams, newSeed);
    }
  }, [inputParams, variationSeed, generateBrandKit]);

  /**
   * Handle first generation from the input form.
   */
  const handleGenerate = useCallback((inputs) => {
    generateBrandKit(inputs, 0);
  }, [generateBrandKit]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden relative font-sans selection:bg-blue-500/30">
      
      {/* ===== AMBIENT BACKGROUND GLOW ===== */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-blue-400/20">
              B
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">BrandForge AI</h1>
              <p className="text-[11px] font-medium text-slate-400 tracking-widest uppercase">Identity Generator</p>
            </div>
          </div>
          {brandKit && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setBrandKit(null); setVariationSeed(0); }}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Start Over
              </button>
              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl 
                  text-sm font-medium text-white transition-all duration-200 flex items-center gap-2 cursor-pointer
                  hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <svg className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Variation #{variationSeed + 1}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {!brandKit ? (
          /* ===== HERO + INPUT STATE ===== */
          <div className="flex flex-col items-center animate-on-mount">
            {/* Hero Section */}
            <div className="text-center mb-14 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-widest mb-8 shadow-inner">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span>
                v2.0 Architecture
              </div>
              <h2 className="text-5xl sm:text-6xl font-extrabold mb-6 text-white tracking-tight leading-[1.1]">
                Design your brand <br/>
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">in seconds.</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
                Our deterministic engine crafts a cohesive identity—including logos, typography, and assets—perfectly tailored to your industry and style.
              </p>
            </div>

            {/* Input Form Card */}
            <div className="w-full max-w-xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative glass-card rounded-3xl p-8 sm:p-10">
                <InputForm onGenerate={handleGenerate} isGenerating={isGenerating} />
              </div>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-20 max-w-5xl w-full">
              {[
                { icon: '🎨', label: 'Vector Logos', desc: 'Scalable SVG' },
                { icon: '🎭', label: 'Color Theory', desc: 'Harmonious palettes' },
                { icon: '🔤', label: 'Typography', desc: 'Premium font pairs' },
                { icon: '💳', label: 'Print Assets', desc: 'Business cards' },
                { icon: '📱', label: 'Social Ready', desc: '1080×1080 posts' },
              ].map((f, i) => (
                <div key={f.label} className={`text-center p-5 rounded-2xl glass-panel animate-on-mount stagger-${i + 1}`}>
                  <div className="text-3xl mb-3 drop-shadow-md">{f.icon}</div>
                  <div className="text-sm font-bold text-slate-200 mb-1">{f.label}</div>
                  <div className="text-xs font-medium text-slate-500">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ===== GENERATED OUTPUT STATE ===== */
          <div className="animate-fade-in">
            {/* Generation Summary Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10 p-5 glass-panel rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Generated Successfully
                </div>
                <div className="hidden sm:flex items-center text-sm font-medium">
                  <span className="text-white bg-white/5 px-3 py-1 rounded-lg border border-white/10">{brandKit.inputs.businessName}</span>
                  <span className="text-slate-600 mx-3">/</span>
                  <span className="text-slate-400">{brandKit.inputs.industry}</span>
                  <span className="text-slate-600 mx-3">/</span>
                  <span className="text-slate-400">{brandKit.inputs.style}</span>
                </div>
              </div>
              
              <ExportAll
                svgString={brandKit.logo.svgString}
                palette={brandKit.palette}
                businessCardCanvas={businessCardCanvasRef.current}
                socialTemplateCanvas={socialTemplateCanvasRef.current}
                businessName={brandKit.inputs.businessName}
              />
            </div>

            {/* Output Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Logo + Colors + Typography (Takes up 5 columns on large screens) */}
              <div className="lg:col-span-5 space-y-8 flex flex-col">
                <LogoPreview 
                  svgString={brandKit.logo.svgString} 
                  logoMeta={brandKit.logo}
                />
                <ColorPalette palette={brandKit.palette} />
                <TypographyPreview 
                  typography={brandKit.typography} 
                  businessName={brandKit.inputs.businessName}
                />
              </div>

              {/* Right Column: Business Card + Social Template (Takes up 7 columns) */}
              <div className="lg:col-span-7 space-y-8 flex flex-col">
                <BusinessCard
                  businessName={brandKit.inputs.businessName}
                  palette={brandKit.palette}
                  typography={brandKit.typography}
                  svgDataUrl={null}
                  style={brandKit.inputs.style}
                  onCanvasReady={(canvas) => { businessCardCanvasRef.current = canvas; }}
                />
                <SocialMediaTemplate
                  businessName={brandKit.inputs.businessName}
                  palette={brandKit.palette}
                  typography={brandKit.typography}
                  svgDataUrl={null}
                  style={brandKit.inputs.style}
                  onCanvasReady={(canvas) => { socialTemplateCanvasRef.current = canvas; }}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 mt-20 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium text-slate-500">
          <p className="flex items-center gap-2">
            BrandForge AI <span className="w-1 h-1 rounded-full bg-slate-700"></span> 2026
          </p>
          <p className="flex items-center gap-2">
            Built with React & Tailwind
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </p>
        </div>
      </footer>
    </div>
  );
}
