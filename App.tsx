import React, { useState, useCallback, useEffect } from 'react';
import { AnimationConfig, AnimationType, ExportFormat } from './types';
import Controls from './components/Controls';
import Preview from './components/Preview';
import { generateCode } from './utils/codeGenerator';
import { generateAnimationConfig } from './services/geminiService';
import { persistenceService, SavedProject } from './services/persistenceService';
import { X, Copy, Check, Sparkles, AlertTriangle, Code, Menu, Settings2, Download, Save, History, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
  easing: 'easeInOut',
  fontFamily: '"Inter", sans-serif',
  iconId: 'rocket',
  morphIconId: 'star',
  iconColor: '#38bdf8',
  strokeWidth: 2,
  iconPosition: 'top',
  itemSpacing: 20
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
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [projectName, setProjectName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Load projects on mount
  useEffect(() => {
    setProjects(persistenceService.getProjects());
  }, []);

  // Close mobile controls when window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowMobileControls(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


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

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const extension = exportFormat === ExportFormat.REACT_FRAMER ? 'tsx' : 'html';
    link.href = url;
    link.download = `introforge-animation.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveProject = () => {
    if (!projectName.trim()) return;
    persistenceService.saveProject(config, projectName);
    setProjects(persistenceService.getProjects());
    setShowSaveModal(false);
    setProjectName('');
  };

  const handleDeleteProject = (id: string) => {
    persistenceService.deleteProject(id);
    setProjects(persistenceService.getProjects());
  };

  const handleLoadProject = (saved: SavedProject) => {
    setConfig(saved.config);
    setTriggerKey(prev => prev + 1);
    setShowProjects(false);
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
    <div className="flex flex-col lg:flex-row h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-primary-500/30">
      
      {/* Main Preview Area */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        {/* Top Bar */}
        <header className="absolute top-0 left-0 w-full z-20 p-4 lg:p-6 flex justify-between items-center">
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-2 rounded-lg border border-white/10 shadow-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-md flex items-center justify-center">
              <span className="font-bold text-white text-sm">IF</span>
            </div>
            <span className="font-bold tracking-tight text-base lg:text-lg">IntroForge</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden sm:block bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] uppercase tracking-widest text-slate-400">
               Live Preview • v1.0
            </div>
            
            <button 
              onClick={() => setShowMobileControls(!showMobileControls)}
              className="lg:hidden p-2 bg-slate-900/80 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-slate-800 transition-colors"
            >
              <Menu size={24} />
            </button>
            
            <button 
              onClick={() => setShowProjects(true)}
              className="p-2 bg-slate-900/80 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-slate-800 transition-colors"
              title="Saved Projects"
            >
              <History size={24} />
            </button>
          </div>
        </header>

        {/* Canvas Area */}
        <div className="flex-1 p-4 lg:p-12 pt-20 lg:pt-28 pb-4 lg:pb-12 flex items-center justify-center bg-[#0d1117] relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/10 blur-[120px] rounded-full pointer-events-none"></div>
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            {/* Preview Component Container */}
            <motion.div 
              layout
              className="relative w-full max-w-5xl aspect-video bg-black rounded-lg lg:rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-800 ring-1 ring-white/5"
            >
                <Preview config={config} triggerKey={triggerKey} />
            </motion.div>
        </div>

        {/* Quick Actions (Mobile Only) */}
        {!showMobileControls && (
          <div className="lg:hidden p-4 flex gap-2 bg-slate-900 border-t border-slate-800">
             <button 
                onClick={handleReplay}
                className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold text-sm"
              >
                Replay Text
              </button>
              <button 
                onClick={() => setShowMobileControls(true)}
                className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary-900/20"
              >
                Edit Config
              </button>
          </div>
        )}
      </main>

      {/* Sidebar Controls (Desktop) */}
      <aside className="hidden lg:block w-[340px] h-full flex-shrink-0 z-30 ring-1 ring-white/5 shadow-2xl">
        <Controls 
          config={config} 
          onChange={setConfig} 
          onReplay={handleReplay}
          onExport={handleExport}
          onGenerateAI={() => setShowAIPrompt(true)}
          onSave={() => setShowSaveModal(true)}
          isGenerating={isGenerating}
        />
      </aside>

      {/* Mobile Controls Drawer */}
      <AnimatePresence>
        {showMobileControls && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 z-[60] flex flex-col bg-slate-950"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
              <h2 className="font-bold flex items-center gap-2">
                <Settings2 size={18} className="text-primary-400" /> Settings
              </h2>
              <button 
                onClick={() => setShowMobileControls(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Controls 
                config={config} 
                onChange={setConfig} 
                onReplay={handleReplay}
                onExport={() => {
                  setShowMobileControls(false);
                  handleExport();
                }}
                onGenerateAI={() => {
                  setShowMobileControls(false);
                  setShowAIPrompt(true);
                }}
                onSave={() => {
                   setShowMobileControls(false);
                   setShowSaveModal(true);
                }}
                isGenerating={isGenerating}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0d1117] border border-slate-800 rounded-2xl shadow-3xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code size={20} className="text-primary-500" /> Export Your Intro
                </h2>
                <p className="text-xs text-slate-500 mt-1">Ready to use in your web projects</p>
              </div>
              <button 
                onClick={() => setShowCode(false)} 
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="lg:flex flex-1 overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="w-full lg:w-56 bg-slate-900/30 border-b lg:border-b-0 lg:border-r border-slate-800 p-2 flex lg:flex-col gap-1">
                <button 
                    onClick={() => handleFormatChange(ExportFormat.REACT_FRAMER)}
                    className={`flex-1 lg:flex-initial flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${exportFormat === ExportFormat.REACT_FRAMER ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
                >
                    <div className={`w-2 h-2 rounded-full ${exportFormat === ExportFormat.REACT_FRAMER ? 'bg-primary-500' : 'bg-slate-700'}`} />
                    React + Framer
                </button>
                <button 
                    onClick={() => handleFormatChange(ExportFormat.HTML_CSS)}
                    className={`flex-1 lg:flex-initial flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${exportFormat === ExportFormat.HTML_CSS ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
                >
                    <div className={`w-2 h-2 rounded-full ${exportFormat === ExportFormat.HTML_CSS ? 'bg-primary-500' : 'bg-slate-700'}`} />
                    Pure HTML & CSS
                </button>
              </div>

              {/* Code Area */}
              <div className="flex-1 overflow-hidden flex flex-col relative">
                <div className="flex-1 overflow-auto bg-black/40">
                  <SyntaxHighlighter 
                    language={exportFormat === ExportFormat.REACT_FRAMER ? 'tsx' : 'html'}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: '1.5rem',
                      fontSize: '0.85rem',
                      lineHeight: '1.5',
                      background: 'transparent',
                      minHeight: '100%'
                    }}
                  >
                    {generatedCode}
                  </SyntaxHighlighter>
                </div>

                {/* Status Bar */}
                <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex flex-wrap gap-4 justify-between items-center">
                  <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                     {exportFormat === ExportFormat.REACT_FRAMER 
                        ? "npm i framer-motion" 
                        : "No dependencies required"}
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                        onClick={handleDownload}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all border border-slate-700"
                    >
                        <Download size={16} />
                        <span>Download</span>
                    </button>
                    <button 
                        onClick={copyToClipboard}
                        className={`px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 ${copied ? 'bg-green-600 text-white' : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20'}`}
                    >
                        {copied ? (
                          <>
                            <Check size={16} /> 
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            <span>Copy Code</span>
                          </>
                        )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default App;