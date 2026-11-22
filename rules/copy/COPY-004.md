---
id: COPY-004
title: Unresolved dummy text in production copy
severity: high
levels: [1, 2, 3]
detect: static
fix_class: completeness
bad: "<p className=\"text-stone-600\">Lorem ipsum ad qui tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>"
good: "<p className=\"text-stone-600\">Chaff executes static code analysis and rendered browser verification in CI to prevent visual regressions.</p>"
why: "Latin dummy text in production routes signals unfinished scaffolding, unreviewed deployment, and absent editorial care."
exceptions: "Unit test fixtures explicitly asserting dummy text detection under tests/ or fixtures/."
---

## Context & Problem
Scaffolding generators and AI code assistants insert Latin filler phrases into cards, blog previews, descriptions, and mock accordions during initial component prototyping. When these placeholder strings slip into production deployments, they immediately announce that the application has not been thoroughly reviewed or finished by human creators.

## Detection Logic
Static text scanner inspects application source files (`.tsx`, `.jsx`, `.html`, `.md`, `.json`) outside test directories for Latin dummy text phrases:
`\b(?:lorem\s+ipsum|consectetur\s+adipiscing|tempor\s+incididunt|magna\s+aliqua|nostrud\s+exercitation)\b` (case-insensitive).

## Remediation Steps
1. Locate and replace every instance of Latin filler copy across all routes and components.
2. Author authentic product descriptions that explain real architecture, workflows, API parameters, or benefits.
3. If content is dynamically populated via CMS or database, render an appropriate skeleton placeholder component or empty state during data loading.
4. Add an automated pre-commit hook or CI lint step to block Latin filler phrases from entering the repository.

## Verification
Repository search for Latin dummy text returns zero results across all production routes, components, and layout files.
