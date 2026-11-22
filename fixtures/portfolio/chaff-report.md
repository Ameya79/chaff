# Chaff Audit Report

**Timestamp:** 2026-11-22T20:36:37.391Z  
**Operating Level:** Level 2  
**Overall Chaff Score:** **96 / 100**

## Score Breakdown

| Category | Score | Status |
|---|:---:|:---:|
| **Visual & Layout** | 100 / 100 | PASS |
| **Copy & Voice** | 100 / 100 | PASS |
| **Code & Semantics** | 100 / 100 | PASS |
| **Performance & Mobile** | 84 / 100 | PASS |

## Identity Lock Summary

- **Detected Framework:** react
- **Locked Design Tokens:** 0
- **Approved Waivers:** 0

## Findings (2 Open, 0 Waived)

### [HIGH] MOBILE-004: Disabling viewport zoom (user-scalable=no) violates mobile accessibility guidelines

- **Location:** `src/App.tsx:4`
- **Fix Class:** `viewport_accessibility`
- **Evidence:**
```
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
```

### [HIGH] MOBILE-001: Fixed layout width >320px causes horizontal overflow on small mobile viewports

- **Location:** `src/App.tsx:5`
- **Fix Class:** `responsive_width`
- **Evidence:**
```
<div style={{ width: '600px' }} className="portfolio-gallery">
```

