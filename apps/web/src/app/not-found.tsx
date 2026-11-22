import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-24 text-center space-y-6">
      <div className="flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)] font-bold">
        <span>404 //</span>
        <span>GRAIN NOT FOUND</span>
      </div>

      <h1 className="text-4xl font-serif text-[var(--text-main)]">
        Nothing to winnow here.
      </h1>

      <p className="text-sm text-[var(--text-dim)] max-w-md mx-auto leading-relaxed">
        The route you requested does not exist on the winnowing floor. The husk was separated, or the path was moved.
      </p>

      <div className="flex items-center justify-center gap-4 pt-4">
        <Link href="/" className="btn primary">
          Return to Overview
        </Link>
        <Link href="/rules" className="btn">
          Browse 72 Rules
        </Link>
      </div>
    </div>
  );
}
