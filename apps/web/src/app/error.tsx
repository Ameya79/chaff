'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Chaff web application error:', error);
  }, [error]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-24 text-center space-y-6">
      <div className="flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)] font-bold">
        <span>ERROR //</span>
        <span>GRAIN DISRUPTED</span>
      </div>

      <h1 className="text-3xl font-serif text-[var(--text-main)]">
        The winnowing floor encountered an error.
      </h1>

      <p className="text-sm text-[var(--text-dim)] max-w-lg mx-auto font-mono leading-relaxed">
        {error.message || 'An unexpected runtime error occurred while processing this request.'}
      </p>

      <div className="flex items-center justify-center gap-4 pt-4">
        <button
          type="button"
          onClick={() => reset()}
          className="btn primary"
        >
          Try Again
        </button>
        <Link href="/" className="btn">
          Return Home
        </Link>
      </div>
    </div>
  );
}
