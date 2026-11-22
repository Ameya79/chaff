'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import type { Rule } from '@chaff/core';

interface RulesClientLedgerProps {
  initialRules: Rule[];
  initialCategory?: string;
  initialQuery?: string;
}

export function RulesClientLedger({
  initialRules,
  initialCategory = 'all',
  initialQuery = '',
}: RulesClientLedgerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut: Press '/' to focus search input (PRD 7.2)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        const tagName = document.activeElement?.tagName.toLowerCase();
        if (tagName !== 'input' && tagName !== 'textarea') {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categories = useMemo(() => [
    { id: 'all', name: 'All Categories', count: initialRules.length },
    { id: 'ui', name: 'UI & Layout', count: initialRules.filter((r) => r.category === 'ui').length },
    { id: 'copy', name: 'Copy & Voice', count: initialRules.filter((r) => r.category === 'copy').length },
    { id: 'code', name: 'Code Patterns', count: initialRules.filter((r) => r.category === 'code').length },
    { id: 'perf', name: 'Performance', count: initialRules.filter((r) => r.category === 'perf').length },
    { id: 'mobile', name: 'Mobile Ergonomics', count: initialRules.filter((r) => r.category === 'mobile').length },
    { id: 'a11y', name: 'Accessibility', count: initialRules.filter((r) => r.category === 'a11y').length },
    { id: 'motion', name: 'Motion Physics', count: initialRules.filter((r) => r.category === 'motion').length },
    { id: 'three', name: '3D & WebGL', count: initialRules.filter((r) => r.category === 'three').length },
  ], [initialRules]);

  const filteredRules = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return initialRules.filter((r) => {
      const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;
      const matchesQ =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.why.toLowerCase().includes(q) ||
        r.fix_class.toLowerCase().includes(q) ||
        r.bad.toLowerCase().includes(q) ||
        r.good.toLowerCase().includes(q);
      return matchesCat && matchesQ;
    });
  }, [initialRules, selectedCategory, searchQuery]);

  const copyPermalink = (id: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/rules#${id}`;
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Bar with '/' Shortcut Badge */}
      <div className="hairline p-4 rounded-md bg-[var(--bg-surface)] space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 72 rules by title, keyword, ID (e.g. UI-001) or syntax..."
              aria-label="Search rules catalog"
              className="w-full pl-4 pr-16 py-2.5 rounded hairline bg-[var(--bg-canvas)] text-[var(--text-main)] font-mono text-sm placeholder:text-[var(--text-dim)] focus-visible:outline-2 focus-visible:outline-[var(--accent-ember)] min-h-[44px]"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <kbd className="px-2 py-0.5 font-mono text-[11px] text-[var(--text-dim)] bg-[var(--bg-surface)] hairline rounded shadow-xs">
                /
              </kbd>
            </div>
          </div>

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="px-3 py-2 text-xs font-mono hairline rounded bg-[var(--bg-canvas)] hover:bg-[var(--bg-surface-elevated)] min-h-[44px] transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--text-dim)] pt-1">
          <span>
            Showing <strong className="text-[var(--text-main)]">{filteredRules.length}</strong> of {initialRules.length} rules
          </span>
          <span>Press <kbd className="px-1 py-0.5 hairline rounded bg-[var(--bg-canvas)]">/</kbd> anywhere to search</span>
        </div>
      </div>

      {/* Main 2-Column Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Category Index Sidebar */}
        <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-24">
          <div className="hairline p-4 rounded-md bg-[var(--bg-surface)] space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-dim)] font-semibold block">
              Categories
            </span>
            <div className="flex flex-col gap-1.5">
              {categories.map((c) => {
                const isActive = selectedCategory === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.id)}
                    className={`flex justify-between items-center px-3 py-2.5 text-xs font-mono rounded min-h-[44px] transition-colors text-left ${
                      isActive
                        ? 'bg-[var(--accent-ember)] text-[var(--btn-primary-text)] font-semibold'
                        : 'text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="opacity-80">({c.count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hairline p-4 rounded-md bg-[var(--bg-surface)] space-y-2 text-xs font-mono text-[var(--text-dim)]">
            <span className="text-[var(--text-main)] font-semibold block uppercase">Severity Legend</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-ember)] inline-block" />
              <span>High: Fails CI gate, -8 to -10 pts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-warn)] inline-block" />
              <span>Medium: Warning, -4 to -6 pts</span>
            </div>
          </div>
        </aside>

        {/* Right Rules Ledger Panel */}
        <div className="lg:col-span-9 space-y-6">
          {filteredRules.length === 0 ? (
            <div className="hairline p-8 rounded-md bg-[var(--bg-surface)] text-center space-y-3 font-mono text-xs">
              <span className="text-base font-serif text-[var(--text-main)] block">
                No matching rules found
              </span>
              <p className="text-[var(--text-dim)]">
                Try searching for different keywords or reset the category filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="btn primary text-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredRules.map((r) => (
              <article
                key={r.id}
                id={r.id}
                className="hairline p-6 sm:p-7 bg-[var(--bg-surface)] rounded-md space-y-4 hover:border-[var(--accent-ember)]/60 transition-colors"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3 hairline-b pb-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="font-mono text-sm font-bold text-[var(--accent-ember)] px-2.5 py-1 hairline rounded bg-[var(--bg-canvas)]">
                      {r.id}
                    </span>
                    <span className="text-xs font-mono uppercase px-2 py-0.5 rounded hairline text-[var(--text-dim)] bg-[var(--bg-canvas)]">
                      {r.category}
                    </span>
                    <span
                      className={`text-xs font-mono uppercase px-2 py-0.5 rounded hairline ${
                        r.severity === 'high'
                          ? 'bg-[var(--accent-ember-soft)] text-[var(--accent-ember)] border-[var(--accent-ember)]/30'
                          : 'bg-[var(--status-warn)]/10 text-[var(--status-warn)] border-[var(--status-warn)]/30'
                      }`}
                    >
                      {r.severity}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs text-[var(--text-dim)]">
                    <span>Levels: [{r.levels.join(', ')}] • Detect: {r.detect}</span>
                    <button
                      type="button"
                      onClick={() => copyPermalink(r.id)}
                      className="px-2.5 py-1.5 hairline rounded hover:bg-[var(--bg-surface-elevated)] text-[11px] min-h-[44px] flex items-center gap-1 transition-colors"
                      title="Copy permalink to this rule"
                    >
                      {copiedId === r.id ? 'Copied!' : '# Permalink'}
                    </button>
                  </div>
                </div>

                <h2 className="font-serif text-xl sm:text-2xl text-[var(--text-main)]">
                  {r.title}
                </h2>

                <p className="text-sm text-[var(--text-dim)] leading-relaxed">
                  {r.why}
                </p>

                {/* Bad vs Good Code Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="hairline p-4 rounded bg-[var(--bg-canvas)] border-[var(--accent-ember)]/30 space-y-2">
                    <div className="flex justify-between items-center font-mono text-xs text-[var(--accent-ember)] font-semibold">
                      <span>[CHAFF] AI Tell Fingerprint</span>
                      <span className="text-[10px] uppercase text-[var(--text-dim)]">Avoid</span>
                    </div>
                    <pre className="text-xs font-mono text-[var(--text-main)] overflow-x-auto p-3 bg-[var(--bg-surface)] rounded border border-[var(--border-line)] leading-relaxed">
                      <code>{r.bad}</code>
                    </pre>
                  </div>

                  <div className="hairline p-4 rounded bg-[var(--bg-canvas)] border-[var(--status-sage)]/40 space-y-2">
                    <div className="flex justify-between items-center font-mono text-xs text-[var(--status-sage)] font-semibold">
                      <span>[GRAIN] Authentic Solution</span>
                      <span className="text-[10px] uppercase text-[var(--text-dim)]">Standard</span>
                    </div>
                    <pre className="text-xs font-mono text-[var(--text-main)] overflow-x-auto p-3 bg-[var(--bg-surface)] rounded border border-[var(--border-line)] leading-relaxed">
                      <code>{r.good}</code>
                    </pre>
                  </div>
                </div>

                {r.exceptions && (
                  <div className="text-xs font-mono text-[var(--text-dim)] pt-2 hairline-t">
                    <strong className="text-[var(--text-main)]">Approved Brand Exceptions:</strong> {r.exceptions}
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}