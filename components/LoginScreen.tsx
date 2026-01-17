import React, { useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup } from '../services/firebase';
import Logo from './Logo';

interface UserProfile {
  name: string;
  email: string;
  picture: string; 
}

interface Props {
  onLoginSuccess: (user: UserProfile) => void;
}

export const getAvatarColor = (name: string) => {
  const char = name.charAt(0).toUpperCase();
  const colors: Record<string, string> = {
    'A': 'bg-blue-600',
    'B': 'bg-green-600',
    'C': 'bg-yellow-600',
    'D': 'bg-red-600',
    'E': 'bg-indigo-600',
    'F': 'bg-pink-600',
    'G': 'bg-purple-600',
    'H': 'bg-cyan-600',
    'I': 'bg-orange-600',
    'J': 'bg-teal-600',
    'K': 'bg-lime-600',
    'L': 'bg-emerald-600',
    'M': 'bg-violet-600',
    'N': 'bg-fuchsia-600',
    'S': 'bg-rose-600',
  };
  return colors[char] || 'bg-slate-600';
};

const LoginScreen: React.FC<Props> = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounting, setIsMounting] = useState(false);

  useEffect(() => {
    setIsMounting(true);
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      onLoginSuccess({
        name: user.displayName || 'User',
        email: user.email || '',
        picture: user.photoURL || ''
      });
    } catch (err: any) {
      console.error("Firebase Login Error:", err);
      setError("Gagal masuk dengan Google. Pastikan konfigurasi Firebase benar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 overflow-hidden relative text-white transition-opacity duration-1000 ${isMounting ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>

      <div className="w-full max-w-md relative z-10 text-center space-y-12 animate-in fade-in zoom-in duration-700">
        <div className="space-y-6">
          <div className="mx-auto w-32 h-32 md:w-40 md:h-40 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center shadow-2xl relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Logo size={100} />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
              MAMBORO<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">AI</span>
            </h1>
            <p className="text-blue-400 font-bold uppercase tracking-[0.4em] text-[10px] opacity-80">Pro Image Studio</p>
          </div>
        </div>

        <div className="bg-slate-900/60 p-8 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-xl shadow-2xl">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-100">Selamat Datang</h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">Masuk ke Studio Editing Mamboro-AI.</p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center gap-4 py-6">
               <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
               <p className="text-[10px] text-blue-500 font-bold tracking-widest uppercase">Sinkronisasi Keamanan...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <button 
                onClick={handleGoogleLogin}
                className="w-full group bg-white hover:bg-slate-50 text-slate-900 px-6 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-xl hover:translate-y-[-2px] active:translate-y-[0px]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Masuk dengan Google
              </button>
              
              {error && (
                <p className="text-red-400 text-[10px] font-bold uppercase tracking-tight">{error}</p>
              )}
            </div>
          )}
          
          <p className="mt-8 text-[10px] text-slate-600 font-medium">© 2025 MAMBORO-AI • INDONESIA</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;