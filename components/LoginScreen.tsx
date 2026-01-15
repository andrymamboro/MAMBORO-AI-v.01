import React, { useState } from 'react';
import Logo from './Logo';

interface Props {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<Props> = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEnter = async () => {
    setIsLoading(true);
    try {
      await window.aistudio.openSelectKey();
      onLoginSuccess();
    } catch (e) {
      console.error("Failed to select key:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Animated Background Neon Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md relative z-10 text-center space-y-12 animate-in fade-in zoom-in duration-1000">
        <div className="space-y-6">
          <div className="mx-auto w-48 h-48 bg-black/80 backdrop-blur-xl border border-slate-800/50 rounded-full flex items-center justify-center shadow-[0_0_60px_-10px_rgba(0,255,255,0.3)] relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Logo size={150} />
          </div>
          <div className="space-y-1">
            <h1 className="text-6xl font-black tracking-tighter text-white">
              Mamboro<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">Ai</span>
            </h1>
            <p className="text-cyan-400 font-bold uppercase tracking-[0.4em] text-[11px] opacity-80">Professional Studio</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-100">AI-Powered Image Synthesis</h2>
            <p className="text-slate-400 text-sm max-w-[280px] mx-auto leading-relaxed">
              Unlock professional-grade editing with the power of Gemini 2.5 Flash.
            </p>
          </div>

          <button
            onClick={handleEnter}
            disabled={isLoading}
            className={`group w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 relative overflow-hidden ${
              isLoading 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-cyan-50 hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]'
            }`}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-3 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
            ) : (
              <>
                Enter Studio
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>

        <div className="pt-8 flex flex-col items-center gap-6">
          <div className="flex gap-4">
             <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
               v1.0.5 Pro
             </div>
             <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
               Gemini 2.5
             </div>
          </div>
        </div>
      </div>

      <p className="absolute bottom-8 text-slate-700 text-[10px] font-bold uppercase tracking-[0.3em]">
        © 2025 MAMBORO-AI STUDIO. INDONESIA.
      </p>
    </div>
  );
};

export default LoginScreen;