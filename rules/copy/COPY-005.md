---
id: COPY-005
title: Vague feature descriptions lacking technical substance
severity: medium
levels: [1, 2, 3]
detect: heuristic
fix_class: specificity
bad: "<div className=\"card\"><h3>Smart Management</h3><p>Our smart platform provides powerful tools that make managing your daily tasks easier and better than ever.</p></div>"
good: "<div className=\"card\"><h3>Atomic Git Commits</h3><p>Every remediation step creates a discrete Git commit tagged with its rule ID for instant rollback via chaff revert.</p></div>"
why: "Vague descriptions using generic terms like 'smart platform' and 'powerful tools' fail to explain what the software actually does or how it works."
exceptions: "High-level brand mission statements on the company /about page."
---

## Context & Problem
AI copy generators frequently generate circular, vacuous feature blurbs that sound pleasant but convey zero technical information: "Our powerful platform makes your workflow better, smarter, and more efficient than ever." When sentences are stripped of concrete nouns, data formats, and mechanisms, readers cannot determine what features actually exist or how the product solves their problems.

## Detection Logic
Heuristic lexical parser evaluates feature cards and description paragraphs. It flags blocks exhibiting a high density of abstract qualifiers ("smart", "powerful", "intuitive", "easy-to-use", "robust", "flexible", "seamless") while lacking concrete domain nouns (protocols, algorithms, data structures, file formats, or measurable units).

## Remediation Steps
1. Rewrite feature descriptions to specify concrete operational mechanisms: state what goes in, what transformation occurs, and what output is produced.
2. Replace abstract buzzwords with technical nouns: specify exact formats, protocols, timings, or storage engines.
3. Quantify performance or architectural benefits wherever possible.
4. Show, rather than tell: include a small inline code sample or terminal command illustrating the feature in action.

## Verification
Editorial review confirms that all feature cards describe concrete technical operations and capabilities rather than abstract assertions of excellence.
