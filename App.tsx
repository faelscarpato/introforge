import React, { useState, useCallback } from 'react';
import { AnimationConfig, AnimationType, ExportFormat } from './types';
import Controls from './components/Controls';
import Preview from './components/Preview';
import { generateCode } from './utils/codeGenerator';
import { generateAnimationConfig } from './services/geminiService';
import { X, Copy, Check, Sparkles, AlertTriangle, Code } from 'lucide-react';

const INITIAL_CONFIG: AnimationConfig = {
  text: 'INTRO FORGE',
  subText: 'Create stunning web animations',
  type: AnimationType.SLIDE_UP,
  duration: 1.2,
  delay: 0.2,
  backgroundColor: '#0f172a',
  textColor: '#f8fafc',
  accentColor: '#38bdf8',
  fontSize: 72,
  letterSpacing: 2,
  easing: 'easeInOut'
};

function App() {
  const [config, setConfig] = useState<AnimationConfig>(INITIAL_CONFIG);
  const [triggerKey, setTriggerKey] = useState(0); // Used to force replay
  const [showCode, setShowCode] = useState(false);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [exportFormat, setExportFormat] = useState<ExportFormat>(ExportFormat.REACT_FRAMER);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleReplay = useCallback(() => {
    setTriggerKey(prev => prev + 1);
  }, []);

  const handleExport = () => {
    const code = generateCode(config, exportFormat);
    setGeneratedCode(code);
    setShowCode(true);
  };

  const handleFormatChange = (format: ExportFormat) => {
    setExportFormat(format);
    const code = generateCode(config, format);
    setGeneratedCode(code);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    setErrorMsg(null);
    
    try {
      const newConfig = await generateAnimationConfig(aiPrompt);
      setConfig(prev => ({
        ...prev,
        ...newConfig,
        // Ensure defaults if AI omits properties
        duration: newConfig.duration || prev.duration,
        delay: newConfig.delay || prev.delay,
        fontSize: newConfig.fontSize || prev.fontSize
      }));
      setTriggerKey(prev => prev + 1);
      setShowAIPrompt(false);
      setAiPrompt('');
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to generate animation. Please check your API Key or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-primary-500/30">
      
      {/* Main Preview Area */}
      <main className="flex-1 relative flex flex-col h-full">
        {/* Top Bar */}
        <header className="absolute top-0 left-0 w-full z-20 p-6 flex justify-between items-center pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/50 backdrop-blur-md p-2 rounded-lg border border-white/10">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-md flex items-center justify-center">
              <span className="font-bold text-white">IF</span>
            </div>
            <span className="font-bold tracking-tight text-lg">IntroForge</span>
          </div>
          
          <div className="pointer-events-auto bg-slate-900/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs text-slate-400">
             v1.0 • React & Framer Motion
          </div>
        </header>

        {/* Canvas */}
        <div className="flex-1 p-8 pt-24 pb-8 flex items-center justify-center bg-[#0d1117] relative">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            {/* Preview Component Container */}
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl shadow-2xl overflow-hidden border border-slate-800 ring-1 ring-white/5">
                <Preview config={config} triggerKey={triggerKey} />
            </div>
        </div>
      </main>

      {/* Right Sidebar Controls */}
      <aside className="w-80 h-full flex-shrink-0 z-30 shadow-2xl">
        <Controls 
          config={config} 
          onChange={setConfig} 
          onReplay={handleReplay}
          onExport={handleExport}
          onGenerateAI={() => setShowAIPrompt(true)}
          isGenerating={isGenerating}
        />
      </aside>

      {/* AI Prompt Modal */}
      {showAIPrompt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
            <button 
              onClick={() => setShowAIPrompt(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3 mb-4 text-purple-400">
               <Sparkles size={24} />
               <h2 className="text-xl font-bold text-white">AI Assistant</h2>
            </div>
            
            <p className="text-slate-400 mb-4 text-sm">
              Describe the vibe you want (e.g., "A retro synthwave intro with neon pink text" or "A corporate clean minimalist fade").
            </p>
            
            <textarea 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Type your vision here..."
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-4 text-white focus:ring-2 focus:ring-purple-500 outline-none h-32 resize-none mb-4"
              autoFocus
            />

            {errorMsg && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded flex items-center gap-2 text-red-200 text-sm">
                    <AlertTriangle size={16} />
                    {errorMsg}
                </div>
            )}

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowAIPrompt(false)}
                className="px-4 py-2 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleGenerateAI}
                disabled={isGenerating || !aiPrompt.trim()}
                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isGenerating ? 'Dreaming...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Code Export Modal */}
      {showCode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50 rounded-t-xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Code size={20} className="text-primary-500" /> Export Code
              </h2>
              <button onClick={() => setShowCode(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 bg-slate-900 border-b border-slate-800 flex gap-4">
                <button 
                    onClick={() => handleFormatChange(ExportFormat.REACT_FRAMER)}
                    className={`pb-2 text-sm font-medium border-b-2 transition-colors ${exportFormat === ExportFormat.REACT_FRAMER ? 'border-primary-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                    React + Framer Motion
                </button>
                <button 
                    onClick={() => handleFormatChange(ExportFormat.HTML_CSS)}
                    className={`pb-2 text-sm font-medium border-b-2 transition-colors ${exportFormat === ExportFormat.HTML_CSS ? 'border-primary-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                    HTML / CSS
                </button>
            </div>

            <div className="flex-1 overflow-auto p-0 relative group">
                <pre className="p-6 text-sm font-mono text-slate-300 bg-[#0d1117] min-h-full">
                    <code>{generatedCode}</code>
                </pre>
                <button 
                    onClick={copyToClipboard}
                    className="absolute top-4 right-4 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-md shadow-lg transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2"
                >
                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            
            <div className="p-4 bg-slate-800/50 text-xs text-slate-500 text-center rounded-b-xl">
               {exportFormat === ExportFormat.REACT_FRAMER 
                 ? "Requires: npm install framer-motion" 
                 : "Copy and paste into your HTML file"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;