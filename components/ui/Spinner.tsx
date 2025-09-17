
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="relative h-12 w-12">
        <span className="absolute inset-0 animate-ping rounded-full bg-blue-500/20" aria-hidden />
        <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-slate-200 border-t-transparent" aria-hidden />
        <span className="absolute inset-1 animate-spin rounded-full border-[3px] border-transparent border-t-blue-500 border-r-indigo-500" aria-hidden />
        <span className="relative flex h-full w-full items-center justify-center rounded-full bg-white text-xs font-semibold uppercase tracking-[0.4em] text-blue-500 shadow-inner shadow-blue-100">
          go
        </span>
      </div>
    </div>
  );
};

export default Spinner;
