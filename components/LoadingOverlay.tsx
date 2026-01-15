
import React from 'react';
import Logo from './Logo';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md z-10 flex flex-col items-center justify-center rounded-xl">
      <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="bg-slate-900 rounded-full p-4 shadow-lg">
           <Logo size={40} className="animate-pulse" />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">Mamboro-Ai sedang bekerja...</h3>
        <p className="text-slate-400 text-sm max-w-[250px]">Kecerdasan buatan kami sedang memproses gambar Anda. Tunggu sebentar ya.</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
