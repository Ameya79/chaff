---
id: CODE-003
title: Client-side useEffect data fetching in Next.js App Router
severity: high
levels: [1, 2, 3]
detect: static
fix_class: architecture
bad: "useEffect(() => { fetch('/api/metrics').then(r => r.json()).then(setMetrics); }, []);"
good: "async function MetricsPanel() { const metrics = await getMetrics(); return <MetricsView data={metrics} />; }"
why: "Initiating data fetches inside client-side useEffect hooks in the App Router creates artificial client-server waterfalls, triggers empty loading flicker, forces unnecessary client bundle bloat with client fetching libraries, and forfeits streaming Server Components, parallel data fetching, and edge caching."
exceptions: "Pure client-side telemetry/analytics tracking events triggered on component mount, polling real-time WebSocket subscriptions, or browser storage reads (e.g. localStorage)."
---

## Context & Problem
AI agents accustomed to legacy React 16/17 Single Page Application patterns frequently generate components that fetch data using `useEffect(() => { fetch(...) }, [])` paired with `useState(null)`. In the Next.js App Router, this pattern causes an unrendered shell to download, hydrates, initiates an asynchronous fetch over the network, and re-renders only after a round-trip delay. This results in jarring layout shifts, visible loading spinners, client-server waterfalls, and defeats Next.js server-side streaming and caching.

## Detection Logic
Static AST analysis searches for `CallExpression[callee.name="useEffect"]` located in files inside `app/` containing asynchronous data calls (`fetch`, `axios`, or async dispatchers updating state via `setState`). It flags components performing initial data acquisition on mount rather than leveraging Server Components or React Suspense boundaries.

## Remediation Steps
1. Remove `'use client'` directive if the component does not require browser events or interactive state.
2. Convert the component into an `async` React Server Component.
3. Await data fetching directly inside the component body: `const data = await fetchData();`.
4. Wrap the Server Component in a `<Suspense fallback={<MetricsSkeleton />}>` boundary in its parent layout or page.
5. If client-side revalidation is strictly needed, migrate to React Server Actions or dedicated client hooks like SWR or TanStack Query.

## Verification
Run static scan verifying absence of `useEffect` + `fetch` data loading patterns in `app/`. Load the page with JavaScript disabled in Chrome DevTools: confirm the data is fully rendered in the initial HTML payload.
