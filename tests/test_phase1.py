"""
tests/test_phase1.py - Comprehensive 4-Tier E2E Test Suite
Chaff Phase 1 - Verification of Rules, Contracts, Pointers, and Protocols
"""

from __future__ import annotations
import re
import sys
from pathlib import Path
from typing import Dict, List, Set, Tuple
import pytest

# Ensure tests directory is importable
tests_dir = Path(__file__).parent.resolve()
if str(tests_dir) not in sys.path:
    sys.path.insert(0, str(tests_dir))

from conftest import (
    CATEGORY_PREFIXES,
    FALLBACK_CONTRACT_PARTS,
    PREFIX_TO_CATEGORY,
    PROTOCOL_STEPS,
    REQUIRED_CATEGORIES,
    REQUIRED_FRONTMATTER_FIELDS,
    REQUIRED_SECTIONS,
    VALID_DETECT,
    VALID_LEVELS,
    VALID_SEVERITIES,
    RuleRecord,
    scan_for_unresolved_stubs,
)


# ==============================================================================
# TIER 1: FEATURE COVERAGE (≥5 Assertions per Feature, 8 Features)
# ==============================================================================

class TestTier1FeatureCoverage:
    """Tier 1: Feature Coverage testing core requirements across all 8 features."""

    # --- Feature 1: Rule Count & Category Layout ---

    def test_f1_total_rule_count_within_bounds(self, parsed_rules: List[RuleRecord]):
        """Assertion 1.1: Total rule count must be between 60 and 80 rules (nominal target: 72)."""
        count = len(parsed_rules)
        assert 60 <= count <= 80, (
            f"[F1 Violation] Total rule count must be between 60 and 80, "
            f"but found {count} rules."
        )

    def test_f1_all_eight_category_directories_exist(self, rules_dir: Path):
        """Assertion 1.2: All 8 required category subdirectories must exist under rules/."""
        assert rules_dir.exists(), f"[F1 Violation] Directory '{rules_dir}' does not exist."
        existing_subdirs = {p.name for p in rules_dir.iterdir() if p.is_dir()}
        for cat in REQUIRED_CATEGORIES:
            assert cat in existing_subdirs, (
                f"[F1 Violation] Required category subdirectory 'rules/{cat}' is missing."
            )

    def test_f1_only_markdown_files_in_category_directories(self, rules_dir: Path):
        """Assertion 1.3: Category directories must only contain .md files (no subdirs or other extensions)."""
        for cat in REQUIRED_CATEGORIES:
            cat_dir = rules_dir / cat
            if not cat_dir.exists():
                continue
            for item in cat_dir.iterdir():
                assert item.is_file() and item.name.endswith(".md"), (
                    f"[F1 Violation] Found non-markdown or sub-directory '{item}' in 'rules/{cat}'."
                )

    def test_f1_no_extraneous_items_in_rules_root(self, rules_dir: Path):
        """Assertion 1.4: rules/ root directory must contain only the 8 category subdirectories."""
        if not rules_dir.exists():
            pytest.fail(f"[F1 Violation] Directory '{rules_dir}' does not exist.")
        root_files = [p.name for p in rules_dir.iterdir() if p.is_file()]
        assert not root_files, (
            f"[F1 Violation] Found extraneous files in rules/ root: {root_files}"
        )
        existing_subdirs = {p.name for p in rules_dir.iterdir() if p.is_dir()}
        extra_dirs = existing_subdirs - set(REQUIRED_CATEGORIES)
        assert not extra_dirs, (
            f"[F1 Violation] Found unexpected category directories in rules/: {extra_dirs}"
        )

    def test_f1_each_category_has_minimum_rules(self, rules_by_category: Dict[str, List[RuleRecord]]):
        """Assertion 1.5: Every category must contain at least 7 rules."""
        for cat in REQUIRED_CATEGORIES:
            rules = rules_by_category.get(cat, [])
            assert len(rules) >= 7, (
                f"[F1 Violation] Category 'rules/{cat}' has {len(rules)} rules; minimum required is 7."
            )

    def test_f1_nominal_balance_per_category(self, rules_by_category: Dict[str, List[RuleRecord]]):
        """Assertion 1.6: Balanced category distribution; no category exceeds 12 rules."""
        for cat in REQUIRED_CATEGORIES:
            rules = rules_by_category.get(cat, [])
            assert len(rules) <= 12, (
                f"[F1 Violation] Category 'rules/{cat}' exceeds nominal limit with {len(rules)} rules."
            )

    # --- Feature 2: YAML Frontmatter Schema (10 Fields) ---

    def test_f2_every_rule_has_valid_frontmatter_without_parse_errors(self, parsed_rules: List[RuleRecord]):
        """Assertion 2.1: Every rule file must have valid YAML frontmatter without syntax or parse errors."""
        assert parsed_rules, "[F2 Violation] No rules discovered to validate."
        errors = [f"{r.path}: {r.parse_error}" for r in parsed_rules if r.parse_error]
        assert not errors, (
            f"[F2 Violation] Rule parsing errors encountered in {len(errors)} files:\n"
            + "\n".join(errors[:10])
        )

    def test_f2_all_ten_required_frontmatter_fields_present(self, parsed_rules: List[RuleRecord]):
        """Assertion 2.2: All 10 required frontmatter fields must be present in every rule."""
        assert parsed_rules, "[F2 Violation] No rules discovered to validate."
        missing_reports = []
        for r in parsed_rules:
            missing = [f for f in REQUIRED_FRONTMATTER_FIELDS if f not in r.frontmatter]
            if missing:
                missing_reports.append(f"{r.path} missing fields: {missing}")
        assert not missing_reports, (
            f"[F2 Violation] Missing required frontmatter fields in {len(missing_reports)} rules:\n"
            + "\n".join(missing_reports[:10])
        )

    def test_f2_severity_enum_valid(self, parsed_rules: List[RuleRecord]):
        """Assertion 2.3: Severity must be one of: high, medium, low."""
        assert parsed_rules, "[F2 Violation] No rules discovered to validate."
        invalid = []
        for r in parsed_rules:
            sev = r.frontmatter.get("severity")
            if sev not in VALID_SEVERITIES:
                invalid.append(f"{r.path}: severity='{sev}'")
        assert not invalid, (
            f"[F2 Violation] Invalid severity enum values. Must be {VALID_SEVERITIES}:\n"
            + "\n".join(invalid[:10])
        )

    def test_f2_detect_enum_valid(self, parsed_rules: List[RuleRecord]):
        """Assertion 2.4: Detect must be one of: static, rendered, heuristic, manual."""
        assert parsed_rules, "[F2 Violation] No rules discovered to validate."
        invalid = []
        for r in parsed_rules:
            det = r.frontmatter.get("detect")
            if det not in VALID_DETECT:
                invalid.append(f"{r.path}: detect='{det}'")
        assert not invalid, (
            f"[F2 Violation] Invalid detect enum values. Must be {VALID_DETECT}:\n"
            + "\n".join(invalid[:10])
        )

    def test_f2_levels_is_valid_non_empty_subset(self, parsed_rules: List[RuleRecord]):
        """Assertion 2.5: Levels must be a non-empty list of integers, subset of [1, 2, 3]."""
        assert parsed_rules, "[F2 Violation] No rules discovered to validate."
        invalid = []
        for r in parsed_rules:
            lvls = r.frontmatter.get("levels")
            if not isinstance(lvls, list) or not lvls or not set(lvls).issubset(VALID_LEVELS):
                invalid.append(f"{r.path}: levels={lvls}")
        assert not invalid, (
            f"[F2 Violation] Invalid levels field. Must be non-empty subset of [1, 2, 3]:\n"
            + "\n".join(invalid[:10])
        )

    def test_f2_string_fields_are_non_empty(self, parsed_rules: List[RuleRecord]):
        """Assertion 2.6: String fields (title, fix_class, bad, good, why, exceptions) must be non-empty."""
        assert parsed_rules, "[F2 Violation] No rules discovered to validate."
        empty_fields = []
        str_fields = ("title", "fix_class", "bad", "good", "why", "exceptions")
        for r in parsed_rules:
            for sf in str_fields:
                val = r.frontmatter.get(sf)
                if val is None or not str(val).strip():
                    empty_fields.append(f"{r.path}: '{sf}' is empty or None")
        assert not empty_fields, (
            f"[F2 Violation] Found empty required string fields:\n"
            + "\n".join(empty_fields[:10])
        )

    # --- Feature 3: Rule IDs & Format ---

    def test_f3_rule_id_format_matches_regex(self, parsed_rules: List[RuleRecord]):
        """Assertion 3.1: Rule ID must match ^(UI|COPY|CODE|PERF|MOBILE|A11Y|MOTION|THREE)-\\d{3}$."""
        assert parsed_rules, "[F3 Violation] No rules discovered to validate."
        id_pattern = re.compile(r"^(UI|COPY|CODE|PERF|MOBILE|A11Y|MOTION|THREE)-\d{3}$")
        mismatches = []
        for r in parsed_rules:
            rid = str(r.frontmatter.get("id", ""))
            if not id_pattern.match(rid):
                mismatches.append(f"{r.path}: invalid id='{rid}'")
        assert not mismatches, (
            f"[F3 Violation] Rule ID format does not match ^(UI|COPY|CODE|PERF|MOBILE|A11Y|MOTION|THREE)-\\d{{3}}$:\n"
            + "\n".join(mismatches[:10])
        )

    def test_f3_rule_ids_globally_unique(self, parsed_rules: List[RuleRecord]):
        """Assertion 3.2: Rule IDs must be globally unique across all rules."""
        assert parsed_rules, "[F3 Violation] No rules discovered to validate."
        seen: Dict[str, Path] = {}
        duplicates = []
        for r in parsed_rules:
            rid = str(r.frontmatter.get("id", ""))
            if rid in seen:
                duplicates.append(f"Duplicate ID '{rid}' in '{r.path}' and '{seen[rid]}'")
            else:
                seen[rid] = r.path
        assert not duplicates, (
            f"[F3 Violation] Duplicate rule IDs detected across library:\n"
            + "\n".join(duplicates)
        )

    def test_f3_rule_id_matches_filename(self, parsed_rules: List[RuleRecord]):
        """Assertion 3.3: Rule filename must match <id>.md."""
        assert parsed_rules, "[F3 Violation] No rules discovered to validate."
        mismatches = []
        for r in parsed_rules:
            rid = str(r.frontmatter.get("id", ""))
            expected_filename = f"{rid}.md"
            if r.filename != expected_filename:
                mismatches.append(f"{r.path}: expected filename '{expected_filename}'")
        assert not mismatches, (
            f"[F3 Violation] Rule filename must match rule ID:\n"
            + "\n".join(mismatches[:10])
        )

    def test_f3_id_prefix_matches_category_folder(self, parsed_rules: List[RuleRecord]):
        """Assertion 3.4: Rule ID category prefix must match its parent directory name in uppercase."""
        assert parsed_rules, "[F3 Violation] No rules discovered to validate."
        mismatches = []
        for r in parsed_rules:
            rid = str(r.frontmatter.get("id", ""))
            prefix = rid.split("-")[0] if "-" in rid else ""
            expected_prefix = CATEGORY_PREFIXES.get(r.category)
            if prefix != expected_prefix:
                mismatches.append(
                    f"{r.path}: ID prefix '{prefix}' does not match expected category prefix '{expected_prefix}'"
                )
        assert not mismatches, (
            f"[F3 Violation] Rule ID prefix does not match category directory:\n"
            + "\n".join(mismatches[:10])
        )

    def test_f3_numeric_suffix_is_three_digits(self, parsed_rules: List[RuleRecord]):
        """Assertion 3.5: Rule ID numeric suffix must be formatted as exactly 3 zero-padded digits."""
        assert parsed_rules, "[F3 Violation] No rules discovered to validate."
        invalid_nums = []
        for r in parsed_rules:
            rid = str(r.frontmatter.get("id", ""))
            parts = rid.split("-")
            if len(parts) == 2 and not (parts[1].isdigit() and len(parts[1]) == 3):
                invalid_nums.append(f"{r.path}: id='{rid}'")
        assert not invalid_nums, (
            f"[F3 Violation] Rule ID numeric suffix must be 3 digits:\n"
            + "\n".join(invalid_nums[:10])
        )

    # --- Feature 4: Markdown Body Sections & Quality ---

    def test_f4_four_required_h2_sections_present(self, parsed_rules: List[RuleRecord]):
        """Assertion 4.1: Every rule must contain all 4 standard H2 markdown sections."""
        assert parsed_rules, "[F4 Violation] No rules discovered to validate."
        missing_sections = []
        for r in parsed_rules:
            missing = [sec for sec in REQUIRED_SECTIONS if sec not in r.sections]
            if missing:
                missing_sections.append(f"{r.path} missing H2 sections: {missing}")
        assert not missing_sections, (
            f"[F4 Violation] Rules missing required H2 sections:\n"
            + "\n".join(missing_sections[:10])
        )

    def test_f4_each_h2_section_has_substantive_content(self, parsed_rules: List[RuleRecord]):
        """Assertion 4.2: Each H2 section must contain non-trivial content (>15 characters)."""
        assert parsed_rules, "[F4 Violation] No rules discovered to validate."
        empty_sections = []
        for r in parsed_rules:
            for sec in REQUIRED_SECTIONS:
                content = r.sections.get(sec, "")
                if len(content.strip()) < 15:
                    empty_sections.append(f"{r.path} section '{sec}' has trivial content (<15 chars)")
        assert not empty_sections, (
            f"[F4 Violation] Markdown sections contain empty or trivial content:\n"
            + "\n".join(empty_sections[:10])
        )

    def test_f4_bad_and_good_snippets_distinct_and_non_empty(self, parsed_rules: List[RuleRecord]):
        """Assertion 4.3: Bad and good snippets must be non-empty and distinct from each other."""
        assert parsed_rules, "[F4 Violation] No rules discovered to validate."
        snippet_issues = []
        for r in parsed_rules:
            bad = str(r.frontmatter.get("bad", "")).strip()
            good = str(r.frontmatter.get("good", "")).strip()
            if not bad or not good:
                snippet_issues.append(f"{r.path}: bad or good snippet is empty")
            elif bad == good:
                snippet_issues.append(f"{r.path}: bad and good snippets are identical")
        assert not snippet_issues, (
            f"[F4 Violation] 'bad' and 'good' snippets must be non-empty and distinct:\n"
            + "\n".join(snippet_issues[:10])
        )

    def test_f4_why_and_exceptions_non_empty(self, parsed_rules: List[RuleRecord]):
        """Assertion 4.4: Why and exceptions fields must contain substantive explanations."""
        assert parsed_rules, "[F4 Violation] No rules discovered to validate."
        trivial = []
        for r in parsed_rules:
            why = str(r.frontmatter.get("why", "")).strip()
            exc = str(r.frontmatter.get("exceptions", "")).strip()
            if len(why) < 10 or len(exc) < 5:
                trivial.append(f"{r.path}: why='{why}', exceptions='{exc}'")
        assert not trivial, (
            f"[F4 Violation] 'why' or 'exceptions' field is empty or trivial:\n"
            + "\n".join(trivial[:10])
        )

    def test_f4_zero_unresolved_stubs_in_rules(self, parsed_rules: List[RuleRecord]):
        """Assertion 4.5: Zero unresolved placeholders, TODOs, or template dummy text in rule files."""
        assert parsed_rules, "[F4 Violation] No rules discovered to validate."
        stub_findings = []
        for r in parsed_rules:
            findings = scan_for_unresolved_stubs(r.raw_content)
            if findings:
                for line_no, line_txt, pattern in findings:
                    stub_findings.append(f"{r.path}:{line_no} [{pattern}] '{line_txt}'")
        assert not stub_findings, (
            f"[F4 Violation] Found unresolved placeholders/stubs in rules:\n"
            + "\n".join(stub_findings[:15])
        )

    # --- Feature 5: Single-File Entry CHAFF.md ---

    def test_f5_chaff_md_exists(self, chaff_md: Tuple[Path, str]):
        """Assertion 5.1: CHAFF.md must exist at repository root and be non-empty."""
        path, content = chaff_md
        assert path.exists(), f"[F5 Violation] File '{path}' does not exist."
        assert len(content.strip()) > 100, f"[F5 Violation] '{path}' is empty or trivial."

    def test_f5_chaff_md_defines_all_seven_protocol_steps(self, chaff_md: Tuple[Path, str]):
        """Assertion 5.2: CHAFF.md must define all 7 agent protocol steps."""
        _, content = chaff_md
        for step in PROTOCOL_STEPS:
            pattern = re.compile(rf"\b{step}\b", re.IGNORECASE)
            assert pattern.search(content), (
                f"[F5 Violation] CHAFF.md does not define required protocol step '{step}'."
            )

    def test_f5_chaff_md_defines_identity_lock(self, chaff_md: Tuple[Path, str]):
        """Assertion 5.3: CHAFF.md must define the Identity Lock mechanism referencing .chaff/identity.json."""
        _, content = chaff_md
        assert ".chaff/identity.json" in content, (
            "[F5 Violation] CHAFF.md does not reference '.chaff/identity.json'."
        )
        assert "Identity Lock" in content or "identity" in content.lower(), (
            "[F5 Violation] CHAFF.md does not specify the Identity Lock mechanism."
        )

    def test_f5_chaff_md_identity_lock_schema_components(self, chaff_md: Tuple[Path, str]):
        """Assertion 5.4: CHAFF.md must explain Identity Lock components: tokens, fonts, locked, waivers."""
        _, content = chaff_md
        content_lower = content.lower()
        for field in ("tokens", "fonts", "locked", "waivers"):
            assert field in content_lower, (
                f"[F5 Violation] CHAFF.md Identity Lock missing explanation of '{field}'."
            )

    def test_f5_chaff_md_summarizes_three_levels(self, chaff_md: Tuple[Path, str]):
        """Assertion 5.5: CHAFF.md must provide an overview of all 3 levels (Level 1, Level 2, Level 3)."""
        _, content = chaff_md
        assert "Level 1" in content or "Clean" in content, "[F5 Violation] Missing Level 1 overview."
        assert "Level 2" in content or "Authored" in content, "[F5 Violation] Missing Level 2 overview."
        assert "Level 3" in content or "Risk" in content, "[F5 Violation] Missing Level 3 overview."

    # --- Feature 6: Dedicated Level Contracts ---

    def test_f6_all_three_level_contract_files_exist(self, level_contracts: Dict[str, Tuple[Path, str]]):
        """Assertion 6.1: Dedicated contract files level-1.md, level-2.md, level-3.md must exist."""
        for lvl in ("level-1", "level-2", "level-3"):
            path, content = level_contracts[lvl]
            assert path.exists(), f"[F6 Violation] Contract file '{path}' does not exist."
            assert len(content.strip()) > 50, f"[F6 Violation] Contract file '{path}' is empty."

    def test_f6_level_contracts_define_allowed_and_forbidden(self, level_contracts: Dict[str, Tuple[Path, str]]):
        """Assertion 6.2: Each level contract file must define Allowed and Forbidden actions."""
        for lvl in ("level-1", "level-2", "level-3"):
            _, content = level_contracts[lvl]
            content_lower = content.lower()
            assert "allowed" in content_lower, f"[F6 Violation] '{lvl}.md' missing 'Allowed' section."
            assert "forbidden" in content_lower or "not allowed" in content_lower, (
                f"[F6 Violation] '{lvl}.md' missing 'Forbidden' section."
            )

    def test_f6_level1_clean_specifies_diff_budget(self, level_contracts: Dict[str, Tuple[Path, str]]):
        """Assertion 6.3: level-1.md must specify a reviewable diff budget confined to existing components."""
        _, content = level_contracts["level-1"]
        content_lower = content.lower()
        assert "diff budget" in content_lower or "sitting" in content_lower or "components" in content_lower, (
            "[F6 Violation] level-1.md does not specify reviewable diff budget."
        )

    def test_f6_level2_authored_specifies_pitches_and_interaction(self, level_contracts: Dict[str, Tuple[Path, str]]):
        """Assertion 6.4: level-2.md must specify 3 Concept Pitches and 1 signature interaction per view."""
        _, content = level_contracts["level-2"]
        content_lower = content.lower()
        assert "pitches" in content_lower or "concept" in content_lower, (
            "[F6 Violation] level-2.md does not specify Concept Pitches."
        )
        assert "signature interaction" in content_lower or "interaction" in content_lower, (
            "[F6 Violation] level-2.md does not specify signature interaction requirement."
        )

    def test_f6_level3_risk_specifies_fallback_contract(self, level_contracts: Dict[str, Tuple[Path, str]]):
        """Assertion 6.5: level-3.md must specify the complete 5-part Fallback Contract."""
        _, content = level_contracts["level-3"]
        content_lower = content.lower()
        assert "fallback contract" in content_lower, (
            "[F6 Violation] level-3.md does not specify Fallback Contract."
        )
        for part in FALLBACK_CONTRACT_PARTS:
            assert part in content_lower, (
                f"[F6 Violation] level-3.md Fallback Contract missing '{part}' requirement."
            )

    # --- Feature 7: Universal Pointer AGENTS.md ---

    def test_f7_agents_md_exists(self, agents_md: Tuple[Path, str, List[str]]):
        """Assertion 7.1: Universal pointer AGENTS.md must exist at repository root."""
        path, _, _ = agents_md
        assert path.exists(), f"[F7 Violation] Universal pointer '{path}' does not exist."

    def test_f7_agents_md_line_count_strictly_under_80(self, agents_md: Tuple[Path, str, List[str]]):
        """Assertion 7.2: AGENTS.md line count must be strictly less than 80 lines (len(lines) < 80)."""
        path, _, lines = agents_md
        assert len(lines) < 80, (
            f"[F7 Violation] AGENTS.md line count must be strictly < 80 lines; "
            f"found {len(lines)} lines in '{path}'."
        )

    def test_f7_agents_md_references_chaff_md(self, agents_md: Tuple[Path, str, List[str]]):
        """Assertion 7.3: AGENTS.md must explicitly reference CHAFF.md."""
        _, content, _ = agents_md
        assert "CHAFF.md" in content, (
            "[F7 Violation] AGENTS.md must explicitly reference 'CHAFF.md'."
        )

    def test_f7_agents_md_references_rules_or_protocol(self, agents_md: Tuple[Path, str, List[str]]):
        """Assertion 7.4: AGENTS.md must reference the Chaff rules, protocol, or audit workflow."""
        _, content, _ = agents_md
        content_lower = content.lower()
        assert "rule" in content_lower or "protocol" in content_lower or "audit" in content_lower, (
            "[F7 Violation] AGENTS.md does not mention rules, protocol, or audit."
        )

    def test_f7_agents_md_non_empty(self, agents_md: Tuple[Path, str, List[str]]):
        """Assertion 7.5: AGENTS.md must contain substantive content (>= 10 lines)."""
        _, _, lines = agents_md
        assert len(lines) >= 10, (
            f"[F7 Violation] AGENTS.md is too short ({len(lines)} lines) to be a functioning pointer."
        )

    # --- Feature 8: Claude Pointer CLAUDE.md & Preservation ---

    def test_f8_claude_md_exists(self, claude_md: Tuple[Path, str]):
        """Assertion 8.1: CLAUDE.md must exist at repository root and be non-empty."""
        path, content = claude_md
        assert path.exists(), f"[F8 Violation] File '{path}' does not exist."
        assert len(content.strip()) > 20, f"[F8 Violation] '{path}' is empty."

    def test_f8_claude_md_references_chaff_md(self, claude_md: Tuple[Path, str]):
        """Assertion 8.2: CLAUDE.md must reference CHAFF.md."""
        _, content = claude_md
        assert "CHAFF.md" in content, (
            "[F8 Violation] CLAUDE.md must reference 'CHAFF.md'."
        )

    def test_f8_claude_md_references_test_command(self, claude_md: Tuple[Path, str]):
        """Assertion 8.3: CLAUDE.md must reference the pytest test command."""
        _, content = claude_md
        assert "pytest" in content or "test" in content.lower(), (
            "[F8 Violation] CLAUDE.md must reference testing commands."
        )

    def test_f8_claude_md_references_rules(self, claude_md: Tuple[Path, str]):
        """Assertion 8.4: CLAUDE.md must reference Chaff rules or workflow."""
        _, content = claude_md
        assert "rules" in content.lower() or "chaff" in content.lower(), (
            "[F8 Violation] CLAUDE.md must reference Chaff rules or workflow."
        )

    def test_f8_prd_preservation_safeguard(self, prd_md: Tuple[Path, str]):
        """Assertion 8.5: Master PRD must be preserved at docs/PRD.md to safeguard from NTFS collision."""
        path, content = prd_md
        assert path.exists(), (
            f"[F8 Violation] Master PRD not found at '{path}'. "
            "Must preserve Chaff.md to docs/PRD.md to prevent Windows NTFS collision."
        )
        assert len(content) > 1000, f"[F8 Violation] '{path}' is empty or incomplete."


