"""
tests/conftest.py - E2E Testing Harness Shared Fixtures & Parsers
Chaff Phase 1 - Opaque-box Test Infrastructure
"""

from __future__ import annotations
import os
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple
import pytest
import yaml

# ==============================================================================
# TAXONOMY & CONTRACT CONSTANTS
# ==============================================================================

REQUIRED_CATEGORIES = (
    "ui",
    "copy",
    "code",
    "perf",
    "mobile",
    "a11y",
    "motion",
    "three",
)

CATEGORY_PREFIXES = {
    "ui": "UI",
    "copy": "COPY",
    "code": "CODE",
    "perf": "PERF",
    "mobile": "MOBILE",
    "a11y": "A11Y",
    "motion": "MOTION",
    "three": "THREE",
}

PREFIX_TO_CATEGORY = {v: k for k, v in CATEGORY_PREFIXES.items()}

REQUIRED_FRONTMATTER_FIELDS = (
    "id",
    "title",
    "severity",
    "levels",
    "detect",
    "fix_class",
    "bad",
    "good",
    "why",
    "exceptions",
)

VALID_SEVERITIES = ("high", "medium", "low")
VALID_DETECT = ("static", "rendered", "heuristic", "manual")
VALID_LEVELS = {1, 2, 3}

REQUIRED_SECTIONS = (
    "## Context & Problem",
    "## Detection Logic",
    "## Remediation Steps",
    "## Verification",
)

PROTOCOL_STEPS = (
    "Read",
    "Look",
    "Audit",
    "Plan",
    "Approve",
    "Implement",
    "Verify",
    "Report",
)

FALLBACK_CONTRACT_PARTS = (
    "lazy load",
    "poster",
    "tier",
    "frame",
    "250",
)

# ==============================================================================
# DATA MODELS
# ==============================================================================

@dataclass
class RuleRecord:
    path: Path
    abs_path: Path
    category: str
    filename: str
    raw_content: str
    frontmatter_raw: str
    frontmatter: Dict[str, Any]
    body: str
    sections: Dict[str, str]
    parse_error: Optional[str] = None


# ==============================================================================
# PARSING & SCANNING UTILITIES
# ==============================================================================

def extract_markdown_sections(body: str) -> Dict[str, str]:
    """
    Extracts H2 sections from markdown body into a dictionary.
    Code blocks (```) are safely ignored so that code examples containing '## '
    do not get falsely recognized as top-level document sections.
    """
    sections: Dict[str, str] = {}
    lines = body.splitlines(keepends=True)
    in_code_block = False
    current_heading: Optional[str] = None
    current_content: List[str] = []

    for line in lines:
        stripped = line.strip()
        if stripped.startswith("```"):
            in_code_block = not in_code_block

        if not in_code_block and stripped.startswith("## "):
            if current_heading:
                sections[current_heading] = "".join(current_content).strip()
            current_heading = stripped
            current_content = []
        elif current_heading:
            current_content.append(line)

    if current_heading:
        sections[current_heading] = "".join(current_content).strip()

    return sections


