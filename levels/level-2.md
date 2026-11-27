# Level 2 Contract: Authored (Confident & Editorial)

For a link-only session, follow the [autonomous runbook](../docs/link-run.md). Approval and pitching steps here apply to guided sessions. All budgets and identity locks apply in both modes.

## 1. Philosophy & Purpose
Level 2 is the creative craftsmanship contract in Chaff. Its goal is to inject a **confident point of view**: authored character, editorial rhythm, and unmistakable human craftsmanship into the product, while preserving bulletproof stability and high performance.

Level 2 replaces predictable, cookie-cutter templates with intentional asymmetric layouts, authentic typographic hierarchy, and tactile texture. It operates on the principle that software should feel authored by skilled designers rather than assembled by default algorithms.

---

## 2. Mandatory Pre-Implementation Gate: 3 Concept Pitches
Before writing a single line of production code in Level 2, the agent must generate three distinct creative directions and save them as markdown specifications in `.chaff/pitches/`:

1. **Direction A (`.chaff/pitches/pitch-1.md`)**:
   - Focus: Typographic authority and editorial split layout.
   - Distinctive typography pairing (e.g., editorial serif display with technical monospaced details and clean sans body).
2. **Direction B (`.chaff/pitches/pitch-2.md`)**:
   - Focus: Modular rail structure with dense informational hierarchy and structured data tables.
   - Distinctive layout geometry (e.g., sticky lateral metadata rail with asymmetric card flow).
3. **Direction C (`.chaff/pitches/pitch-3.md`)**:
   - Focus: Minimalist tactile immersion with generous negative space and physical micro-interactions.
   - Distinctive motion model (e.g., physics-calibrated spring transitions and tactile press feedback).

### Diversity Validation
- The three pitches must differ fundamentally across three mandatory axes:
  1. **Typography Model**: Different heading-to-body pairings, scale ratios, and optical tracking.
  2. **Layout Architecture**: Different structural grid configurations (e.g., 12-column asymmetric vs split-column vs modular rail).
  3. **Motion Model**: Different choreography models (e.g., scroll-linked reveal vs spring micro-transitions vs view transitions).
- **Near-Duplicate Rejection**: If two pitches share the same layout structure or motion model with only superficial color adjustments, the pitch generation step is rejected and must be regenerated.
- **Approval Checkpoint**: The agent must halt and present the three pitches to the user. Implementation begins only after the user selects their preferred direction.

---

## 3. Allowed Actions
Agents executing Level 2 are permitted to perform the following authored enhancements:

1. **All Level 1 Remediations**:
   - Every typographic, contrast, accessibility, and copy cleanup defined in Level 1.
2. **Asymmetric & Editorial Layouts**:
   - Restructure standard centered heroes into dynamic asymmetric hero layouts (e.g., 8-column display headline paired with a 4-column contextual rail).
   - Replace generic 3-column equal cards with modular asymmetric grids, unequal content tiles, or split narrative sections.
   - Introduce full-bleed hairlines, fine borders, and calibrated divider rules.
3. **Signature Interaction (Exactly One per Major View)**:
   - Implement exactly **one** memorable, physical interaction per primary route. Permitted interaction types include:
     - Native CSS scroll-driven animations (`animation-timeline: scroll()`).
     - Multi-page View Transitions API (`document.startViewTransition`).
     - Smooth spring-based micro-interactions on interactive cards or tabs.
4. **Tactile Texture & Craft Elements**:
   - Introduce subtle, performance-conscious background textures (such as lightweight inline SVG noise filters or paper-grain overlays).
   - Use warm off-white and charcoal tinted grounds (e.g., `#f7f5f0` and `#1a1918`).
   - Add fine craftsmanship accents such as tally marks, index numbers, or monospaced metadata badges.
5. **Bespoke Visual Assets**:
   - Author custom vector SVG illustrations, architectural diagrams, or interactive data charts tailored to the product's domain.
6. **Controlled Motion Dependencies**:
   - At most **one** small, approved motion library (such as Motion or Lenis) is permitted, and **only if** native CSS transitions, CSS scroll-driven animations, and the Web Animations API are technically incapable of achieving the authored interaction.

---

## 4. Forbidden Actions
Agents executing Level 2 are strictly forbidden from performing any of the following actions:

1. **No 3D, WebGL, or Canvas Heroes**:
   - Three.js, React Three Fiber, raw WebGL, WebGPU, and heavy `<canvas>` scene graphs are strictly banned in Level 2 (reserved exclusively for Level 3).
2. **No Multiple Motion Libraries**:
   - Stacking multiple animation packages (e.g., combining Framer Motion, GSAP, and Anime.js) is prohibited.
3. **No Main-Thread Degradation**:
   - Long tasks exceeding 50ms on the main thread are forbidden.
   - Smooth 60fps scrolling and immediate interaction response must be preserved on mid-tier mobile hardware.
4. **No Unauthorized Identity Lock Overrides**:
   - The agent cannot alter locked brand tokens from `.chaff/identity.json` without an explicit user waiver proposal.

---

## 5. Performance & Quality Budgets
All Level 2 implementations must satisfy stringent performance budgets verified via `chaff gate`:

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
| **Motion Accessibility** | Strictly honors `prefers-reduced-motion` | Hard Gate |
