import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-canvas)',
        surface: 'var(--bg-surface)',
        'surface-elevated': 'var(--bg-surface-elevated)',
        inset: 'var(--bg-inset)',
        main: 'var(--text-main)',
        dim: 'var(--text-dim)',
        'border-line': 'var(--border-line)',
        'border-control': 'var(--border-control)',
        ember: 'var(--accent-ember)',
        'ember-soft': 'var(--accent-ember-soft)',
        sage: 'var(--status-sage)',
        'sage-soft': 'var(--status-sage-soft)',
        warn: 'var(--status-warn)',
        'brand-violet': 'var(--brand-violet)',
        'brand-violet-soft': 'var(--brand-violet-soft)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['var(--font-display)', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
