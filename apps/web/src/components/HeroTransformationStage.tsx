'use client';

import React, { useState, useRef } from 'react';
import { BeforeSpecimen } from './BeforeSpecimen';
import { ProjectSpecimen } from './ProjectSpecimen';
import { KestrelRouteSheet } from './KestrelRouteSheet';
import Link from 'next/link';
import stageProjectsData from '../data/stage-projects.json';
import { RollingCounter } from './RollingCounter';

interface ProjectRow {
  label: string;
  val: string;
  pct: number;
}

interface TellItem {
  id: string;
  ruleId: string;
  label: string;
  deduction: number;
  note: string;
}

interface StageProject {
  id: string;
  tab: string;
  name: string;
  domain: string;
  chatPrompt: string;
  detected: {
    framework: string;
    brandHex: string;
    brandLabel: string;
    issueSummary: string;
  };
  questions: {
    level1: string;
    level2: string;
    level3: string;
  };
  beforeScore: number;
  afterScore: number;
  slop: {
    pill: string;
    headline: string;
    subhead: string;
    primaryCta: string;
    secondaryCta: string;
    cards: Array<{ title: string; body: string }>;
  };
  crafted: {
    kicker: string;
    headline: string;
    body: string;
    cta: string;
    metricLabel: string;
    metricValue: string;
    metricSub: string;
    rows: ProjectRow[];
  };
  tells: TellItem[];
}

const PROJECTS = stageProjectsData as StageProject[];

type ViewMode = 'before' | 'curtain' | 'after';
type SelectedLevel = 'level1' | 'level2' | 'level3';

