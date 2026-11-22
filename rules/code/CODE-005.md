---
id: CODE-005
title: Premature 'use client' directive on server-compatible components
severity: high
levels: [1, 2, 3]
detect: static
fix_class: architecture
bad: "'use client'; export default function FeaturesPage() { return <section className=\"py-20\"><h2 className=\"text-3xl font-bold\">Platform Overview</h2><StaticFeatureList /></section>; }"
good: "export default function FeaturesPage() { return <section className=\"py-20\"><h2 className=\"text-3xl font-bold\">Platform Overview</h2><StaticFeatureList /><InteractiveFilterModal /></section>; }"
why: "Marking entire page routes or static layout wrappers with 'use client' forces the entire sub-tree into the client bundle, ballooning hydration cost, blocking server-side streaming, and exposing server-only dependencies to the browser."
exceptions: "Root interactive layout components requiring client-side context providers (e.g., ThemeProvider, AuthProvider) that wrap children without converting children into client components."
---

## Context & Problem
When AI agents encounter any requirement for interactivity (such as a dropdown or modal), they often take the shortcut of slapping `'use client'` at the top of the entire `page.tsx` or `layout.tsx` file. In Next.js App Router, the `'use client'` directive defines a network boundary: all components imported into that file are compiled into the client JavaScript bundle. Marking root pages as client components defeats Server Components, inflates bundle size, and degrades First Contentful Paint (FCP).

## Detection Logic
Static AST analysis inspects files in `app/**/page.tsx` or `app/**/layout.tsx` beginning with directive literal `'use client'`. It checks whether the file contains browser event listeners (`onClick`, `onChange`), React state/lifecycle hooks (`useState`, `useEffect`), or browser APIs (`window`, `localStorage`). If not, or if interactivity is confined to an isolated child element, it is flagged as premature.

## Remediation Steps
1. Delete `'use client'` from the top of the page or layout file.
2. Identify the specific UI element that requires interactivity (e.g., a toggle button, search input, or tab controller).
3. Extract that interactive element into an isolated component file under `components/` or `_components/`.
4. Place `'use client'` exclusively inside that extracted leaf component.
5. Import and render the interactive leaf component within the Server Component page.

## Verification
Run `npm run build`. Verify Next.js build output route table displays `○ (Static)` or `ƒ (Dynamic)` Server Components for the target routes rather than client-rendered bundles.
