# Chaff Audit Report

**Timestamp:** 2026-11-22T17:53:41.321Z  
**Operating Level:** Level 2  
**Overall Chaff Score:** **94 / 100**

## Score Breakdown

| Category | Score | Status |
|---|:---:|:---:|
| **Visual & Layout** | 100 / 100 | PASS |
| **Copy & Voice** | 100 / 100 | PASS |
| **Code & Semantics** | 88 / 100 | PASS |
| **Performance & Mobile** | 88 / 100 | PASS |

## Identity Lock Summary

- **Detected Framework:** next
- **Locked Design Tokens:** 0
- **Approved Waivers:** 0

## Findings (4 Open, 0 Waived)

### [MEDIUM] CODE-003: Raw <img> tag used in React component; prefer next/image or responsive <picture>

- **Location:** `pages/index.tsx:11`
- **Fix Class:** `image_component`
- **Evidence:**
```
<img src="/static/hero.png" />
```

### [HIGH] PERF-001: Google Fonts import missing display=swap parameter, blocking initial text render

- **Location:** `pages/index.tsx:7`
- **Fix Class:** `font_display`
- **Evidence:**
```
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700" rel="stylesheet" />
```

### [MEDIUM] PERF-003: Image tag missing explicit width/height dimensions, triggering Cumulative Layout Shift (CLS)

- **Location:** `pages/index.tsx:11`
- **Fix Class:** `cls_dimensions`
- **Evidence:**
```
<img src="/static/hero.png" />
```

### [HIGH] A11Y-001: <img> element missing required alt attribute for screen readers

- **Location:** `pages/index.tsx:11`
- **Fix Class:** `accessible_alt`
- **Evidence:**
```
<img src="/static/hero.png" />
```

