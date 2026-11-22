---
id: CODE-007
title: Non-semantic <div> container nesting
severity: medium
levels: [1, 2, 3]
detect: static
fix_class: semantics
bad: "<div className=\"site-header\"><div className=\"header-inner\"><div className=\"nav-wrapper\"><div className=\"links\"><a href=\"/\">Home</a></div></div></div></div>"
good: "<header className=\"w-full border-b border-neutral-800\"><nav aria-label=\"Main Navigation\" className=\"max-w-7xl mx-auto px-4\"><ul className=\"flex items-center gap-6\"><li><Link href=\"/\">Home</Link></li></ul></nav></header>"
why: "Gratuitous nesting of unstyled or redundant <div> tags (div soup) creates deeply nested DOM trees, increases memory consumption, and destroys document semantics needed by screen readers, assistive tools, and search engine crawlers."
exceptions: "Pure styling wrappers strictly required for absolute positioning contexts, CSS grid containment overlays, or complex SVG clip-path boundaries where no semantic HTML5 tag is appropriate."
---

## Context & Problem
AI code generation often wraps every element in successive layers of generic `<div>` containers. This produces "div soup" where document hierarchy is completely obscured. Screen readers cannot locate landmark navigation points, search indexing spiders cannot identify main content blocks, and the browser's layout engine must traverse unnecessarily deep DOM hierarchies during style recalculation.

## Detection Logic
Static AST analysis detects JSX trees containing sequences of nested `div > div > div` where intermediate containers lack distinct styling, attributes, or layout responsibilities. It audits `div` containers wrapping landmark content (headers, navigation menus, main content areas, articles, footers) without using semantic HTML5 elements.

## Remediation Steps
1. Replace outermost landmark divs with HTML5 landmark tags: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`.
2. Flatten redundant passthrough wrapper divs that only contain a single child.
3. Use React Fragments `<> ... </>` when returning sibling elements without needing a DOM container node.
4. Structure lists of items using `<ul>` or `<ol>` with `<li>` rather than stacked `<div>` items.

## Verification
Run axe-core accessibility audit to ensure landmarks are present and valid (`region`, `landmark-one-main`). Inspect DOM tree in browser: verify DOM depth is reduced and semantic tags wrap major sections.
