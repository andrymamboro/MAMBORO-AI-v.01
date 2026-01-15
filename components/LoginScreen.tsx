
import React, { useState, useEffect } from 'react';
import Logo from './Logo';

interface Props {
  onLoginSuccess: () => void;
}

// Global declaration to handle pre-configured window.aistudio from the environment
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const LoginScreen: React.FC<Props> = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    // Fixed: window.removeResizeListener is incorrect, use window.removeEventListener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;

  const handleEnter = async () => {
    setIsLoading(true);
    try {
      // Periksa apakah window.aistudio tersedia (hanya ada di environment Mamboro Editor)
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio.openSelectKey();
        }
      } else {
        // Fallback: Jika tidak ada di environment editor, periksa apakah API_KEY sudah ada di process.env
        // Ini memungkinkan aplikasi yang sudah di-build/deploy tetap berjalan
        if (!process.env.API_KEY || process.env.API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
          console.warn("API Key tidak ditemukan di environment. Pastikan file .env sudah terisi.");
          // Tetap lanjutkan untuk melihat apakah API membalas dengan error 401 nanti
        }
      }
      
      // Tunggu sebentar untuk efek transisi yang mulus
      setTimeout(() => {
        onLoginSuccess();
        setIsLoading(false);
      }, 800);
    } catch (error: any) {
      console.error("Login Error:", error);
      setIsLoading(false);
      alert(error.message || "Gagal masuk. Silakan periksa konfigurasi API Key Anda.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 md:p-6 overflow-hidden relative text-white">
      {/* Animated Background Neon Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md relative z-10 text-center space-y-8 md:space-y-12 animate-in fade-in zoom-in duration-1000">
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

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-bold text-slate-100 px-4">AI-Powered Image Synthesis</h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-[260px] md:max-w-[280px] mx-auto leading-relaxed">
              Masuk dengan akun Google Anda untuk menggunakan teknologi penyuntingan gambar tercanggih dari Google Gemini.
            </p>
          </div>

          <div className="px-4">
            <button
              onClick={handleEnter}
              disabled={isLoading}
              className={`group w-full py-3.5 px-4 rounded-xl md:rounded-2xl font-semibold text-sm md:text-base transition-all flex items-center justify-center gap-3 relative border border-slate-700 ${
                isLoading 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-white text-slate-900 hover:bg-slate-50 hover:scale-[1.01] active:scale-[0.99] shadow-xl'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-300 border-t-cyan-500 rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Login dengan Google
                </>
              )}
            </button>
          </div>
          <p className="text-[9px] md:text-[10px] text-slate-500 px-8">
            Dengan masuk, Anda setuju untuk menggunakan Kunci API Google Cloud Anda sendiri untuk pemrosesan gambar.
            <br/><a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-cyan-500 hover:underline">Pelajari tentang penagihan API.</a>
          </p>
        </div>

        <div className="pt-4 md:pt-8 flex flex-col items-center gap-4 md:gap-6">
          <div className="flex gap-2 md:gap-4">
             <div className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">
               v1.1.0 Image
             </div>
             <div className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[8px] md:text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
               Powered by Google
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
