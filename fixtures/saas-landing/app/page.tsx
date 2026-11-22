export default function HeroPage() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex flex-col items-center justify-center p-8 hero">
      <h1 className="text-5xl font-bold text-center">
        Delve into our cutting-edge revolutionary platform
      </h1>
      <p className="text-xl mt-4 text-center">
        Streamline and supercharge your team with 99.9% uptime and 10,000+ happy teams.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-5xl">
        <div className="p-6 bg-white/10 rounded-lg">Card 1</div>
        <div className="p-6 bg-white/10 rounded-lg">Card 2</div>
        <div className="p-6 bg-white/10 rounded-lg">Card 3</div>
      </div>
    </main>
  );
}
