---
id: CODE-009
title: Dynamic styling via inline style objects instead of CSS classes
severity: medium
levels: [1, 2, 3]
detect: static
fix_class: maintainability
bad: "<div style={{ padding: \"24px\", backgroundColor: isSelected ? \"#2563eb\" : \"#1f2937\", borderRadius: \"12px\", display: \"flex\" }}>Item</div>"
good: "<div className={cn(\"p-6 rounded-xl flex transition-colors\", isSelected ? \"bg-blue-600\" : \"bg-neutral-800\")}>Item</div>"
why: "Heavy use of React style={{ ... }} inline objects bypasses Tailwind CSS optimization, defeats CSP style-src security directives, prevents CSS variable theming, forces new object allocation on every render, and breaks pseudo-class (:hover, :focus) ergonomics."
exceptions: "Truly continuous, high-frequency dynamic values calculated from real-time coordinates (e.g. cursor positions, spring animation translations, drag offsets, or canvas dimensions)."
---

## Context & Problem
AI models often output inline `style={{ ... }}` blocks for styling variants instead of idiomatic utility classes. Inline styles bypass design token systems, cannot utilize responsive breakpoints (`md:`, `lg:`), cannot respond to pseudo-states (`hover:`, `focus-visible:`), and allocate new JavaScript objects on every render pass, triggering garbage collection overhead. In addition, inline styles violate strict Content Security Policy (CSP) configurations requiring non-inline styles.

## Detection Logic
Static AST analysis searches for `JSXAttribute[name.name="style"]` with a `JSXExpressionContainer` containing an `ObjectExpression`. It detects standard static styling properties (`padding`, `margin`, `backgroundColor`, `color`, `fontSize`, `display`, `borderRadius`) mapped to static values or ternary expressions rather than continuous transforms.

## Remediation Steps
1. Replace static and state-dependent inline styles with Tailwind utility classes.
2. Use the `cn()` utility (combining `clsx` and `tailwind-merge`) to conditionally apply classes based on component state.
3. If continuous dynamic values are needed (e.g. a progress bar width percentage), assign them via CSS custom properties: `style={{ '--progress': `${percent}%` } as React.CSSProperties}` and consume via Tailwind: `className="w-[var(--progress)]"`.
4. Restrict inline style attributes solely to continuous animated coordinates or user-defined dimensions.

## Verification
Search workspace for `style={{` patterns. Confirm remaining instances are strictly continuous transform coordinates or CSS variables. Check browser DevTools Elements panel: verify classes are merged cleanly without conflicting CSS rules.
