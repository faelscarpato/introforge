import React from 'react';
import { AnimationConfig, AnimationType } from '../types';
import { Play, Code, Wand2, Download, Sparkles, Shapes, Type } from 'lucide-react';
import { FONTS, ICONS } from '../constants/assets';

interface ControlsProps {
  config: AnimationConfig;
  onChange: (newConfig: AnimationConfig) => void;
  onReplay: () => void;
  onExport: () => void;
  onGenerateAI: () => void;
  isGenerating: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  config, 
  onChange, 
  onReplay, 
  onExport, 
  onGenerateAI, 
  isGenerating 
}) => {

  const handleChange = (key: keyof AnimationConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="w-full h-full bg-[#0d1117] lg:bg-slate-900 border-l lg:border-slate-800 p-5 lg:p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
      
      {/* Header Actions */}
      <div className="flex gap-2 shrink-0">
        <button 
          onClick={onReplay}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-[0.98] border border-slate-700"
        >
          <Play size={16} className="fill-current" /> Replay
        </button>
        <button 
            onClick={onGenerateAI}
            disabled={isGenerating}
            className={`flex-[1.2] ${isGenerating ? 'bg-purple-900 border-purple-700' : 'bg-purple-600 hover:bg-purple-500 border-purple-500'} text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-[0.98] border shadow-lg shadow-purple-900/20`}
        >
            <Sparkles size={16} className={isGenerating ? "animate-pulse" : ""} /> 
            {isGenerating ? 'Refining...' : 'AI Remix'}
        </button>
      </div>

      <div className="space-y-8 pb-10">
        {/* Content Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="w-4 h-[2px] bg-primary-500 rounded-full"></span>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Typography</h3>
          </div>
          
          <div className="grid gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-400 ml-1">Main Heading</label>
              <input 
                type="text" 
                value={config.text}
                onChange={(e) => handleChange('text', e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-primary-500/50 lg:focus:ring-primary-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="Title"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-400 ml-1">Support Text</label>
              <input 
                type="text" 
                value={config.subText}
                onChange={(e) => handleChange('subText', e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-primary-500/50 outline-none transition-all placeholder:text-slate-600"
                placeholder="Subtitle"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-400 ml-1">Font Family</label>
              <div className="relative group">
                <select 
                  value={config.fontFamily}
                  onChange={(e) => handleChange('fontFamily', e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary-500/50 transition-all font-sans"
                >
                  {FONTS.map((font) => (
                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }} className="bg-slate-900">{font.name}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                   <Type size={14} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Morphing Options (Conditional) */}
        {config.type === AnimationType.MORPH && (
          <section className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="flex items-center gap-2 px-1">
              <span className="w-4 h-[2px] bg-purple-500 rounded-full"></span>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Morph Shapes</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-400 ml-1">Initial Shape</label>
                <div className="relative">
                  <select 
                    value={config.iconId}
                    onChange={(e) => handleChange('iconId', e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-purple-500/50 transition-all font-mono"
                  >
                    {ICONS.map((icon) => (
                      <option key={icon.id} value={icon.id} className="bg-slate-900">{icon.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <Shapes size={12} />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-400 ml-1">Target Shape</label>
                <div className="relative">
                  <select 
                    value={config.morphIconId}
                    onChange={(e) => handleChange('morphIconId', e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-purple-500/50 transition-all font-mono"
                  >
                    {ICONS.map((icon) => (
                      <option key={icon.id} value={icon.id} className="bg-slate-900">{icon.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <Shapes size={12} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="w-4 h-[2px] bg-primary-500 rounded-full"></span>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Motion</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-400 ml-1">Reveal Style</label>
              <div className="relative group">
                <select 
                  value={config.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary-500/50 transition-all"
                >
                  {Object.values(AnimationType).map((t) => (
                    <option key={t} value={t} className="bg-slate-900 border-none">{t.replace(/_/g, ' ').toUpperCase()}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                   <Download size={14} className="rotate-180" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-400 ml-1">Duration (s)</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="0.1"
                  max="10"
                  value={config.duration}
                  onChange={(e) => handleChange('duration', parseFloat(e.target.value))}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-400 ml-1">Delay (s)</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="0"
                  max="5"
                  value={config.delay}
                  onChange={(e) => handleChange('delay', parseFloat(e.target.value))}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-mono"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Sliders Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <span className="w-4 h-[2px] bg-primary-500 rounded-full"></span>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Fine Tuning</h3>
          </div>

          <div className="space-y-6 px-1">
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-[11px] font-medium text-slate-400">Size</label>
                    <span className="text-[10px] font-mono text-primary-500 bg-primary-500/10 px-1.5 py-0.5 rounded">{config.fontSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="16" 
                  max="200"
                  value={config.fontSize}
                  onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-[11px] font-medium text-slate-400">Track</label>
                    <span className="text-[10px] font-mono text-primary-500 bg-primary-500/10 px-1.5 py-0.5 rounded">{config.letterSpacing}px</span>
                </div>
                <input 
                  type="range" 
                  min="-10" 
                  max="50"
                  value={config.letterSpacing}
                  onChange={(e) => handleChange('letterSpacing', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="w-4 h-[2px] bg-primary-500 rounded-full"></span>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Appearance</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
             {[
               { label: 'Base', key: 'backgroundColor' },
               { label: 'Type', key: 'textColor' },
               { label: 'Accent', key: 'accentColor' }
             ].map((item) => (
               <div key={item.key} className="p-3 bg-slate-800/30 border border-slate-800 rounded-xl flex flex-col items-center gap-2 hover:bg-slate-800/50 transition-all group">
                <label className="text-[9px] font-bold text-slate-500 uppercase group-hover:text-slate-400 transition-colors tracking-tighter">{item.label}</label>
                <div className="relative w-8 h-8 lg:w-10 lg:h-10">
                    <input 
                        type="color" 
                        value={(config as any)[item.key]}
                        onChange={(e) => handleChange(item.key as any, e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div 
                      className="w-full h-full rounded-full ring-2 ring-slate-700 ring-offset-2 ring-offset-slate-900 shadow-inner group-hover:ring-slate-500 transition-all active:scale-90"
                      style={{ backgroundColor: (config as any)[item.key] }}
                    />
                </div>
               </div>
             ))}
          </div>
        </section>
      </div>

      <div className="mt-auto shrink-0 pt-4">
        <button 
          onClick={onExport}
          className="w-full bg-primary-600 hover:bg-primary-500 text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest transition-all shadow-[0_10px_30px_-10px_rgba(59,130,246,0.5)] active:translate-y-1"
        >
          <Code size={16} /> Get Code
        </button>
      </div>

    </div>
  );
};

export default Controls;