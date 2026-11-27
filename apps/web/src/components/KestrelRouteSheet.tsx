import { useState, type CSSProperties } from 'react';

interface RouteSheetProps {
  venues: { label: string; val: string }[];
  accent: string;
  median: string;
  summary: string;
}

export function KestrelRouteSheet({ venues, accent, median, summary }: RouteSheetProps) {
  const [selected, setSelected] = useState(0);
  const paths = [
    'M49 112H126Q140 112 151 99L208 38Q218 27 233 27H365',
    'M49 112H196Q208 112 220 99L237 81Q248 70 265 70H365',
    'M49 112H365',
  ];
  return (
    <article className="route-sheet" style={{ '--route-ink': accent } as CSSProperties}>
      <header className="route-mast">
        <strong>Kestrel</strong><span>Order router / US-East</span>
      </header>
      <div className="route-summary">
        <div><h3>Execution map</h3><p>Spot orders across 14 venues</p></div>
        <div className="route-median"><span>Median hop</span><strong>{median}</strong></div>
      </div>
      <figure className="route-figure">
        <svg viewBox="0 0 500 152" role="img" aria-label={'US-East router to ' + venues[selected].label + ', ' + venues[selected].val}>
          <defs>
            <pattern id="route-dots" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".8" fill="#bdb8b0" /></pattern>
          </defs>
          <rect width="500" height="152" fill="url(#route-dots)" />
          {venues.map((venue, i) => (
            <g key={venue.label}>
              <path d={paths[i]} fill="none" stroke="#b0aaa3" strokeWidth="2" />
              <text x="381" y={32 + i * 43} fill="#242222" fontSize="13" fontFamily="monospace">{venue.label}</text>
            </g>
          ))}
          <path d={paths[selected]} fill="none" stroke="var(--route-ink)" strokeWidth="5" />
          {venues.map((venue, i) => <circle key={venue.label} cx="365" cy={27 + i * 43} r="5" fill={selected === i ? 'var(--route-ink)' : '#fff'} stroke="#302f31" strokeWidth="2" />)}
          <path d="m49 102 10 10-10 10-10-10Z" fill="#202022" />
          <text x="26" y="140" fontSize="12" fill="#242222" fontFamily="monospace">US-EAST</text>
        </svg>
      </figure>
      <div className="route-stops" role="group" aria-label="Inspect venue">
        {venues.map((venue, i) => <button key={venue.label} type="button" aria-pressed={selected === i} onClick={() => setSelected(i)}>
          <span>{venue.label}</span><strong>{venue.val}</strong>
        </button>)}
      </div>
      <footer>{summary}</footer>
    </article>
  );
}
