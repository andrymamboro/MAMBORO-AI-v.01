import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  quota: number;
}

const SettingsModal: React.FC<Props> = ({ isOpen, onClose, onLogout, quota }) => {
  if (!isOpen) return null;

  const handleChangeKey = async () => {
    try {
      if (window.aistudio) {
        await window.aistudio.openSelectKey();
        onClose();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-white leading-tight">Pengaturan</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Google AI Cloud Session</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-8 pb-8 space-y-6 mt-4">
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex items-center justify-between group">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Status Kuota</p>
                <p className="text-sm text-slate-200">Tersisa <span className="text-cyan-400 font-bold">{quota} generasi</span> hari ini.</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-500">
                {quota}
              </div>
            </div>

            <button 
              onClick={handleChangeKey}
              className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Ganti Akun API Google
            </button>

            <button 
              onClick={onLogout}
              className="w-full py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout dari Mamboro-AI
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <p className="text-[10px] text-slate-600 text-center leading-relaxed">
              Versi Aplikasi: 1.1.0 Image<br/>
              Mamboro-Ai Pro Studio menggunakan infrastruktur Google Cloud.<br/>
              © 2025 Mamboro-Ai Studio
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;