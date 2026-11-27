import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-24 space-y-6">
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)] block">
        404 · Missing
      </span>

      <h1 className="text-4xl font-display text-[var(--text-main)]">
        Route not found.
      </h1>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link href="/" className="btn primary text-sm">
          Home
        </Link>
        <Link href="/rules" className="btn text-sm">
          72 Rules
        </Link>
      </div>
    </div>
  );
}
