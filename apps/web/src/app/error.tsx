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
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-ember)] block">
        Runtime Fault
      </span>

      <h1 className="text-4xl font-serif text-[var(--text-main)]">
        Route interrupted.
      </h1>

      <p className="text-sm text-[var(--text-dim)] max-w-lg font-mono">
        {error.message || 'An unexpected error occurred.'}
      </p>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button type="button" onClick={() => reset()} className="btn primary text-sm">
          Retry
        </button>
        <Link href="/" className="btn text-sm">
          Home
        </Link>
      </div>
    </div>
  );
}
