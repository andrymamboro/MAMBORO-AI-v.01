import React from 'react';
import Logo from './components/Logo';
import { getAvatarColor } from './components/LoginScreen';

interface UserProfile {
  name: string;
  email: string;
  picture: string;
}

interface Props {
  onOpenSettings: () => void;
  quota?: number;
  maxQuota?: number;
  user: UserProfile;
}

const Header: React.FC<Props> = ({ onOpenSettings, quota = 0, maxQuota = 5, user }) => {
  const isLow = quota <= 1;
  const isEmpty = quota === 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-black p-1 md:p-1.5 rounded-lg md:rounded-xl border border-slate-800 shadow-inner group cursor-pointer" onClick={() => window.location.reload()}>
            <Logo size={28} className="md:w-8 md:h-8" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm sm:text-lg md:text-xl font-black tracking-tighter text-white leading-none">
              MAMBORO<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">AI</span>
            </h1>
            <p className="text-[7px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-cyan-400/60 font-black mt-0.5 sm:mt-1">Image Studio</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-5">
          <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border transition-all ${
            isEmpty 
              ? 'bg-red-500/10 border-red-500/20 text-red-400' 
              : isLow 
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
          }`}>
            <span className="text-[8px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-1 sm:gap-2">
              <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${isEmpty ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-cyan-500'} animate-pulse`}></span>
              {quota} <span className="hidden xs:inline">Tokens</span>
            </span>
          </div>

          <div 
            onClick={onOpenSettings}
            className="flex items-center gap-2 md:gap-3 pl-2 sm:pl-3 pr-1 py-1 bg-slate-900 border border-slate-800 rounded-full hover:border-slate-600 transition-all cursor-pointer group"
          >
            <div className="hidden sm:block text-right">
               <p className="text-[10px] font-bold text-white leading-tight">{user.name}</p>
               <p className="text-[9px] text-slate-500 font-medium">{user.email}</p>
            </div>
            
            {user.picture ? (
              <img 
                src={user.picture} 
                alt={user.name} 
                className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border border-slate-700 shadow-lg group-hover:scale-105 transition-transform object-cover" 
              />
            ) : (
              <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border border-slate-700 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center text-white font-bold text-[10px] sm:text-xs md:text-base ${getAvatarColor(user.name)}`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;