# ==============================================================================
# TIER 2: BOUNDARY & CORNER CASES
# ==============================================================================

class TestTier2BoundaryCornerCases:
    """Tier 2: Boundary & Corner Cases testing exact limits, empty values, casing."""

    def test_t2_agents_md_line_boundary_79_vs_80(self, agents_md: Tuple[Path, str, List[str]]):
        """Boundary Test: AGENTS.md line count must be <= 79 lines (strictly under 80)."""
        _, _, lines = agents_md
        line_count = len(lines)
        assert line_count <= 79, (
            f"[Boundary Violation] Line count of AGENTS.md is {line_count}. "
            f"Constraint is strictly < 80 lines (max allowable is 79)."
        )

    def test_t2_frontmatter_no_empty_or_whitespace_strings(self, parsed_rules: List[RuleRecord]):
        """Boundary Test: None of the frontmatter string fields can be empty or pure whitespace."""
        assert parsed_rules, "[Boundary Violation] No rules discovered to validate."
        empty_fields = []
        string_fields = ("id", "title", "fix_class", "bad", "good", "why", "exceptions")
        for r in parsed_rules:
            for fld in string_fields:
                val = r.frontmatter.get(fld)
                if val is None or not str(val).strip():
                    empty_fields.append(f"{r.path} field '{fld}' is empty or whitespace")
        assert not empty_fields, (
            f"[Boundary Violation] Empty string fields found:\n" + "\n".join(empty_fields[:10])
        )

    def test_t2_levels_non_empty_and_no_zero_or_four(self, parsed_rules: List[RuleRecord]):
        """Boundary Test: Levels list cannot contain 0 or 4, cannot be empty, and no duplicates."""
        assert parsed_rules, "[Boundary Violation] No rules discovered to validate."
        invalid_lvls = []
        for r in parsed_rules:
            lvls = r.frontmatter.get("levels")
            if not isinstance(lvls, list) or len(lvls) == 0:
                invalid_lvls.append(f"{r.path}: empty levels list")
            elif any(lvl not in (1, 2, 3) for lvl in lvls):
                invalid_lvls.append(f"{r.path}: invalid level in {lvls}")
            elif len(lvls) != len(set(lvls)):
                invalid_lvls.append(f"{r.path}: duplicate levels in {lvls}")
        assert not invalid_lvls, (
            f"[Boundary Violation] Invalid levels boundary:\n" + "\n".join(invalid_lvls[:10])
        )

    def test_t2_severity_strict_lowercase_enum(self, parsed_rules: List[RuleRecord]):
        """Boundary Test: Severity enum must be strictly lowercase (e.g. reject 'High', 'HIGH')."""
        assert parsed_rules, "[Boundary Violation] No rules discovered to validate."
        case_errors = []
        for r in parsed_rules:
            sev = r.frontmatter.get("severity")
            if isinstance(sev, str) and sev != sev.lower():
                case_errors.append(f"{r.path}: severity '{sev}' is not strictly lowercase")
        assert not case_errors, (
            f"[Boundary Violation] Severity must be strictly lowercase enum:\n"
            + "\n".join(case_errors[:10])
        )

    def test_t2_detect_strict_lowercase_enum(self, parsed_rules: List[RuleRecord]):
        """Boundary Test: Detect enum must be strictly lowercase (e.g. reject 'Static', 'STATIC')."""
        assert parsed_rules, "[Boundary Violation] No rules discovered to validate."
        case_errors = []
        for r in parsed_rules:
            det = r.frontmatter.get("detect")
            if isinstance(det, str) and det != det.lower():
                case_errors.append(f"{r.path}: detect '{det}' is not strictly lowercase")
        assert not case_errors, (
            f"[Boundary Violation] Detect must be strictly lowercase enum:\n"
            + "\n".join(case_errors[:10])
        )

    def test_t2_category_folder_names_strictly_lowercase(self, rules_dir: Path):
        """Boundary Test: All category folder names must be strictly lowercase (reject 'UI', 'A11y')."""
        if not rules_dir.exists():
            pytest.fail(f"[Boundary Violation] Directory '{rules_dir}' does not exist.")
        invalid_folders = []
        for p in rules_dir.iterdir():
            if p.is_dir() and p.name != p.name.lower():
                invalid_folders.append(f"Directory '{p.name}' is not lowercase")
        assert not invalid_folders, (
            f"[Boundary Violation] Category folders must be lowercase:\n"
            + "\n".join(invalid_folders)
        )

    def test_t2_code_snippets_minimum_length(self, parsed_rules: List[RuleRecord]):
        """Boundary Test: bad and good snippets must be substantive (>= 5 chars)."""
        assert parsed_rules, "[Boundary Violation] No rules discovered to validate."
        short_snippets = []
        for r in parsed_rules:
            bad = str(r.frontmatter.get("bad", "")).strip()
            good = str(r.frontmatter.get("good", "")).strip()
            if len(bad) < 5:
                short_snippets.append(f"{r.path}: 'bad' snippet too short ({len(bad)} chars)")
            if len(good) < 5:
                short_snippets.append(f"{r.path}: 'good' snippet too short ({len(good)} chars)")
        assert not short_snippets, (
            f"[Boundary Violation] Code snippets must be substantive (>= 5 chars):\n"
            + "\n".join(short_snippets[:10])
        )

    def test_t2_exact_h2_heading_wording(self, parsed_rules: List[RuleRecord]):
        """Boundary Test: Body H2 headings must match the 4 required titles exactly."""
        assert parsed_rules, "[Boundary Violation] No rules discovered to validate."
        header_errors = []
        for r in parsed_rules:
            for heading in r.sections:
                if heading.startswith("## ") and heading not in REQUIRED_SECTIONS:
                    header_errors.append(f"{r.path}: unrecognized H2 heading '{heading}'")
        assert not header_errors, (
            f"[Boundary Violation] Unrecognized or misspelled H2 headings:\n"
            + "\n".join(header_errors[:10])
        )

    def test_t2_stub_scanner_detects_html_and_bracketed_stubs(self):
        """Boundary Test: Stub scanner detects HTML comments, bracketed markers, dummy text, template vars."""
        sample_with_stubs = (
            "# Rule Document\n"
            "<!-- TODO: fix this section later -->\n"
            "Here is some [TBD] content.\n"
            "Also <placeholder> for description.\n"
            "Lorem ipsum dolor sit amet.\n"
            "- TODO: finish verification\n"
            "{{template_var}}\n"
        )
        findings = scan_for_unresolved_stubs(sample_with_stubs)
        assert len(findings) >= 6, (
            f"[Boundary Violation] Stub scanner expected to catch at least 6 stubs, found {len(findings)}: {findings}"
        )


