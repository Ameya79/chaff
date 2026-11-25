import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20 space-y-6 min-h-[50dvh]">
      <div className="space-y-3">
        <div className="h-3 w-36 rounded-full bg-[var(--bg-surface-elevated)] animate-pulse" />
        <div className="h-10 w-72 max-w-full rounded-xl bg-[var(--bg-surface-elevated)] animate-pulse" />
      </div>
      <div className="h-72 w-full rounded-2xl bg-[var(--bg-surface)] animate-pulse" />
    </div>
  );
}
