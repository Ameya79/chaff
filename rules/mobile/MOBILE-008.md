---
id: MOBILE-008
title: Prevent mobile cumulative layout shift from dynamic banners
severity: high
levels: [1, 2, 3]
detect: rendered
fix_class: layout
bad: "export function AnnouncementBanner() { const [banner, setBanner] = useState<string | null>(null); useEffect(() => { fetchBanner().then(setBanner); }, []); if (!banner) return null; return <div className=\"bg-amber-100 p-3 text-sm\">{banner}</div>; }"
good: "export function AnnouncementBanner() { const [banner, setBanner] = useState<string | null>(null); useEffect(() => { fetchBanner().then(setBanner); }, []); if (!banner) return null; return <aside role=\"region\" aria-label=\"System announcement\" className=\"fixed bottom-0 inset-x-0 z-40 p-3 bg-stone-900 text-stone-100 text-sm shadow-md\"><div className=\"max-w-md mx-auto flex items-center justify-between\"><span>{banner}</span><button className=\"min-h-[44px] min-w-[44px] p-2 text-stone-300 hover:text-white\">Dismiss</button></div></aside>; }"
why: "Asynchronously injected banners, consent bars, and dynamic headers placed at the top of the mobile viewport push down visible content, generating high Cumulative Layout Shift (CLS > 0.1) and causing accidental tap errors on mobile devices."
exceptions: "Pre-rendered server components or layout placeholders with exact height reservation matching the injected content."
---

## Context & Problem
Asynchronous notifications, cookie consent bars, promotional ribbons, and authentication alerts are frequently injected into the top of the DOM after client-side hydration or network response arrival. On desktop displays, this may only cause a minor visual shift, but on narrow mobile viewports with tight vertical constraints, a sudden 50px insertion shifts the entire page downward. Users who are already reading or tapping a primary CTA end up tapping the wrong link or losing their reading position, resulting in high Cumulative Layout Shift (CLS > 0.1) and severe user frustration.

## Detection Logic
Automated rendered audit in Playwright or Lighthouse captures performance metrics during page loading at 390px viewport width. It calculates the cumulative layout shift (CLS) score and flags any dynamic element injected into document flow after initial paint that produces a layout shift score exceeding 0.05. Static code scanner also flags client-side `useEffect` hooks that mount top-of-page alert containers without layout space reservation.

## Remediation Steps
1. Anchor dynamic asynchronous notices to the bottom of the viewport using `fixed bottom-0 inset-x-0 z-40`, completely separating them from normal document flow.
2. If top placement is strictly required by product architecture, render a placeholder skeleton or CSS container with pre-reserved height (`min-h-[48px]`) during server-side rendering so layout geometry is locked before client data arrives.
3. Use CSS `contain: layout;` and `content-visibility: auto;` on dynamic notification wrappers to isolate render tree recalculations.
4. Animate banner dismissal via opacity and scale rather than collapsing height, preventing reverse layout shifts on close.

## Verification
Execute Lighthouse mobile performance audit at 390px emulation. Verify that the Cumulative Layout Shift (CLS) score remains strictly below 0.10 (nominal target: 0.00) during initial page load, asynchronous banner injection, and user dismissal.
