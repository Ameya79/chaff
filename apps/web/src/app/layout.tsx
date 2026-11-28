import { siteUrl, repository, pages } from '../lib/discovery';
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

export const metadata = { metadataBase: siteUrl };

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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "SoftwareSourceCode", name: "Chaff",
          description: pages["/"][1], url: siteUrl.href, codeRepository: repository, maintainer: { "@type": "Person", name: "Ameya Kulkarni", url: "https://github.com/Ameya79", sameAs: ["https://www.linkedin.com/in/ameya-kulkarni-a31b74246"] }, programmingLanguage: "TypeScript",
        }).replace(/</g, "\\u003c") }} />
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
