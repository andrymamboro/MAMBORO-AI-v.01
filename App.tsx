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
      setErrorMsg(err.message || "Terjadi kesalahan.");
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
        <div className="flex justify-center mb-6 md:mb-10 px-2 md:px-0">
          <div className="bg-slate-900/80 p-1.5 rounded-2xl md:rounded-3xl border border-slate-700 backdrop-blur-md flex w-full md:w-auto gap-1 shadow-2xl overflow-x-auto no-scrollbar">
            <button onClick={() => setMode('general')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-6 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl font-bold transition-all duration-300 text-[10px] md:text-sm whitespace-nowrap ${mode === 'general' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Umum</button>
            <button onClick={() => setMode('clothes')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-6 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl font-bold transition-all duration-300 text-[10px] md:text-sm whitespace-nowrap ${mode === 'clothes' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Ganti Baju</button>
            <button onClick={() => setMode('reference')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-6 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl font-bold transition-all duration-300 text-[10px] md:text-sm whitespace-nowrap ${mode === 'reference' ? 'bg-cyan-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Referensi</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-10 items-start px-2 md:px-0">
          <div className="space-y-4 md:space-y-8">
            <section className="bg-slate-800/40 p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-700/50 shadow-2xl backdrop-blur-sm">
              <ImageUploader onUpload={handleImageUpload} currentImage={sourceImage} />
            </section>

            {sourceImage && (
              <div className="animate-in slide-in-from-bottom-6 duration-500 space-y-4 md:space-y-8">
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

          <div className="space-y-4 md:space-y-8 sticky top-20 md:top-24">
            <section className="bg-slate-800/40 p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-700/50 shadow-2xl backdrop-blur-sm min-h-[400px] md:min-h-[580px] flex flex-col relative overflow-hidden">
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