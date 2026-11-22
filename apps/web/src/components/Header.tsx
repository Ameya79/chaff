'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/rules', label: 'Rules' },
  { href: '/levels', label: 'Levels' },
  { href: '/install', label: 'Install & MCP' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/bench', label: 'Bench' },
  { href: '/gate', label: 'Gate' },
  { href: '/playground', label: 'Playground' },
];

export function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const navRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem('chaff-theme') as 'light' | 'dark' | null;
    const initial = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
    if (initial === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('chaff-theme', next);
    document.documentElement.setAttribute('data-theme', next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Spring-driven sliding active indicator calculation with resize & font-load resilience
  useEffect(() => {
    if (!navRef.current) return;
    const container = navRef.current;

    const updateIndicator = () => {
      const activeLink = container.querySelector<HTMLAnchorElement>(`a[data-active="true"]`);
      if (activeLink) {
        setIndicatorStyle({
          left: activeLink.offsetLeft,
          width: activeLink.offsetWidth,
          opacity: 1,
        });
      } else {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(updateIndicator);
    }

    return () => window.removeEventListener('resize', updateIndicator);
  }, [pathname]);

  return (
    <header className="hairline-b sticky top-0 bg-[var(--bg-canvas)]/90 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-3 no-underline group focus-visible:outline-none">
          <span className="font-serif text-2xl font-bold tracking-tight text-[var(--text-main)] group-hover:text-[var(--accent-ember)] transition-colors">
            CHAFF
          </span>
          <span className="hidden sm:inline text-[11px] uppercase tracking-widest text-[var(--accent-ember)] font-mono">
            Keep the grain
          </span>
        </Link>

        {/* Navigation with sliding spring-driven active indicator */}
        <nav
          ref={navRef}
          aria-label="Main Navigation"
          className="relative flex items-center gap-1 overflow-x-auto py-1"
        >
          {/* Spring-driven indicator bar */}
          <div
            className="absolute bottom-0 left-0 h-[2px] bg-[var(--accent-ember)] rounded-full transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none pointer-events-none"
            style={{
              width: `${indicatorStyle.width}px`,
              transform: `translateX(${indicatorStyle.left}px)`,
              opacity: indicatorStyle.opacity,
            }}
            aria-hidden="true"
          />

          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                data-active={isActive ? 'true' : 'false'}
                className={`relative px-3 py-2 text-xs sm:text-sm font-medium transition-colors min-h-[44px] inline-flex items-center ${
                  isActive
                    ? 'text-[var(--accent-ember)] font-semibold'
                    : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'night' : 'day'} theme`}
            className="ml-2 px-2.5 py-1.5 font-mono text-xs hairline bg-[var(--bg-surface)] text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)] min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            title={`Current theme: ${theme}. Click to toggle.`}
          >
            {theme === 'light' ? 'NIGHT' : 'DAY'}
          </button>
        </nav>
      </div>
    </header>
  );
}
