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
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('chaff-theme');
    const initial: 'light' | 'dark' = saved === 'light' ? 'light' : 'dark';
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
    const next = theme === 'dark' ? 'light' : 'dark';
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
    <header className="sticky top-0 z-50 bg-[var(--bg-header)] backdrop-blur-sm hairline-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 min-h-[44px] min-w-[44px] group"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 32 32"
            aria-hidden="true"
            className="shrink-0"
          >
            <path
              d="M9 24C9 15.5 13 10 21 7C21 15 17 21 9 24Z"
              fill="var(--text-main)"
            />
            <path
              d="M21.5 6.5C24 8 25.5 10.5 25.5 13"
              fill="none"
              stroke="var(--accent-ember)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-serif text-xl tracking-tight text-[var(--text-main)] group-hover:text-[var(--accent-ember)] transition-colors">
            Chaff
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
                className={`relative px-3.5 py-2 text-sm min-h-[44px] min-w-[44px] inline-flex items-center justify-center whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-[var(--text-main)] font-medium'
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
            aria-label={`Switch to ${theme === 'dark' ? 'day' : 'night'} theme`}
            className="ml-3 px-4 py-2 rounded-full bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface)] text-[var(--text-main)] font-mono text-xs min-h-[44px] min-w-[64px] transition-colors"
          >
            {theme === 'dark' ? 'Day' : 'Night'}
          </button>
        </nav>

        {/* Mobile Controls (320px - 1023px) */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'day' : 'night'} theme`}
            className="px-3.5 py-2 rounded-full bg-[var(--bg-surface-elevated)] text-[var(--text-main)] font-mono text-xs min-h-[44px] min-w-[44px] transition-colors"
          >
            {theme === 'dark' ? 'Day' : 'Night'}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="px-4 py-2 rounded-full bg-[var(--bg-surface-elevated)] text-[var(--text-main)] font-mono text-xs min-h-[44px] min-w-[44px] transition-colors"
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {/* Accessible Mobile Navigation Drawer */}
      {menuOpen && (
        <nav
          id="mobile-nav-drawer"
          aria-label="Mobile Navigation"
          className="lg:hidden hairline-t bg-[var(--bg-surface)] px-4 py-3 space-y-1"
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 min-h-[44px] text-sm border-b border-[var(--border-line)] last:border-b-0 ${
                  isActive
                    ? 'text-[var(--accent-ember)] font-medium'
                    : 'text-[var(--text-main)]'
                }`}
              >
                <span>{link.label}</span>
                <span className="font-mono text-xs text-[var(--text-dim)]">
                  {isActive ? 'Active' : 'Go'}
                </span>
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
