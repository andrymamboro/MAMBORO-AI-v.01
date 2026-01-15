import React, { useState, useEffect } from 'react';
import Logo from './Logo';

interface Props {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<Props> = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;

  const handleEnter = async () => {
    setIsLoading(true);
    // Simulating a brief loading for aesthetic entrance
    setTimeout(() => {
      onLoginSuccess();
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 md:p-6 overflow-hidden relative">
      {/* Animated Background Neon Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md relative z-10 text-center space-y-6 md:space-y-12 animate-in fade-in zoom-in duration-1000">
        <div className="space-y-4 md:space-y-6">
          <div className="mx-auto w-32 h-32 md:w-48 md:h-48 bg-black/80 backdrop-blur-xl border border-slate-800/50 rounded-full flex items-center justify-center shadow-[0_0_40px_-10px_rgba(0,255,255,0.2)] md:shadow-[0_0_60px_-10px_rgba(0,255,255,0.3)] relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Logo size={isMobile ? 100 : 150} />
          </div>
          <div className="space-y-1">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
              Mamboro<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">Ai</span>
            </h1>
            <p className="text-cyan-400 font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-[9px] md:text-[11px] opacity-80">Image Studio</p>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-bold text-slate-100 px-4">AI-Powered Image Synthesis</h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-[260px] md:max-w-[280px] mx-auto leading-relaxed">
              Unlock professional-grade editing with the power of Gemini 2.5 Flash.
            </p>
          </div>

          <button
            onClick={handleEnter}
            disabled={isLoading}
            className={`group w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all flex items-center justify-center gap-3 relative overflow-hidden ${
              isLoading 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-cyan-50 hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.05)] md:shadow-[0_0_30px_rgba(255,255,255,0.1)]'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 md:w-6 md:h-6 border-2 md:border-3 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
            ) : (
              <>
                Enter Studio
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>

        <div className="pt-4 md:pt-8 flex flex-col items-center gap-4 md:gap-6">
          <div className="flex gap-2 md:gap-4">
             <div className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">
               v1.0.5 Image
             </div>
             <div className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[8px] md:text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
               Gemini 2.5
             </div>
          </div>
        </div>
      </div>

      <p className="absolute bottom-4 md:bottom-8 text-slate-700 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">
        © 2025 MAMBORO-AI STUDIO. INDONESIA.
      </p>
    </div>
  );
};

export default LoginScreen;