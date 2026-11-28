import React, { Suspense } from 'react';
import { pageMetadata } from '../../lib/discovery';
import caseStudiesData from '../../data/case-studies.json';
import { GalleryWorkbench, CaseStudyDto } from '../../components/GalleryWorkbench';
import { PageHeader } from '../../components/PageHeader';

export const metadata = pageMetadata('/gallery');

export default function GalleryPage() {
  const studies = caseStudiesData as CaseStudyDto[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20 space-y-12">
      <PageHeader
        eyebrow="Case Studies"
        title="Before & After Frames"
        lead="Five local fixtures compared at 1440px and 390px."
      />

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
