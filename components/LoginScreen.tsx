
import React, { useState, useEffect } from 'react';
import Logo from './Logo';

interface UserProfile {
  name: string;
  email: string;
  picture: string;
}

interface Props {
  onLoginSuccess: (user: UserProfile) => void;
}

const MOCK_USERS: UserProfile[] = [
  { name: 'Andry Mamboro', email: 'andry.mamboro@gmail.com', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andry' },
  { name: 'Guest Designer', email: 'guest.designer@mamboro.ai', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest' },
  { name: 'Creative User', email: 'creative.user@gmail.com', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Creative' },
];

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
    
    // Artificial delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Integration with AI Studio API Key selection
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio.openSelectKey();
        }
      }
      onLoginSuccess(user);
    } catch (err) {
      console.error("Studio Key selection error:", err);
      onLoginSuccess(user);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 overflow-hidden relative text-white transition-opacity duration-1000 ${isMounting ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background Neon Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md relative z-10 text-center space-y-12 animate-in fade-in zoom-in duration-1000">
        <div className="space-y-6">
          <div className="mx-auto w-32 h-32 md:w-48 md:h-48 bg-black/80 backdrop-blur-xl border border-slate-800/50 rounded-full flex items-center justify-center shadow-[0_0_60px_-10px_rgba(0,255,255,0.3)] relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Logo size={120} />
          </div>
          <div className="space-y-1">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
              Mamboro<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">Ai</span>
            </h1>
            <p className="text-cyan-400 font-bold uppercase tracking-[0.4em] text-[10px] opacity-80">Professional Image Studio</p>
          </div>
        </div>

        <div className="space-y-8 bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-md shadow-2xl">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-100">Selamat Datang</h2>
            <p className="text-slate-400 text-sm max-w-[280px] mx-auto leading-relaxed">
              Masuk untuk mulai mengedit gambar dengan AI. Dapatkan <span className="text-cyan-400 font-bold">5 Token Gratis</span> setiap hari.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4 py-4">
                 <div className="w-10 h-10 border-4 border-slate-800 border-t-cyan-500 rounded-full animate-spin"></div>
                 <p className="text-xs text-cyan-500 font-bold animate-pulse tracking-widest uppercase">Authorizing Session...</p>
              </div>
            ) : (
              <button 
                onClick={() => setShowAccountPicker(true)}
                className="w-full group bg-white hover:bg-slate-50 text-slate-900 px-6 py-4 rounded-full font-bold text-base flex items-center justify-center gap-3 transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3 justify-center opacity-40">
            <div className="h-[1px] w-12 bg-slate-700"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Secured via OAuth 2.0</span>
            <div className="h-[1px] w-12 bg-slate-700"></div>
          </div>
        </div>

        <p className="text-[10px] text-slate-600 max-w-xs mx-auto">
          Mamboro-AI memerlukan akses ke profil Google Anda hanya untuk identifikasi kuota penggunaan. 
          <a href="#" className="text-cyan-500/80 hover:underline ml-1">Kebijakan Privasi</a>
        </p>
      </div>

      {/* Account Picker Modal (Simulated Google UI) */}
      {showAccountPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white text-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 pb-4 text-center">
              <div className="flex justify-center mb-4">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <h3 className="text-xl font-medium">Choose an account</h3>
              <p className="text-sm text-slate-500 mt-1">to continue to Mamboro-AI</p>
            </div>

            <div className="p-2 space-y-1">
              {MOCK_USERS.map((user) => (
                <button
                  key={user.email}
                  onClick={() => handleSelectAccount(user)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-slate-100 transition-colors text-left group"
                >
                  <img src={user.picture} alt="" className="w-10 h-10 rounded-full border border-slate-200" />
                  <div className="flex-grow">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              ))}
              
              <div className="p-4 border-t border-slate-100 flex items-center gap-4 hover:bg-slate-50 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-600">Use another account</p>
              </div>
            </div>

            <div className="p-6 text-[11px] text-slate-400 leading-relaxed">
              To continue, Google will share your name, email address, language preference, and profile picture with Mamboro-AI. Before using this app, you can review its <a href="#" className="text-blue-600 hover:underline">privacy policy</a> and <a href="#" className="text-blue-600 hover:underline">terms of service</a>.
            </div>
            
            <div className="bg-slate-50 p-4 flex justify-end">
              <button 
                onClick={() => setShowAccountPicker(false)}
                className="text-sm font-medium text-slate-500 hover:text-slate-700 px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="absolute bottom-8 text-slate-700 text-[10px] font-bold uppercase tracking-[0.3em]">
        © 2025 MAMBORO-AI STUDIO. INDONESIA.
      </p>
    </div>
  );
};

export default LoginScreen;
