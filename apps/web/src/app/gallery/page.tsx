import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import caseStudiesData from '../../data/case-studies.json';
import { GalleryWorkbench, CaseStudyDto } from '../../components/GalleryWorkbench';

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Before and After visual comparisons and reconciled scores across five workspace fixtures.',
};

export default function GalleryPage() {
  const studies = caseStudiesData as CaseStudyDto[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20 space-y-12">
      <header className="space-y-3">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-ember)] block">
          Case Studies
        </span>
        <h1 className="font-serif text-[var(--text-main)]">
          Before &amp; After Frames
        </h1>
        <p className="text-base text-[var(--text-dim)] max-w-[46ch]">
          Five local fixtures compared at 1440px and 390px.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="py-12 font-mono text-xs text-[var(--text-dim)]">
            Loading visual dossiers...
          </div>
        }
      >
        <GalleryWorkbench studies={studies} />
      </Suspense>
    </div>
  );
}
