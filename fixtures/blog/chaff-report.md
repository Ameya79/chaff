# Chaff Audit Report

**Timestamp:** 2026-11-22T20:36:37.398Z  
**Operating Level:** Level 2  
**Overall Chaff Score:** **94 / 100**

## Score Breakdown

| Category | Score | Status |
|---|:---:|:---:|
| **Visual & Layout** | 100 / 100 | PASS |
| **Copy & Voice** | 92 / 100 | PASS |
| **Code & Semantics** | 88 / 100 | PASS |
| **Performance & Mobile** | 96 / 100 | PASS |

## Identity Lock Summary

- **Detected Framework:** next
- **Locked Design Tokens:** 0
- **Approved Waivers:** 0

## Findings (4 Open, 0 Waived)

### [HIGH] COPY-007: Lorem ipsum placeholder copy detected

- **Location:** `app/post/page.tsx:5`
- **Fix Class:** `real_content`
- **Evidence:**
```
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
```

### [MEDIUM] CODE-003: Raw <img> tag used in React component; prefer next/image or responsive <picture>

- **Location:** `app/post/page.tsx:6`
- **Fix Class:** `image_component`
- **Evidence:**
```
<img src="/article-cover.jpg" />
```

### [MEDIUM] PERF-003: Image tag missing explicit width/height dimensions, triggering Cumulative Layout Shift (CLS)

- **Location:** `app/post/page.tsx:6`
- **Fix Class:** `cls_dimensions`
- **Evidence:**
```
<img src="/article-cover.jpg" />
```

### [HIGH] A11Y-001: <img> element missing required alt attribute for screen readers

- **Location:** `app/post/page.tsx:6`
- **Fix Class:** `accessible_alt`
- **Evidence:**
```
<img src="/article-cover.jpg" />
```

