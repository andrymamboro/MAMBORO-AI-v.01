
import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onResetQuota: () => void;
  quota: number;
}

const SettingsModal: React.FC<Props> = ({ isOpen, onClose, onResetQuota, quota }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Pengaturan</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-8 pb-8 space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Status Kuota</p>
              <p className="text-sm text-slate-200">Anda memiliki <span className="text-blue-400 font-bold">{quota} generasi</span> tersisa hari ini.</p>
            </div>

            <button 
              onClick={() => { onResetQuota(); onClose(); }}
              className="w-full py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/20 rounded-xl text-sm font-bold transition-all"
            >
              Reset Kuota (Dev Mode)
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <p className="text-[10px] text-slate-600 text-center leading-relaxed">
              Versi Aplikasi: 1.0.5 Pro<br/>
              © 2025 Mamboro-Ai Studio
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