def parse_rule_file(rule_path: Path, workspace_root: Path) -> RuleRecord:
    """
    Parses a markdown rule file extracting YAML frontmatter and H2 sections.
    Ensures graceful error handling if YAML is malformed or delimiters are missing.
    """
    abs_path = rule_path if rule_path.is_absolute() else (workspace_root / rule_path).resolve()
    rel_path = abs_path.relative_to(workspace_root) if abs_path.is_relative_to(workspace_root) else rule_path
    category = rel_path.parent.name
    filename = rel_path.name

    try:
        content = abs_path.read_text(encoding="utf-8")
    except Exception as e:
        return RuleRecord(
            path=rel_path,
            abs_path=abs_path,
            category=category,
            filename=filename,
            raw_content="",
            frontmatter_raw="",
            frontmatter={},
            body="",
            sections={},
            parse_error=f"Failed to read file: {e}",
        )

    lines = content.splitlines()
    if not lines or lines[0].strip() != "---":
        return RuleRecord(
            path=rel_path,
            abs_path=abs_path,
            category=category,
            filename=filename,
            raw_content=content,
            frontmatter_raw="",
            frontmatter={},
            body=content,
            sections={},
            parse_error="File does not start with opening YAML frontmatter '---'",
        )

    # Find closing '---' line
    closing_idx = -1
    for idx in range(1, len(lines)):
        if lines[idx].strip() == "---":
            closing_idx = idx
            break

    if closing_idx == -1:
        return RuleRecord(
            path=rel_path,
            abs_path=abs_path,
            category=category,
            filename=filename,
            raw_content=content,
            frontmatter_raw="",
            frontmatter={},
            body=content,
            sections={},
            parse_error="Missing closing YAML frontmatter '---'",
        )

    fm_raw = "\n".join(lines[1:closing_idx])
    body_raw = "\n".join(lines[closing_idx + 1:]).strip()

    try:
        fm_data = yaml.safe_load(fm_raw)
        if not isinstance(fm_data, dict):
            return RuleRecord(
                path=rel_path,
                abs_path=abs_path,
                category=category,
                filename=filename,
                raw_content=content,
                frontmatter_raw=fm_raw,
                frontmatter={},
                body=body_raw,
                sections={},
                parse_error="Frontmatter is not a valid YAML dictionary mapping",
            )
    except Exception as e:
        return RuleRecord(
            path=rel_path,
            abs_path=abs_path,
            category=category,
            filename=filename,
            raw_content=content,
            frontmatter_raw=fm_raw,
            frontmatter={},
            body=body_raw,
            sections={},
            parse_error=f"YAML safe_load parse error: {e}",
        )

    sections = extract_markdown_sections(body_raw)

    return RuleRecord(
        path=rel_path,
        abs_path=abs_path,
        category=category,
        filename=filename,
        raw_content=content,
        frontmatter_raw=fm_raw,
        frontmatter=fm_data,
        body=body_raw,
        sections=sections,
        parse_error=None,
    )


def scan_for_unresolved_stubs(content: str) -> List[Tuple[int, str, str]]:
    """
    High-precision scanner for unresolved TODOs, stubs, and placeholder tokens.
    Excludes intentional bad code snippet demonstrations while catching real placeholders.
    """
    findings: List[Tuple[int, str, str]] = []
    lines = content.splitlines()
    for idx, line in enumerate(lines, 1):
        # 1. Bracketed/Angled placeholders: [TODO], [TBD], [placeholder], <placeholder>
        if re.search(r"\[(TBD|TODO|placeholder|insert[^\]]*)\]", line, re.I):
            findings.append((idx, line.strip(), "bracketed placeholder"))
        elif re.search(r"<(TBD|TODO|placeholder|insert[^>]*)>", line, re.I):
            findings.append((idx, line.strip(), "angled placeholder"))
        # 2. HTML/Markdown comment placeholders: <!-- TODO: fix -->
        elif re.search(r"<!--\s*(TODO|FIXME|TBD|PLACEHOLDER)", line, re.I):
            findings.append((idx, line.strip(), "HTML comment placeholder"))
        # 3. Dummy text: Lorem ipsum dolor sit amet...
        elif re.search(r"\blorem\s+ipsum\s+(dolor|sit|amet)\b", line, re.I):
            findings.append((idx, line.strip(), "lorem ipsum dummy text"))
        # 4. Unresolved action items at line start or markdown bullets: TODO:, FIXME:, TBD:
        elif re.search(r"^\s*[-*#]?\s*(TODO|FIXME|TBD)\s*:\s*\w+", line, re.I):
            findings.append((idx, line.strip(), "unresolved TODO/FIXME heading or bullet"))
        # 5. Standalone stub token
        elif re.search(r"^\s*(TBD|TODO|FIXME|PLACEHOLDER)\s*$", line, re.I):
            findings.append((idx, line.strip(), "bare stub marker"))
        # 6. Jinja/Mustache template markers: {{ ... }}
        elif re.search(r"\{\{[a-zA-Z0-9_]+\}\}", line):
            findings.append((idx, line.strip(), "unresolved template variable"))

    return findings


