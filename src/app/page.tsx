import { HomeForm } from "@/components/HomeForm";

export default function HomePage() {
  return (
    <main className="relative isolate flex min-h-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="relative z-10 flex justify-center border-b border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
            Right
          </span>
          <span className="relative -top-0.5 mx-0.5 font-bold text-slate-100">
            |
          </span>
          <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
            front
          </span>
        </h1>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h2 className="mb-4 leading-tight drop-shadow">
          <span className="mb-2 block text-xl font-semibold text-slate-100 md:text-2xl">
            Send users to the
          </span>

          <span className="block text-6xl font-extrabold tracking-tight md:text-7xl">
            <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
              Right
            </span>{" "}
            <span className="font-bold text-slate-100">App Store</span>
            <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
              front
            </span>
          </span>

          <span className="mt-6 block text-2xl font-semibold tracking-tight text-slate-100/90 md:text-3xl">
            Every time, in every country.
          </span>
        </h2>
        <p
          className="mt-6 mb-10 max-w-3xl text-lg text-slate-200/80"
          style={{ textWrap: "balance" }}
        >
          A geo-aware link that routes each user to the correct{" "}
          <span className="font-semibold text-slate-100">App Store</span> or{" "}
          <span className="font-semibold text-slate-100">Play Store</span> for
          their country or region. Stop losing installs to{" "}
          <span className="font-semibold text-sky-200">“Not Available”</span>{" "}
          pages.
        </p>

        <HomeForm />
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-6 text-center text-sm text-slate-400">
        <p className="leading-relaxed">
          <span className="opacity-80">© {new Date().getFullYear()} </span>
          <span className="font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
              Right
            </span>
            <span className="relative -top-0.25 mx-0.5 font-bold text-slate-100">
              |
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
              front
            </span>
          </span>
          <span className="opacity-80">
            {" "}
            — geo-aware store links that land right, every time.
          </span>
        </p>
      </footer>
    </main>
  );
}
