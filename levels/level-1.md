# Level 1 Contract: Clean (Safe Tell Removal)

## 1. Philosophy & Purpose
Level 1 is the baseline cleanup contract in Chaff. Its goal is **safe tell removal**: eliminate every recognizable AI-generated visual and textual fingerprint while altering as little code as possible. It stabilizes the user interface, restores craft hygiene, and ensures strict accessibility compliance without altering application layout architecture, visual brand identity, or component state structure.

Level 1 operates on the principle of maximum safety: a developer should be able to review and merge an entire Level 1 remediation pass in a single fifteen-minute sitting.

---

## 2. Allowed Actions
Agents executing Level 1 are strictly permitted to perform the following remediations:

1. **Typographic Normalization**:
   - Swap unstyled system defaults (e.g., raw unconfigured Arial, Times New Roman, or default unweighted Inter) for intentional type configurations using modern framework loaders (`next/font/google` or `next/font/local`).
   - Standardize type scale and line-height values to avoid arbitrary font sizes.
   - Set optimal reading measure (`45ch` to `75ch`) on long-form content blocks.
2. **Spacing & Scale Normalization**:
   - Snap arbitrary padding, margins, and gaps to a strict 4px/8px modular rhythm.
   - Align disparate component padding across cards and list items.
3. **Color & Contrast Corrections**:
   - Normalize color tokens to ensure all text meets WCAG AA contrast ratios (minimum 4.5:1 for body text, minimum 3:1 for large text over 18pt or bold 14pt).
   - Replace harsh, pure `#000000` text and blinding `#ffffff` backgrounds with balanced, warm or cool tinted neutrals (e.g., `#171717` text over `#fafafa` or `#f8f9fa`).
4. **Copywriting Remediation**:
   - Rewrite generic AI buzzwords and hyperbolic marketing jargon, removing terms like "supercharge", "unleash", "elevate", "delve", "testament", "tapestry", and "seamless".
   - Replace fabricated company names, repetitive lorem ipsum passages, and round fabricated metrics (such as "99.9% customer satisfaction" or "10x faster") with factual, direct, context-specific statements.
5. **Icon & Graphic Hygiene**:
   - Replace raw emoji used as interface icons with clean, accessible inline SVG icon components (such as Lucide, Heroicons, or Radix Icons).
   - Ensure all decorative SVGs include `aria-hidden="true"` and interactive icons include accessible labels (`aria-label` or visually hidden screen reader text).
6. **State Completeness**:
   - Implement missing core UI states: skeleton loading indicators for asynchronous data, structured empty states for zero-data collections, and localized error boundaries.
7. **Accessibility Hygiene**:
   - Add explicit, visible `focus-visible` outline rings to all interactive elements (`a`, `button`, `input`).
   - Ensure all interactive elements satisfy touch-target requirements (minimum 44x44px bounding box).
   - Ensure all `img` tags have descriptive `alt` text or `alt=""` if purely decorative.
8. **Performance Hygiene**:
   - Add explicit `width`, `height`, and `sizes` attributes to responsive images to prevent Cumulative Layout Shift (CLS).
   - Configure `font-display: swap` on web font declarations to prevent invisible text during load.

---

## 3. Forbidden Actions
Agents executing Level 1 are strictly forbidden from performing any of the following actions:

1. **No Structural Layout Changes**:
   - Do not alter layout geometry, CSS grid definitions, column spans, or DOM hierarchies.
   - Do not convert a multi-card grid into a slider or change flexbox direction.
2. **No Animation or Motion Libraries**:
   - Adding Framer Motion, GSAP, Motion, Remotion, or other motion libraries is strictly banned.
   - Simple, existing CSS transitions (such as hover opacity or color transitions under 200ms) may be polished, but no new complex animation systems may be introduced.
3. **No New Runtime Dependencies**:
   - Modifying `package.json` to introduce new runtime dependencies is prohibited. Existing project packages and utility functions must be leveraged.
4. **No Identity Lock Overrides**:
   - Do not modify or override any token, color, font family, or spacing base defined in the `locked` array of `.chaff/identity.json`.
5. **No Logic or State Refactoring**:
   - Do not refactor application business logic, API calls, state management, or component hierarchies under the guise of styling cleanup.

---

## 4. Reviewable Diff Budget
Level 1 pull requests must remain small, focused, and reviewable in a single sitting. The change set must satisfy the following diff limits:

- **Component Scope**: All changes must remain internal to existing component files.
- **Maximum Modified Files**: At most 10 source files altered per Level 1 remediation cycle.
- **Net Line Budget**: At most 200 lines net diff across the entire pull request.
- **Commit Discipline**: Atomic commits tagged by rule ID (e.g., `chaff: normalize contrast and focus rings [A11Y-001]`).

---

## 5. Performance & Quality Budgets
All Level 1 remediations must pass automated verification gates without regression:

| Metric | Target Budget | Enforcement Level |
|---|---|---|
| **Lighthouse Mobile Performance** | >= 90 | Hard Gate (`chaff gate`) |
| **Largest Contentful Paint (LCP)** | <= 2.5s on simulated mobile 4G | Hard Gate |
| **Interaction to Next Paint (INP)** | <= 200ms | Hard Gate |
| **Cumulative Layout Shift (CLS)** | <= 0.10 | Hard Gate |
| **Total Blocking Time (TBT)** | <= 200ms | Hard Gate |
| **First-Load JavaScript Bundle** | <= 170 KB gzipped | Hard Gate |
| **Horizontal Viewport Overflow** | Zero overflow at 320px width | Hard Gate |
| **Touch Target Dimensions** | Minimum 44x44px for all targets | Hard Gate |
| **Accessibility Contrast** | 100% WCAG AA compliance | Hard Gate |
