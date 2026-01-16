import React, { useState } from 'react';

interface Props {
  resultImage: string | null;
  sourceImage: string | null;
}

const ResultGallery: React.FC<Props> = ({ resultImage, sourceImage }) => {
  const [activeTab, setActiveTab] = useState<'result' | 'original'>('result');

  if (!resultImage) {
    return (
      <div className="text-center text-slate-500 p-6">
        <div className="mb-4 text-slate-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 md:w-16 md:h-16 mx-auto opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="font-bold text-xs md:text-sm uppercase tracking-widest text-slate-600">Hasil Render</p>
        <p className="text-[10px] md:text-xs mt-1 text-slate-500">Silakan unggah gambar dan pilih instruksi untuk melihat hasil.</p>
      </div>
    );
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `mamboro-ai-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col h-full animate-in fade-in duration-500 p-2 md:p-4">
      <div className="flex bg-slate-900/50 backdrop-blur-sm rounded-xl p-1 mb-3 md:mb-4 self-center border border-slate-700/50">
        <button 
          onClick={() => setActiveTab('result')}
          className={`px-4 py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'result' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Hasil
        </button>
        <button 
          onClick={() => setActiveTab('original')}
          className={`px-4 py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'original' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Asli
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 bg-black flex-grow flex items-center justify-center min-h-0">
        <img 
          src={activeTab === 'result' ? resultImage : (sourceImage || '')} 
          alt="Result" 
          className="max-w-full h-auto max-h-full object-contain transition-all" 
        />
        
        <button 
          onClick={handleDownload}
          className="absolute bottom-3 right-3 md:bottom-4 md:right-4 p-2.5 md:p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-2xl transition-all flex items-center gap-2 group border border-blue-400/50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Simpan</span>
        </button>
      </div>
    </div>
  );
};

export default ResultGallery;