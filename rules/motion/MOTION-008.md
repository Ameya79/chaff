---
id: MOTION-008
title: Restrict will-change usage to prevent GPU layer explosion and VRAM leaks
severity: medium
levels: [1, 2, 3]
detect: static
fix_class: gpu_memory_management
bad: "* { will-change: all; } .card-item { will-change: transform, opacity, filter; }"
good: ".card-item:hover { will-change: transform, opacity; } .card-item:not(:hover) { will-change: auto; }"
why: "Setting will-change indiscriminately or permanently forces the browser compositor to allocate dedicated GPU memory textures for every element. On mobile devices with unified memory, this causes layer explosion, excessive memory consumption, and browser tab crashes."
exceptions: "High-frequency persistent viewport elements like fixed navigation bars undergoing continuous scroll-driven blur transitions."
---

## Context & Problem
Developers and AI models frequently apply `will-change: transform` or even `will-change: all` across recurring list items, cards, or universal resets in an attempt to force hardware acceleration and eliminate stutter. However, `will-change` informs the browser compositor that the element will change in the immediate future, prompting the browser to promote each element into its own separate GPU graphics layer (compositing layer). On complex pages containing dozens or hundreds of items, this triggers "layer explosion". Dedicated texture memory in GPU VRAM is quickly exhausted, leading to severe memory bloat, sluggish scrolling, rasterization stutter, and mobile Safari tab crashes.

## Detection Logic
Static CSS and stylesheet scanner analyzes all selector blocks for `will-change`. Flags:
1. Universal selector usage (`* { will-change: ... }`).
2. Declarations of `will-change: all`.
3. Persistent, non-pseudo-class declarations of `will-change` on recurring list items, table rows, or card components (such as `.card`, `li`, `tr`) that are not scoped to `:hover`, `:focus-visible`, or an active interaction class.

## Remediation Steps
1. Apply `will-change` strictly just before the element changes and remove it as soon as the transition completes: scope rules to interactive pseudo-classes like `:hover` or `:focus-visible` (`.card:hover { will-change: transform, opacity; }`).
2. If managing dynamic animations in JavaScript, set `element.style.willChange = 'transform'` upon `pointerdown` or `mouseenter`, and reset `element.style.willChange = 'auto'` on `transitionend` or `animationend`.
3. Restrict target properties strictly to `transform` and `opacity`; never apply `will-change` to `all`, `filter`, or layout properties like `width` or `height`.
4. Ensure default state resets to `will-change: auto;`.

## Verification
Open Chrome DevTools Layers panel (`Rendering -> Layer borders` or `More tools -> Layers`). Inspect the layer count of the page: confirm that idle resting pages contain a minimal number of composite layers and that layer count returns to baseline after interactions finish.
