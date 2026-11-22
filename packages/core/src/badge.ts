export function generateScoreBadgeSvg(score: number): string {
  const boundedScore = Math.max(0, Math.min(100, Math.round(score)));
  
  // Color tokens matching the winnowing floor
  let badgeColor = '#2d6a4f'; // Sage pass (>= 90)
  let statusText = `${boundedScore} / 100`;

  if (boundedScore < 70) {
    badgeColor = '#c2410c'; // Ember fail (< 70)
  } else if (boundedScore < 90) {
    badgeColor = '#b45309'; // Amber warn (70-89)
  }

  const leftLabel = 'chaff';
  const rightLabel = statusText;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="132" height="20" role="img" aria-label="chaff: ${statusText}">
  <title>chaff: ${statusText}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="132" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="52" height="20" fill="#1c1917"/>
    <rect x="52" width="80" height="20" fill="${badgeColor}"/>
    <rect width="132" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="270" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="340">${leftLabel}</text>
    <text x="270" y="140" transform="scale(.1)" fill="#fff" textLength="340">${leftLabel}</text>
    <text aria-hidden="true" x="910" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="620">${rightLabel}</text>
    <text x="910" y="140" transform="scale(.1)" fill="#fff" textLength="620">${rightLabel}</text>
  </g>
</svg>`;
}
