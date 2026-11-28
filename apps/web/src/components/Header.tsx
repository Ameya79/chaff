'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChaffWordmark } from './ChaffWordmark';
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
    const saved = localStorage.getItem('chaff-theme');
    const initial: 'light' | 'dark' = saved === 'dark' ? 'dark' : 'light';
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
    <header className="sticky top-0 z-50 bg-[var(--bg-header)] backdrop-blur-md hairline-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 min-h-[44px] min-w-[44px] text-[var(--text-main)] group"
        >
          <ChaffWordmark />
        </Link>

        {/* Desktop Navigation */}
        <nav
          ref={navRef}
          aria-label="Main Navigation"
          className="hidden lg:flex relative items-center gap-1"
        >
          <div
            className="absolute bottom-0 left-0 h-[2px] bg-[var(--accent)] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none pointer-events-none"
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
                className={`relative px-3.5 py-2 text-sm min-h-[44px] min-w-[44px] inline-flex items-center justify-center whitespace-nowrap transition-colors duration-200 ${
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
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="ml-3 px-3.5 py-2 rounded-[6px] border border-[var(--border-control)] bg-[var(--bg-surface)] hover:border-[var(--text-main)] text-[var(--text-main)] font-mono text-xs min-h-[44px] min-w-[64px] transition-colors duration-200"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </nav>

        {/* Mobile Controls (320px - 1023px) */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="px-3.5 py-2 rounded-[6px] border border-[var(--border-control)] bg-[var(--bg-surface)] text-[var(--text-main)] font-mono text-xs min-h-[44px] min-w-[44px] transition-colors duration-200"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="px-3.5 py-2 rounded-[6px] border border-[var(--border-control)] bg-[var(--bg-surface)] text-[var(--text-main)] font-mono text-xs min-h-[44px] min-w-[44px] transition-colors duration-200"
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
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto lg:hidden hairline-t bg-[var(--bg-surface)] px-4 py-3 space-y-1 panel-enter"
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center px-3 py-2 min-h-[44px] text-sm rounded-[6px] transition-colors duration-200 ${
                  isActive
                    ? 'text-[var(--accent)] font-medium bg-[var(--accent-soft)]'
                    : 'text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
