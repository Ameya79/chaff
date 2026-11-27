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
  for (const heading of main.querySelectorAll('h1, h2, h3')) {
    if (!heading.getClientRects().length) continue;
    const style = getComputedStyle(heading);
    const clips = value => ['hidden', 'clip'].includes(value);
    if ((clips(style.overflowX) && heading.scrollWidth > heading.clientWidth + 1) ||
        (clips(style.overflowY) && heading.scrollHeight > heading.clientHeight + 1)) {
      findings.push({ issue: 'clipped-heading', text: heading.textContent.trim().slice(0, 80) });
    }
  }
  for (const button of main.querySelectorAll('button')) {
    const closed = button.closest('details:not([open])');
    if (closed && !closed.querySelector(':scope > summary')?.contains(button)) continue;
    if (!button.getClientRects().length || button.closest('[aria-hidden="true"], [inert]')) continue;
    const referenced = (button.getAttribute('aria-labelledby') || '').split(/\s+/)
      .some(id => document.getElementById(id)?.textContent.trim());
    const descendantName = [...button.querySelectorAll('img[alt], svg title, [aria-label]')]
      .some(node => (node.getAttribute('alt') || node.getAttribute('aria-label') || node.textContent).trim());
    if (!(button.innerText.trim() || button.getAttribute('aria-label')?.trim() ||
          button.title.trim() || referenced || descendantName ||
          [...button.labels || []].some(label => label.textContent.trim()))) {
      findings.push({ issue: 'check-button-name', html: button.outerHTML.slice(0, 140) });
    }
  }
  for (const image of main.querySelectorAll('img')) {
    if (image.getClientRects().length && image.complete && image.currentSrc && !image.naturalWidth)
      findings.push({ issue: 'broken-image', alt: image.alt });
  }
  return { viewport, heading: headings[0]?.textContent?.trim(), findings };
})()
