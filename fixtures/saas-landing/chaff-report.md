# Chaff Audit Report

**Timestamp:** 2026-11-22T20:36:37.378Z  
**Operating Level:** Level 2  
**Overall Chaff Score:** **90 / 100**

## Score Breakdown

| Category | Score | Status |
|---|:---:|:---:|
| **Visual & Layout** | 80 / 100 | PASS |
| **Copy & Voice** | 80 / 100 | PASS |
| **Code & Semantics** | 100 / 100 | PASS |
| **Performance & Mobile** | 100 / 100 | PASS |

## Identity Lock Summary

- **Detected Framework:** next
- **Locked Design Tokens:** 0
- **Approved Waivers:** 0

## Findings (6 Open, 0 Waived)

### [HIGH] UI-004: Purple/indigo AI glow gradient detected

- **Location:** `app/page.tsx:3`
- **Fix Class:** `color_hygiene`
- **Evidence:**
```
<main className="min-h-screen bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex flex-col items-center justify-center p-8 hero">
```

### [MEDIUM] UI-008: min-h-screen causes mobile viewport jumping; use min-h-dvh

- **Location:** `app/page.tsx:3`
- **Fix Class:** `viewport_units`
- **Evidence:**
```
<main className="min-h-screen bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex flex-col items-center justify-center p-8 hero">
```

### [HIGH] UI-001: Generic centered hero with 3-card equal grid layout fingerprint detected

- **Location:** `app/page.tsx:1`
- **Fix Class:** `editorial_layout`
- **Evidence:**
```
Centered hero followed by md:grid-cols-3 cards block
```

### [HIGH] COPY-001: AI buzzword 'delve' detected; replace with plain, specific copy

- **Location:** `app/page.tsx:5`
- **Fix Class:** `authentic_voice`
- **Evidence:**
```
Delve into our cutting-edge revolutionary platform
```

### [HIGH] COPY-001: AI buzzword 'streamline' detected; replace with plain, specific copy

- **Location:** `app/page.tsx:8`
- **Fix Class:** `authentic_voice`
- **Evidence:**
```
Streamline and supercharge your team with 99.9% uptime and 10,000+ happy teams.
```

### [MEDIUM] COPY-003: Round synthetic statistic detected without attribution

- **Location:** `app/page.tsx:8`
- **Fix Class:** `grounded_metrics`
- **Evidence:**
```
Streamline and supercharge your team with 99.9% uptime and 10,000+ happy teams.
```

