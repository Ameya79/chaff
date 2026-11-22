---
id: MOBILE-006
title: Replace default WebKit tap highlight gray box with active state
severity: low
levels: [1, 2, 3]
detect: static
fix_class: interaction
bad: "button, a { cursor: pointer; }"
good: "button, a { -webkit-tap-highlight-color: transparent; } button:active, a:active { transform: scale(0.98); transition: transform 80ms ease; }"
why: "Default WebKit mobile browsers render a jarring translucent gray rectangle over tapped links and buttons. Removing this generic overlay and replacing it with intentional :active micro-interactions gives the UI native tactile responsiveness."
exceptions: "Legacy browsers lacking CSS transform support or native OS-rendered select controls."
---

## Context & Problem
Mobile WebKit and Blink engines render a default translucent gray bounding box (`rgba(0, 0, 0, 0.18)`) whenever a user taps an interactive element. This generic rectangle ignores custom component corner radii, clashes with brand aesthetic palettes, and flashes abruptly across the screen. In AI-generated templates, leaving `-webkit-tap-highlight-color` unmanaged immediately reveals an unpolished, uncrafted web interface rather than a fluid, native-grade touch application.

## Detection Logic
Static CSS and global stylesheet scanner inspects base CSS reset configurations (`globals.css`, `base.css`, `reset.css`) to confirm presence of `-webkit-tap-highlight-color: transparent;`. Flags stylesheets where interactive components (`button`, `a`, `[role='button']`) declare click handlers but fail to define both highlight suppression and explicit `:active` state visual feedback.

## Remediation Steps
1. Add global touch highlight suppression to the base stylesheet:
   `* { -webkit-tap-highlight-color: transparent; }`.
2. Author distinct, tactile `:active` state styles for all interactive buttons and actionable surfaces. For example, add Tailwind's `active:scale-[0.98] active:opacity-90 transition-transform duration-75`.
3. Provide high-contrast focus and hover states that coexist gracefully with touch feedback without getting stuck in an active state after finger release.
4. Test touch feedback latency to ensure the response fires within 80ms of touch initiation.

## Verification
Inspect compiled CSS to verify `-webkit-tap-highlight-color: transparent` is present in the global reset. Emulate mobile touch events in browser devtools and tap interactive buttons; verify the absence of any gray highlight rectangle and confirm smooth micro-interaction feedback.
