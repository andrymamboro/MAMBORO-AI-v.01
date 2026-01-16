import React, { useRef } from 'react';
import { AspectRatio } from '../types';

interface Props {
  onApply: (prompt: string) => void;
  isLoading: boolean;
  aspectRatio: AspectRatio;
  setAspectRatio: (val: AspectRatio) => void;
  refImage: string | null;
  setRefImage: (val: string | null) => void;
  prompt: string;
  setPrompt: (val: string) => void;
  isQuotaExhausted?: boolean;
}

const ratios: AspectRatio[] = ["1:1", "4:3", "3:4", "16:9", "9:16"];

const ReferenceEditMenu: React.FC<Props> = ({ 
  onApply, 
  isLoading, 
  aspectRatio, 
  setAspectRatio,
  refImage,
  setRefImage,
  prompt,
  setPrompt,
  isQuotaExhausted = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRefImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="bg-slate-800/50 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-700 backdrop-blur-sm shadow-xl space-y-4 md:space-y-5 animate-in slide-in-from-right-4 duration-500">
      <h2 className="text-base md:text-lg font-bold flex items-center gap-2 text-white">
        <span className="p-1.5 bg-cyan-500/20 rounded-lg text-cyan-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </span>
        Edit Referensi
      </h2>

      <div className="space-y-2.5">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Gambar Referensi (Gaya/Objek)
        </label>
        {refImage ? (
          <div className="relative w-full h-28 md:h-36 rounded-xl overflow-hidden border border-cyan-500/50 group bg-slate-900">
            <img src={refImage} alt="Reference" className="w-full h-full object-contain" />
            <button 
              onClick={() => setRefImage(null)}
              className="absolute top-1.5 right-1.5 p-1 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-16 border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all bg-slate-900/30 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600 group-hover:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="text-[9px] font-bold text-slate-500 group-hover:text-cyan-300">UNGGAH REFERENSI</span>
          </div>
        )}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      </div>

      <div className="space-y-2">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Instruksi Perubahan
        </label>
        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Contoh: 'Terapkan gaya ini ke subjek'..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none h-20 resize-none transition-all"
        />
      </div>

      <div>
        <label className="block text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest">
          Rasio Aspek
        </label>
        <div className="grid grid-cols-5 gap-2">
          {ratios.map((r) => (
            <button
              key={r}
              onClick={() => setAspectRatio(r)}
              className={`py-2 rounded-lg text-[10px] font-bold transition-all border ${
                aspectRatio === r 
                  ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-600/20' 
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onApply(prompt)}
        disabled={isLoading || !prompt.trim() || !refImage || isQuotaExhausted}
        className={`w-full py-3.5 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3 ${
          isLoading || !prompt.trim() || !refImage || isQuotaExhausted
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-xl shadow-cyan-600/20'
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            Memproses...
          </>
        ) : isQuotaExhausted ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Kuota Habis
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Terapkan
          </>
        )}
      </button>
    </section>
  );
};

export default ReferenceEditMenu;