# ==============================================================================
# PYTEST FIXTURES
# ==============================================================================

@pytest.fixture(scope="session")
def workspace_root() -> Path:
    """Returns absolute Path to the project root directory."""
    return Path(__file__).parent.parent.resolve()


@pytest.fixture(scope="session")
def rules_dir(workspace_root: Path) -> Path:
    """Returns Path to rules directory."""
    return workspace_root / "rules"


@pytest.fixture(scope="session")
def levels_dir(workspace_root: Path) -> Path:
    """Returns Path to levels directory."""
    return workspace_root / "levels"


@pytest.fixture(scope="session")
def all_rule_files(rules_dir: Path) -> List[Path]:
    """Finds all *.md files under rules/*."""
    if not rules_dir.exists():
        return []
    return sorted(list(rules_dir.glob("*/*.md")))


@pytest.fixture(scope="session")
def parsed_rules(all_rule_files: List[Path], workspace_root: Path) -> List[RuleRecord]:
    """Parses all rule files in rules/ once per test session."""
    return [parse_rule_file(p, workspace_root) for p in all_rule_files]


@pytest.fixture(scope="session")
def rules_by_id(parsed_rules: List[RuleRecord]) -> Dict[str, RuleRecord]:
    """Returns a lookup dictionary mapping rule id string to RuleRecord."""
    return {
        str(r.frontmatter.get("id")): r
        for r in parsed_rules
        if r.frontmatter.get("id")
    }


@pytest.fixture(scope="session")
def rules_by_category(parsed_rules: List[RuleRecord]) -> Dict[str, List[RuleRecord]]:
    """Returns a dictionary grouping parsed RuleRecords by category."""
    cat_map: Dict[str, List[RuleRecord]] = {cat: [] for cat in REQUIRED_CATEGORIES}
    for r in parsed_rules:
        if r.category in cat_map:
            cat_map[r.category].append(r)
    return cat_map


@pytest.fixture(scope="session")
def chaff_md(workspace_root: Path) -> Tuple[Path, str]:
    """Returns (path, content) for repository root CHAFF.md."""
    path = workspace_root / "CHAFF.md"
    content = path.read_text(encoding="utf-8") if path.exists() else ""
    return path, content


@pytest.fixture(scope="session")
def agents_md(workspace_root: Path) -> Tuple[Path, str, List[str]]:
    """Returns (path, content, lines) for repository root AGENTS.md."""
    path = workspace_root / "AGENTS.md"
    content = path.read_text(encoding="utf-8") if path.exists() else ""
    lines = content.splitlines() if content else []
    return path, content, lines


@pytest.fixture(scope="session")
def claude_md(workspace_root: Path) -> Tuple[Path, str]:
    """Returns (path, content) for repository root CLAUDE.md."""
    path = workspace_root / "CLAUDE.md"
    content = path.read_text(encoding="utf-8") if path.exists() else ""
    return path, content


@pytest.fixture(scope="session")
def prd_md(workspace_root: Path) -> Tuple[Path, str]:
    """Returns (path, content) for preserved specification docs/PRD.md."""
    path = workspace_root / "docs" / "PRD.md"
    content = path.read_text(encoding="utf-8") if path.exists() else ""
    return path, content


@pytest.fixture(scope="session")
def level_contracts(levels_dir: Path) -> Dict[str, Tuple[Path, str]]:
    """Returns a dictionary of (path, content) for all level contract files."""
    contracts: Dict[str, Tuple[Path, str]] = {}
    for lvl in ("level-1", "level-2", "level-3"):
        p = levels_dir / f"{lvl}.md"
        c = p.read_text(encoding="utf-8") if p.exists() else ""
        contracts[lvl] = (p, c)
    return contracts
