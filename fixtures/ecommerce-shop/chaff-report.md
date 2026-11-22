# Chaff Audit Report

**Timestamp:** 2026-11-22T20:36:37.406Z  
**Operating Level:** Level 2  
**Overall Chaff Score:** **98 / 100**

## Score Breakdown

| Category | Score | Status |
|---|:---:|:---:|
| **Visual & Layout** | 100 / 100 | PASS |
| **Copy & Voice** | 100 / 100 | PASS |
| **Code & Semantics** | 96 / 100 | PASS |
| **Performance & Mobile** | 96 / 100 | PASS |

## Identity Lock Summary

- **Detected Framework:** next
- **Locked Design Tokens:** 0
- **Approved Waivers:** 0

## Findings (2 Open, 0 Waived)

### [MEDIUM] MOBILE-002: Interactive touch target under 44x44px mobile touch threshold

- **Location:** `app/page.tsx:7`
- **Fix Class:** `touch_target_dimensions`
- **Evidence:**
```
<button type="submit" className="w-6 h-6 p-0.5 bg-gray-200">
```

### [MEDIUM] A11Y-003: Form input missing associated label or aria-label

- **Location:** `app/page.tsx:6`
- **Fix Class:** `form_label`
- **Evidence:**
```
<input type="text" placeholder="Search catalog..." />
```

