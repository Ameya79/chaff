---
id: CODE-002
title: Raw HTML anchor <a> tags for internal route navigation
severity: high
levels: [1, 2, 3]
detect: static
fix_class: navigation
bad: "<a href=\"/settings\" className=\"text-neutral-300 hover:text-white\">Settings</a>"
good: "<Link href=\"/settings\" className=\"text-neutral-300 hover:text-white\">Settings</Link>"
why: "Using standard HTML <a> tags for internal links forces a full page reload, destroying client-side React state, discarding in-memory cache, unmounting layout trees, and causing unnecessary server round-trips instead of instant prefetching and client-side transitions via next/link."
exceptions: "External outbound URLs (target=\"_blank\", rel=\"noopener noreferrer\"), protocol links (mailto:, tel:), hash links (#section-id) on the same view, or non-HTML file downloads (download attribute)."
---

## Context & Problem
AI generators often write standard HTML `<a href="/path">` anchors for navigation between application routes. In a single-page or hybrid Next.js application, clicking an `<a>` tag instructs the browser to unload the current document, purge client-side React state and memory caches, perform a full round-trip HTTP request to the origin server, and re-parse all scripts and stylesheets. This degrades user experience and destroys navigation snappiness.

## Detection Logic
Static AST analysis searches for `JSXOpeningElement[name.name="a"]` where the `href` attribute is a relative path or string literal starting with `/` (excluding `//` protocol-relative links), and does not carry attributes `target="_blank"`, `download`, or start with external protocol schemas (`http:`, `https:`, `mailto:`, `tel:`). It aligns with Next.js rule `@next/next/no-html-link-for-pages`.

## Remediation Steps
1. Import Next.js Link: `import Link from 'next/link';`.
2. Replace `<a href="/...">` with `<Link href="/...">`.
3. Retain existing `className`, `children`, and accessibility attributes.
4. Ensure any internal navigation buttons wrap the `Link` component or use router navigation hooks (`useRouter` from `next/navigation`).

## Verification
Run `npx eslint . --rule "@next/next/no-html-link-for-pages: error"`. In a browser session, click navigation links and observe DevTools Network tab: confirm route transitions occur via client-side RSC payload fetches without full document reloads.
