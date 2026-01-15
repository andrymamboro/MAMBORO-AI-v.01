
import React, { useState, useRef } from 'react';
import { AspectRatio } from '../types';

interface Props {
  onApply: (prompt: string) => void;
  isLoading: boolean;
  aspectRatio: AspectRatio;
  setAspectRatio: (val: AspectRatio) => void;
  refImage: string | null;
  setRefImage: (val: string | null) => void;
  isQuotaExhausted?: boolean;
}

const clothingStyles = [
  { id: 'suit', label: 'Setelan Jas Formal', icon: '👔', prompt: 'ganti pakaian menjadi setelan jas formal hitam yang rapi dan mewah' },
  { id: 'batik', label: 'Kemeja Batik', icon: '🎨', prompt: 'ganti pakaian menjadi kemeja batik Indonesia modern dengan motif yang elegan' },
  { id: 'casual', label: 'Kaos & Jaket', icon: '👕', prompt: 'ganti pakaian menjadi kaos putih and jaket denim casual modern' },
  { id: 'traditional', label: 'Baju Adat', icon: '🎭', prompt: 'ganti pakaian menjadi baju adat tradisional Indonesia yang megah' },
  { id: 'sport', label: 'Pakaian Olahraga', icon: '👟', prompt: 'ganti pakaian menjadi setelan jersey olahraga profesional yang stylish' },
  { id: 'doctor', label: 'Jas Dokter', icon: '🥼', prompt: 'ganti pakaian menjadi jas putih dokter yang bersih and profesional' },
];

const ratios: AspectRatio[] = ["1:1", "4:3", "3:4", "16:9", "9:16"];

const ClothesMenu: React.FC<Props> = ({ 
  onApply, 
  isLoading, 
  aspectRatio, 
  setAspectRatio,
  refImage,
  setRefImage,
  isQuotaExhausted = false
}) => {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [customDetail, setCustomDetail] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRefImage(reader.result as string);
        setSelectedStyle('custom_ref');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = () => {
    if (isQuotaExhausted) return;

    let finalPrompt = '';
    
    if (refImage) {
      finalPrompt = `Ganti pakaian subjek agar persis seperti pakaian dalam gambar referensi kedua. ${customDetail ? `Gunakan detail tambahan: ${customDetail}.` : ''} Pertahankan bentuk tubuh dan wajah subjek asli.`;
    } else {
      const style = clothingStyles.find(s => s.id === selectedStyle);
      if (style) {
        finalPrompt = `${style.prompt}. ${customDetail ? `Gunakan detail tambahan: ${customDetail}.` : ''} Pastikan wajah dan latar belakang tetap asli.`;
      }
    }

    if (finalPrompt) {
      onApply(finalPrompt);
    }
  };

  return (
    <section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 backdrop-blur-sm shadow-xl space-y-6 animate-in slide-in-from-right-4 duration-500">
      <h2 className="text-xl font-bold flex items-center gap-2 text-white">
        <span className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.38 3.46 16 2a4 4 0 0 0-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
          </svg>
        </span>
        Pilih Pakaian Baru
      </h2>

      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
          Referensi Gambar Pakaian (Optional)
        </label>
        {refImage ? (
          <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-indigo-500/50 group bg-slate-900">
            <img src={refImage} alt="Reference" className="w-full h-full object-contain" />
            <button 
              onClick={() => setRefImage(null)}
              className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-24 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all bg-slate-900/30 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="text-[10px] font-bold text-slate-500 group-hover:text-indigo-300">UNGGAH CONTOH BAJU</span>
          </div>
        )}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-700"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#1e293b] px-2 text-xs text-slate-500 font-bold italic">ATAU PILIH PRESET</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {clothingStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => {
              setSelectedStyle(style.id);
              setRefImage(null);
            }}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all duration-200 ${
              selectedStyle === style.id && !refImage
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20 scale-[1.02]' 
                : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            <span className="text-3xl">{style.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-tight text-center">{style.label}</span>
          </button>
        ))}
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
          Detail Tambahan (Opsional)
        </label>
        <input 
          type="text"
          value={customDetail}
          onChange={(e) => setCustomDetail(e.target.value)}
          placeholder="Contoh: warna merah, bahan sutra, motif garis..."
          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm transition-all"
        />
      </div>

      <button
        onClick={handleApply}
        disabled={isLoading || (!selectedStyle && !refImage) || isQuotaExhausted}
        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
          isLoading || (!selectedStyle && !refImage) || isQuotaExhausted
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-600/20'
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            Menjahit...
          </>
        ) : isQuotaExhausted ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Kuota Habis
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Ganti Sekarang
          </>
        )}
      </button>
      {isQuotaExhausted && (
        <p className="text-[10px] text-red-400 text-center font-bold uppercase tracking-widest">Upgrade atau tunggu esok hari untuk kuota baru</p>
      )}
    </section>
  );
};

export default ClothesMenu;
