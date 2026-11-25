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
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-24 space-y-6">
      <div className="font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)] font-bold">
        Runtime Fault · Grain Disrupted
      </div>

      <h1 className="text-3xl font-serif text-[var(--text-main)]">
        The winnowing floor encountered an unexpected error.
      </h1>

      <p className="text-sm text-[var(--text-dim)] max-w-lg font-mono leading-relaxed">
        {error.message || 'An unexpected error occurred while rendering this route.'}
      </p>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button type="button" onClick={() => reset()} className="btn primary">
          Retry Route
        </button>
        <Link href="/" className="btn">
          Return Home
        </Link>
      </div>
    </div>
  );
}
