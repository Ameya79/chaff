# Build the first route

When the user gives you the Chaff GitHub link in a frontend workspace, use this runbook. The main branch contains everything needed to start. You need access to the target project's files and a rendered preview to verify the result. Leave Chaff itself in place unless it is the user's target.

## Small-model path

Complete one row at a time. This table is the entire default workflow. Read the longer examples below only when a decision is unclear.

| Step | Do this in the target project | Evidence to carry forward |
| --- | --- | --- |
| 1. Ground | Open the requested route, its component, and its styles. Run the current screen. Identify the real content and the user's main task. | Route, component path, one real content example, existing brand constraint. |
| 2. Compose | Sketch the screen in three lines: what leads, what supports it, what comes next on a phone. Choose one distinctive detail that helps the task. | A concrete arrangement. Example for a bookstore: selected book cover and title, edition and price, then related books. |
| 3. Implement | Build that one route. Use the project's components and tokens. Connect the principal action or reading path. Work with actual content, including the longest title. | The real click destination or resulting state. For a reading page, show the reader can reach and navigate the article. |
| 4. Inspect | Render at desktop and phone sizes. Look first at the primary object, then type, alignment and wrapping. Run [the browser check](browser-check.js) at 320, 390 and 1440 pixels. | A screenshot per composition, findings per width, and the observed result of the primary task. |
| 5. Repair | Pick the most consequential failed observation. Change its cause, render the same viewport, and repeat the same interaction. Run the project's build and existing checks. | A specific before/after observation. Finish when the requested flow works and the visual review passes, or identify exactly what remains unverified. |

**Keep the handoff short.** If context runs low, retain only the route and file, brand constraint, composition, most recent failed observation, and next edit. Resume there.

**Example of a repair decision.** A narrow booking screen puts the month, date picker and three promotional cards before the first available appointment. Move available times directly after the selected date. Keep the selected time and booking action together. Reopen the same date at 390 pixels, pick a time with the keyboard, and check that the confirmation shows that time. Increasing border radii would leave the original problem in place.

**When tools are limited.** If screenshots are unavailable, use rendered dimensions, computed styles, accessible names and interaction results where available. If the agent can capture images but cannot inspect them, attach them for review. Mark visual review pending in either case. Source inspection and a successful build cannot establish that the screen looks finished.

### Translate the showcase into the target stack

The demo uses Next.js App Router, React, TypeScript, Tailwind, CSS custom properties and inline SVG. Its design language pairs a pale mineral canvas and dark ink with sage accents, Plus Jakarta Sans for interface text, editorial serif display type, and JetBrains Mono for measurements. Color distinguishes the demo product from the surrounding guide. Each illustration explains something: the route diagram changes with the selected venue and the performance gauge depicts a measurement.

In Codex, Claude Code, Antigravity, Windsurf or Cursor, use that level of specificity as the review floor. Keep the target framework and brand. Map the same roles to its existing tokens; build with native links, semantic buttons, responsive grids and a static reduced-motion state. Open the phone menu and confirm the underlying headline stays at the same vertical position. A task-specific graphic, a working action, and a legible small-screen composition all need evidence in the finished route.

## 1. Pick a real task

Follow the user's requested route. With only the URL, find the main public entry point and improve its primary task. In a blank frontend workspace, use the project brief or existing assets to establish the audience and purpose. If both are missing, ask what the product should do. Preserve real data, brand colors, actions, routing, and any existing identity locks. Keep uncertain tokens unchanged. Read only relevant project files and avoid credentials.

## 2. Compose before coding

Choose Level 2 for a broad visual improvement, Level 1 for a narrow repair, and Level 3 only for requested 3D. Write down the visitor, their next action, the most useful thing to show them, and one layout decision. Choose a direction yourself. The interactive pitching workflow in CHAFF.md is available when the user explicitly asks to direct the design.

Use the Chaff showcase as the minimum **review target**. Compare the desktop and phone reference images linked below before declaring the route finished. Reproduce the quality of the decisions using the target project's own visual language.

| Decision | What to implement | What to check in the screenshot |
| --- | --- | --- |
| First screen | One specific headline, one primary action, and a real specimen of the product | At a glance, a visitor can explain what the product does and where to start |
| Hierarchy | Give the primary task the largest useful area. Put supporting tools and secondary content together | Cover the labels. The primary region should still be obvious |
| Visual identity | Use one distinctive typographic or graphic idea drawn from the product | A route planner might show its actual route diagram. A bookstore might show a shelf of real covers |
| Detail | Align edges and baselines. Reserve space for media. Keep metric values and their units together when space permits | Inspect long labels, empty states, dark theme if supported, and the final row of each section |
| Phone | Recompose controls and media for one column. Keep the primary task reachable early | At 320 and 390 pixels, inspect wrapping, usable tap targets, the first screen, and the end of the page |

[Desktop reference](reference/showcase-desktop.png) · [Phone reference](reference/showcase-phone.png)

### Worked example: Kestrel's order router

The showcase starts with an actual task: deciding where to route an order. Its weak version leads with a generic claim and three equally weighted marketing cards. Its revised version leads with the routing decision, puts the median hop and venue timings together, and lets visitors select a venue to trace the corresponding route. At phone width the comparison opens on one complete specimen. The original violet remains the product accent.

For a different product, make the equivalent decision. On a booking screen, group the selected date, available times and booking action. On a documentation page, show a working example alongside its explanation. Use the user's real content. If a proposed visual could move unchanged to an unrelated product, revise it.

For implementation detail, inspect the [execution map](../apps/web/src/components/KestrelRouteSheet.tsx), the [rule illustrations](../apps/web/src/components/DomainPrint.tsx), or the [responsive styles](../apps/web/src/app/globals.css) individually as needed.

## 3. Build a vertical slice

Implement the primary route end to end using the existing framework, tokens and components. Wire the principal action to its real destination. Reuse existing imagery or create an informative diagram from actual project data. Keep interaction lightweight and honor reduced motion. On additional requested routes, reuse the typography, navigation, spacing, and interaction conventions. Never invent testimonials, conversion figures, activity, or product capabilities to fill space.

## 4. Render, repair, repeat

Start the project's own preview using its documented commands. Capture before and after screenshots at 390 and 1440 pixels, plus 320 pixels for overflow. Compare the actual output against each row above. Record one concrete observation per row. If a row fails, change the component and inspect a fresh render. Test the primary action and keyboard navigation. Check the narrowest width again with the longest real label.

Run [the browser layout check](browser-check.js) in the target preview's browser evaluation context at each width after fonts load. It reads rendered DOM geometry locally. If your agent cannot evaluate JavaScript, measure overflow and inspect headings directly in browser tools. A clean geometry check alone cannot establish visual quality.

If the first pass looks generic, pick the largest failure and make a structural repair. Equal-weight cards: promote the primary object and collapse secondary metadata into a list. Phone screenshot dominated by navigation: compact the navigation and show the first useful item earlier. An impressive graphic with no product meaning: replace it with a view of the actual object or data. Re-render the same viewport after each repair so the comparison is meaningful.

Run the target project's existing tests, lint and production build. Use Chaff CLI checks when available. Report routes, screenshots, actual measurements, unresolved defects and anything the environment prevented you from verifying. Continue autonomously through reversible work. Ask only for a missing project goal, a change to locked identity, a destructive action, or access you genuinely need.