export function HeroTransformationStage() {
  const [projectId, setProjectId] = useState<string>(PROJECTS[0].id);
  const [selectedLevel, setSelectedLevel] = useState<SelectedLevel>('level2');
  const [lockBrandColor, setLockBrandColor] = useState<boolean>(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('curtain');
  React.useEffect(() => {
    setNotesOpen(window.matchMedia('(min-width: 1024px)').matches);
    if (window.matchMedia('(max-width: 900px)').matches) setViewMode('after');
  }, []);
  const [wipePercent, setWipePercent] = useState<number>(42);
  const [activeTellId, setActiveTellId] = useState<string>(PROJECTS[0].tells[0].id);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const stageBodyRef = useRef<HTMLDivElement>(null);

  const project = PROJECTS.find((p) => p.id === projectId) || PROJECTS[0];
  const activeTell =
    project.tells.find((t) => t.id === activeTellId) || project.tells[0];

  const accentColor = lockBrandColor ? project.detected.brandHex : 'var(--accent)';
  const effectiveBeforePct =
    viewMode === 'before' ? 100 : viewMode === 'after' ? 0 : wipePercent;

  const handleProjectSwitch = (nextId: string) => {
    setProjectId(nextId);
    const nextProj = PROJECTS.find((p) => p.id === nextId) || PROJECTS[0];
    setActiveTellId(nextProj.tells[0].id);
  };

  const triggerCleanReveal = () => {
    setViewMode('curtain');
    setWipePercent(0);
  };

  const updateCurtainFromClientX = (clientX: number) => {
    const el = stageBodyRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width) return;
    const pct = Math.max(
      0,
      Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100))
    );
    setWipePercent(pct);
  };

  const renderBefore = () => project.id !== 'kestrel' ? (
    <BeforeSpecimen id={project.id} name={project.name} copy={project.slop} />
  ) : (
    <div className="slop-specimen-shell relative h-full p-6 sm:p-8 min-h-[420px] flex flex-col justify-between gap-5">
      <div className="slop-orb-purple" aria-hidden="true" />
      <div className="slop-orb-cyan" aria-hidden="true" />

      <div className="relative z-10 flex items-center justify-between font-mono text-xs text-rose-300">
        <span>Before · {project.domain}</span>
        <span>{project.beforeScore} / 100</span>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-4 my-auto max-w-md mx-auto w-full">
        <span className="slop-pill-badge px-3 py-1 rounded-full text-[11px] font-mono">
          {project.slop.pill}
        </span>

        <div className="slop-headline-gradient font-sans font-extrabold tracking-tight leading-[1.1] text-xl sm:text-2xl">
          {project.slop.headline}
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
          {project.slop.subhead}
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          <span className="slop-cta-gradient px-4 py-1.5 rounded-full text-white text-xs font-semibold">
            {project.slop.primaryCta}
          </span>
          <span className="px-4 py-1.5 rounded-full border border-slate-600 text-slate-200 text-xs font-semibold">
            {project.slop.secondaryCta}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full text-left pt-1">
          {project.slop.cards.map((card) => (
            <div key={card.title} className="slop-glass-tile p-2.5">
              <span className="block font-sans text-[11px] font-bold text-white">
                {card.title}
              </span>
              <span className="block text-[11px] text-slate-300 mt-0.5 leading-snug">
                {card.body}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex justify-between font-mono text-xs text-slate-400">
        <span>Generic AI Slop</span>
        <span className="text-rose-300">FAIL</span>
      </div>
    </div>
  );

  const renderAfter = () => project.id === 'kestrel' && selectedLevel !== 'level1' ? (
    <KestrelRouteSheet venues={project.crafted.rows} median={project.crafted.metricValue} summary={project.crafted.metricSub} accent={accentColor} />
  ) : selectedLevel !== 'level1' ? (
    <ProjectSpecimen key={project.id} id={project.id} rows={project.crafted.rows} accent={accentColor} />
  ) : (
    <div style={{ "--project-ink": accentColor } as React.CSSProperties} className="crafted-sheet bg-[var(--bg-surface)] text-[var(--text-main)] h-full p-6 sm:p-8 min-h-[420px] flex flex-col justify-between gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 hairline-b pb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: accentColor }}
            aria-hidden="true"
          />
          <span className="font-semibold text-sm text-[var(--text-main)]">
            {project.name}
          </span>
          <span className="font-mono text-[11px] text-[var(--text-dim)]">
            {lockBrandColor ? `${project.detected.brandHex} Locked` : 'Clean Reset'}
          </span>
        </div>

        <span className="font-mono text-xs text-[var(--status-pass)] font-medium">
          After · {project.afterScore} / 100
        </span>
      </div>

      <div
        className="grid grid-cols-1 gap-5 my-auto"
      >
        <div className="space-y-3">
          <span
            className="font-mono text-[11px] uppercase tracking-[0.14em] block font-medium"
            style={{ color: accentColor }}
          >
            {project.crafted.kicker}
          </span>
          <h3 className="font-display text-xl sm:text-2xl font-medium text-[var(--text-main)] leading-snug">
            {project.crafted.headline}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-dim)] leading-relaxed">
            {project.crafted.body}
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={triggerCleanReveal}
              className="px-4 py-2 rounded-[6px] min-h-[44px] font-mono text-xs text-white font-medium transition-opacity duration-200 hover:opacity-90"
              style={{ backgroundColor: accentColor }}
            >
              {project.crafted.cta}
            </button>
          </div>
        </div>

        <div
          className="hairline-t pt-4 metric-plate space-y-4 min-w-0"
        >
          <div className="flex items-baseline justify-between gap-2 hairline-b pb-3">
            <div>
              <span className="font-mono text-[11px] text-[var(--text-dim)] block">
                {project.crafted.metricLabel}
              </span>
              <span className="metric-value font-display text-3xl sm:text-4xl font-semibold text-[var(--text-main)] tabular-nums">
                {project.crafted.metricValue}
              </span>
            </div>

          </div>

          <div className="metric-rows space-y-2.5">
            {project.crafted.rows.map((row) => (
              <div key={row.label} className="space-y-1">
                <div className="flex justify-between font-mono text-xs gap-2">
                  <span className="text-[var(--text-main)] truncate">{row.label}</span>
                  <span className="text-[var(--text-dim)] tabular-nums shrink-0">{row.val}</span>
                </div>
                <div className="metric-track h-1.5 w-full rounded-full bg-[var(--bg-surface-elevated)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-transform duration-500 origin-left"
                    style={{
                      width: `${row.pct}%`,
                      backgroundColor: accentColor,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-[var(--text-dim)] hairline-t pt-3">
        <span>{project.crafted.metricSub}</span>
        <span className="text-[var(--status-pass)] font-medium">All Budgets Green</span>
      </div>
    </div>
  );

  return (
    <section
      id="tailored-demo"
      className="workshop-shell py-4 sm:py-8 max-w-7xl mx-auto px-4 sm:px-8 space-y-10 hairline-t scroll-mt-20"
    >
      <header className="grain-cover">
        <div className="grain-copy">
          <h1>The first draft<br /><em>is for editing.</em></h1>
          <p>Give your coding agent a frontend field guide. Chaff walks smaller models through the details of type, layout and interaction, one screen at a time.</p>
          <Link href="/install" className="grain-cta">Get the guide <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 16 15 5M5 5h10v10" stroke="currentColor" strokeWidth="2" /></svg></Link>
        </div>
        <svg className="grain-print" viewBox="0 0 340 240" aria-hidden="true" focusable="false">
          <defs>
            <pattern id="engraving" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(36)">
              <path d="M0 0V7" stroke="currentColor" strokeWidth="3" />
            </pattern>
          </defs>
          <g className="grain-guides" opacity=".25" fill="none" stroke="currentColor" strokeDasharray="2 5"><circle cx="180" cy="125" r="104" /><circle cx="180" cy="125" r="88" /><path d="M0 218h340M32 0v240" /></g>
          <g fill="url(#engraving)">
            <path d="M32 218C12 126 47 58 132 19C145 110 114 174 32 218Z" />
            <path d="M128 222C110 143 143 82 213 45C226 123 201 181 128 222Z" />
            <path d="M215 218C206 161 231 115 288 89C295 145 275 188 215 218Z" />
          </g>
          <path d="M32 218L128 30M128 222L210 55M215 218L285 98" stroke="currentColor" fill="none" />
        </svg>
        <a className="grain-evidence" href="https://github.com/Ameya79/chaff/tree/main/bench/trials/print-booking"><strong>3 viewport widths</strong><span>One booking flow tested with GPT-5.6 Luna. Read the trial ↗</span></a>
      </header>
      <div className="specimen-heading">
        <h2>Inside the edit</h2>
        <label className="phone-project">
          <span className="sr-only">Choose example project</span>
          <select value={project.id} onChange={e => handleProjectSwitch(e.target.value)}>
            {PROJECTS.map(item => <option key={item.id} value={item.id}>{item.tab}</option>)}
          </select>
        </label>
        <div
          role="group"
          aria-label="Simulated project domain"
          className="inline-flex flex-wrap items-center gap-1 rounded-[8px] bg-[var(--bg-surface)] border border-[var(--border-control)] p-1 shrink-0"
        >
          {PROJECTS.map((p) => {
            const active = p.id === project.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleProjectSwitch(p.id)}
                aria-pressed={active}
                className={`px-3.5 py-2.5 rounded-[6px] min-h-[46px] min-w-[46px] font-mono text-xs transition-colors duration-200 ${
                  active
                    ? 'bg-[var(--text-main)] text-[var(--btn-primary-text)] font-medium'
                    : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'
                }`}
              >
                {p.tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Experience: Left Interactive Chat Q&A, Right Live Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Chat Interaction Panel */}
        <div
          key={project.id}
          className="order-2 lg:order-1 lg:col-span-4 space-y-5 min-w-0 panel-enter"
        >
          <details className="audit-notes" open={notesOpen} onToggle={event => setNotesOpen(event.currentTarget.open)}>
          <summary>Explore the audit for {project.name}</summary>
          <div className="space-y-5 pt-4">
          {/* User Message */}
          <div className="rounded-[10px] bg-[var(--bg-surface)] hairline-box p-4 space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)] block">
              01 · You in chat
            </span>
            <p className="font-mono text-xs text-[var(--text-main)] leading-relaxed">
              &ldquo;{project.chatPrompt}&rdquo;
            </p>
          </div>

          {/* Agent Discovery + Tailored Level Questions */}
          <div className="rounded-[10px] bg-[var(--bg-surface)] hairline-box p-5 space-y-5">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)] font-medium block">
                02 · Chaff reads {project.name} ({project.detected.framework})
              </span>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                Found brand accent <code className="mono text-[var(--text-main)]">{project.detected.brandHex}</code> ({project.detected.brandLabel}). {project.detected.issueSummary}.
              </p>
            </div>

            {/* Project-Specific Level Choice */}
            <div className="space-y-2.5">
              <span className="font-mono text-[11px] text-[var(--text-main)] font-medium block">
                Which creative depth fits {project.name}?
              </span>

              <div className="space-y-1.5">
                {(
                  [
                    { id: 'level1', label: 'Level 1 · Clean', desc: project.questions.level1 },
                    { id: 'level2', label: 'Level 2 · Authored', desc: project.questions.level2 },
                    { id: 'level3', label: 'Level 3 · Risk', desc: project.questions.level3 },
                  ] as const
                ).map((lvl) => {
                  const chosen = selectedLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setSelectedLevel(lvl.id)}
                      aria-pressed={chosen}
                      className={`w-full text-left p-3 rounded-[8px] border transition-colors duration-200 min-h-[44px] space-y-1 ${
                        chosen
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                          : 'border-[var(--border-line)] hover:border-[var(--border-control)]'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className={chosen ? 'text-[var(--accent)] font-semibold' : 'text-[var(--text-main)]'}>
                          {lvl.label}
                        </span>
                        {chosen && (
                          <span className="text-[10px] text-[var(--accent)] uppercase">Selected</span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-dim)] leading-snug">
                        {lvl.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Project-Specific Identity Choice */}
            <div className="hairline-t pt-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="font-mono text-xs text-[var(--text-main)] block">
                  Lock {project.detected.brandHex} ({project.detected.brandLabel})?
                </span>
                <span className="text-[11px] text-[var(--text-dim)] block">
                  Keep existing brand token in .chaff/identity.json
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLockBrandColor((prev) => !prev)}
                aria-pressed={lockBrandColor}
                className="btn text-xs font-mono shrink-0"
              >
                {lockBrandColor ? 'Locked' : 'Reset'}
              </button>
            </div>
          </div>
          </div>
          </details>
        </div>

        {/* Right: Visual Before/After Transformation Stage */}
        <div className="specimen-frame order-1 lg:order-2 lg:col-span-8 space-y-3 min-w-0">
          {/* Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              role="group"
              aria-label="Preview view mode"
              className="inline-flex items-center gap-1 rounded-[8px] bg-[var(--bg-surface)] border border-[var(--border-control)] p-1"
            >
              {[
                { id: 'before', label: 'Before' },
                { id: 'curtain', label: 'Wipe' },
                { id: 'after', label: 'After' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setViewMode(m.id as ViewMode);
                    if (m.id === 'curtain' && (wipePercent === 0 || wipePercent === 100)) {
                      setWipePercent(42);
                    }
                  }}
                  aria-pressed={viewMode === m.id}
                  className={`px-3.5 py-1.5 rounded-[6px] min-h-[44px] min-w-[44px] font-mono text-xs transition-colors duration-200 ${
                    viewMode === m.id
                      ? 'bg-[var(--text-main)] text-[var(--btn-primary-text)] font-medium'
                      : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {viewMode === 'curtain' && (
              <label className="inline-flex items-center gap-2.5 cursor-pointer font-mono text-xs text-[var(--text-dim)]">
                <span className="sr-only">Reveal crafted output percentage</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={100 - effectiveBeforePct}
                  onChange={(e) => setWipePercent(100 - parseInt(e.target.value, 10))}
                  aria-label="Reveal clean UI over generic slop"
                  className="w-28 min-h-[44px] text-base cursor-pointer"
                />
                <span className="tabular-nums text-[var(--text-main)] w-9 text-right">
                  {100 - effectiveBeforePct}%
                </span>
              </label>
            )}
          </div>

          {/* Interactive Split Wipe Surface */}
          <div
            ref={stageBodyRef}
            onPointerDown={(e) => {
              if (viewMode !== 'curtain') return;
              if ((e.target as HTMLElement).closest('button, a, input')) return;
              setIsDragging(true);
              updateCurtainFromClientX(e.clientX);
            }}
            onPointerMove={(e) => {
              if (viewMode === 'curtain' && isDragging) {
                updateCurtainFromClientX(e.clientX);
              }
            }}
            onPointerUp={() => setIsDragging(false)}
            onPointerLeave={() => setIsDragging(false)}
            className={`relative rounded-[10px] hairline-box overflow-hidden select-none shadow-[0_1px_3px_rgba(12,14,20,0.04)] ${
              viewMode === 'curtain' ? 'cursor-ew-resize touch-pan-y' : ''
            }`}
          >
            <div key={project.id} className="specimen-stage relative grid grid-cols-1">
              <div hidden={viewMode === 'before'} className="col-start-1 row-start-1 relative z-0">
                {renderAfter()}
              </div>

              <div
                hidden={viewMode === 'after'}
                className="col-start-1 row-start-1 relative z-10"
                style={{
                  clipPath: `inset(0 ${100 - effectiveBeforePct}% 0 0)`,
                  pointerEvents: effectiveBeforePct > 12 ? 'auto' : 'none',
                }}
              >
                {renderBefore()}
              </div>

              {viewMode === 'curtain' && (
                <div
                  className="pointer-events-none absolute top-0 bottom-0 z-20 w-[2px] bg-[var(--accent)]"
                  style={{ left: `${effectiveBeforePct}%` }}
                  aria-hidden="true"
                >
                  <div className="absolute top-3 -translate-x-1/2 px-2.5 py-0.5 rounded-[4px] bg-[var(--accent)] text-[var(--btn-accent-text)] font-mono text-[10px] font-medium uppercase tracking-wider whitespace-nowrap">
                    Wipe
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Clean Rule Pills + Score Telemetry */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 font-mono text-xs">
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              {project.tells.map((t) => {
                const active = t.id === activeTell.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTellId(t.id)}
                    aria-pressed={active}
                    className={`px-2.5 py-1 rounded-[4px] min-h-[44px] min-w-[44px] text-[11px] transition-colors duration-150 ${
                      active
                        ? 'bg-[var(--accent)] text-[var(--btn-accent-text)] font-medium'
                        : 'bg-[var(--bg-surface)] border border-[var(--border-line)] text-[var(--text-dim)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {t.ruleId}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={`/rules#${activeTell.ruleId}`}
                className="ink-link text-[var(--accent)] min-h-[44px]"
              >
                {activeTell.label} (-{activeTell.deduction})
              </Link>
              <strong className="text-[var(--status-pass)]">
                <RollingCounter
                  value={project.afterScore - project.beforeScore}
                  prefix="+"
                  suffix=" pts"
                />
              </strong>
            </div>
          </div>
          <p className="text-xs text-[var(--text-dim)] font-sans">{activeTell.note}</p>
        </div>
      </div>
    </section>
  );
}
