import { repository, siteUrl } from '../../lib/discovery';

export const dynamic = 'force-static';

export function GET() {
  const catalog = new URL('/rules.json', siteUrl).href;
  return new Response([
    '# Chaff',
    '',
    '> An open frontend design and verification protocol for AI coding agents. Start with the runbook in the target frontend workspace.',
    '',
    '## Agent resources',
    '- [Autonomous runbook](' + repository + '/blob/main/docs/link-run.md): Start here for a link-only project.',
    '- [Rule catalog](' + catalog + '): JSON with IDs, titles, categories, severity and direct Markdown sources. Filter locally to find relevant rules.',
    '- [Browser check](' + repository + '/blob/main/docs/browser-check.js): Inspect rendered layout and controls.',
    '- [Model evaluation](' + repository + '/blob/main/bench/model-trial.md): Compare runs on the same frontend task.',
    '',
  ].join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
