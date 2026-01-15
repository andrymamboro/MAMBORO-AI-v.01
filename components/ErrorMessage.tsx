
import React from 'react';

interface Props {
  message: string;
}

const ErrorMessage: React.FC<Props> = ({ message }) => {
  return (
    <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
      <div className="p-1 bg-red-500/20 rounded text-red-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
      <div>
        <h4 className="text-red-400 font-bold text-sm">Error Occurred</h4>
        <p className="text-red-300/80 text-xs mt-0.5">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
