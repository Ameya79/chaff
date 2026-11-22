import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-24 flex flex-col items-center justify-center space-y-6 min-h-[50dvh]">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--border-line)] border-t-[var(--accent-ember)] animate-spin" />
      <div className="space-y-1 text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-ember)] block">
          Winnowing in Progress
        </span>
        <p className="text-sm text-[var(--text-dim)] font-mono">
          Loading grain specifications and audit ledgers...
        </p>
      </div>
    </div>
  );
}
