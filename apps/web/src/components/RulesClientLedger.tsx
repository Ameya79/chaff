'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut: Press '/' to focus search input
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

  // Hash anchor navigation: expand rule if anchor matches
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashId = window.location.hash.replace('#', '');
      if (hashId) {
        setExpandedIds((prev) => new Set([...prev, hashId]));
        const el = document.getElementById(hashId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, []);

  const categories = useMemo(() => [
    { id: 'all', name: 'All Rules', count: initialRules.length },
    { id: 'ui', name: 'UI & Layout', count: initialRules.filter((r) => r.category === 'ui').length },
    { id: 'copy', name: 'Copy & Voice', count: initialRules.filter((r) => r.category === 'copy').length },
    { id: 'code', name: 'Code & AST', count: initialRules.filter((r) => r.category === 'code').length },
    { id: 'perf', name: 'Performance', count: initialRules.filter((r) => r.category === 'perf').length },
    { id: 'mobile', name: 'Mobile', count: initialRules.filter((r) => r.category === 'mobile').length },
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

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(filteredRules.map((r) => r.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  const copyPermalink = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/rules#${id}`;
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Ruled Broadsheet Filter & Search Ledger (Zero Boxed Cards) */}
      <div className="hairline-y py-4 px-2 sm:px-4 space-y-4">
        {/* Search Input Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 72 rules by title, keyword, ID (e.g. UI-001) or syntax..."
              aria-label="Search rules catalog"
              className="w-full pl-4 pr-16 py-2.5 hairline bg-[var(--bg-canvas)] text-[var(--text-main)] font-mono text-sm placeholder:text-[var(--text-dim)] focus-visible:outline-2 focus-visible:outline-[var(--accent-ember)] min-h-[44px]"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <kbd className="px-2 py-0.5 font-mono text-[11px] text-[var(--text-dim)] bg-[var(--bg-surface)] hairline">
                /
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-3 py-2 text-xs font-mono hairline bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] min-h-[44px] transition-colors"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={expandAll}
              className="px-3 py-2 text-xs font-mono hairline bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] min-h-[44px] transition-colors"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="px-3 py-2 text-xs font-mono hairline bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] min-h-[44px] transition-colors"
            >
              Collapse
            </button>
          </div>
        </div>

        {/* Category Filter Ledger Rail */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 hairline-t border-[var(--border-line)]">
          {categories.map((c) => {
            const isActive = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 text-xs font-mono min-h-[44px] transition-colors inline-flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[var(--accent-ember)] text-[var(--btn-primary-text)] font-semibold'
                    : 'text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)] hairline'
                }`}
              >
                <span>{c.name}</span>
                <span className="opacity-75 tabular-nums">({c.count})</span>
              </button>
            );
          })}
        </div>

        {/* Ledger Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--text-dim)] pt-1">
          <span>
            Catalog Index: <strong className="text-[var(--text-main)]">{filteredRules.length}</strong> of {initialRules.length} rules matching
          </span>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Press <kbd className="px-1 py-0.5 hairline bg-[var(--bg-surface)]">/</kbd> to search</span>
            <span>Severity: <span className="text-[var(--accent-ember)] font-bold">High (Gate Fail)</span> • <span className="text-[var(--status-warn)] font-bold">Med (Warn)</span></span>
          </div>
        </div>
      </div>

      {/* The Dense, Ruled Broadsheet Index Ledger (Zero Cards) */}
      <div className="hairline-y divide-y divide-[var(--border-line)]">
        {filteredRules.length === 0 ? (
          <div className="p-12 text-center space-y-3 font-mono text-xs">
            <span className="text-base font-serif text-[var(--text-main)] block">
              No matching architectural rules found
            </span>
            <p className="text-[var(--text-dim)]">
              Try adjusting your query or resetting category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="btn primary text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredRules.map((r) => {
            const isExpanded = expandedIds.has(r.id);
            return (
              <article
                key={r.id}
                id={r.id}
                className="transition-colors hover:bg-[var(--bg-canvas)]/40 scroll-mt-20"
              >
                {/* Clickable Ledger Row Header with Semantic Buttons (Zero div onClick) */}
                <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 select-none min-h-[44px]">
                  <button
                    type="button"
                    onClick={() => toggleExpand(r.id)}
                    className="flex-1 text-left flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-transparent border-0 cursor-pointer p-0 min-h-[44px]"
                    aria-expanded={isExpanded}
                  >
                    {/* Left Columnar Identifiers */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-sm font-bold text-[var(--accent-ember)] min-w-[72px]">
                        {r.id} //
                      </span>
                      <span className="text-[11px] font-mono uppercase px-2 py-0.5 hairline text-[var(--text-dim)] bg-[var(--bg-canvas)]">
                        {r.category}
                      </span>
                      <span
                        className={`text-[11px] font-mono uppercase px-2 py-0.5 hairline font-semibold ${
                          r.severity === 'high'
                            ? 'bg-[var(--accent-ember-soft)] text-[var(--accent-ember)] border-[var(--accent-ember)]/40'
                            : 'bg-[var(--status-warn)]/10 text-[var(--status-warn)] border-[var(--status-warn)]/40'
                        }`}
                      >
                        {r.severity}
                      </span>
                      <span className="text-xs font-mono text-[var(--text-dim)] hidden sm:inline">
                        Levels: [{r.levels.join(', ')}]
                      </span>
                    </div>

                    {/* Center Column: Title & Brief */}
                    <div className="flex-1 lg:px-4">
                      <h2 className="font-serif text-lg text-[var(--text-main)] inline">
                        {r.title}
                      </h2>
                      {!isExpanded && (
                        <span className="text-xs text-[var(--text-dim)] ml-2 hidden xl:inline line-clamp-1">
                          — {r.why}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Right Actions: Expand Toggle & Permalink */}
                  <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-dim)] self-start lg:self-auto">
                    <button
                      type="button"
                      onClick={(e) => copyPermalink(e, r.id)}
                      className="px-2.5 py-1.5 hairline hover:bg-[var(--bg-surface-elevated)] min-h-[44px] flex items-center transition-colors text-[11px]"
                      title="Copy direct permalink"
                    >
                      {copiedId === r.id ? 'Copied' : '# Link'}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleExpand(r.id)}
                      className="px-3 py-1.5 min-h-[44px] inline-flex items-center font-bold text-[var(--accent-ember)] hairline hover:bg-[var(--bg-surface-elevated)] transition-colors"
                    >
                      {isExpanded ? '[-] HIDE SPEC' : '[+] VIEW SPEC'}
                    </button>
                  </div>
                </div>

                {/* Expanded Architectural Specification Ledger Pane */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-6 pt-2 space-y-4 hairline-t border-[var(--border-line)] bg-[var(--bg-canvas)]/30">
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-ember)] font-bold block">
                        ARCHITECTURAL SPECIFICATION &amp; DETECTION RATIONALE
                      </span>
                      <p className="text-sm text-[var(--text-dim)] leading-relaxed max-w-[75ch]">
                        {r.why}
                      </p>
                      <div className="text-xs font-mono text-[var(--text-dim)] pt-1">
                        <span>Detection Mechanism: <code className="text-[var(--text-main)]">{r.detect}</code></span>
                        <span> • Fix Class: <code className="text-[var(--text-main)]">{r.fix_class}</code></span>
                      </div>
                    </div>

                    {/* Continuous Ruled Code Spec Comparison (Zero Boxed Subcards) */}
                    <div className="hairline-y divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-line)] grid grid-cols-1 lg:grid-cols-2">
                      {/* Left: Anti-Pattern AI Fingerprint */}
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-baseline font-mono text-xs">
                          <span className="text-[var(--accent-ember)] font-bold uppercase">
                            [CHAFF] AI Tell Fingerprint
                          </span>
                          <span className="text-[10px] uppercase text-[var(--status-warn)] font-semibold">
                            Banned Anti-Pattern
                          </span>
                        </div>
                        <pre className="text-xs font-mono text-[var(--text-main)] overflow-x-auto p-3 bg-[var(--bg-canvas)] hairline leading-relaxed">
                          <code>{r.bad}</code>
                        </pre>
                      </div>

                      {/* Right: Authentic Craft Solution */}
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-baseline font-mono text-xs">
                          <span className="text-[var(--status-sage)] font-bold uppercase">
                            [GRAIN] Authentic Solution
                          </span>
                          <span className="text-[10px] uppercase text-[var(--status-sage)] font-semibold">
                            Human-Authored Standard
                          </span>
                        </div>
                        <pre className="text-xs font-mono text-[var(--text-main)] overflow-x-auto p-3 bg-[var(--bg-canvas)] hairline leading-relaxed">
                          <code>{r.good}</code>
                        </pre>
                      </div>
                    </div>

                    {r.exceptions && (
                      <div className="text-xs font-mono text-[var(--text-dim)] pt-2">
                        <strong className="text-[var(--text-main)]">Documented Brand Waiver Criteria:</strong> {r.exceptions}
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
