---
id: COPY-003
title: Generic placeholder entity and company names
severity: medium
levels: [1, 2, 3]
detect: static
fix_class: realism
bad: "<div className=\"flex gap-8\"><p>Trusted by teams at Acme Corp, Globex, TechCorp, and Innotech</p></div>"
good: "<div className=\"flex gap-8\"><p>Used in production by developers building with Next.js, Vite, and Astro</p></div>"
why: "Fictional corporate names like Acme Corp and TechCorp in social proof sections make applications look like unmaintained mockups."
exceptions: "Integration test suites and seed data files explicitly marked under fixtures/ or tests/."
---

## Context & Problem
AI coding tools frequently populate customer logo marquees and client endorsement sections with stock cartoon corporation names: "Acme Corp", "TechCorp", "Globex", "InnoTech", "StartupX", "ExampleCo". Displaying fictional corporate entities in production copy makes the product look like a throwaway tutorial project or an abandoned wireframe prototype.

## Detection Logic
Static regex scanner searches production JSX, TSX, HTML, and markdown files for stereotypical placeholder corporation names:
`\b(?:Acme(?:\s+Corp)?|TechCorp|Globex|InnoTech|ExampleCo|Startup(?:\s+Inc)?|FooBar(?:\s+Labs)?)\b` (case-insensitive), excluding files located inside `tests/` or `fixtures/`.

## Remediation Steps
1. Delete mock customer logo sections and fake partner marquees from production pages.
2. For nascent tools lacking institutional customers, showcase genuine ecosystem compatibility instead: "Engineered for Next.js, SvelteKit, Vite, and Remix".
3. For open-source projects, feature real GitHub stargazers, community contributors, or verified adopters with their express consent.
4. Confine synthetic test fixtures strictly to test directories and mock databases.

## Verification
Static codebase scan confirms zero instances of placeholder corporate entities across all production route files and components.
