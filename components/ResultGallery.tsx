
import React, { useState } from 'react';

interface Props {
  resultImage: string | null;
  sourceImage: string | null;
}

const ResultGallery: React.FC<Props> = ({ resultImage, sourceImage }) => {
  const [activeTab, setActiveTab] = useState<'result' | 'original'>('result');

  if (!resultImage) {
    return (
      <div className="text-center text-slate-500">
        <div className="mb-4 text-slate-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 mx-auto opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="font-medium">The edited image will appear here.</p>
        <p className="text-sm">Configure your edit and press 'Apply Changes'</p>
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
    <div className="w-full flex flex-col h-full">
      <div className="flex bg-slate-900 rounded-lg p-1 mb-4 self-center border border-slate-700">
        <button 
          onClick={() => setActiveTab('result')}
          className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
            activeTab === 'result' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Edited
        </button>
        <button 
          onClick={() => setActiveTab('original')}
          className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
            activeTab === 'original' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Original
        </button>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black flex-grow flex items-center justify-center">
        <img 
          src={activeTab === 'result' ? resultImage : (sourceImage || '')} 
          alt="Result" 
          className="max-w-full h-auto max-h-[600px] object-contain animate-in fade-in zoom-in duration-300" 
        />
        
        <button 
          onClick={handleDownload}
          className="absolute bottom-4 right-4 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg transition-all flex items-center gap-2 group border border-blue-400/50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="text-sm font-bold">Download</span>
        </button>
      </div>
    </div>
  );
};

export default ResultGallery;
