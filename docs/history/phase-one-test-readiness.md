# Phase 1 test readiness snapshot

Historical planning record. For current setup and verification, see the [contributor guide](../../CONTRIBUTING.md).

## Test Runner
- Command: `python -m pytest tests/test_phase1.py -v`
- Collection: `python -m pytest --collect-only tests/test_phase1.py` (61 tests collected)
- Expected: All 61 tests pass with exit code 0 once all Phase 1 implementation milestones (M1, M2, M3) are complete. Currently, 27 tests pass (100% of Milestone 1 deliverables verified), and 34 tests provide strict, descriptive verification gates for Milestone 2 and Milestone 3 rule authoring.

## Coverage Summary
| Tier | Count | Description |
|------|------:|-------------|
| 1. Feature Coverage | 42 | Features 1-8: rule count (60-80), 8 categories, frontmatter schema (10 fields), IDs & formats, H2 sections & stubs, CHAFF.md 7-step entry, level contracts, AGENTS.md (<80 lines), CLAUDE.md |
| 2. Boundary & Corner | 9 | AGENTS.md line count boundary (<=79 vs 80), non-empty string fields, levels subset/range, strict lowercase enums/folders, snippet min length, exact H2 headings, stub scanner sensitivity |
| 3. Cross-Feature | 5 | Global ID uniqueness, category prefix consistency, Three.js level 3 scoping, level 1 layout constraints, cross-pointer references |
| 4. Real-World Application | 5 | Agent protocol traversal simulation, clean workspace zero stubs audit, Level 1 clean audit simulation, Level 3 fallback contract simulation, machine ingestion and indexing |
| **Total** | **61** | Complete Phase 1 E2E Test Suite |

## Feature Checklist
| Feature | Tier 1 | Tier 2 | Tier 3 | Tier 4 | Status |
|---------|:------:|:------:|:------:|:------:|:------:|
| 1. Rule Count & Categories | 6 | 1 | ✓ | ✓ | Ready (awaiting M2/M3 rules) |
| 2. Frontmatter Schema (10 fields) | 6 | 3 | ✓ | ✓ | Ready (awaiting M2/M3 rules) |
| 3. Rule ID & Category Prefixes | 5 | 1 | ✓ | ✓ | Ready (awaiting M2/M3 rules) |
| 4. Body Sections & Zero Stubs | 5 | 2 | ✓ | ✓ | Ready (Verified clean) |
| 5. CHAFF.md Single-File Entry | 5 | ✓ | ✓ | ✓ | **PASSED** (5/5) |
| 6. Dedicated Level Contracts | 5 | ✓ | ✓ | ✓ | **PASSED** (5/5) |
| 7. Universal Pointer AGENTS.md | 5 | 1 | ✓ | ✓ | **PASSED** (6/6, strictly < 80 lines) |
| 8. Claude Pointer CLAUDE.md & PRD | 5 | ✓ | ✓ | ✓ | **PASSED** (5/5) |

## Verification & Audit Certification
- **Primary Reviewer**: `reviewer_e2e_1` — **APPROVE** (verified 61 items collected, 27 passed, 34 descriptive failures for pending rules).
- **Adversarial Challenger**: `challenger_e2e_1` — **APPROVE** (verified 100% sensitivity catch rate on all boundary limits and zero false positives on legitimate code samples).
- **Forensic Auditor**: `auditor_e2e_1` — **CLEAN** (verified 115 assertions with 0 constant/tautological assertions, genuine PyYAML/AST logic, and clean workspace hygiene).
