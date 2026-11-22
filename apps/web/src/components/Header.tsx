'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('chaff-theme') as 'light' | 'dark' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('chaff-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <header className="hairline-b sticky top-0 bg-[var(--bg-canvas)]/95 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-3 text-decoration-none group">
          <span className="font-serif text-2xl font-bold tracking-tight text-[var(--text-main)]">
            CHAFF
          </span>
          <span className="text-xs uppercase tracking-widest text-[var(--accent-ember)] font-mono">
            Keep the grain
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link href="/rules" className="btn text-sm px-3 py-1.5 border-transparent hover:border-[var(--border-line)]">
            Rules
          </Link>
          <Link href="/levels" className="btn text-sm px-3 py-1.5 border-transparent hover:border-[var(--border-line)]">
            Levels
          </Link>
          <Link href="/install" className="btn text-sm px-3 py-1.5 border-transparent hover:border-[var(--border-line)]">
            Install & MCP
          </Link>
          <Link href="/gallery" className="btn text-sm px-3 py-1.5 border-transparent hover:border-[var(--border-line)]">
            Gallery
          </Link>
          <Link href="/bench" className="btn text-sm px-3 py-1.5 border-transparent hover:border-[var(--border-line)]">
            Bench
          </Link>
          <Link href="/playground" className="btn text-sm px-3 py-1.5 border-transparent hover:border-[var(--border-line)]">
            Playground
          </Link>
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            className="ml-2 px-2.5 py-1.5 font-mono text-xs border-[var(--border-line)]"
            title="Toggle theme"
          >
            {theme === 'light' ? 'NIGHT' : 'DAY'}
          </button>
        </nav>
      </div>
    </header>
  );
}
