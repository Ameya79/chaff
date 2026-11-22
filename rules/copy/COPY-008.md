---
id: COPY-008
title: Exclamation mark inflation and synthetic cheerleader tone
severity: medium
levels: [1, 2, 3]
detect: static
fix_class: tone
bad: "<h2>Start building today! It is completely free! You will love how easy it is!</h2>"
good: "<h2>Start building in seconds. Free for open source, no credit card required.</h2>"
why: "Excessive exclamation marks and breathless enthusiasm sound like desperate sales pitches rather than confident, high-craft engineering tools."
exceptions: "Interactive success toasts celebrating completion of a major user action (e.g., 'Deployment successful!')."
---

## Context & Problem
AI agents simulate excitement by littering marketing copy with exclamation marks: "Start coding today!", "Build the future!", "It's completely free!", "You'll love our speed!". Breathless synthetic enthusiasm comes across as an aggressive infomercial sales pitch. Confident, world-class developer tools communicate with calm, understated authority and let capabilities speak for themselves.

## Detection Logic
Static regex scanner detects consecutive exclamation marks (`!{2,}`) or sentences terminating in exclamation marks within major marketing copy blocks, and flags any exclamation mark appearing in `<h1>`, `<h2>`, or `<h3>` header elements:
`(?:\b[A-Z][^.!?]*!\s*){2,}` or `^[^<]*<h[1-3][^>]*>[^<]*![^<]*<\/h[1-3]>`.

## Remediation Steps
1. Remove exclamation marks from all page headings, hero subtitles, and feature descriptions.
2. Terminate affirmative sentences with standard periods or omit trailing punctuation entirely on standalone headline titles.
3. Replace breathy hype adjectives ("amazing", "unbelievable", "incredible") with factual, objective descriptions of system performance and architecture.
4. Confine exclamation marks strictly to celebratory transient toasts or interactive gamification elements where appropriate.

## Verification
Static search verifies zero exclamation marks across all `<h1>`, `<h2>`, and `<h3>` tags in public marketing and landing page components.
