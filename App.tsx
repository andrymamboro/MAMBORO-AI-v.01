import React, { useState, useEffect, useRef } from 'react';
import { processImageEdit } from './services/geminiService';
import { auth, onAuthStateChanged } from './services/firebase';
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

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
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

  // Monitor Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          picture: firebaseUser.photoURL || ''
        });
      } else {
        setUser(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync Quota based on user email
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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsSettingsOpen(false);
      setSourceImage(null);
      setRefImage(null);
      setResultImage(null);
      setStatus(AppStatus.IDLE);
    } catch (error) {
      console.error("Logout error", error);
    }
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
      setErrorMsg(err.message || "Terjadi kesalahan pada layanan AI. Silakan coba beberapa saat lagi.");
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-400 font-bold uppercase tracking-widest text-xs">Menghubungkan...</p>
        </div>
      </div>
    );
  }

  if (!user) return <LoginScreen onLoginSuccess={() => {}} />;

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

      <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 py-4 md:py-6">
        <div className="flex justify-center mb-6 md:mb-8 px-2 md:px-0">
          <div className="bg-slate-900/80 p-1.5 rounded-2xl md:rounded-3xl border border-slate-700 backdrop-blur-md flex w-full md:w-auto gap-2 shadow-2xl overflow-x-auto no-scrollbar">
            {/* Tab Umum */}
            <button 
              onClick={() => setMode('general')} 
              className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-5 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black transition-all duration-300 text-[11px] md:text-sm whitespace-nowrap group ${
                mode === 'general' ? 'bg-blue-600 text-white ring-2 ring-blue-500/20' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className={`p-1 rounded-lg transition-all ${mode === 'general' ? 'bg-white/20 scale-110' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="gradUmumMagic" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                  <path d="M15 4L16 6M20 9L22 10M17 10L19 12M5 19L14 10L11 7L2 16L5 19Z" stroke={mode === 'general' ? 'white' : 'url(#gradUmumMagic)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              Umum
            </button>
            
            {/* Tab Ganti Baju */}
            <button 
              onClick={() => setMode('clothes')} 
              className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-5 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black transition-all duration-300 text-[11px] md:text-sm whitespace-nowrap group ${
                mode === 'clothes' ? 'bg-indigo-600 text-white ring-2 ring-indigo-500/20' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className={`p-1 rounded-lg transition-all ${mode === 'clothes' ? 'bg-white/20 scale-110' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="gradClothesHanger" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                  <path d="M12 2V5M12 5C14.5 5 18 7.5 21 11H3C6 7.5 9.5 5 12 5ZM12 2C13 2 14 3 14 4C14 5 13 6 12 6" stroke={mode === 'clothes' ? 'white' : 'url(#gradClothesHanger)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              Ganti Baju
            </button>
            
            {/* Tab Referensi */}
            <button 
              onClick={() => setMode('reference')} 
              className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-5 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black transition-all duration-300 text-[11px] md:text-sm whitespace-nowrap group ${
                mode === 'reference' ? 'bg-cyan-600 text-white ring-2 ring-cyan-500/20' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className={`p-1 rounded-lg transition-all ${mode === 'reference' ? 'bg-white/20 scale-110' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="gradRefGallery" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <rect x="3" y="7" width="14" height="14" rx="2" stroke={mode === 'reference' ? 'white' : 'url(#gradRefGallery)'} strokeWidth="2.5" strokeLinejoin="round"/>
                </svg>
              </div>
              Referensi
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] gap-6 md:gap-8 items-start">
          <div className="space-y-6">
            <section className="bg-slate-800/40 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-700/50 shadow-2xl backdrop-blur-sm">
              <ImageUploader onUpload={handleImageUpload} currentImage={sourceImage} />
            </section>

            {sourceImage && (
              <div className="animate-in slide-in-from-bottom-6 duration-500 space-y-6">
                {mode === 'general' ? (
                  <EditorPanel prompt={prompt} setPrompt={setPrompt} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} onEdit={() => handleEdit()} isLoading={status === AppStatus.PROCESSING} isQuotaExhausted={quota <= 0} />
                ) : mode === 'clothes' ? (
                  <ClothesMenu onApply={(p) => handleEdit(p, refImage)} isLoading={status === AppStatus.PROCESSING} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} refImage={refImage} setRefImage={setRefImage} isQuotaExhausted={quota <= 0} />
                ) : (
                  <ReferenceEditMenu onApply={(p) => handleEdit(p, refImage)} isLoading={status === AppStatus.PROCESSING} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} refImage={refImage} setRefImage={setRefImage} prompt={prompt} setPrompt={setPrompt} isQuotaExhausted={quota <= 0} />
                )}
              </div>
            )}

            {errorMsg && <ErrorMessage message={errorMsg} />}
          </div>

          <div className="space-y-6 lg:sticky lg:top-24 h-fit">
            <section className="bg-slate-800/40 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-700/50 shadow-2xl backdrop-blur-sm flex flex-col relative overflow-hidden h-full min-h-[500px] lg:min-h-[calc(100vh-160px)]">
              <div ref={resultRef} className="flex-grow flex items-center justify-center relative bg-slate-950/50 rounded-2xl md:rounded-3xl border border-slate-800/50 shadow-inner group overflow-hidden">
                {status === AppStatus.PROCESSING && <LoadingOverlay />}
                <ResultGallery resultImage={resultImage} sourceImage={sourceImage} />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;