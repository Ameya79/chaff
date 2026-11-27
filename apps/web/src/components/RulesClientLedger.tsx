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

  useEffect(() => {
    setSelectedCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery]);

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
      { id: 'ui', name: 'UI', count: initialRules.filter((r) => r.category === 'ui').length },
      { id: 'copy', name: 'Copy', count: initialRules.filter((r) => r.category === 'copy').length },
      { id: 'code', name: 'Code', count: initialRules.filter((r) => r.category === 'code').length },
      { id: 'perf', name: 'Perf', count: initialRules.filter((r) => r.category === 'perf').length },
      { id: 'mobile', name: 'Mobile', count: initialRules.filter((r) => r.category === 'mobile').length },
      { id: 'a11y', name: 'A11y', count: initialRules.filter((r) => r.category === 'a11y').length },
      { id: 'motion', name: 'Motion', count: initialRules.filter((r) => r.category === 'motion').length },
      { id: 'three', name: '3D', count: initialRules.filter((r) => r.category === 'three').length },
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
    <div className="space-y-8 sheet-in" style={{ '--d': '120ms' } as React.CSSProperties}>
      {/* Rectilinear Search & Category Tab Bar */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
          <div className="flex-1 min-w-0">
            <label htmlFor="rules-search" className="sr-only">
              Search 72 rules
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
              placeholder="Filter rules by ID, keyword, or pattern (press /)..."
              className="w-full px-4 py-3 min-h-[44px] rounded-[2px] bg-[var(--bg-surface)] hairline-box text-[var(--text-main)] font-mono text-base placeholder:text-[var(--text-dim)]"
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
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 hairline-b pb-3">
          <div className="flex flex-wrap items-center gap-1">
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
                  className={`px-3 py-2 rounded-[6px] min-h-[44px] min-w-[44px] font-mono text-xs transition-colors duration-200 border-b-2 ${
                    active
                      ? 'border-[var(--accent)] bg-[var(--bg-surface)] text-[var(--text-main)] font-medium'
                      : 'border-transparent text-[var(--text-dim)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {c.name} <span className="opacity-70 tabular-nums">{c.count}</span>
                </button>
              );
            })}
          </div>

          <span className="font-mono text-xs text-[var(--text-dim)] tabular-nums">
            {filteredRules.length} / {initialRules.length}
          </span>
        </div>
      </div>

      {/* Split Index + Sticky Spec */}
      {filteredRules.length === 0 ? (
        <div className="py-16 space-y-4">
          <h2 className="font-display text-2xl text-[var(--text-main)]">
            No matching rules
          </h2>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-2">
          <div className="lg:col-span-7 divide-y divide-[var(--border-line)] min-w-0">
            {filteredRules.map((r) => {
              const isSelected = activeRule?.id === r.id;
              const isMobileOpen = mobileExpandedId === r.id;

              return (
                <article
                  key={r.id}
                  id={r.id}
                  className={`scroll-mt-24 transition-colors duration-200 ${
                    isSelected ? 'bg-[var(--bg-surface-active)]' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(r.id);
                      setMobileExpandedId(isMobileOpen ? null : r.id);
                    }}
                    aria-expanded={isMobileOpen}
                    className="w-full text-left px-3 py-4 min-h-[44px] flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[var(--bg-surface-hover)] transition-colors duration-200"
                  >
                    <div className="flex flex-wrap items-center gap-3 min-w-0">
                      <span className="font-mono text-xs font-medium text-[var(--accent)] min-w-[76px]">
                        {r.id}
                      </span>
                      <span className="font-medium text-base text-[var(--text-main)]">
                        {r.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs shrink-0">
                      <span
                        className={
                          r.severity === 'high'
                            ? 'text-[var(--status-fail)]'
                            : 'text-[var(--status-warn)]'
                        }
                      >
                        {r.severity}
                      </span>
                      <span className="text-[var(--text-dim)]">
                        L{r.levels.join(',')}
                      </span>
                    </div>
                  </button>

                  {isMobileOpen && (
                    <div className="lg:hidden px-3 pb-6 pt-2 space-y-4 panel-enter">
                      <p className="text-sm text-[var(--text-dim)] leading-relaxed">
                        {r.why}
                      </p>
                      <div className="space-y-3">
                        <div>
                          <span className="font-mono text-xs text-[var(--status-fail)] block mb-1.5">
                            Before
                          </span>
                          <pre className="p-3.5 rounded-[6px] bg-[var(--bg-surface)] hairline-box font-mono text-xs overflow-x-auto leading-relaxed">
                            <code>{r.bad}</code>
                          </pre>
                        </div>
                        <div>
                          <span className="font-mono text-xs text-[var(--status-pass)] block mb-1.5">
                            After
                          </span>
                          <pre className="p-3.5 rounded-[6px] bg-[var(--bg-surface)] hairline-box font-mono text-xs overflow-x-auto leading-relaxed">
                            <code>{r.good}</code>
                          </pre>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyPermalink(r.id)}
                        className="btn text-xs font-mono"
                      >
                        {copiedId === r.id ? 'Copied' : `#${r.id} Link`}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {activeRule && (
            <aside
              key={activeRule.id}
              aria-label="Rule inspection panel"
              className="hidden lg:block lg:col-span-5 lg:sticky lg:top-24 rounded-[10px] bg-[var(--bg-surface)] hairline-box p-6 sm:p-8 space-y-6 min-w-0 panel-enter"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs text-[var(--text-dim)]">
                    <span className="font-medium text-[var(--accent)]">
                      {activeRule.id}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="uppercase">{activeRule.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeRule.detect}</span>
                  </div>
                  <h2 className="font-display text-2xl text-[var(--text-main)]">
                    {activeRule.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => copyPermalink(activeRule.id)}
                  className="btn text-xs font-mono shrink-0"
                >
                  {copiedId === activeRule.id ? 'Copied' : 'Link'}
                </button>
              </div>

              <p className="text-sm text-[var(--text-dim)] leading-relaxed">
                {activeRule.why}
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="font-mono text-xs text-[var(--status-fail)] block">
                    Bad
                  </span>
                  <pre className="p-4 rounded-[6px] bg-[var(--bg-surface-elevated)] font-mono text-xs text-[var(--text-main)] overflow-x-auto max-h-44 leading-relaxed">
                    <code>{activeRule.bad}</code>
                  </pre>
                </div>

                <div className="space-y-1.5">
                  <span className="font-mono text-xs text-[var(--status-pass)] block">
                    Good
                  </span>
                  <pre className="p-4 rounded-[6px] bg-[var(--bg-surface-elevated)] font-mono text-xs text-[var(--text-main)] overflow-x-auto max-h-44 leading-relaxed">
                    <code>{activeRule.good}</code>
                  </pre>
                </div>
              </div>

              {activeRule.exceptions && (
                <p className="text-xs font-mono text-[var(--text-dim)] leading-relaxed hairline-t pt-4">
                  Waiver: {activeRule.exceptions}
                </p>
              )}
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
