# Chaff Audit Report

**Timestamp:** 2026-11-22T14:06:44.866Z  
**Operating Level:** Level 2  
**Overall Chaff Score:** **100 / 100**

## Score Breakdown

| Category | Score | Status |
|---|:---:|:---:|
| **Visual & Layout** | 100 / 100 | PASS |
| **Copy & Voice** | 100 / 100 | PASS |
| **Code & Semantics** | 100 / 100 | PASS |
| **Performance & Mobile** | 100 / 100 | PASS |

## Identity Lock Summary

- **Detected Framework:** next
- **Locked Design Tokens:** 1
- **Approved Waivers:** 1

## Findings (0 Open, 1 Waived)

### [WAIVED - Brand guideline explicitly specifies purple as primary brand color in DESIGN.md] UI-004: Purple/indigo AI glow gradient detected

- **Location:** `app/page.tsx:3`
- **Fix Class:** `color_hygiene`
- **Evidence:**
```
<div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8">
```

