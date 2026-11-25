import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import caseStudiesData from '../../data/case-studies.json';
import { GalleryWorkbench, CaseStudyDto } from '../../components/GalleryWorkbench';

export const metadata: Metadata = {
  title: 'Visual Before & After Case Studies',
  description:
    'Inspect live rendered Before/After comparisons and reconciled audit metrics across five local workspace fixtures.',
};

export default function GalleryPage() {
  const studies = caseStudiesData as CaseStudyDto[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      <header className="space-y-3 pb-6 hairline-b">
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-[var(--text-dim)]">
          <span className="uppercase tracking-[0.16em] text-[var(--accent-ember)] font-semibold">
            Workspace Fixtures
          </span>
          <span>5 Verified Case Studies · Reconciled with chaff audit</span>
        </div>
        <h1 className="font-serif text-[var(--text-main)]">
          Visual Case Study Gallery
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-dim)] max-w-[65ch] leading-relaxed">
          Compare live rendered Before and After browser frames at 1440px and 390px across five workspace fixtures, alongside reconciled baseline scores and preserved brand waivers.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="p-8 hairline bg-[var(--bg-surface)] font-mono text-xs text-[var(--text-dim)]">
            Loading visual fixture dossiers...
          </div>
        }
      >
        <GalleryWorkbench studies={studies} />
      </Suspense>
    </div>
  );
}
