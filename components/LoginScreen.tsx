
import React, { useState, useEffect } from 'react';
import Logo from './Logo';

interface UserProfile {
  name: string;
  email: string;
  picture: string; // Tetap ada di tipe data, tapi kita akan mengosongkannya untuk memicu avatar inisial
}

interface Props {
  onLoginSuccess: (user: UserProfile) => void;
}

const MOCK_USERS: UserProfile[] = [
  { 
    name: 'Andry Mamboro', 
    email: 'andry.mamboro@gmail.com', 
    picture: '' 
  },
  { 
    name: 'Budi Santoso', 
    email: 'budi.santoso@mamboro.ai', 
    picture: '' 
  },
  { 
    name: 'Siti Aminah', 
    email: 'siti.aminah@gmail.com', 
    picture: '' 
  },
];

// Helper untuk mendapatkan warna berdasarkan inisial
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
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [isMounting, setIsMounting] = useState(false);

  useEffect(() => {
    setIsMounting(true);
  }, []);

  const handleSelectAccount = async (user: UserProfile) => {
    setIsLoading(true);
    setShowAccountPicker(false);
    
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio.openSelectKey();
        }
      }
      onLoginSuccess(user);
    } catch (err) {
      onLoginSuccess(user);
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
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">Gunakan akun Google untuk masuk ke Studio Editing Mamboro-AI.</p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center gap-4 py-6">
               <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
               <p className="text-[10px] text-blue-500 font-bold tracking-widest uppercase">Sinkronisasi Akun...</p>
            </div>
          ) : (
            <button 
              onClick={() => setShowAccountPicker(true)}
              className="w-full group bg-white hover:bg-slate-50 text-slate-900 px-6 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-xl hover:translate-y-[-2px] active:translate-y-[0px]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Masuk dengan Google
            </button>
          )}
          
          <p className="mt-8 text-[10px] text-slate-600 font-medium">© 2025 MAMBORO-AI • INDONESIA</p>
        </div>
      </div>

      {showAccountPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white text-slate-900 w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-8 pb-4 text-center">
              <div className="flex justify-center mb-4">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold">Pilih Akun</h3>
              <p className="text-xs text-slate-500 mt-1">untuk melanjutkan ke Mamboro-AI</p>
            </div>

            <div className="p-2 space-y-1">
              {MOCK_USERS.map((user) => (
                <button
                  key={user.email}
                  onClick={() => handleSelectAccount(user)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left group rounded-xl"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner ${getAvatarColor(user.name)}`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-sm">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-300 group-hover:text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              ))}
            </div>

            <div className="p-6 text-[10px] text-slate-400 border-t border-slate-100 mt-2">
              {/* Kalimat dihapus sesuai permintaan */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
