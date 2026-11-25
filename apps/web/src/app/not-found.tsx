import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-24 space-y-6">
      <div className="font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)] font-bold">
        HTTP 404 · Unindexed Specimen
      </div>

      <h1 className="text-4xl font-serif text-[var(--text-main)]">
        Nothing to winnow on this route.
      </h1>

      <p className="text-base text-[var(--text-dim)] max-w-lg leading-relaxed">
        The requested path does not match an archival dossier or specification route.
      </p>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link href="/" className="btn primary">
          Return to Specimen Stage
        </Link>
        <Link href="/rules" className="btn">
          Browse 72 Rules
        </Link>
      </div>
    </div>
  );
}
