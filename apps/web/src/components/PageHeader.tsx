import React from 'react';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  lead: React.ReactNode;
}

export function PageHeader({ eyebrow, title, lead }: PageHeaderProps) {
  const words = title.split(/\s+/).filter(Boolean);

  return (
    <header className="folio-header space-y-4">
      <div
        className="hero-fade-in flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-[var(--accent)] font-medium"
        style={{ '--d': '0ms' } as React.CSSProperties}
      >
        <span>{eyebrow}</span>
        <span className="h-px w-8 bg-[var(--accent)] opacity-45" aria-hidden="true" />
      </div>

      <h1 className="font-display text-[var(--text-main)]" aria-label={title}>
        {words.map((word, idx) => (
          <React.Fragment key={`${word}-${idx}`}>
            <span className="word-mask">
              <span
                className="word-in"
                style={{ '--d': `${40 + idx * 50}ms` } as React.CSSProperties}
              >
                {word}
              </span>
            </span>
            {idx < words.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </h1>

      <p
        className="hero-fade-in text-base text-[var(--text-dim)] max-w-[54ch] leading-relaxed"
        style={{ '--d': '200ms' } as React.CSSProperties}
      >
        {lead}
      </p>

      <div
        className="rule-wipe h-px w-full bg-[var(--border-line)] mt-6"
        style={{ '--d': '240ms' } as React.CSSProperties}
      />
    </header>
  );
}
