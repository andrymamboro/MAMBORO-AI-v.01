import React from 'react';
import Logo from './Logo';

interface Props {
  onOpenSettings: () => void;
  quota?: number;
  maxQuota?: number;
}

const Header: React.FC<Props> = ({ onOpenSettings, quota = 0, maxQuota = 5 }) => {
  const isLow = quota <= 1;
  const isEmpty = quota === 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-black p-1 rounded-xl border border-slate-800 shadow-inner">
            <Logo size={32} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">
              Mamboro<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">Ai</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-cyan-400/80 font-bold mt-1">Image Studio</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          {/* Quota Display */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
            isEmpty 
              ? 'bg-red-500/10 border-red-500/30 text-red-400' 
              : isLow 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
          }`}>
            <span className="text-[10px] md:text-xs font-bold tracking-tight">Token : {quota}/{maxQuota}</span>
          </div>

          <button 
            onClick={onOpenSettings}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700"
            title="Pengaturan"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;