# ==============================================================================
# TIER 3: CROSS-FEATURE COMBINATIONS
# ==============================================================================

class TestTier3CrossFeatureCombinations:
    """Tier 3: Cross-Feature Combinations & Pairwise Consistency."""

    def test_t3_global_id_uniqueness(self, parsed_rules: List[RuleRecord]):
        """Pairwise Consistency: IDs are globally unique across all categories and files."""
        assert parsed_rules, "[Cross-Feature Violation] No rules discovered to validate."
        all_ids = [r.frontmatter.get("id") for r in parsed_rules if r.frontmatter.get("id")]
        assert len(all_ids) == len(set(all_ids)), (
            f"[Cross-Feature Violation] Total rule IDs ({len(all_ids)}) != unique IDs ({len(set(all_ids))})"
        )

    def test_t3_id_prefix_pairwise_category_consistency(self, parsed_rules: List[RuleRecord]):
        """Pairwise Consistency: Rule ID prefix corresponds directly to its parent category folder."""
        assert parsed_rules, "[Cross-Feature Violation] No rules discovered to validate."
        mismatches = []
        for r in parsed_rules:
            rid = str(r.frontmatter.get("id", ""))
            prefix = rid.split("-")[0] if "-" in rid else ""
            expected_cat = PREFIX_TO_CATEGORY.get(prefix)
            if expected_cat != r.category:
                mismatches.append(
                    f"Rule '{r.path}' with prefix '{prefix}' located in category '{r.category}', expected '{expected_cat}'"
                )
        assert not mismatches, (
            f"[Cross-Feature Violation] Pairwise ID prefix and folder mismatch:\n"
            + "\n".join(mismatches[:10])
        )

    def test_t3_three_js_rules_scoped_to_level_3(self, rules_by_category: Dict[str, List[RuleRecord]]):
        """Pairwise Consistency: Three.js rules cannot be scoped exclusively to Level 1 (Clean)."""
        three_rules = rules_by_category.get("three", [])
        assert three_rules, "[Cross-Feature Violation] No rules found in 'rules/three/'."
        exclusive_l1 = []
        for r in three_rules:
            lvls = r.frontmatter.get("levels", [])
            if lvls == [1]:
                exclusive_l1.append(r.path)
        assert not exclusive_l1, (
            f"[Cross-Feature Violation] 3D/Three.js rules cannot be exclusively Level 1 (Clean):\n"
            + "\n".join(str(p) for p in exclusive_l1)
        )

    def test_t3_level1_rules_exclude_layout_restructuring(self, parsed_rules: List[RuleRecord]):
        """Pairwise Consistency: Level 1 rules cannot mandate layout overhauls."""
        assert parsed_rules, "[Cross-Feature Violation] No rules discovered to validate."
        l1_layout_disruptions = []
        for r in parsed_rules:
            lvls = r.frontmatter.get("levels", [])
            fix_class = str(r.frontmatter.get("fix_class", "")).lower()
            if lvls == [1] and fix_class in ("layout_overhaul", "architectural_redesign"):
                l1_layout_disruptions.append(f"{r.path} has fix_class '{fix_class}'")
        assert not l1_layout_disruptions, (
            f"[Cross-Feature Violation] Level 1 rules cannot mandate layout overhauls:\n"
            + "\n".join(l1_layout_disruptions)
        )

    def test_t3_cross_pointer_references(
        self,
        agents_md: Tuple[Path, str, List[str]],
        claude_md: Tuple[Path, str],
        chaff_md: Tuple[Path, str],
    ):
        """Pairwise Consistency: AGENTS.md and CLAUDE.md point to CHAFF.md; CHAFF.md references level contracts."""
        _, agents_content, _ = agents_md
        _, claude_content = claude_md
        _, chaff_content = chaff_md

        assert "CHAFF.md" in agents_content, "AGENTS.md does not point to CHAFF.md"
        assert "CHAFF.md" in claude_content, "CLAUDE.md does not point to CHAFF.md"
        assert "levels/" in chaff_content or "level-1" in chaff_content, (
            "CHAFF.md does not cross-reference level contract files"
        )


