import React from 'react';
import { AnimationConfig, AnimationType } from '../types';
import { Play, Code, Wand2, Download } from 'lucide-react';

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
    <div className="w-full h-full bg-slate-900 border-l border-slate-700 p-6 flex flex-col gap-6 overflow-y-auto">
      
      {/* Header Actions */}
      <div className="flex gap-2 mb-2">
        <button 
          onClick={onReplay}
          className="flex-1 bg-primary-600 hover:bg-primary-500 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 font-medium transition-colors"
        >
          <Play size={18} /> Replay
        </button>
        <button 
            onClick={onGenerateAI}
            disabled={isGenerating}
            className={`flex-1 ${isGenerating ? 'bg-purple-800' : 'bg-purple-600 hover:bg-purple-500'} text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 font-medium transition-colors`}
        >
            <Wand2 size={18} className={isGenerating ? "animate-spin" : ""} /> 
            {isGenerating ? 'Thinking...' : 'AI Magic'}
        </button>
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Content</h3>
        
        <div className="space-y-2">
          <label className="text-xs text-slate-300">Main Title</label>
          <input 
            type="text" 
            value={config.text}
            onChange={(e) => handleChange('text', e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-slate-300">Subtitle</label>
          <input 
            type="text" 
            value={config.subText}
            onChange={(e) => handleChange('subText', e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
      </div>

      {/* Animation Settings */}
      <div className="space-y-4 border-t border-slate-700 pt-6">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Animation</h3>
        
        <div className="space-y-2">
          <label className="text-xs text-slate-300">Effect Type</label>
          <select 
            value={config.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white outline-none"
          >
            {Object.values(AnimationType).map((t) => (
              <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-slate-300">Duration (s)</label>
            <input 
              type="number" 
              step="0.1"
              min="0.1"
              max="10"
              value={config.duration}
              onChange={(e) => handleChange('duration', parseFloat(e.target.value))}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-300">Delay (s)</label>
            <input 
              type="number" 
              step="0.1"
              min="0"
              max="5"
              value={config.delay}
              onChange={(e) => handleChange('delay', parseFloat(e.target.value))}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* Typography & Color */}
      <div className="space-y-4 border-t border-slate-700 pt-6">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Style</h3>

        <div className="space-y-2">
            <label className="text-xs text-slate-300">Font Size ({config.fontSize}px)</label>
            <input 
              type="range" 
              min="24" 
              max="150"
              value={config.fontSize}
              onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
        </div>

        <div className="space-y-2">
            <label className="text-xs text-slate-300">Letter Spacing ({config.letterSpacing}px)</label>
            <input 
              type="range" 
              min="-5" 
              max="30"
              value={config.letterSpacing}
              onChange={(e) => handleChange('letterSpacing', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
             <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Background</label>
                <div className="flex items-center gap-2">
                    <input 
                        type="color" 
                        value={config.backgroundColor}
                        onChange={(e) => handleChange('backgroundColor', e.target.value)}
                        className="w-8 h-8 rounded border-none cursor-pointer"
                    />
                </div>
             </div>
             <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Text</label>
                <div className="flex items-center gap-2">
                    <input 
                        type="color" 
                        value={config.textColor}
                        onChange={(e) => handleChange('textColor', e.target.value)}
                        className="w-8 h-8 rounded border-none cursor-pointer"
                    />
                </div>
             </div>
             <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Accent</label>
                <div className="flex items-center gap-2">
                    <input 
                        type="color" 
                        value={config.accentColor}
                        onChange={(e) => handleChange('accentColor', e.target.value)}
                        className="w-8 h-8 rounded border-none cursor-pointer"
                    />
                </div>
             </div>
        </div>
      </div>

      <div className="mt-auto border-t border-slate-700 pt-6">
        <button 
          onClick={onExport}
          className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white py-3 px-4 rounded-md flex items-center justify-center gap-2 font-medium transition-colors"
        >
          <Code size={18} /> Export Code
        </button>
      </div>

    </div>
  );
};

export default Controls;