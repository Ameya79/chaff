---
id: PERF-003
title: Monolithic client bundles lacking dynamic code splitting
severity: high
levels: [1, 2, 3]
detect: static
fix_class: bundle
bad: "import { MonacoCodeEditor } from '@/components/MonacoCodeEditor'; export default function EditorPage() { return <div><MonacoCodeEditor /></div>; }"
good: "import dynamic from 'next/dynamic'; const MonacoCodeEditor = dynamic(() => import('@/components/MonacoCodeEditor'), { ssr: false, loading: () => <EditorSkeleton /> }); export default function EditorPage() { return <div><MonacoCodeEditor /></div>; }"
why: "Statically importing heavy client libraries (syntax highlighters, chart packages, 3D engines, rich text editors) into root page components forces megabytes of unnecessary JavaScript onto initial route loads, blowing past the 170 KB gzip first-load JS budget."
exceptions: "Lightweight core application primitives required for above-the-fold first paint rendering or routes with total first-load JS bundle demonstrably under 100 KB gzip."
---

## Context & Problem
AI generators often place static `import` statements at the top of route components for large dependencies such as charting libraries (Recharts, Chart.js), syntax highlighters (Prism, Monaco), or rich-text editors. These heavy modules are bundled directly into the initial entry JavaScript chunk. This increases initial route download size, slows down JavaScript parsing and compilation on mobile CPUs, and degrades Interaction to Next Paint (INP).

## Detection Logic
Static AST analysis detects top-level `ImportDeclaration` nodes of heavy third-party packages (`monaco-editor`, `echarts`, `three`, `chart.js`, `prismjs`, `@tiptap/react`, `recharts`, `lottie-web`) in entry route components (`page.tsx`). Bundle analyzer audits flag initial route bundles that exceed 170 KB gzip.

## Remediation Steps
1. Replace static import with `next/dynamic` lazy loading: `const HeavyComponent = dynamic(() => import('./HeavyComponent'), { loading: () => <Skeleton />, ssr: false });`.
2. Provide a lightweight fallback skeleton that matches the dimensions of the lazy-loaded component to prevent layout shifts.
3. Defer loading of non-critical UI dialogs, drawers, and below-the-fold features until user interaction or viewport intersection.
4. Leverage React 19 Server Components for data display to avoid sending rendering libraries to client browsers.

## Verification
Run `npm run build` or `npx @next/bundle-analyzer`. Confirm route initial JS payload is under 170 KB gzip in build summary. Verify Lighthouse Total Blocking Time (TBT) remains below 200ms.
