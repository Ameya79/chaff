---
id: MOTION-005
title: Replace robotic linear easing with calibrated spring physics and natural curves
severity: medium
levels: [2, 3]
detect: heuristic
fix_class: physics_tuning
bad: ".card-interactive { transition: transform 300ms linear; } .drawer-pane { transition: transform 400ms ease-in-out; }"
good: ".card-interactive { transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1); } .drawer-pane { transition: transform 320ms cubic-bezier(0.32, 0.72, 0, 1); }"
why: "Default linear and mechanical ease-in-out timing functions lack momentum and inertia, signaling automated template construction. Physical interactions in nature accelerate quickly and decelerate smoothly with mass and friction."
exceptions: "Continuous rotational spinners or progress meters where constant linear velocity is semantically meaningful."
---

## Context & Problem
Default CSS timing functions like `linear`, `ease`, and symmetrical `ease-in-out` impart an unnatural, mechanical motion quality to user interface components. Objects in the physical world possess mass, inertia, and friction: when set in motion by a human touch or click, they accelerate swiftly and decelerate smoothly as kinetic energy dissipates. Mechanical ease-in-out curves take too long to accelerate at the start and stop abruptly at the end, creating a distinctive robotic feel that instantly identifies AI-generated or template-authored software.

## Detection Logic
Heuristic scanner inspects transition and animation definitions across stylesheets and motion configs. It flags occurrences of `linear`, `ease`, or `ease-in-out` on spatial movement properties (`transform`, `translate`, `scale`) or modal presentations. Transitions that do not declare calibrated `cubic-bezier` parameters or spring physics definitions are flagged for authored curve adoption.

## Remediation Steps
1. Replace generic easing with calibrated cubic bezier curves tailored to interaction intent:
   - For UI component reveals, dialogs, and popovers: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy acceleration, soft settling).
   - For bottom sheets and off-canvas drawers: `cubic-bezier(0.32, 0.72, 0, 1)` (natural mass deceleration).
   - For quick micro-interactions (button presses, toggle switches): `cubic-bezier(0.2, 0, 0, 1)`.
2. When using JavaScript animation libraries, configure physics springs with high stiffness and moderate damping (e.g. `stiffness: 400, damping: 32`) to achieve responsive momentum without cartoonish overshoots.
3. Ensure exit transitions are slightly faster (typically 75% of the entrance duration) using accelerated exit curves: `cubic-bezier(0.7, 0, 0.84, 0)`.

## Verification
Inspect compiled CSS stylesheets and motion component configs to confirm adoption of authored `cubic-bezier` curves or spring parameters. In browser review, verify that cards, drawers, and interactive reveals feel physically grounded, responsive, and natural.
