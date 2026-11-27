# Build the first route

When the user gives you the Chaff GitHub link in a frontend workspace, use this runbook. The main branch contains everything needed to start. You need access to the target project's files and a rendered preview to verify the result. Leave Chaff itself in place unless it is the user's target.

## Short path for a small context window

Read this page first. Load only the one example or rule relevant to your next edit. Keep this four-line working note through every revision:

- Visitor and action: who needs to do what, and where does the action lead?
- Specimen: which existing object, data or interaction can show the product working?
- Desktop and phone: which element leads, and what moves below it on a narrow screen?
- Proof: which click, screenshot and measurement will demonstrate the result?

Build the specimen before polishing the surrounding page. For a dashboard, select a record and show its actual detail. For a store, select a real variant and keep its price and purchase action together. For an editorial page, lead with a real story and a readable excerpt. When content is scarce, use a smaller composition.

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
