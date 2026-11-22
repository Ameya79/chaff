---
id: PERF-001
title: Unoptimized web font loading without next/font
severity: high
levels: [1, 2, 3]
detect: static
fix_class: font
bad: "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');"
good: "import { Inter } from 'next/font/google'; const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-sans' });"
why: "Loading web fonts via external @import in CSS or unoptimized <link rel=\"stylesheet\"> tags triggers third-party blocking network requests, delays text rendering, and produces severe Flash of Invisible Text (FOIT) or Flash of Unstyled Text (FOUT)."
exceptions: "Dynamically chosen, user-uploaded custom fonts loaded at runtime within an interactive design tool or WYSIWYG editor."
---

## Context & Problem
AI coding assistants often paste `@import url('https://fonts.googleapis.com/css2?family=...')` into CSS stylesheets or insert `<link rel="stylesheet" href="...">` in HTML heads. External font links require additional DNS resolution, TLS negotiation, and CSSOM blocking roundtrips to external Google servers. This delays text rendering, causes FOIT/FOUT flashes, and violates privacy compliance frameworks like GDPR.

## Detection Logic
Static AST and CSS analysis searches stylesheets for `@import` rules referencing external font domains (`fonts.googleapis.com`, `fonts.gstatic.com`). In JSX components, it detects `<link rel="stylesheet">` elements pointing to third-party font host providers. It corresponds to Next.js ESLint rule `@next/next/no-page-custom-font`.

## Remediation Steps
1. Remove external font `@import` rules from `globals.css` and font `<link>` tags from root layouts.
2. Use Next.js built-in font optimization: import desired font from `next/font/google` (or `next/font/local`).
3. Configure the font instance with `subsets: ['latin']`, `display: 'swap'`, and an explicit CSS variable name (e.g. `variable: '--font-sans'`).
4. Inject the font's CSS variable class into the `<html>` or `<body>` element.
5. Reference the CSS variable in Tailwind configuration: `fontFamily: { sans: ['var(--font-sans)', 'sans-serif'] }`.

## Verification
Run `npx eslint . --rule "@next/next/no-page-custom-font: error"`. Check Network panel on page load: confirm zero outgoing requests to `fonts.googleapis.com` or `fonts.gstatic.com`; font files must be self-hosted locally by Next.js.
