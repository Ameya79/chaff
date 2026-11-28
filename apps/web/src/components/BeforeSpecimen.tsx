interface MarketingCopy {
  pill: string;
  headline: string;
  subhead: string;
  primaryCta: string;
  cards: { title: string; body: string }[];
}

export function BeforeSpecimen({ id, name, copy }: { id: string; name: string; copy: MarketingCopy }) {
  if (id === 'atelier') {
    return <article className="before-portfolio">
      <header>{name}<span>Architecture studio</span></header>
      <h3>{copy.headline}</h3>
      <div className="portfolio-contact-sheet" aria-hidden="true">
        {['A', 'B', 'C'].map(letter => <div key={letter}><i /><b>{letter}</b></div>)}
      </div>
      <p>{copy.subhead}</p>
    </article>;
  }
  if (id === 'fieldwork') {
    return <article className="before-store">
      <header>{name}<span>Hardware store</span></header>
      <div className="store-ad"><small>{copy.pill}</small><h3>{copy.headline}</h3>
        <div className="ad-burst" aria-hidden="true">FX</div>
        <span className="mock-buy">{copy.primaryCta}</span>
      </div>
      <footer>{copy.cards.map(card => <span key={card.title}>{card.title}</span>)}</footer>
    </article>;
  }
  return <article className="before-console">
    <header>{name}<span>Platform overview</span></header>
    <div className="console-body"><aside aria-hidden="true">Overview<br />Sensors<br />Reports</aside>
      <div><small>{copy.pill}</small><h3>{copy.headline}</h3>
        {copy.cards.map(card => <div className="console-summary" key={card.title}><i aria-hidden="true" /><strong>{card.title}</strong><span>{card.body}</span></div>)}
      </div>
    </div>
  </article>;
}
