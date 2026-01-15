
import React, { useRef } from 'react';

interface Props {
  onUpload: (base64: string) => void;
  currentImage: string | null;
}

const ImageUploader: React.FC<Props> = ({ onUpload, currentImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => fileInputRef.current?.click();

  if (currentImage) {
    return (
      <div className="relative group overflow-hidden rounded-xl border border-slate-700 bg-black">
        <img 
          src={currentImage} 
          alt="Upload preview" 
          className="w-full h-auto max-h-[500px] object-contain transition-transform duration-500 group-hover:scale-[1.02]" 
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button 
            onClick={triggerUpload}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-all border border-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
      </div>
    );
  }

  return (
    <div 
      onClick={triggerUpload}
      className="border-2 border-dashed border-slate-700 hover:border-blue-500 bg-slate-800/20 hover:bg-blue-500/5 rounded-2xl py-16 px-8 transition-all cursor-pointer flex flex-col items-center gap-4 group"
    >
      <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-slate-300">Click to upload image</p>
        <p className="text-sm text-slate-500 mt-1">PNG, JPG, or WEBP supported</p>
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />
    </div>
  );
};

export default ImageUploader;
