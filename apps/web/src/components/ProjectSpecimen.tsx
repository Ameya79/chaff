import { useState, type CSSProperties } from 'react';

type Row = { label: string; val: string };
type Props = { id: string; rows: Row[]; accent: string };

function TimberStudy({ plate }: { plate: number }) {
  const bays = [6, 9, 5][plate];
  const rise = [46, 31, 65][plate];
  return <svg className="study-drawing" viewBox="0 0 460 190" aria-label="Axonometric timber frame study" role="img">
    <path d="m28 139 210 38 191-66-208-37Z" fill="#c9c4a9" opacity=".45"/>
    {Array.from({ length: bays }, (_, i) => {
      const x = 78 + i * (215 / bays), y = 124 + i * (37 / bays);
      return <g key={i} transform={`translate(${x} ${y})`} stroke="#284337" strokeLinejoin="round">
        <path d={`M0 0v-43l40 -${rise} 50 9v44l-5 2v-42l-45-8-35 ${rise-4}v39Z`} fill="#b8915d"/>
        <path d={`M0 -43l40 -${rise} 50 9 5-3-55-11L-4 -46Z`} fill="#e9c990"/>
      </g>;
    })}
    <g fill="none" stroke="#657264" strokeWidth=".8"><path d="m69 141 220 39m-221-44 1 10m218 29 1 10M302 157l89-34m-88 30 1 9m86-42 1 8"/></g>
  </svg>;
}

function Synth({ wave }: { wave: number }) {
  const curves = ['M0 24Q12 0 24 24T48 24T72 24T96 24T120 24','M0 34V12h24v24h24V12h24v24h24V12h24','M0 36l24-25v25l24-25v25l24-25v25l24-25v25l24-25'];
  return <svg viewBox="0 0 460 185" className="synth-drawing" role="img" aria-label="Synthesizer faceplate and selected oscillator waveform">
    <path d="m42 46 351-16 30 106-360 21Z" fill="#191e1c"/>
    <g transform="matrix(1,-.05,.19,.94,37,40)">
      <rect width="355" height="118" rx="7" fill="#b7bcb2" stroke="#323931" strokeWidth="2"/>
      <rect x="12" y="11" width="133" height="54" rx="3" fill="#182a23"/>
      <path d="M14 38h128" stroke="#466650" strokeDasharray="2 4"/>
      <path transform="translate(18 15)" d={curves[wave]} fill="none" stroke="#b6ed97" strokeWidth="2.6"/>
      {[173,216,259,302].map((x,i)=><g key={x}><circle cx={x} cy="37" r="15" fill="#737a70"/><circle cx={x-1} cy="34" r="14" fill="#252c26"/><path d={`M${x} 34l${i*4-6} -10`} stroke="#e9eee4" strokeWidth="2"/></g>)}
      {Array.from({length: 16},(_,i)=><rect key={i} x={13+i*20.6} y="79" width="16" height="25" rx="2" fill={i%4===wave?'#e9ae66':'#e3e3ce'} stroke="#777f72"/>)}
    </g>
  </svg>;
}

function Radar({ feed }: { feed: number }) {
  return <svg className="radar-drawing" viewBox="0 0 460 180" role="img" aria-label="Approach scope with selected feed highlighted">
    <g fill="none" stroke="#527668" strokeWidth=".9">{[32,61,89].map(r=><circle key={r} cx="210" cy="96" r={r}/>)}<path d="M45 96h330M210 0v180m-95-162 186 156m-187 0L307 14" strokeDasharray="3 5"/></g>
    <path d="m210 96 81-38a89 89 0 0 1 7 30Z" fill="#9fd7af" opacity=".18"/>
    {['M62 142l63-8 44-39 41 1','M349 31l-53 1-28 43-58 21','M350 144l-55-8-35-32-50-8'].map((d,i)=><path key={d} d={d} fill="none" stroke={i===feed?'#cbf4b1':'#6e8c7c'} strokeWidth={i===feed?3:1.3} strokeDasharray={i===feed?undefined:'4 5'}/>)}
    <circle cx="210" cy="96" r="5" fill="#e4f8c7"/><text x="222" y="114" fill="#d1e8d2" fontFamily="monospace" fontSize="12">KSEA</text>
  </svg>;
}

export function ProjectSpecimen({ id, rows, accent }: Props) {
  const [choice, select] = useState(0);
  const studio = id === 'atelier', instrument = id === 'fieldwork';
  const waveforms = ['Sine', 'Square', 'Saw'];
  const title = studio ? rows[choice].label.replace(/^\d+\s*·\s*/, '') : instrument ? 'Analog matrix' : 'Approach monitor';
  return <article className={'project-specimen specimen-' + id} style={{'--spec-accent':accent} as CSSProperties}>
    <header><strong>{studio?'Norden':instrument?'Fieldwork':'Meridian'}</strong><span>{studio?'Monograph / 2018–2026':instrument?'Batch 03 / Eight voices':'Flight desk / KSEA'}</span></header>
    <div className="specimen-caption"><h3>{title}</h3><span>{studio?rows[choice].val:instrument?'48 kHz modulation':rows[choice].val}</span></div>
    {studio?<TimberStudy plate={choice}/>:instrument?<Synth wave={choice}/>:<Radar feed={choice}/>}
    <div className="specimen-choices" role="group" aria-label={studio?'Select architectural study':instrument?'Select oscillator waveform':'Inspect approach feed'}>
      {rows.map((row,i)=><button key={row.label} type="button" aria-pressed={i===choice} onClick={()=>select(i)}>{studio?row.label.split(' · ')[1]:instrument?waveforms[i]:row.label}</button>)}
    </div>
    <footer>{studio?'Timber structures / Frame studies':instrument?'Optical encoders · USB-C MIDI':'Approach telemetry · 42 sectors'}</footer>
  </article>;
}
