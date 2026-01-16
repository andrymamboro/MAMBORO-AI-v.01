import React from 'react';
import { getAvatarColor } from './LoginScreen';

interface UserProfile {
  name: string;
  email: string;
  picture: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  quota: number;
  user: UserProfile;
}

const SettingsModal: React.FC<Props> = ({ isOpen, onClose, onLogout, quota, user }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-white leading-tight">Akun Saya</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1">Sesi Aktif Google</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2.5 bg-white/5 hover:bg-white/10 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-8 pb-10 space-y-6">
          <div className="flex flex-col items-center py-6 gap-4">
             <div className="relative">
                {user.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-24 h-24 rounded-full border-4 border-slate-800 shadow-2xl object-cover" 
                  />
                ) : (
                  <div className={`w-24 h-24 rounded-full border-4 border-slate-800 shadow-2xl flex items-center justify-center text-white font-bold text-4xl ${getAvatarColor(user.name)}`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 border-4 border-slate-900 rounded-full flex items-center justify-center">
                   <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
             </div>
             <div className="text-center">
                <h3 className="text-xl font-bold text-white">{user.name}</h3>
                <p className="text-sm text-slate-500">{user.email}</p>
             </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-slate-800/40 rounded-3xl border border-slate-800 flex items-center justify-between group">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status Token Harian</p>
                <p className="text-base text-slate-200">Tersisa <span className="text-blue-400 font-black">{quota} token</span></p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-black text-blue-400">
                {quota}
              </div>
            </div>

            <button 
              onClick={onLogout}
              className="w-full py-4 bg-red-500/5 hover:bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-3"
            >
              Keluar Sesi Google
            </button>
          </div>

          <div className="pt-6 border-t border-slate-800">
            <p className="text-[10px] text-slate-600 text-center leading-relaxed font-medium">
              V2.1.0 (Google Identity Synced)<br/>
              MAMBORO-AI STUDIO © 2025.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;