# ==============================================================================
# TIER 4: REAL-WORLD APPLICATION SCENARIOS
# ==============================================================================

class TestTier4RealWorldScenarios:
    """Tier 4: End-to-End Real-World Application Workloads & Workflows."""

    def test_t4_agent_protocol_traversal(
        self,
        agents_md: Tuple[Path, str, List[str]],
        chaff_md: Tuple[Path, str],
    ):
        """Simulate autonomous agent discovery: pointer -> protocol -> Identity Lock."""
        _, agents_content, _ = agents_md
        chaff_path, chaff_content = chaff_md

        # 1. Agent loads pointer
        assert "CHAFF.md" in agents_content, "Agent failed to discover CHAFF.md from AGENTS.md"

        # 2. Agent loads CHAFF.md
        assert chaff_path.exists(), "Target single-file prompt does not exist"

        # 3. Agent traverses 7-step sequence
        for step in PROTOCOL_STEPS:
            assert step in chaff_content, f"Agent protocol step '{step}' missing in traversal"

        # 4. Agent discovers Identity Lock requirement
        assert ".chaff/identity.json" in chaff_content, (
            "Agent failed to discover .chaff/identity.json in Step 1 (Read)"
        )

    def test_t4_clean_workspace_zero_stubs(self, workspace_root: Path, all_rule_files: List[Path]):
        """Audit entire repository text corpus for zero unresolved stubs or TODOs."""
        target_files = [
            workspace_root / "CHAFF.md",
            workspace_root / "AGENTS.md",
            workspace_root / "CLAUDE.md",
            workspace_root / "docs" / "PRD.md",
            workspace_root / "levels" / "level-1.md",
            workspace_root / "levels" / "level-2.md",
            workspace_root / "levels" / "level-3.md",
        ] + all_rule_files

        all_findings = []
        for path in target_files:
            if not path.exists():
                continue
            content = path.read_text(encoding="utf-8")
            findings = scan_for_unresolved_stubs(content)
            for line_no, line_txt, pat in findings:
                rel = path.relative_to(workspace_root) if path.is_relative_to(workspace_root) else path
                all_findings.append(f"{rel}:{line_no} [{pat}] {line_txt}")

        assert not all_findings, (
            f"[Real-World Audit Violation] Found {len(all_findings)} unresolved placeholders/stubs in workspace:\n"
            + "\n".join(all_findings[:20])
        )

    def test_t4_level1_clean_audit_simulation(
        self,
        parsed_rules: List[RuleRecord],
        level_contracts: Dict[str, Tuple[Path, str]],
    ):
        """Simulate agent executing a Level 1 Clean audit run."""
        _, contract = level_contracts["level-1"]
        assert "forbidden" in contract.lower()

        l1_rules = [r for r in parsed_rules if 1 in r.frontmatter.get("levels", [])]
        assert len(l1_rules) >= 20, (
            f"Level 1 audit simulation requires at least 20 active rules; found {len(l1_rules)}"
        )
        for r in l1_rules:
            assert r.frontmatter.get("detect") in ("static", "rendered", "heuristic", "manual")
            assert len(str(r.frontmatter.get("good", ""))) > 0

    def test_t4_level3_fallback_contract_simulation(
        self,
        level_contracts: Dict[str, Tuple[Path, str]],
        rules_by_category: Dict[str, List[RuleRecord]],
    ):
        """Simulate agent verifying 5-part Fallback Contract for 3D/Three.js assets."""
        _, contract = level_contracts["level-3"]
        contract_lower = contract.lower()
        for elem in ("lazy", "poster", "tier", "budget", "250"):
            assert elem in contract_lower, (
                f"Level 3 Fallback Contract simulation missing '{elem}' stipulation"
            )

        three_rules = rules_by_category.get("three", [])
        assert len(three_rules) >= 7, "Insufficient Three.js rules to support Fallback Contract"

    def test_t4_machine_ingestion_and_indexing(self, parsed_rules: List[RuleRecord]):
        """Simulate automated MCP tool or CLI scanner loading all rules into memory."""
        index: Dict[str, RuleRecord] = {}
        for r in parsed_rules:
            rid = str(r.frontmatter.get("id"))
            assert rid not in index, f"Collision during index build on rule ID '{rid}'"
            index[rid] = r

        assert len(index) >= 60, f"Machine index contains only {len(index)} rules (minimum: 60)"
        for rid, rule in index.items():
            assert rule.frontmatter.get("title")
            assert rule.frontmatter.get("why")
            assert rule.sections.get("## Context & Problem")
            assert rule.sections.get("## Detection Logic")
            assert rule.sections.get("## Remediation Steps")
            assert rule.sections.get("## Verification")
