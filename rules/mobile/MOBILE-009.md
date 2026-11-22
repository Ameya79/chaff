---
id: MOBILE-009
title: Prevent illegible micro-typography and truncation on compact view
severity: medium
levels: [1, 2, 3]
detect: static
fix_class: typography
bad: "<p className=\"text-[10px] leading-tight truncate text-gray-400\">Last synced at 14:32:01 UTC - Server node cluster US-East-1</p>"
good: "<p className=\"text-xs sm:text-sm leading-normal text-stone-500 break-words\">Last synced at 14:32:01 UTC &bull; Server node cluster US-East-1</p>"
why: "Font sizes smaller than 12px (0.75rem) are illegible on handheld mobile screens viewed at arm's length. Premature single-line truncation (ellipsis) without hover or tooltip capabilities permanently obscures vital information for mobile touch users."
exceptions: "Legal copyright footers, trademark badges, or monospaced serial hashes constrained to technical metadata labels."
---

## Context & Problem
When shrinking desktop interfaces into mobile layouts, naive templates frequently compress font sizes down to 9px, 10px, or 11px and apply CSS `truncate` (text-overflow: ellipsis) to prevent text from wrapping. On handheld smartphones held at distances of 30 to 40 cm, micro-typography becomes completely illegible to average human vision. Furthermore, touch devices lack hover capability, meaning mobile users have no way to trigger tooltips or inspect truncated text strings, permanently hiding essential status or metadata information.

## Detection Logic
Static source scanner parses CSS and JSX style definitions for arbitrary or utility font sizes under 12px (`text-[9px]`, `text-[10px]`, `text-[11px]`, `font-size: 10px`, `font-size: 0.625rem`) and flags any occurrence applied to body copy, metadata summaries, or interactive controls. It also flags unconditional `truncate` utilities placed on critical data fields lacking mobile wrap handling.

## Remediation Steps
1. Establish a strict typographic minimum threshold of 12px (`text-xs` / 0.75rem) for supplementary captions, with 14px (`text-sm`) or 16px (`text-base`) for primary body text.
2. Replace single-line `truncate` with responsive multi-line wrapping: use `break-words` or CSS line clamps (`line-clamp-2` or `line-clamp-3`) so users can read the complete content on compact viewports.
3. Ensure line heights provide adequate legibility: maintain `leading-normal` (1.5) or `leading-relaxed` (1.625) for compact text to prevent ascenders and descenders from colliding on mobile displays.
4. Set minimum contrast ratios for small text to at least 4.5:1 against the surrounding background.

## Verification
Run static scanner over all UI component directories. Verify that zero font size declarations specify values below 12px. Load the application on a 320px viewport and confirm all text nodes remain legible, unwrapped without clipping, and fully readable without ellipsis truncation.
