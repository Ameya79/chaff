'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/rules', label: 'Rules' },
  { href: '/levels', label: 'Levels' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/playground', label: 'Playground' },
  { href: '/bench', label: 'Bench' },
  { href: '/gate', label: 'Gate' },
  { href: '/install', label: 'Install' },
];

export function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('chaff-theme') as 'light' | 'dark' | null;
    const initial =
      saved ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.add('theme-switching');
    setTheme(next);
    localStorage.setItem('chaff-theme', next);
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('theme-switching');
      });
    });
  };

  useEffect(() => {
    const container = navRef.current;
    if (!container) return;

    const updateIndicator = () => {
      const activeLink = container.querySelector<HTMLAnchorElement>(
        'a[data-active="true"]'
      );
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
    if ('fonts' in document) {
      document.fonts.ready.then(updateIndicator);
    }
    return () => window.removeEventListener('resize', updateIndicator);
  }, [pathname]);

  return (
    <header className="hairline-b sticky top-0 bg-[var(--bg-canvas)]/95 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 min-h-[44px] group"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 32 32"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect
              x="1.5"
              y="1.5"
              width="29"
              height="29"
              rx="3"
              fill="var(--bg-surface)"
              stroke="var(--accent-ember)"
              strokeWidth="2"
            />
            <path
              d="M11 23C11 16 14 11 20 8C20 15 17 20 11 23Z"
              fill="var(--text-main)"
            />
            <path
              d="M20.5 7.5C22.5 8.5 23.5 10.5 23.5 12.5"
              fill="none"
              stroke="var(--accent-ember)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-main)] group-hover:text-[var(--accent-ember)] transition-colors">
            CHAFF
          </span>
          <span className="hidden xl:inline text-[11px] uppercase tracking-[0.16em] text-[var(--text-dim)] font-mono border-l border-[var(--border-line)] pl-2.5">
            Keep the grain
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          ref={navRef}
          aria-label="Main Navigation"
          className="hidden lg:flex relative items-center gap-1"
        >
          <div
            className="absolute bottom-0 left-0 h-[2px] bg-[var(--accent-ember)] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none pointer-events-none"
            style={{
              width: `${indicatorStyle.width}px`,
              transform: `translateX(${indicatorStyle.left}px)`,
              opacity: indicatorStyle.opacity,
            }}
            aria-hidden="true"
          />

          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                data-active={isActive ? 'true' : 'false'}
                className={`relative px-3 py-2 text-sm font-medium min-h-[44px] inline-flex items-center whitespace-nowrap transition-colors ${
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
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'night' : 'day'} theme`}
            className="btn ml-2 px-3 py-1.5 font-mono text-xs min-h-[44px] min-w-[68px]"
            title={`Current theme: ${theme}`}
          >
            {theme === 'light' ? 'Night' : 'Day'}
          </button>
        </nav>

        {/* Mobile Controls (320px - 1023px) */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'night' : 'day'} theme`}
            className="btn px-2.5 py-1.5 font-mono text-xs min-h-[44px] min-w-[44px]"
          >
            {theme === 'light' ? 'Night' : 'Day'}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="btn px-3 py-1.5 font-mono text-xs min-h-[44px] min-w-[44px]"
          >
            <span>{menuOpen ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </div>

      {/* Accessible Mobile Navigation Drawer */}
      {menuOpen && (
        <nav
          id="mobile-nav-drawer"
          aria-label="Mobile Navigation"
          className="lg:hidden hairline-t bg-[var(--bg-surface)] px-4 py-3 space-y-1 shadow-sm"
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 min-h-[44px] text-sm font-medium border-b border-[var(--border-line)] last:border-b-0 ${
                  isActive
                    ? 'text-[var(--accent-ember)] font-semibold'
                    : 'text-[var(--text-main)]'
                }`}
              >
                <span>{link.label}</span>
                <span className="font-mono text-xs text-[var(--text-dim)]">
                  {isActive ? 'Active' : 'Open'}
                </span>
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
