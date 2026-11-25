import type { Metadata } from 'next';
import { Fraunces } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  axes: ['opsz', 'SOFT'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://chaff.dev'),
  title: {
    default: 'Chaff — Design Audit & Level 3 Enforcement Toolkit',
    template: '%s | Chaff',
  },
  description:
    'Chaff audits rendered UI against 72 rules, locks intentional brand tokens, enforces three creative contracts, and fails the pull request when performance degrades.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
  },
  openGraph: {
    title: 'Chaff — Keep the grain. Winnow the slop.',
    description:
      'Autonomous design audit and level enforcement toolkit preserving authored brand craft and strict Core Web Vitals budgets.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chaff — Design Audit & Level 3 Enforcement Toolkit',
    description:
      'Audit rendered pages, preserve brand identity locks, and gate CI on 320px overflow and WebGL performance budgets.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('chaff-theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-dvh flex flex-col font-sans bg-[var(--bg-canvas)] text-[var(--text-main)] selection:bg-[var(--accent-ember)] selection:text-[var(--btn-primary-text)]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] btn primary text-xs"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1 min-w-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
