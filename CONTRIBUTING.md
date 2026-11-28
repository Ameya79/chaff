# Contributing to Chaff

Chaff has two entry points. To **use** the design protocol, give the repository URL to a coding agent in your frontend workspace. To **change** Chaff itself, clone this repository and run the workspace locally.

## Run the project

Use Node.js 24, pnpm 10, and Python 3.12 for the same toolchain as CI. From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm --filter chaff-web dev
```

Open the local address printed by Next.js. Building the workspace packages first makes their compiled exports available to the showcase. The app can run locally without a GitHub token or a Vercel account.

## Choose a change

| Area | Implementation | Verification |
| --- | --- | --- |
| Agent guidance | [GitHub-link runbook](docs/link-run.md) | Follow the changed step in a fresh frontend workspace |
| Rules and detection | [Rules](rules), [source checks](packages/checks/src) | Exercise both a finding and a valid exception |
| Showcase | [Web app](apps/web/src) | Test the interaction at phone and desktop widths, including keyboard and reduced motion when relevant |
| CLI and MCP | [CLI](packages/cli), [MCP](packages/mcp) | Run package tests and exercise the affected command or tool |

For a new rule, [open a rule proposal](https://github.com/Ameya79/chaff/issues/new?template=rule_proposal.yml). Include a concrete example, the smallest useful fix, and a case where the pattern is intentional. The [rule backlog](docs/GOOD_FIRST_RULES.md) contains proposals.

## Run the checks

```sh
pnpm build
pnpm test
python -m pip install -r tests/requirements.txt
python -m pytest tests -q
```

For showcase changes, also run `pnpm --filter chaff-web build`. Stop the development server before building because both use the same Next.js output directory. CI runs the production build on Linux.

## Open a pull request

Describe the user-visible change, how you verified it, and any remaining limitations. For visual changes, include before and after screenshots at the same viewport. For model-quality claims, include the model ID, task, rendered output and observed failures. A passing source audit alone cannot establish visual quality.

Report ordinary bugs through the [bug form](https://github.com/Ameya79/chaff/issues/new?template=bug_report.yml). For sensitive issues, use the [security policy](SECURITY.md).
