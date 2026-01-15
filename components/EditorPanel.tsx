import React from 'react';
import { AspectRatio } from '../types';

interface Props {
  prompt: string;
  setPrompt: (val: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (val: AspectRatio) => void;
  onEdit: () => void;
  isLoading: boolean;
  isQuotaExhausted?: boolean;
}

const ratios: AspectRatio[] = ["1:1", "4:3", "3:4", "16:9", "9:16"];

const EditorPanel: React.FC<Props> = ({ 
  prompt, 
  setPrompt, 
  aspectRatio, 
  setAspectRatio, 
  onEdit,
  isLoading,
  isQuotaExhausted = false
}) => {
  return (
    <section className="bg-slate-800/50 p-4 md:p-6 rounded-2xl border border-slate-700 backdrop-blur-sm shadow-xl space-y-4 md:space-y-6">
      <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-white">
        <span className="p-1.5 md:p-2 bg-green-500/20 rounded-lg text-green-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </span>
        Parameter Edit
      </h2>

      <div>
        <label className="block text-[10px] md:text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">
          Apa yang ingin Anda ubah?
        </label>
        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Contoh: 'Tambahkan matahari terbenam', 'Ubah warna baju'..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 md:p-4 text-sm md:text-base text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none h-24 md:h-32 resize-none"
        />
      </div>

      <div>
        <label className="block text-[10px] md:text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">
          Rasio Aspek
        </label>
        <div className="grid grid-cols-5 gap-1.5 md:gap-2">
          {ratios.map((r) => (
            <button
              key={r}
              onClick={() => setAspectRatio(r)}
              className={`py-2 px-0.5 rounded-lg text-[10px] md:text-xs font-bold transition-all border ${
                aspectRatio === r 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onEdit}
        disabled={isLoading || !prompt.trim() || isQuotaExhausted}
        className={`w-full py-3.5 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all flex items-center justify-center gap-3 ${
          isLoading || !prompt.trim() || isQuotaExhausted
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/20'
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            Memproses...
          </>
        ) : isQuotaExhausted ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Kuota Habis
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Terapkan
          </>
        )}
      </button>
      {isQuotaExhausted && (
        <p className="text-[9px] md:text-[10px] text-red-400 text-center font-bold uppercase tracking-widest">Tunggu esok hari untuk kuota baru</p>
      )}
    </section>
  );
};

export default EditorPanel;