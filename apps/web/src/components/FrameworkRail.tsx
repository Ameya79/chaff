'use client';

import Image from 'next/image';
import { useState } from 'react';

const stacks = [
  ['SolidJS', 'solidjs'], ['React', 'react'], ['Next.js', 'nextjs'],
  ['Vite', 'vitejs'], ['Angular', 'angular'], ['AngularJS', 'angularjs'],
  ['SvelteKit', 'svelte'], ['Vue', 'vuejs'], ['Nuxt', 'nuxtjs'], ['Astro', 'astro'],
];

export function FrameworkRail() {
  const [paused, setPaused] = useState(false);
  return (
    <section aria-label="Supported frameworks and tools" className="framework-rail">
      <div className="rail-heading">
        <h2>Built for</h2>
        <button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>
          {paused ? 'Resume slider' : 'Pause slider'}
        </button>
      </div>
      <div className="rail-window">
        <div className="rail-track" style={{ animationPlayState: paused ? 'paused' : 'running' }}>
          {[0, 1].map(copy => (
            <ul key={copy} aria-hidden={copy === 1 || undefined}>
              {stacks.map(([label, slug]) => (
                <li key={slug} data-framework={slug}><Image unoptimized src={'/frameworks/' + slug + '.svg'} width={30} height={30} alt="" />{label}</li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
