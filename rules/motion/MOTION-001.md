---
id: MOTION-001
title: Enforce prefers-reduced-motion compliance across animations and transitions
severity: high
levels: [1, 2, 3]
detect: rendered
fix_class: accessibility_fix
bad: ".hero-banner { animation: continuousFlyIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) infinite; transform: translateY(-20px); transition: transform 0.4s ease; }"
good: ".hero-banner { animation: continuousFlyIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) infinite; transform: translateY(-20px); transition: transform 0.4s ease; } @media (prefers-reduced-motion: reduce) { .hero-banner { animation: none !important; transition: opacity 0.2s ease, transform 0.01ms !important; transform: none !important; } }"
why: "Unchecked spatial animations and looping movements cause severe nausea, vestibular disorientation, and cognitive fatigue for users with vestibular spectrum disorders. Operating system reduced-motion preferences must be strictly respected by neutralizing non-essential spatial motion while preserving subtle opacity transitions."
exceptions: "Essential functional progress indicators where motion communicates vital real-time status and no spatial displacement or high-frequency flicker is present."
---

## Context & Problem
Operating systems provide accessibility preferences enabling users to indicate a preference for reduced motion (`prefers-reduced-motion: reduce`). Individuals with vestibular spectrum disorders, motion sickness, vertigo, or migraines can experience physical dizziness, nausea, disorientation, and headaches when exposed to large-scale spatial movements, parallax scrolling, or spinning UI elements. Uncrafted AI templates routinely build flashy entrance animations, floating cards, and looping rotations without respecting this user setting, forcing vulnerable users off the site.

## Detection Logic
Automated rendered audit in Playwright emulates reduced motion via `page.emulateMedia({ reducedMotion: 'reduce' })`. The test inspects computed styles across all animated and transitioned DOM elements, verifying that `animation-duration` is reduced to zero or `animation-name` is `none`, and that spatial transforms (`translate`, `scale`, `rotate`) are neutralized. Static scanner also searches stylesheets and components for keyframe animations lacking corresponding `@media (prefers-reduced-motion: reduce)` rules or Tailwind `motion-reduce:` classes.

## Remediation Steps
1. Add global CSS reset for reduced motion in base stylesheets:
   `@media (prefers-reduced-motion: reduce) { *, ::before, ::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } }`.
2. When building tailored micro-interactions, preserve subtle opacity fades while zeroing spatial translation:
   `@media (prefers-reduced-motion: reduce) { .modal { transform: none !important; transition: opacity 150ms ease !important; } }`.
3. In React and Framer Motion code, integrate the `useReducedMotion()` hook:
   `const shouldReduceMotion = useReducedMotion(); const animateProps = shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 };`.
4. Replace auto-playing video backgrounds or animated canvas loops with static high-resolution poster images when reduced motion is detected.

## Verification
Run automated Playwright test suite with `reducedMotion: 'reduce'`. Inspect rendered animations and confirm that zero spatial motion occurs across all UI routes and component interactions.
