'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface RulePublicDto {
  id: string;
  title: string;
  category: string;
  severity: 'high' | 'medium' | 'low';
  levels: number[];
  detect: string;
  fix_class: string;
  bad: string;
  good: string;
  why: string;
  exceptions: string;
  detectionLogic: string;
  remediationSteps: string;
}

interface RulesClientLedgerProps {
  initialRules: RulePublicDto[];
  initialCategory?: string;
  initialQuery?: string;
}

export function RulesClientLedger({
  initialRules,
  initialCategory = 'all',
  initialQuery = '',
}: RulesClientLedgerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlCategory = searchParams.get('category') || initialCategory || 'all';
  const urlQuery = searchParams.get('q') ?? searchParams.get('query') ?? initialQuery ?? '';

  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [searchQuery, setSearchQuery] = useState<string>(urlQuery);
  const [selectedId, setSelectedId] = useState<string>(initialRules[0]?.id || 'UI-001');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync state when URL query params change via client navigation (e.g. from footer/taxonomy links)
  useEffect(() => {
    setSelectedCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery]);

  // '/' shortcut focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        const tag = document.activeElement?.tagName.toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Hash anchor sync: /rules#UI-009 selects and scrolls smoothly to that rule
  useEffect(() => {
    const applyHash = () => {
      const hashId = window.location.hash.replace('#', '').trim();
      if (!hashId) return;
      const match = initialRules.find((r) => r.id.toLowerCase() === hashId.toLowerCase());
      if (match) {
        setSelectedCategory('all');
        setSearchQuery('');
        setSelectedId(match.id);
        setMobileExpandedId(match.id);
        requestAnimationFrame(() => {
          document.getElementById(match.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, [initialRules]);

  const syncUrl = (cat: string, q: string) => {
    const params = new URLSearchParams();
    if (cat && cat !== 'all') params.set('category', cat);
    if (q.trim()) params.set('q', q.trim());
    const qs = params.toString();
    router.replace(qs ? `/rules?${qs}` : '/rules', { scroll: false });
  };

  const categories = useMemo(
    () => [
      { id: 'all', name: 'All', count: initialRules.length },
      { id: 'ui', name: 'UI & Layout', count: initialRules.filter((r) => r.category === 'ui').length },
      { id: 'copy', name: 'Copy', count: initialRules.filter((r) => r.category === 'copy').length },
      { id: 'code', name: 'Code', count: initialRules.filter((r) => r.category === 'code').length },
      { id: 'perf', name: 'Perf', count: initialRules.filter((r) => r.category === 'perf').length },
      { id: 'mobile', name: 'Mobile', count: initialRules.filter((r) => r.category === 'mobile').length },
      { id: 'a11y', name: 'A11y', count: initialRules.filter((r) => r.category === 'a11y').length },
      { id: 'motion', name: 'Motion', count: initialRules.filter((r) => r.category === 'motion').length },
      { id: 'three', name: '3D & WebGL', count: initialRules.filter((r) => r.category === 'three').length },
    ],
    [initialRules]
  );

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

  const activeRule = useMemo(() => {
    return (
      filteredRules.find((r) => r.id === selectedId) ||
      filteredRules[0] ||
      initialRules[0]
    );
  }, [filteredRules, selectedId, initialRules]);

  const copyPermalink = (id: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/rules#${id}`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Category Controls */}
      <div className="hairline bg-[var(--bg-surface)] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end justify-between">
          <div className="flex-1 min-w-0 space-y-1.5">
            <label
              htmlFor="rules-search"
              className="block font-mono text-xs uppercase tracking-wider text-[var(--text-dim)] font-semibold"
            >
              Search 72 Rules (Press / to focus)
            </label>
            <input
              ref={searchInputRef}
              id="rules-search"
              name="q"
              type="search"
              value={searchQuery}
              onChange={(e) => {
                const nextQ = e.target.value;
                setSearchQuery(nextQ);
                syncUrl(selectedCategory, nextQ);
              }}
              placeholder="Filter by ID (UI-009), keyword, or class..."
              className="w-full px-3.5 py-2.5 min-h-[44px] border border-[var(--border-control)] bg-[var(--bg-canvas)] text-[var(--text-main)] font-mono text-base placeholder:text-[var(--text-dim)]"
            />
          </div>

          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                syncUrl(selectedCategory, '');
              }}
              className="btn text-xs font-mono shrink-0"
            >
              Clear Search
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-2 hairline-t">
          {categories.map((c) => {
            const active = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(c.id);
                  syncUrl(c.id, searchQuery);
                }}
                aria-pressed={active}
                className={`px-3 py-1.5 min-h-[44px] font-mono text-xs border transition-colors ${
                  active
                    ? 'bg-[var(--accent-ember)] text-[var(--btn-primary-text)] border-[var(--accent-ember)] font-bold'
                    : 'bg-[var(--bg-canvas)] text-[var(--text-main)] border-[var(--border-line)] hover:bg-[var(--bg-surface-elevated)]'
                }`}
              >
                {c.name} <span className="opacity-80 tabular-nums">({c.count})</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-between items-center gap-2 font-mono text-xs text-[var(--text-dim)]">
          <span>
            Showing <strong className="text-[var(--text-main)]">{filteredRules.length}</strong> of {initialRules.length} rules
          </span>
          <span>Select any row to inspect Bad vs Good code diff</span>
        </div>
      </div>

      {/* Desktop 2-Pane Split: Left Rule Index + Right Sticky Spec Inspector */}
      {filteredRules.length === 0 ? (
        <div className="p-10 hairline bg-[var(--bg-surface)] space-y-3">
          <h2 className="font-serif text-xl text-[var(--text-main)]">
            No matching rules found
          </h2>
          <p className="text-sm text-[var(--text-dim)]">
            Clear your search query or switch back to All categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              syncUrl('all', '');
            }}
            className="btn primary text-xs font-mono"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7-col Rule List */}
          <div className="lg:col-span-7 hairline bg-[var(--bg-surface)] divide-y divide-[var(--border-line)] min-w-0">
            {filteredRules.map((r) => {
              const isSelected = activeRule?.id === r.id;
              const isMobileOpen = mobileExpandedId === r.id;

              return (
                <article
                  key={r.id}
                  id={r.id}
                  className={`scroll-mt-24 transition-colors ${
                    isSelected ? 'bg-[var(--bg-surface-elevated)]/70' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(r.id);
                      setMobileExpandedId(isMobileOpen ? null : r.id);
                    }}
                    aria-expanded={isMobileOpen}
                    className="w-full text-left p-4 min-h-[44px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--bg-surface-elevated)]/50 transition-colors"
                  >
                    <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                      <span className="font-mono text-xs font-bold text-[var(--accent-ember)] min-w-[82px]">
                        {r.id}
                      </span>
                      <span
                        className={`font-mono text-[11px] uppercase px-2 py-0.5 font-semibold ${
                          r.severity === 'high'
                            ? 'bg-[var(--accent-ember-soft)] text-[var(--accent-ember)]'
                            : 'bg-[var(--bg-inset)] text-[var(--status-warn)]'
                        }`}
                      >
                        {r.severity}
                      </span>
                      <span className="font-serif text-base sm:text-lg text-[var(--text-main)]">
                        {r.title}
                      </span>
                    </div>

                    <span className="font-mono text-xs text-[var(--text-dim)] shrink-0">
                      L[{r.levels.join(',')}]
                    </span>
                  </button>

                  {/* Mobile Inline Spec Drawer */}
                  {isMobileOpen && (
                    <div className="lg:hidden px-4 pb-5 pt-2 space-y-4 hairline-t bg-[var(--bg-inset)]">
                      <p className="text-sm text-[var(--text-dim)] leading-relaxed">
                        {r.why}
                      </p>
                      <div className="space-y-3">
                        <div>
                          <span className="font-mono text-xs font-bold text-[var(--accent-ember)] block mb-1">
                            Anti-Pattern (Chaff)
                          </span>
                          <pre className="p-3 bg-[var(--bg-surface)] hairline font-mono text-xs overflow-x-auto leading-relaxed">
                            <code>{r.bad}</code>
                          </pre>
                        </div>
                        <div>
                          <span className="font-mono text-xs font-bold text-[var(--status-sage)] block mb-1">
                            Authored Solution (Grain)
                          </span>
                          <pre className="p-3 bg-[var(--bg-surface)] hairline font-mono text-xs overflow-x-auto leading-relaxed">
                            <code>{r.good}</code>
                          </pre>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyPermalink(r.id)}
                        className="btn text-xs font-mono"
                      >
                        {copiedId === r.id ? 'Permalink Copied' : `Copy #${r.id} Link`}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {/* Right 5-col Sticky Desktop Spec Inspector */}
          {activeRule && (
            <aside
              aria-label="Rule inspection panel"
              className="hidden lg:block lg:col-span-5 lg:sticky lg:top-24 hairline bg-[var(--bg-surface)] p-6 space-y-5 min-w-0"
            >
              <div className="flex items-start justify-between gap-3 pb-4 hairline-b">
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className="font-bold text-[var(--accent-ember)]">
                      {activeRule.id}
                    </span>
                    <span className="text-[var(--text-dim)] uppercase">
                      {activeRule.category}
                    </span>
                    <span className="text-[var(--text-dim)]">
                      Detect: {activeRule.detect}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl text-[var(--text-main)]">
                    {activeRule.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => copyPermalink(activeRule.id)}
                  className="btn text-xs font-mono shrink-0"
                >
                  {copiedId === activeRule.id ? 'Copied' : '# Link'}
                </button>
              </div>

              <div className="space-y-2">
                <span className="font-mono text-xs uppercase font-semibold text-[var(--text-dim)] block">
                  Rationale
                </span>
                <p className="text-sm text-[var(--text-main)] leading-relaxed">
                  {activeRule.why}
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <span className="font-mono text-xs font-bold uppercase text-[var(--accent-ember)] block">
                    Bad · AI Fingerprint
                  </span>
                  <pre className="p-3 bg-[var(--bg-inset)] hairline font-mono text-xs text-[var(--text-main)] overflow-x-auto max-h-44 leading-relaxed">
                    <code>{activeRule.bad}</code>
                  </pre>
                </div>

                <div className="space-y-1.5">
                  <span className="font-mono text-xs font-bold uppercase text-[var(--status-sage)] block">
                    Good · Authored Craft
                  </span>
                  <pre className="p-3 bg-[var(--bg-inset)] hairline font-mono text-xs text-[var(--text-main)] overflow-x-auto max-h-44 leading-relaxed">
                    <code>{activeRule.good}</code>
                  </pre>
                </div>
              </div>

              {activeRule.exceptions && (
                <div className="pt-3 hairline-t text-xs font-mono text-[var(--text-dim)] leading-relaxed">
                  <strong className="text-[var(--text-main)] block mb-0.5">
                    Waiver Criteria:
                  </strong>
                  {activeRule.exceptions}
                </div>
              )}
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
