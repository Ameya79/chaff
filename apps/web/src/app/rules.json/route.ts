import { siteUrl } from '../../lib/discovery';
import { getCachedRules } from '../../lib/rules-loader';

export const dynamic = 'force-static';

export async function GET() {
  const rules = await getCachedRules();
  return Response.json(rules.map(({ id, title, category, severity }) => ({
    id, title, category, severity,
    url: new URL('/rules/' + id.toLowerCase(), siteUrl).href,
    source: 'https://raw.githubusercontent.com/Ameya79/chaff/main/rules/' + category + '/' + id + '.md',
  })));
}
