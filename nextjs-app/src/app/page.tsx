import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="text-3xl">🎵</span>
          Music Bingo
        </div>
        <Link
          href="/login"
          className="bg-white text-purple-900 font-semibold px-5 py-2 rounded-full text-sm hover:bg-purple-100 transition-colors"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-32">
        <div className="inline-block bg-purple-500/20 border border-purple-400/30 text-purple-200 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          Generate bingo cards from any Spotify playlist
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight max-w-3xl mb-6">
          Make every song a{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            winning moment
          </span>
        </h1>

        <p className="text-lg md:text-xl text-purple-200 max-w-2xl mb-10 leading-relaxed">
          Upload your Spotify playlist export and instantly generate printable
          music bingo cards for your party, quiz night, or classroom.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/login"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-full text-lg shadow-lg shadow-purple-900/50 transition-all hover:scale-105"
          >
            Get Started Free
          </Link>
          <a
            href="#how-it-works"
            className="border border-purple-400/50 hover:border-purple-300 text-purple-200 hover:text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors"
          >
            How It Works
          </a>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="bg-black/30 backdrop-blur-sm py-24 px-6"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            How It Works
          </h2>
          <p className="text-purple-200 text-center mb-16 max-w-xl mx-auto">
            Three simple steps to bingo glory
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-lg font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Everything you need
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4 items-start">
              <span className="text-2xl mt-0.5">{f.icon}</span>
              <div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-purple-200 text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 border border-purple-400/30 rounded-3xl max-w-2xl mx-auto p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to play?</h2>
          <p className="text-purple-200 mb-8">
            Sign in and generate your first set of bingo cards in seconds.
          </p>
          <Link
            href="/login"
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold px-10 py-4 rounded-full text-lg transition-all hover:scale-105"
          >
            Start Generating
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-purple-300 text-sm">
        <p>Music Bingo Generator &mdash; Built for fun, powered by Spotify exports</p>
      </footer>
    </main>
  );
}

const steps = [
  {
    number: "1",
    title: "Export your playlist",
    description:
      "Go to exportify.net, connect your Spotify account, and export any playlist as a CSV file.",
  },
  {
    number: "2",
    title: "Upload & configure",
    description:
      "Upload the CSV, choose how many cards to generate, set the grid size, and pick display options.",
  },
  {
    number: "3",
    title: "Print & play",
    description:
      "Download or print the generated bingo cards. Each card is unique — no two are the same!",
  },
];

const features = [
  {
    icon: "🎲",
    title: "Unique cards every time",
    desc: "Every card has a randomly selected, non-overlapping set of songs.",
  },
  {
    icon: "⚙️",
    title: "Fully configurable",
    desc: "Set the number of cards, grid size, pool size, and display mode.",
  },
  {
    icon: "🎤",
    title: "Artist or song mode",
    desc: "Show artist names, song titles, or both — your choice.",
  },
  {
    icon: "🖨️",
    title: "Print ready",
    desc: "Clean card layout designed for printing on standard paper.",
  },
  {
    icon: "📂",
    title: "CSV upload",
    desc: "Works with Exportify CSV exports from Spotify playlists.",
  },
  {
    icon: "🔒",
    title: "Password protected",
    desc: "Keep your generator private with simple login credentials.",
  },
];
