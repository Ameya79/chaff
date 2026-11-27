import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-jakarta',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://chaff.dev'),
  title: {
    default: 'Chaff — Paste the repo. Keep what is yours.',
    template: '%s · Chaff',
  },
  description:
    'Give your coding agent one GitHub link to build and verify a frontend using real visual references.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://chaff.dev',
    siteName: 'Chaff',
    title: 'Chaff — Paste the repo. Keep what is yours.',
    description:
      'Give your coding agent one GitHub link to build and verify a frontend using real visual references.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chaff — Paste the repo. Keep what is yours.',
    description:
      'Give your coding agent one GitHub link to build and verify a frontend using real visual references.',
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
      data-theme="light"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('chaff-theme');var t=s==='dark'?'dark':'light';document.documentElement.setAttribute('data-theme',t);if(t==='dark'){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-dvh flex flex-col font-sans bg-[var(--bg-canvas)] text-[var(--text-main)] selection:bg-[var(--accent)] selection:text-[var(--btn-accent-text)]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-[var(--btn-accent-text)] focus:rounded-[4px] font-mono text-xs"
        >
          Skip to main content
        </a>

        <Header />

        <main id="main-content" className="flex-1 w-full min-w-0">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
