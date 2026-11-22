---
id: COPY-006
title: Decorative emoji icons as bullet points or header accents
severity: low
levels: [1, 2, 3]
detect: static
fix_class: typography
bad: "<ul><li>🚀 Fast Performance</li><li>🔒 Enterprise Security</li><li>✨ AI Intelligence</li><li>⚡ Real-time Sync</li></ul>"
good: "<ul className=\"space-y-3 font-sans text-stone-700 dark:text-stone-300\"><li className=\"flex items-center gap-3\"><span className=\"w-1.5 h-1.5 rounded-full bg-amber-500\" />Sub-50ms query latency</li><li className=\"flex items-center gap-3\"><span className=\"w-1.5 h-1.5 rounded-full bg-amber-500\" />End-to-end encrypted storage</li></ul>"
why: "Using system emojis as list markers and headline badges cheapens the interface aesthetic and causes inconsistent, platform-dependent rendering."
exceptions: "Dedicated messaging, chat, or social communication applications where emojis are user-generated chat content."
---

## Context & Problem
AI agents prepend feature list items and heading badges with colorful system emojis: 🚀, ⚡, 🔥, ✨, 🔒. System emojis render drastically differently across macOS, iOS, Windows, Android, and Ubuntu, clashing violently with carefully chosen brand palettes and creating visual noise that cheapens the perceived quality of developer tooling.

## Detection Logic
Static regex scanner searches JSX text nodes, markdown list items, buttons, and heading components for leading emoji pictograph characters:
`[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]` (unicode regex flag enabled).

## Remediation Steps
1. Strip leading decorative emoji characters from headings, badges, and list items.
2. Replace emojis with refined typographic bullets (such as a hairline disc, en-dash, or subtle geometric shape).
3. Where iconographic reinforcement is needed, use curated monochromatic SVG vector icons (such as Lucide, Radix, or Heroicons) that inherit theme colors.
4. Maintain consistent typographic hierarchy and baseline alignment across all list elements.

## Verification
Static scanner detects zero unicode emoji characters at the start of navigational elements, feature lists, badges, or section headers.
