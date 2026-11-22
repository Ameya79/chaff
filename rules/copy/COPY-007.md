---
id: COPY-007
title: Impersonal and passive value propositions
severity: medium
levels: [1, 2, 3]
detect: heuristic
fix_class: voice
bad: "<h2 className=\"text-3xl\">Efficiency can be achieved and codebases are elevated through our automated pipeline</h2>"
good: "<h2 className=\"text-3xl\">Audit your UI for AI tells and fail CI when performance regresses</h2>"
why: "Passive voice creates distance, weakens claims, and makes software read like detached corporate committee output rather than authored software."
exceptions: "Technical error messages or system event logs where the actor is unknown or irrelevant (e.g., 'Connection was terminated by host')."
---

## Context & Problem
Language models default to cautious, bureaucratic passive voice: "Workflows can be optimized", "Productivity is enhanced", "Errors are mitigated through our advanced engine". Passive phrasing obscures agency, distances the user from the product, and makes copy read like an impersonal committee memorandum rather than decisive, authored software built by passionate engineers.

## Detection Logic
Heuristic grammar parser inspects section headings, hero subheadings, and call-to-action text for passive verb constructions (combinations of auxiliary verbs like "is", "are", "can be", "has been" with past participles) combined with detached corporate nouns ("solutions", "efficiency", "capabilities").

## Remediation Steps
1. Transform passive constructions into active voice with explicit agency: place the user or the software tool as the direct grammatical subject.
2. Formulate hero headings and call-to-action statements using strong imperative verbs: "Audit your UI", "Inspect DOM geometry", "Enforce performance budgets in CI".
3. Speak directly to the practitioner in second person ("you", "your team") or direct action commands.
4. Eliminate extraneous auxiliary verbs to improve sentence punch and brevity.

## Verification
Review of top-level section headings and hero declarations confirms that all primary statements employ active or imperative verbs with clear agency.
