import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700" rel="stylesheet" />
      </Head>
      <main>
        <h1>Legacy Pages App</h1>
        <img src="/static/hero.png" />
      </main>
    </div>
  );
}
