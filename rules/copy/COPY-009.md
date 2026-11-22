---
id: COPY-009
title: Fabricated customer testimonials and avatar quotes
severity: high
levels: [1, 2, 3]
detect: heuristic
fix_class: credibility
bad: "<div className=\"testimonial\"><img src=\"https://images.unsplash.com/photo-1534528741775-53994a69daeb\" alt=\"Sarah\" /><blockquote>\"This product transformed our entire company culture!\"</blockquote><cite>Sarah Miller, VP of Synergy at TechCorp</cite></div>"
good: "<div className=\"case-study\"><div className=\"font-mono text-xs text-amber-500\">Benchmark Result</div><p className=\"mt-2 text-stone-700 dark:text-stone-300\">Reduced median First Contentful Paint from 1.8s to 420ms across 10 production routes.</p></div>"
why: "Fake quotes with stock photography avatars and invented corporate titles are immediately recognized by users, destroying all project credibility."
exceptions: "Verified customer testimonials with real external links, authentic GitHub/X handles, and verified identity attribution."
---

## Context & Problem
AI web generation tools routinely insert fabricated customer testimonial carousels complete with stock Unsplash portraits, fictional user names ("Sarah Miller, VP of Innovation"), and generic glowing endorsements. Savvy developers immediately identify stock photography and synthetic corporate titles, destroying the product's credibility and flagging the entire application as deceptive.

## Detection Logic
Heuristic scanner evaluates testimonial card components. It flags cards referencing stock photo service URL patterns (`images.unsplash.com`, `source.unsplash.com`, `randomuser.me`, `api.dicebear.com`) paired with generic corporate titles ("VP of *", "Head of Innovation at *", "Lead Developer at TechCorp") that lack external verifiability.

## Remediation Steps
1. Delete unverified testimonial cards, fictitious customer quotes, and stock photo avatar blocks.
2. Replace social proof sections with empirical evidence: benchmark charts, before-and-after code diffs, or architecture diagrams.
3. If featuring real testimonials from early adopters, include verified links to their public GitHub or social profiles with their permission.
4. If no testimonials exist yet, let the product's documentation, code quality, and demo speak directly for itself.

## Verification
Static scan verifies zero references to stock portrait CDN URLs in testimonial cards. Review confirms that any featured quotes include verified public profile links.
