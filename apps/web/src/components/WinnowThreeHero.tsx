'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { DeviceTier } from '@chaff/tier';
import { WinnowScenePoster } from './WinnowScenePoster';

const WinnowThreeScene = dynamic(() => import('./WinnowThreeScene'), {
  ssr: false,
  loading: () => <WinnowScenePoster />,
});

const REPO_CHAT_PROMPT =
  'Audit my app using https://github.com/Ameya79/chaff and ask me Level 1–3 design questions tailored to my project.';

export function WinnowThreeHero() {
  const [, setResolvedTier] = useState<DeviceTier>('full');
  const [rippleEnergy, setRippleEnergy] = useState<number>(0);
  const [usePosterFallback, setUsePosterFallback] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  useEffect(() => {
    const syncTheme = () => {
      const current = document.documentElement.getAttribute('data-theme');
      setThemeMode(current === 'dark' ? 'dark' : 'light');
    };
    syncTheme();

    const mo = new MutationObserver(syncTheme);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
    if (reducedMotion || conn?.saveData) {
      setUsePosterFallback(true);
    }

    return () => mo.disconnect();
  }, []);

  const copyChatPrompt = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(REPO_CHAT_PROMPT);
      setCopiedPrompt(true);
      setRippleEnergy((prev) => prev + 1);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  return (
    <section className="relative min-h-[calc(100dvh-4rem)] flex items-center py-14 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
        {/* Left Column: Unclipped Type + Chat-First Paste Prompt */}
        <div className="lg:col-span-6 space-y-7 min-w-0 relative z-10">
          <div
            className="hero-fade-in flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-[var(--accent)] font-medium"
            style={{ '--d': '20ms' } as React.CSSProperties}
          >
            <span>Design Craft Protocol</span>
            <span className="h-[1px] w-7 bg-[var(--accent)] opacity-50" aria-hidden="true" />
            <span className="text-[var(--text-dim)]">Levels 1–3</span>
          </div>

          <h1
            className="font-display text-[var(--text-main)]"
            aria-label="Strip the slop. Keep your craft."
          >
            <span className="block">
              {['Strip', 'the', 'slop.'].map((word, idx) => (
                <React.Fragment key={word}>
                  <span className="word-mask">
                    <span
                      className="word-in"
                      style={{ '--d': `${70 + idx * 55}ms` } as React.CSSProperties}
                    >
                      {word}
                    </span>
                  </span>
                  {idx < 2 ? ' ' : ''}
                </React.Fragment>
              ))}
            </span>
            <span className="block">
              {['Keep', 'your', 'craft.'].map((word, idx) => (
                <React.Fragment key={word}>
                  <span className="word-mask">
                    <span
                      className="word-in"
                      style={{ '--d': `${235 + idx * 55}ms` } as React.CSSProperties}
                    >
                      {idx === 2 ? (
                        <>
                          craft<span className="text-[var(--accent)]">.</span>
                        </>
                      ) : (
                        word
                      )}
                    </span>
                  </span>
                  {idx < 2 ? ' ' : ''}
                </React.Fragment>
              ))}
            </span>
          </h1>

          <p
            className="hero-fade-in text-base sm:text-[17px] text-[var(--text-dim)] max-w-[44ch] leading-[1.65]"
            style={{ '--d': '340ms' } as React.CSSProperties}
          >
            Paste our repo link with your prompt in chat. Your agent reads your project first,
            asks tailored Level 1–3 design questions around your codebase, and passes every gate.
          </p>

          {/* Zero-Setup Chat Paste Box */}
          <div
            className="hero-fade-in max-w-xl"
            style={{ '--d': '410ms' } as React.CSSProperties}
          >
            <div className="rounded-[10px] bg-[var(--bg-surface)] hairline-box p-2 pl-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-[0_1px_2px_rgba(17,24,19,0.03)]">
              <div className="min-w-0 py-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)] block mb-0.5">
                  Paste in chat with your prompt
                </span>
                <code className="font-mono text-xs sm:text-[13px] text-[var(--text-main)] block truncate">
                  https://github.com/Ameya79/chaff
                </code>
              </div>

              <button
                type="button"
                onClick={copyChatPrompt}
                aria-label="Copy chat repo prompt"
                className="btn accent text-xs font-mono shrink-0"
              >
                {copiedPrompt ? 'Copied Prompt' : 'Copy Chat Prompt'}
              </button>
            </div>
          </div>

          {/* Crisp Secondary Actions */}
          <div
            className="hero-fade-in flex flex-wrap items-center gap-6 pt-1"
            style={{ '--d': '470ms' } as React.CSSProperties}
          >
            <Link
              href="#tailored-demo"
              className="ink-link text-sm font-medium text-[var(--text-main)] min-h-[44px] min-w-[44px]"
            >
              See how it asks &rarr;
            </Link>
            <Link
              href="/rules"
              className="ink-link text-sm text-[var(--text-dim)] hover:text-[var(--text-main)] min-h-[44px] min-w-[44px]"
            >
              72 Rules
            </Link>
            <Link
              href="/playground"
              className="ink-link text-sm text-[var(--text-dim)] hover:text-[var(--text-main)] min-h-[44px] min-w-[44px]"
            >
              Live Playground
            </Link>
          </div>
        </div>

        {/* Right Column: Pure 3D Crystal Artifact (No caption text below) */}
        <div className="lg:col-span-6 relative h-[320px] sm:h-[430px] lg:h-[560px] flex items-center justify-center min-w-0 canvas-stage-in">
          {usePosterFallback ? (
            <WinnowScenePoster tierLabel="Static Poster Fallback" />
          ) : (
            <WinnowThreeScene
              rippleEnergy={rippleEnergy}
              themeMode={themeMode}
              onTierResolved={setResolvedTier}
              onFallbackToPoster={() => setUsePosterFallback(true)}
            />
          )}
        </div>
      </div>
    </section>
  );
}
