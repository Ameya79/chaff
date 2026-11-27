import React from 'react';
import Link from 'next/link';
import { ChaffWordmark } from './ChaffWordmark';

export function Footer() {
  return (
    <footer className="site-colophon hairline-t py-10 sm:py-16 px-4 sm:px-8 mt-8">
      <div className="scroll-sheet max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-5 space-y-3 min-w-0">
          <div className="flex items-center gap-2.5 text-[var(--text-main)]">
            <ChaffWordmark />
          </div>
          <p className="text-sm text-[var(--text-dim)] max-w-[38ch]">
            Chat-first UI craft protocol, Identity Lock, and Level 1–3 performance gates.
          </p>
          <span className="font-mono text-xs text-[var(--text-dim)] block pt-1">
            v0.1.0 · Local execution · Zero telemetry
          </span>
        </div>

        <div className="md:col-span-4 flex flex-wrap gap-x-6 gap-y-1 text-sm min-w-0">
          {[
            { href: '/rules', label: 'Rules' },
            { href: '/levels', label: 'Levels' },
            { href: '/gallery', label: 'Gallery' },
            { href: '/playground', label: 'Playground' },
            { href: '/bench', label: 'Bench' },
            { href: '/gate', label: 'Gate' },
            { href: '/install', label: 'Install' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="ink-link min-h-[44px] min-w-[44px] text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="md:col-span-3 md:text-right space-y-2 min-w-0">
          <span className="font-mono text-xs text-[var(--status-pass)] block">
            Downgrade effect, never budget.
          </span>
          <a
            href="https://github.com/Ameya79/chaff"
            target="_blank"
            rel="noopener noreferrer"
            className="ink-link min-h-[44px] min-w-[44px] font-mono text-xs text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors duration-200"
          >
            github.com/Ameya79/chaff &rarr;
          </a>
        </div>
      </div>
    </footer>
  );
}
