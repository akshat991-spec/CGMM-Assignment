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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ===== HEADER ===== */}
      <header className="border-b border-white/5 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
              B
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">BrandForge AI</h1>
              <p className="text-xs text-gray-500">AI-Based Logo & Brand Identity Generator</p>
            </div>
          </div>
          {brandKit && (
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl 
                text-sm font-medium text-white transition-all duration-200 flex items-center gap-2 cursor-pointer
                hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Regenerate
            </button>
          )}
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {!brandKit ? (
          /* ===== HERO + INPUT STATE ===== */
          <div className="flex flex-col items-center">
            {/* Hero Section */}
            <div className="text-center mb-12 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                Computer Graphics & Multimedia Project
              </div>
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                Generate Your Complete Brand Identity
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Enter your business details below and our rule-based AI engine will generate
                a complete brand kit — logo, color palette, typography, business card, and social media template.
              </p>
            </div>

            {/* Input Form Card */}
            <div className="w-full max-w-xl">
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/20">
                <InputForm onGenerate={handleGenerate} isGenerating={isGenerating} />
              </div>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-5 gap-4 mt-16 max-w-4xl w-full">
              {[
                { icon: '🎨', label: 'SVG Logo', desc: 'Scalable vector' },
                { icon: '🎭', label: 'Color Palette', desc: '5-color harmony' },
                { icon: '🔤', label: 'Typography', desc: 'Font pairing' },
                { icon: '💳', label: 'Business Card', desc: 'Print-ready' },
                { icon: '📱', label: 'Social Post', desc: '1080×1080' },
              ].map(f => (
                <div key={f.label} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="text-sm font-semibold text-gray-300">{f.label}</div>
                  <div className="text-xs text-gray-500">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ===== GENERATED OUTPUT STATE ===== */
          <div>
            {/* Generation Summary Bar */}
            <div className="flex items-center justify-between mb-8 p-4 bg-white/[0.03] border border-white/10 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm font-medium">
                  ✓ Generated
                </div>
                <div>
                  <span className="text-white font-semibold">{brandKit.inputs.businessName}</span>
                  <span className="text-gray-500 mx-2">•</span>
                  <span className="text-gray-400 text-sm">{brandKit.inputs.industry}</span>
                  <span className="text-gray-500 mx-2">•</span>
                  <span className="text-gray-400 text-sm">{brandKit.inputs.style}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setBrandKit(null); setVariationSeed(0); }}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  ← New Brand
                </button>
                <button
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg 
                    text-sm font-medium text-white transition-all duration-200 cursor-pointer
                    disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Variation #{variationSeed + 1}
                </button>
              </div>
            </div>

            {/* Output Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Logo + Colors + Typography */}
              <div className="space-y-8">
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

              {/* Right Column: Business Card + Social Template */}
              <div className="space-y-8">
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

            {/* Export All Button */}
            <ExportAll
              svgString={brandKit.logo.svgString}
              palette={brandKit.palette}
              businessCardCanvas={businessCardCanvasRef.current}
              socialTemplateCanvas={socialTemplateCanvasRef.current}
              businessName={brandKit.inputs.businessName}
            />
          </div>
        )}
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between text-sm text-gray-600">
          <p>AI-Based Logo & Brand Identity Generator — Computer Graphics & Multimedia Project</p>
          <p>Built with React + Tailwind CSS + HTML5 Canvas</p>
        </div>
      </footer>
    </div>
  );
}
