import type { ReactNode } from 'react';

const prints: Record<string, ReactNode> = {
  ui: <><path d="M24 18h132v60H24zM78 18v60m-54-40h132m-48 0v40" /><path d="M28 22h46v12H28z" fill="currentColor" /></>,
  copy: <><text x="22" y="69" fontFamily="Georgia,serif" fontStyle="italic" fontSize="68" fill="currentColor" stroke="none">Aa</text><path d="M17 70h144m-58-35h52m-52 11h38m-38 11h46" /></>,
  code: <><path d="M30 22h47v22h49v24h24M77 44v25h23" />{[[30,22],[77,44],[150,68],[100,69]].map(([x,y])=><circle key={x} cx={x} cy={y} r="5" fill="currentColor" />)}</>,
  perf: <><path d="M24 71h134M30 65a59 59 0 0 1 118 0m-109-8 8 2m8-29 5 6m29-18v10m33 2-6 7m24 17-8 3" /><path d="m85 68 46-34-38 42Z" fill="currentColor" /></>,
  mobile: <><rect x="57" y="9" width="49" height="76" rx="6" /><path d="M64 23h35v45H64zM76 77h11m31-54v45m-4-41 4-4 4 4m-8 37 4 4 4-4" /></>,
  a11y: <><path d="M20 49q68-73 140 0-70 66-140 0Z" /><circle cx="90" cy="47" r="22" /><circle cx="90" cy="47" r="10" fill="currentColor" /></>,
  motion: <><path strokeDasharray="3 4" d="M25 71V22h130v49" /><path d="M25 70c56 0 40-48 91-48h39" /><circle className="curve-tracer" cx="25" cy="70" r="5" fill="currentColor" /><circle cx="155" cy="22" r="5" fill="currentColor" /></>,
  three: <><path d="m90 9 44 23v40L90 91 46 69V32Zm0 0v41m44-18L90 54 46 32m44 22v37" /><path strokeDasharray="3 4" d="m46 69 44-19 44 22" /></>,
};

export function DomainPrint({ category }: { category: string }) {
  return <svg viewBox="0 0 180 96" aria-hidden="true" className="domain-print" data-domain={category} fill="none" stroke="currentColor" strokeWidth="1.75">{prints[category]}</svg>;
}
