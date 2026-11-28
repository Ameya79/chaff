import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCachedRules } from '../../../lib/rules-loader';
import { createPageMetadata } from '../../../lib/discovery';

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getCachedRules()).map(rule => ({ id: rule.id.toLowerCase() }));
}

async function findRule(id: string) {
  const rule = (await getCachedRules()).find(item => item.id.toLowerCase() === id);
  if (!rule) notFound();
  return rule;
}

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props) {
  const rule = await findRule(params.id);
  return createPageMetadata('/rules/' + params.id, rule.id + ': ' + rule.title, rule.why);
}

export default async function RulePage({ params }: Props) {
  const rule = await findRule(params.id);
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <Link className="underline" href="/rules">All frontend rules</Link>
      <header className="space-y-3">
        <p className="font-mono text-sm">{rule.id} / {rule.category}</p>
        <h1 className="font-display">{rule.title}</h1>
        <p>{rule.why}</p>
      </header>
      {[[ 'Pattern to fix', rule.bad ], [ 'Preferred pattern', rule.good ]].map(([label, example]) => (
        <section key={label}><h2 className="text-xl mb-2">{label}</h2><pre className="p-4 bg-[var(--bg-surface)] overflow-auto"><code>{example}</code></pre></section>
      ))}
      <section><h2 className="text-xl mb-2">Verification</h2><p className="whitespace-pre-line">{rule.verification}</p></section>
      <a className="underline" href={'https://github.com/Ameya79/chaff/blob/main/rules/' + rule.category + '/' + rule.id + '.md'}>Read the full specification on GitHub</a>
    </article>
  );
}
