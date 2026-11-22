# Chaff Audit Report

**Timestamp:** 2026-11-22T17:53:41.365Z  
**Operating Level:** Level 2  
**Overall Chaff Score:** **98 / 100**

## Score Breakdown

| Category | Score | Status |
|---|:---:|:---:|
| **Visual & Layout** | 92 / 100 | PASS |
| **Copy & Voice** | 100 / 100 | PASS |
| **Code & Semantics** | 100 / 100 | PASS |
| **Performance & Mobile** | 100 / 100 | PASS |

## Identity Lock Summary

- **Detected Framework:** vite
- **Locked Design Tokens:** 0
- **Approved Waivers:** 0

## Findings (1 Open, 0 Waived)

### [HIGH] THREE-004: Uncapped device pixel ratio triggers GPU thermal throttling and battery drain; cap at 1.5

- **Location:** `src/App.tsx:6`
- **Fix Class:** `pixel_ratio_cap`
- **Evidence:**
```
renderer.setPixelRatio(window.devicePixelRatio);
```

