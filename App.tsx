import React, { useState, useEffect, useRef } from 'react';
import { processImageEdit } from './services/geminiService';
import { AppStatus, AspectRatio } from './types';

// Components
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import EditorPanel from './components/EditorPanel';
import ClothesMenu from './components/ClothesMenu';
import ResultGallery from './components/ResultGallery';
import LoadingOverlay from './components/LoadingOverlay';
import ErrorMessage from './components/ErrorMessage';
import SettingsModal from './components/SettingsModal';
import LoginScreen from './components/LoginScreen';
import Logo from './components/Logo';

type AppMode = 'general' | 'clothes';
const MAX_DAILY_QUOTA = 10;
const QUOTA_STORAGE_KEY = 'mamboro_quota_v4';
const RESET_DATE_KEY = 'mamboro_reset_v4';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [mode, setMode] = useState<AppMode>('general');
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [clothesRefImage, setClothesRefImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [quota, setQuota] = useState<number>(MAX_DAILY_QUOTA);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuthAndQuota = async () => {
      // Check API Key status
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsLoggedIn(hasKey);
      } else {
        setIsLoggedIn(true); 
      }

      // Init Quota
      const today = new Date().toISOString().split('T')[0];
      const lastReset = localStorage.getItem(RESET_DATE_KEY);
      const storedQuota = localStorage.getItem(QUOTA_STORAGE_KEY);

      if (lastReset !== today) {
        setQuota(MAX_DAILY_QUOTA);
        localStorage.setItem(QUOTA_STORAGE_KEY, MAX_DAILY_QUOTA.toString());
        localStorage.setItem(RESET_DATE_KEY, today);
      } else if (storedQuota !== null) {
        setQuota(parseInt(storedQuota, 10));
      }
    };
    
    checkAuthAndQuota();
  }, []);

  const resetQuota = () => {
    setQuota(MAX_DAILY_QUOTA);
    localStorage.setItem(QUOTA_STORAGE_KEY, MAX_DAILY_QUOTA.toString());
  };

  const handleImageUpload = (base64: string) => {
    setSourceImage(base64);
    setResultImage(null);
    setStatus(AppStatus.IDLE);
    setErrorMsg(null);
  };

  const handleEdit = async (customPrompt?: string, refImage?: string | null) => {
    if (quota <= 0) {
      setErrorMsg("Kuota harian Anda telah habis. Silakan coba lagi besok.");
      return;
    }

    const finalPrompt = customPrompt || prompt;
    if (!sourceImage) {
      setErrorMsg("Silakan unggah gambar terlebih dahulu.");
      return;
    }
    if (!finalPrompt.trim()) {
      setErrorMsg("Silakan masukkan instruksi edit.");
      return;
    }

    setStatus(AppStatus.PROCESSING);
    setErrorMsg(null);

    try {
      const result = await processImageEdit(sourceImage, finalPrompt, aspectRatio, refImage);
      setResultImage(result.imageUrl);
      setStatus(AppStatus.SUCCESS);
      
      const newQuota = Math.max(0, quota - 1);
      setQuota(newQuota);
      localStorage.setItem(QUOTA_STORAGE_KEY, newQuota.toString());
      
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    } catch (err: any) {
      console.error(err);
      
      // Handle the specific "Requested entity was not found" error
      if (err.message && err.message.includes("Requested entity was not found")) {
        setErrorMsg("Masalah autentikasi terdeteksi. Silakan pilih API Key kembali.");
        setIsLoggedIn(false); // Force re-login/key selection
        setStatus(AppStatus.ERROR);
        return;
      }

      setErrorMsg(err.message || "Terjadi kegagalan sistem. Coba beberapa saat lagi.");
      setStatus(AppStatus.ERROR);
    }
  };

  if (isLoggedIn === null) return null;
  if (isLoggedIn === false) return <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />;

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-100 animate-in fade-in duration-700">
      <Header 
        onOpenSettings={() => setIsSettingsOpen(true)}
        quota={quota} 
        maxQuota={MAX_DAILY_QUOTA} 
      />
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        onResetQuota={resetQuota}
        quota={quota}
      />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {/* Banner Section */}
        <div className="mb-10 p-6 bg-gradient-to-br from-indigo-600/10 via-slate-800/40 to-blue-600/10 border border-slate-700/50 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full -mr-20 -mt-20"></div>
          <div className="hidden sm:flex w-20 h-20 bg-slate-900/90 border border-slate-700/50 rounded-3xl items-center justify-center shadow-2xl shadow-indigo-500/10 backdrop-blur-md relative z-10 group-hover:scale-105 transition-transform">
            <Logo size={56} />
          </div>
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-2xl font-black text-white mb-1 tracking-tight text-glow">Mamboro-Ai Pro Studio</h2>
            <p className="text-slate-400 text-sm max-w-md">Transformasi gambar profesional dengan kekuatan Gemini 2.5 Flash Image. Cepat, cerdas, dan presisi.</p>
          </div>
          <div className="ml-auto flex gap-3 relative z-10">
             <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               System Online
             </div>
          </div>
        </div>

        {/* Mode Toggler */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-900/80 p-1.5 rounded-3xl border border-slate-700 backdrop-blur-md flex gap-1 shadow-2xl">
            <button 
              onClick={() => setMode('general')}
              className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all duration-300 ${mode === 'general' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Umum
            </button>
            <button 
              onClick={() => setMode('clothes')}
              className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all duration-300 ${mode === 'clothes' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.268 0 2.39.63 3.068 1.593m-4.714 14.307c-.733.006-1.414-.303-1.784-.872L4 13m7.714 5.307c.493.013.988-.03 1.472-.128M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Ganti Pakaian
            </button>
          </div>
        </div>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-8">
            <section className="bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-700/50 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Langkah 1: Unggah Sumber</h2>
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400">01</div>
              </div>
              <ImageUploader onUpload={handleImageUpload} currentImage={sourceImage} />
            </section>

            {sourceImage && (
              <div className="animate-in slide-in-from-bottom-6 duration-500">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Langkah 2: Konfigurasi AI</h2>
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400">02</div>
                </div>
                {mode === 'general' ? (
                  <EditorPanel 
                    prompt={prompt} 
                    setPrompt={setPrompt} 
                    aspectRatio={aspectRatio} 
                    setAspectRatio={setAspectRatio} 
                    onEdit={() => handleEdit()} 
                    isLoading={status === AppStatus.PROCESSING}
                    isQuotaExhausted={quota <= 0}
                  />
                ) : (
                  <ClothesMenu 
                    onApply={(p) => handleEdit(p, clothesRefImage)}
                    isLoading={status === AppStatus.PROCESSING}
                    aspectRatio={aspectRatio}
                    setAspectRatio={setAspectRatio}
                    refImage={clothesRefImage}
                    setRefImage={setClothesRefImage}
                    isQuotaExhausted={quota <= 0}
                  />
                )}
              </div>
            )}

            {errorMsg && <ErrorMessage message={errorMsg} />}
          </div>

          <div className="space-y-8 sticky top-24">
            <section className="bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-700/50 shadow-2xl backdrop-blur-sm min-h-[580px] flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Langkah 3: Output Preview</h2>
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400">03</div>
              </div>
              
              <div ref={resultRef} className="flex-grow flex items-center justify-center relative bg-slate-950/50 rounded-3xl border border-slate-800/50 shadow-inner group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none"></div>
                {status === AppStatus.PROCESSING && <LoadingOverlay />}
                <ResultGallery resultImage={resultImage} sourceImage={sourceImage} />
              </div>
            </section>

            {resultImage && (
              <button 
                onClick={() => { setSourceImage(null); setResultImage(null); setStatus(AppStatus.IDLE); setPrompt(''); }}
                className="w-full py-5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded-3xl transition-all font-bold flex items-center justify-center gap-3 group shadow-xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Mulai Ulang Project
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="py-16 border-t border-slate-800/50 text-center space-y-6">
        <div className="flex justify-center gap-8 items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
           <Logo size={24} />
           <span className="text-xs font-bold tracking-[0.3em] uppercase">Mamboro AI Studio</span>
        </div>
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">Integrated with Google Gemini 2.5 Infrastructure</p>
        <p className="text-slate-500 text-xs font-medium">© 2025 MAMBORO-AI STUDIO. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;