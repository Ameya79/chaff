# Chaff Audit Report

**Timestamp:** 2026-11-22T14:06:44.745Z  
**Operating Level:** Level 2  
**Overall Chaff Score:** **97 / 100**

## Score Breakdown

| Category | Score | Status |
|---|:---:|:---:|
| **Visual & Layout** | 100 / 100 | PASS |
| **Copy & Voice** | 100 / 100 | PASS |
| **Code & Semantics** | 88 / 100 | PASS |
| **Performance & Mobile** | 100 / 100 | PASS |

## Identity Lock Summary

- **Detected Framework:** next
- **Locked Design Tokens:** 0
- **Approved Waivers:** 0

## Findings (3 Open, 0 Waived)

### [HIGH] CODE-001: Non-semantic <div> used as button with onClick; use <button> or add role="button"

- **Location:** `app/page.tsx:7`
- **Fix Class:** `semantic_html`
- **Evidence:**
```
<div className="cursor-pointer bg-blue-500 text-white px-4 py-2" 
```

### [LOW] CODE-007: Residual console.log detected in component code

- **Location:** `app/page.tsx:3`
- **Fix Class:** `code_hygiene`
- **Evidence:**
```
console.log('Rendering Dashboard');
```

### [LOW] CODE-007: Residual console.log detected in component code

- **Location:** `app/page.tsx:9`
- **Fix Class:** `code_hygiene`
- **Evidence:**
```
onClick={() => console.log('Export data clicked')}
```

