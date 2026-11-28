import type { MetadataRoute } from 'next';
import { pages, siteUrl } from '../lib/discovery';

import { getCachedRules } from '../lib/rules-loader';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [...Object.keys(pages), ...(await getCachedRules()).map(rule => '/rules/' + rule.id.toLowerCase())].map(path => ({ url: new URL(path, siteUrl).href }));
}
