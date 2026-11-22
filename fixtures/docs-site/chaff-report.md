# Chaff Audit Report

**Timestamp:** 2026-11-22T14:06:44.824Z  
**Operating Level:** Level 2  
**Overall Chaff Score:** **96 / 100**

## Score Breakdown

| Category | Score | Status |
|---|:---:|:---:|
| **Visual & Layout** | 84 / 100 | PASS |
| **Copy & Voice** | 100 / 100 | PASS |
| **Code & Semantics** | 100 / 100 | PASS |
| **Performance & Mobile** | 100 / 100 | PASS |

## Identity Lock Summary

- **Detected Framework:** next
- **Locked Design Tokens:** 0
- **Approved Waivers:** 0

## Findings (3 Open, 0 Waived)

### [MEDIUM] UI-002: Arbitrary spacing [13px] violates 4/8px spatial rhythm

- **Location:** `app/docs/page.tsx:3`
- **Fix Class:** `spacing_hygiene`
- **Evidence:**
```
<div className="p-[13px] docs-wrapper">
```

### [HIGH] MOTION-001: CSS keyframe animations declared without @media (prefers-reduced-motion: reduce) fallback

- **Location:** `app/styles.css:1`
- **Fix Class:** `reduced_motion_query`
- **Evidence:**
```
CSS keyframes present without prefers-reduced-motion query
```

### [MEDIUM] MOTION-002: CSS transition animates layout properties triggering recalculate style and layout; use transform and opacity

- **Location:** `app/styles.css:7`
- **Fix Class:** `composited_transforms`
- **Evidence:**
```
transition: width 0.3s ease;
```

