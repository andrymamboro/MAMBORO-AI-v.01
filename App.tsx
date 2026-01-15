import React, { useState, useEffect, useRef } from 'react';
import { processImageEdit } from './services/geminiService';
import { AppStatus, AspectRatio } from './types';

// Components
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import EditorPanel from './components/EditorPanel';
import ClothesMenu from './components/ClothesMenu';
import ReferenceEditMenu from './components/ReferenceEditMenu';
import ResultGallery from './components/ResultGallery';
import LoadingOverlay from './components/LoadingOverlay';
import ErrorMessage from './components/ErrorMessage';
import SettingsModal from './components/SettingsModal';
import LoginScreen from './components/LoginScreen';
import Logo from './components/Logo';

type AppMode = 'general' | 'clothes' | 'reference';
const MAX_DAILY_QUOTA = 10;
const QUOTA_STORAGE_KEY = 'mamboro_quota_v4';
const RESET_DATE_KEY = 'mamboro_reset_v4';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [mode, setMode] = useState<AppMode>('general');
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [refImage, setRefImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [quota, setQuota] = useState<number>(MAX_DAILY_QUOTA);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initQuota = () => {
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
    
    initQuota();
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

  const handleEdit = async (customPrompt?: string, customRefImage?: string | null) => {
    if (quota <= 0) {
      setErrorMsg("Kuota harian Anda telah habis. Silakan coba lagi besok.");
      return;
    }

    const finalPrompt = customPrompt || prompt;
    const finalRefImage = customRefImage !== undefined ? customRefImage : refImage;

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
      const result = await processImageEdit(sourceImage, finalPrompt, aspectRatio, finalRefImage);
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
      setErrorMsg(err.message || "Terjadi kegagalan sistem. Coba beberapa saat lagi.");
      setStatus(AppStatus.ERROR);
    }
  };

  if (!isLoggedIn) return <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />;

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-100 animate-in fade-in duration-700 overflow-x-hidden">
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

      <main className="flex-grow w-full max-w-6xl mx-auto md:px-4 py-2 md:py-8">
        <div className="mb-4 md:mb-10 p-3 md:p-4 mx-2 md:mx-0 bg-gradient-to-br from-indigo-600/5 via-slate-800/40 to-blue-600/5 border border-slate-700/30 rounded-2xl md:rounded-[2rem] flex items-center gap-3 md:gap-4 shadow-xl backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] rounded-full -mr-10 -mt-10"></div>
          <div className="flex shrink-0 w-10 h-10 md:w-12 md:h-12 bg-slate-900 border border-slate-700/50 rounded-xl md:rounded-2xl items-center justify-center shadow-lg backdrop-blur-md relative z-10">
            <Logo size={24} />
          </div>
          <div className="relative z-10 overflow-hidden">
            <h2 className="text-xs md:text-sm font-bold text-slate-300 tracking-wide uppercase opacity-70 truncate">Studio Dashboard</h2>
          </div>
          <div className="ml-auto flex gap-3 relative z-10">
             <div className="px-2 md:px-3 py-1 md:py-1.5 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 md:gap-2 whitespace-nowrap">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
               System Online
             </div>
          </div>
        </div>

        {/* Mode Toggler - 3 Tabs for mobile */}
        <div className="flex justify-center mb-6 md:mb-10 px-2 md:px-0">
          <div className="bg-slate-900/80 p-1 rounded-2xl md:rounded-3xl border border-slate-700 backdrop-blur-md flex w-full md:w-auto gap-1 shadow-2xl overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setMode('general')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold transition-all duration-300 text-[10px] md:text-sm whitespace-nowrap ${mode === 'general' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
            >
              Umum
            </button>
            <button 
              onClick={() => setMode('clothes')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold transition-all duration-300 text-[10px] md:text-sm whitespace-nowrap ${mode === 'clothes' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
            >
              Baju
            </button>
            <button 
              onClick={() => setMode('reference')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold transition-all duration-300 text-[10px] md:text-sm whitespace-nowrap ${mode === 'reference' ? 'bg-cyan-600 text-white shadow-xl shadow-cyan-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
            >
              Referensi
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-10 items-start px-2 md:px-0">
          <div className="space-y-4 md:space-y-8">
            <section className="bg-slate-800/40 p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-700/50 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-500">Langkah 1: Unggah Sumber</h2>
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[8px] md:text-[10px] font-bold text-slate-400">01</div>
              </div>
              <ImageUploader onUpload={handleImageUpload} currentImage={sourceImage} />
            </section>

            {sourceImage && (
              <div className="animate-in slide-in-from-bottom-6 duration-500 space-y-4 md:space-y-8">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-500">Langkah 2: Konfigurasi AI</h2>
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[8px] md:text-[10px] font-bold text-slate-400">02</div>
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
                ) : mode === 'clothes' ? (
                  <ClothesMenu 
                    onApply={(p) => handleEdit(p, refImage)}
                    isLoading={status === AppStatus.PROCESSING}
                    aspectRatio={aspectRatio}
                    setAspectRatio={setAspectRatio}
                    refImage={refImage}
                    setRefImage={setRefImage}
                    isQuotaExhausted={quota <= 0}
                  />
                ) : (
                  <ReferenceEditMenu
                    onApply={(p) => handleEdit(p, refImage)}
                    isLoading={status === AppStatus.PROCESSING}
                    aspectRatio={aspectRatio}
                    setAspectRatio={setAspectRatio}
                    refImage={refImage}
                    setRefImage={setRefImage}
                    prompt={prompt}
                    setPrompt={setPrompt}
                    isQuotaExhausted={quota <= 0}
                  />
                )}
              </div>
            )}

            {errorMsg && <div className="px-2 md:px-0"><ErrorMessage message={errorMsg} /></div>}
          </div>

          <div className="space-y-4 md:space-y-8 sticky top-20 md:top-24">
            <section className="bg-slate-800/40 p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-700/50 shadow-2xl backdrop-blur-sm min-h-[400px] md:min-h-[580px] flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 md:mb-8">
                <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-500">Langkah 3: Output Preview</h2>
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[8px] md:text-[10px] font-bold text-slate-400">03</div>
              </div>
              
              <div ref={resultRef} className="flex-grow flex items-center justify-center relative bg-slate-950/50 rounded-2xl md:rounded-3xl border border-slate-800/50 shadow-inner group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none"></div>
                {status === AppStatus.PROCESSING && <LoadingOverlay />}
                <ResultGallery resultImage={resultImage} sourceImage={sourceImage} />
              </div>
            </section>

            {resultImage && (
              <button 
                onClick={() => { setSourceImage(null); setRefImage(null); setResultImage(null); setStatus(AppStatus.IDLE); setPrompt(''); }}
                className="w-full py-4 md:py-5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded-2xl md:rounded-3xl transition-all font-bold flex items-center justify-center gap-3 group shadow-xl text-sm md:text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-slate-500 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Ulang Project
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 md:py-8 border-t border-slate-800/50 text-center space-y-2 md:space-y-3">      
        <div className="flex flex-col items-center gap-2 px-2">
          <p className="text-slate-500 text-[10px] md:text-xs font-medium">© 2025 MAMBORO-AI STUDIO. All rights reserved.</p>
          <a 
            href="https://github.com/andrymamboro" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-[10px] md:text-xs font-semibold group"
          >
            <svg className="w-3 h-3 md:w-4 md:h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            andrymamboro
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;