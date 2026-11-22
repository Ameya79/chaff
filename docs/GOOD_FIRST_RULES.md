# 20 Good First Rules: RFC Proposals for Contributors

Want to contribute to Chaff? Here are 20 curated, high-impact rule proposals ready for community implementation. Each rule must follow the standard 10-field YAML frontmatter and 4 markdown sections documented in `CHAFF.md`.

---

## Category 1: UI & Layout (`rules/ui/`)

1. **`UI-010: Excessive Rounded Pill Buttons`**
   - *Problem*: Overuse of `rounded-full` on large rectangular CTA buttons creates unbalanced balloon shapes.
   - *Remediation*: Recommend subtle physical border radii (`rounded-md` or 4-6px).
2. **`UI-011: Stacked Card Drop Shadows`**
   - *Problem*: High-blur diffused drop shadows (`shadow-2xl` on colored surfaces) creating muddy gray contours.
   - *Remediation*: Hairline borders (`border border-neutral-200`) and low-blur directional shadows.
3. **`UI-012: Uniform Feature Grid Without Visual Anchor`**
   - *Problem*: 6 or 9 equal-weight cards with identical icon-heading-paragraph structures.
   - *Remediation*: Asymmetric 2/1 or editorial hero card anchoring the sequence.
4. **`UI-013: Floating Header Without Border or Contrast Separation`**
   - *Problem*: Fixed headers with pure transparent backgrounds causing unreadable text overlap on scroll.
   - *Remediation*: Subtle hairline ledger border and backdrop blur guard.
5. **`UI-014: Unconstrained Content Width on Ultra-Wide Monitors`**
   - *Problem*: Content stretching across 2560px+ displays without `max-w-*` boundaries.
   - *Remediation*: Enforce max container bounds (`max-w-7xl` or `max-w-6xl`).
6. **`UI-015: Low-Contrast Badge Pills`**
   - *Problem*: Gray text on slightly lighter gray background chips (`bg-slate-100 text-slate-400`).
   - *Remediation*: Enforce 4.5:1 WCAG AA badge text contrast.

---

## Category 2: Copy & Voice (`rules/copy/`)

7. **`COPY-010: Faux Social Proof Avatars Without Names`**
   - *Problem*: Stacked circular avatar bubbles without associated names or verified accounts.
   - *Remediation*: Named customer citations or verified partner logos.
8. **`COPY-011: Passive Hero Subheadings ("Built for developers who...")`**
   - *Problem*: Formulaic "Built for X who want to Y without Z" copy templates.
   - *Remediation*: Direct active voice stating specific capabilities and outcomes.
9. **`COPY-012: Fake Countdown Urgency Timers`**
   - *Problem*: Static looping "Only 2 spots left!" banners on software products.
   - *Remediation*: Remove deceptive countdown timers.

---

## Category 3: Code & Semantics (`rules/code/`)

10. **`CODE-010: Unstyled Raw Anchor Tags Without Next/Link`**
    - *Problem*: Using raw `<a>` tags for internal navigation causing full page reloads.
    - *Remediation*: Replace with `next/link` or framework router link.
11. **`CODE-011: Nested Interactive Elements (button inside a)`**
    - *Problem*: Invalid HTML nesting triggering unpredictable browser event bubbling.
    - *Remediation*: Separate action containers.
12. **`CODE-012: Inline Styles for Responsive Layouts`**
    - *Problem*: Hardcoded `style={{ width: 800 }}` preventing media query responsiveness.
    - *Remediation*: CSS custom properties or responsive utility classes.
13. **`CODE-013: Missing Form Submission Types on Buttons`**
    - *Problem*: `<button>` inside form missing explicit `type="submit"` or `type="button"`.
    - *Remediation*: Add explicit button type attribute.

---

## Category 4: Accessibility (`rules/a11y/`)

14. **`A11Y-010: Icon-Only Buttons Missing aria-label`**
    - *Problem*: `<button><svg .../></button>` without accessible name for screen readers.
    - *Remediation*: Add `aria-label` or visually hidden text span.
15. **`A11Y-011: Skipped Heading Levels (h1 to h3)`**
    - *Problem*: Heading hierarchy jumps without intermediate levels, breaking document outlines.
    - *Remediation*: Sequential heading hierarchy (`h1` -> `h2` -> `h3`).
16. **`A11Y-012: Low-Contrast Placeholder Text in Input Fields`**
    - *Problem*: Placeholder text lighter than 4.5:1 contrast against input background.
    - *Remediation*: Upgraded placeholder styling and explicit visible `<label>`.

---

## Category 5: Mobile & Responsive (`rules/mobile/`)

17. **`MOBILE-010: Table Overflow Without Horizontal Scroll Container`**
    - *Problem*: Wide data tables breaking mobile viewport width without `overflow-x-auto`.
    - *Remediation*: Wrap table in touch-scrollable responsive ledger container.
18. **`MOBILE-011: Modal Overlays Missing Viewport Bounding and Dismiss Gesture`**
    - *Problem*: Dialogs taller than mobile viewports without scroll or touch dismiss.
    - *Remediation*: `max-h-[90dvh]` with scrollable content container and accessible close target.
19. **`MOBILE-012: Fixed Position Floating Bars Obscuring Bottom Content`**
    - *Problem*: Sticky banners (`fixed bottom-0`) overlapping footer links on mobile.
    - *Remediation*: Bottom padding matching banner height (`pb-20`).

---

## Category 6: Performance (`rules/perf/`)

20. **`PERF-010: Loading Third-Party Analytics Synchronously in <head>`**
    - *Problem*: Render-blocking external scripts delaying First Contentful Paint.
    - *Remediation*: Use `next/script` with `strategy="afterInteractive"` or `strategy="lazyOnload"`.

---

## How to Submit a Rule
1. Pick any rule ID from this list.
2. Create `rules/<category>/<ID>.md`.
3. Include all 10 YAML frontmatter fields and the 4 required sections (`## Description`, `## Why It Matters`, `## Bad Example`, `## Good Example`).
4. Add corresponding test case to `tests/test_phase1.py` or `packages/checks/src/tests/`.
5. Open a Pull Request!
