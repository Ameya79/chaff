(async () => {
  await document.fonts.ready;
  const root = document.documentElement;
  const viewport = root.clientWidth;
  const main = document.querySelector('main') || document.body;
  const headings = [...main.querySelectorAll('h1')].filter(node => node.getClientRects().length);
  const findings = [];
  if (headings.length !== 1) findings.push({ issue: 'primary-heading-count', count: headings.length });
  if (root.scrollWidth > viewport + 1) {
    const elements = [...main.querySelectorAll('*')].filter(node => {
      const bounds = node.getBoundingClientRect();
      return bounds.width && bounds.right > viewport + 1;
    });
    findings.push({ issue: 'horizontal-overflow', pixels: root.scrollWidth - viewport,
      candidates: elements.slice(0, 6).map(node => node.tagName.toLowerCase() + (node.id ? '#' + node.id : '')) });
  }
  for (const image of main.querySelectorAll('img')) {
    if (image.getClientRects().length && image.complete && image.currentSrc && !image.naturalWidth)
      findings.push({ issue: 'broken-image', alt: image.alt });
  }
  return { viewport, heading: headings[0]?.textContent?.trim(), findings };
})()
