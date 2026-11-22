---
id: MOTION-003
title: Eliminate unbounded animation loops and excessive transition durations
severity: medium
levels: [1, 2, 3]
detect: static
fix_class: timing_constraint
bad: ".feature-badge { animation: infinitePulse 3.5s linear infinite; } .modal-overlay { transition: opacity 850ms ease-in-out; }"
good: ".feature-badge { animation: enterBadge 250ms cubic-bezier(0.16, 1, 0.3, 1) 1 forwards; } .modal-overlay { transition: opacity 200ms cubic-bezier(0.16, 1, 0.3, 1); }"
why: "Infinite looping animations consume continuous CPU/GPU cycles, cause visual distraction that erodes user trust, and drain mobile batteries. Transition durations exceeding 300ms make interfaces feel sluggish and unresponsive."
exceptions: "Skeleton shimmer loading placeholders while awaiting network responses, or active audio playback visualizers during active media streaming."
---

## Context & Problem
A common hallmark of synthetic AI-generated UI is the proliferation of continuous looping animations: pulsating gradient glows, rotating badges, bouncing icons, and floating background cards that never stop moving. These perpetual animations keep the GPU and CPU active indefinitely, heating up mobile devices, depleting battery life, and creating ambient visual noise that distracts users from reading content. Furthermore, AI templates routinely assign sluggish transition durations (such as 600ms to 1000ms) to simple interactive states like button hovers, dialog popups, and dropdowns, making the application feel laggy and non-responsive.

## Detection Logic
Static source scanner parses CSS and JSX style definitions and flags:
1. Declarations of `animation-iteration-count: infinite` (or shorthand `infinite`) applied to decorative elements (excluding skeleton shimmers and loading spinners).
2. Any `transition-duration` or `animation-duration` exceeding 300ms for micro-interactions (or exceeding 400ms for large sheet or modal view transitions).

## Remediation Steps
1. Convert decorative loops into crisp, single-execution entry animations: use `animation-iteration-count: 1; animation-fill-mode: forwards;`.
2. Restrict micro-interaction durations (hover, active, toggle, button states) to 150ms-250ms.
3. Restrict larger surface transitions (dialog entries, drawer sheets, off-canvas navigation) to 250ms-350ms maximum.
4. Replace spinning or pulsating status badges with static high-contrast iconography and crisp typography.

## Verification
Static scanner verifies that no non-exempt elements declare `infinite` animation iterations and that all transition durations are capped at <= 300ms (<= 400ms for sheets). In manual review, confirm that all decorative animations settle to a resting state within 400ms of appearance.
