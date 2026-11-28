import type { Metadata } from 'next';

export const siteUrl = new URL(process.env.CHAFF_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : 'https://chaff.dev'));
export const repository = 'https://github.com/Ameya79/chaff';

export const pages = {
  '/': ['Chaff | Frontend design guidance for AI coding agents', 'Give a coding agent one GitHub link to design, build and verify a frontend with visual references, mobile checks and 72 craft rules.'],
  '/install': ['Start using Chaff', 'Start from the GitHub link or connect Chaff to your coding environment with CLI and MCP adapters.'],
  '/rules': ['Frontend design and accessibility rules', 'Explore 72 rules for layout, copy, code, performance, mobile, accessibility, motion and WebGL.'],
  '/levels': ['Frontend design levels and budgets', 'Compare Clean, Authored and Risk scopes and their layout, interaction and performance budgets.'],
  '/gallery': ['Frontend redesign examples', 'Explore examples of frontend design changes that preserve product identity.'],
  '/playground': ['Interactive frontend audit playground', 'Try Chaff rule checks on interface code and inspect individual findings.'],
  '/bench': ['Frontend audit benchmarks', 'Explore the Chaff benchmark fixtures, evaluation methodology and recorded results.'],
  '/gate': ['Frontend performance and mobile gates', 'Inspect the budgets Chaff uses to check frontend performance, mobile layouts and motion.'],
} as const;

export function pageMetadata(route: keyof typeof pages): Metadata {
  const [label, description] = pages[route];
  return createPageMetadata(route, label, description);
}

export function createPageMetadata(route: string, label: string, description: string): Metadata {
  const title = route === '/' ? label : label + ' | Chaff';
  const url = new URL(route, siteUrl).href;
  const image = { url: new URL('/opengraph-image', siteUrl).href, width: 1200, height: 630, alt: 'Chaff frontend design protocol for coding agents' };
  return {
    title: { absolute: title }, description,
    alternates: { canonical: url },
    openGraph: { type: 'website', siteName: 'Chaff', url, title, description, images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}
