import type { Metadata } from 'next';
import './globals.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'Chaff — Design Audit & Level Enforcement Toolkit',
  description:
    'Chaff audits the page as it renders, locks what is yours, ships the runtime for risky 3D, and fails the pull request when the page gets slow.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <Header />
        <main id="main-content" className="min-h-[calc(100dvh-18rem)]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
