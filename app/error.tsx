'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[pixel-tree] page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="font-pixel text-[9px] text-muted tracking-[3px] mb-4">SOMETHING BROKE</div>
      <h1 className="font-pixel text-white mb-4" style={{ fontSize: 'clamp(14px, 2vw, 20px)' }}>
        THE TREE FELL OVER
      </h1>
      <p className="text-muted text-[14px] max-w-[400px] leading-[1.7] mb-8">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={reset}
        className="font-pixel text-[9px] bg-accent2 text-white border-none px-6 py-3 cursor-pointer hover:bg-[#9b7fff] transition-colors"
      >
        TRY AGAIN ▶
      </button>
    </div>
  );
}
