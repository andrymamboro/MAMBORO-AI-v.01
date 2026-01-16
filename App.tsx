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

interface UserProfile {
  name: string;
  email: string;
  picture: string;
}

type AppMode = 'general' | 'clothes' | 'reference';
const MAX_DAILY_QUOTA = 5;
const AUTH_KEY = 'mamboro_user_profile_v2';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  
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

  // Inisialisasi kuota berdasarkan EMAIL user
  useEffect(() => {
    if (!user) return;

    const initQuota = () => {
      const today = new Date().toISOString().split('T')[0];
      const quotaKey = `quota_${user.email}`;
      const resetKey = `reset_${user.email}`;
      
      const lastReset = localStorage.getItem(resetKey);
      const storedQuota = localStorage.getItem(quotaKey);

      if (lastReset !== today) {
        setQuota(MAX_DAILY_QUOTA);
        localStorage.setItem(quotaKey, MAX_DAILY_QUOTA.toString());
        localStorage.setItem(resetKey, today);
      } else if (storedQuota !== null) {
        setQuota(parseInt(storedQuota, 10));
      } else {
        setQuota(MAX_DAILY_QUOTA);
        localStorage.setItem(quotaKey, MAX_DAILY_QUOTA.toString());
        localStorage.setItem(resetKey, today);
      }
    };
    
    initQuota();
  }, [user]);

  const handleLogin = (profile: UserProfile) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(profile));
    setUser(profile);
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
    setIsSettingsOpen(false);
    setSourceImage(null);
    setRefImage(null);
    setResultImage(null);
    setStatus(AppStatus.IDLE);
  };

  const handleImageUpload = (base64: string) => {
    setSourceImage(base64);
    setResultImage(null);
    setStatus(AppStatus.IDLE);
    setErrorMsg(null);
  };

  const handleEdit = async (customPrompt?: string, customRefImage?: string | null) => {
    if (quota <= 0) {
      setErrorMsg("Kuota harian aplikasi Anda telah habis. Silakan coba lagi besok.");
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
      if (user) {
        localStorage.setItem(`quota_${user.email}`, newQuota.toString());
      }
      
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    } catch (err: any) {
      console.error("Edit Error:", err);
      setStatus(AppStatus.ERROR);
      
      const errMsg = err.message || "";
      if (errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("Quota exceeded") || errMsg.includes("429")) {
         setErrorMsg("Kuota API Google (Free Tier) telah habis atau terbatas. Disarankan menggunakan API Key dari Project Google Cloud yang memiliki Penagihan (Paid Project). Silakan buka Pengaturan untuk memperbarui kunci.");
      } else if (errMsg.includes("Requested entity was not found") || errMsg.includes("API key not valid")) {
         setErrorMsg("Koneksi API bermasalah. Silakan pilih kembali Kunci API Anda di menu Pengaturan.");
      } else {
         setErrorMsg(errMsg || "Terjadi kegagalan sistem. Coba beberapa saat lagi.");
      }
    }
  };

  if (!user) return <LoginScreen onLoginSuccess={handleLogin} />;

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-100 animate-in fade-in duration-700 overflow-x-hidden">
      <Header 
        onOpenSettings={() => setIsSettingsOpen(true)}
        quota={quota} 
        maxQuota={MAX_DAILY_QUOTA}
        user={user}
      />
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        onLogout={handleLogout}
        quota={quota}
        user={user}
      />

      <main className="flex-grow w-full max-w-6xl mx-auto md:px-4 py-2 md:py-8">
        <div className="mb-4 md:mb-10 p-3 md:p-4 mx-2 md:mx-0 bg-gradient-to-br from-indigo-600/10 via-slate-800/40 to-blue-600/10 border border-slate-700/30 rounded-2xl md:rounded-[2rem] flex items-center gap-3 md:gap-4 shadow-xl backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10 overflow-hidden pl-2">
            <h2 className="text-xs md:text-sm font-bold text-slate-300 tracking-wide uppercase opacity-70 truncate">
              Welcome back, <span className="text-white">{user.name.split(' ')[0]}</span>
            </h2>
          </div>
          <div className="ml-auto flex gap-3 relative z-10">
             <div className="px-2 md:px-3 py-1 md:py-1.5 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 md:gap-2 whitespace-nowrap">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
               AI Neural Link Active
             </div>
          </div>
        </div>

        <div className="flex justify-center mb-6 md:mb-10 px-2 md:px-0">
          <div className="bg-slate-900/80 p-1.5 rounded-2xl md:rounded-3xl border border-slate-700 backdrop-blur-md flex w-full md:w-auto gap-1 shadow-2xl overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setMode('general')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-6 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl font-bold transition-all duration-300 text-[10px] md:text-sm whitespace-nowrap ${mode === 'general' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 md:w-5 md:h-5 ${mode === 'general' ? 'text-white' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Umum
            </button>
            <button 
              onClick={() => setMode('clothes')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-6 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl font-bold transition-all duration-300 text-[10px] md:text-sm whitespace-nowrap ${mode === 'clothes' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 md:w-5 md:h-5 ${mode === 'clothes' ? 'text-white' : 'text-indigo-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.38 3.46 16 2a4 4 0 0 0-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
              </svg>
              Ganti Baju
            </button>
            <button 
              onClick={() => setMode('reference')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-6 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl font-bold transition-all duration-300 text-[10px] md:text-sm whitespace-nowrap ${mode === 'reference' ? 'bg-cyan-600 text-white shadow-xl shadow-cyan-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 md:w-5 md:h-5 ${mode === 'reference' ? 'text-white' : 'text-cyan-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Referensi
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-10 items-start px-2 md:px-0">
          <div className="space-y-4 md:space-y-8">
            <section className="bg-slate-800/40 p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-700/50 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-500">Langkah 1: Unggah Gambar</h2>
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
                <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-500">Langkah 3: Preview Output</h2>
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
                Reset Studio
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-slate-800/50 text-center space-y-4">      
        <div className="flex flex-col items-center gap-4">
          <a 
            href="https://github.com/andrymamboro" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 rounded-full text-[10px] md:text-xs font-bold text-slate-400 hover:text-white transition-all group shadow-lg"
          >
            <svg className="w-4 h-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>View GitHub andrymamboro</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <p className="text-slate-500 text-[10px] md:text-xs font-medium uppercase tracking-[0.2em]">© 2025 MAMBORO-AI STUDIO. INDONESIA.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;