"""Keep the no-install entry path usable from a GitHub repository view."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_all_agent_entry_points_lead_to_the_same_runbook():
    for entry in ("README.md", "AGENTS.md", "CLAUDE.md", "CHAFF.md"):
        introduction = (ROOT / entry).read_text(encoding="utf-8").splitlines()[:16]
        assert "(docs/link-run.md)" in "\n".join(introduction), entry


def test_runbook_references_ship_with_the_repository():
    runbook = ROOT / "docs" / "link-run.md"
    targets = re.findall(r"\]\(([^)]+)\)", runbook.read_text(encoding="utf-8-sig"))
    assert {"browser-check.js", "reference/showcase-phone.png",
            "reference/showcase-desktop.png"} <= set(targets)
    for target in targets:
        path = (runbook.parent / target).resolve()
        assert path.is_relative_to(ROOT) and path.is_file(), target


def test_showcase_copies_only_the_repository_url():
    workbench = ROOT / "apps/web/src/components/InstallAdaptersWorkbench.tsx"
    source = workbench.read_text(encoding="utf-8")
    assert re.search(r"const CHAT_SNIPPET\s*=\s*'https://github\.com/Ameya79/chaff';", source)
    assert "copyToClipboard(CHAT_SNIPPET," in source

def test_readme_wordmark_and_navigation():
    text = (ROOT / "README.md").read_text(encoding="utf-8-sig")
    assert chr(0x2014) not in text
    assert 'src="docs/reference/chaff-wordmark.svg"' in text
    targets = re.findall(r'\]\(([^)]+)\)|src="([^"]+)"', text)
    for markdown, html in targets:
        path = markdown or html
        if "://" not in path:
            assert (ROOT / path).exists(), path
