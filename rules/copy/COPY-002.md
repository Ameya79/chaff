---
id: COPY-002
title: Round synthetic metric claims
severity: high
levels: [1, 2, 3]
detect: static
fix_class: honesty
bad: "<div className=\"grid grid-cols-3\"><div>10x Faster</div><div>99.9% Uptime</div><div>10,000+ Happy Users</div></div>"
good: "<div className=\"grid grid-cols-3\"><div>14ms P95 Latency</div><div>Zero Dependencies</div><div>4.2 KB Brotli Size</div></div>"
why: "Vague, rounded claims like '10x faster' and '99.9% uptime' on newly created sites are unverifiable synthetic hallucinations that destroy user trust."
exceptions: "Audited third-party compliance SLAs (e.g. SOC2 reports or legal enterprise contracts) with documented proof."
---

## Context & Problem
AI landing page generators universally populate metrics sections with stereotypical round numbers: "10x Faster", "100x Productivity", "99.9% Uptime", "10,000+ Active Users", "500% ROI". When encountered on new, nascent, or open-source software projects, these claims are immediately recognized as synthetic hallucinations, shattering user trust and signaling amateur execution.

## Detection Logic
Static regex scanner flags unsubstantiated rounded metric claims inside stats cards, grid blocks, and hero sections:
`\b(?:10x|100x|99\.9%|99%|10,?000\+|500%|100%\s+automated|100%\s+secure)\b` (case-insensitive) appearing without citing an audited methodology or empirical source.

## Remediation Steps
1. Remove unsubstantiated vanity multipliers and fabricated round numbers from stats blocks.
2. Replace round claims with genuine, measurable engineering specifications: bundle size (KB), response latency (ms), test coverage percentage, or license type.
3. If real-world usage figures do not yet exist, replace the stats section with a technical architecture diagram, interactive code preview, or installation instructions.
4. If citing real benchmarks, provide an explicit methodology footnote or public reproduction link.

## Verification
Static verification confirms that metrics displays feature verifiable engineering units (such as ms, KB, ops/sec) rather than unsubstantiated round multiplier claims.
