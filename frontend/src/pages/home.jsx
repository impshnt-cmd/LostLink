import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">

      {/* ================= BACKGROUND ================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-3xl" />

        <div className="absolute right-[-180px] top-20 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-3xl" />

        <div className="absolute bottom-[-200px] left-[30%] h-[500px] w-[500px] rounded-full bg-fuchsia-600/15 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ================= HERO ================= */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 lg:px-10 lg:pb-28 lg:pt-24">

        <div className="grid items-center gap-14 lg:grid-cols-2">

          {/* LEFT */}
          <div>

            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs font-bold tracking-wide text-violet-200 backdrop-blur-xl">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.9)]" />
              AI POWERED LOST & FOUND PLATFORM
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">

              Find what
              <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                you lost.
              </span>

              <span className="block">
                Return what
              </span>

              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                you found.
              </span>

            </h1>

            {/* Description */}
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
              LostLink helps people report, discover and reconnect with
              lost belongings through a simple community-driven platform.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <Link
                to="/create-lost"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-900/25 transition duration-300 hover:-translate-y-1 hover:from-violet-500 hover:to-indigo-500"
              >
                🔎 Report Lost Item
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                to="/create-found"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-6 py-3.5 text-sm font-bold text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.1]"
              >
                🤝 Report Found Item
              </Link>

            </div>

            {/* Trust line */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-500">
              <span>✓ Simple reporting</span>
              <span>✓ Community driven</span>
              <span>✓ Fast discovery</span>
            </div>

          </div>

          {/* RIGHT VISUAL */}
          <div className="relative">

            {/* Glow */}
            <div className="absolute inset-10 rounded-full bg-violet-600/20 blur-3xl" />

            {/* Main Card */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-violet-950/30 backdrop-blur-2xl sm:p-7">

              {/* Card Header */}
              <div className="mb-5 flex items-center justify-between">

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
                    LostLink
                  </p>

                  <h3 className="mt-1 text-xl font-black">
                    Smart Item Discovery
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
                  ✨
                </div>

              </div>

              {/* Search */}
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3">

                  <span className="text-lg">🔍</span>

                  <span className="text-sm text-slate-500">
                    Search lost items...
                  </span>

                </div>

              </div>

              {/* Item Cards */}
              <div className="mt-5 space-y-3">

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4 transition hover:bg-white/[0.07]">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-2xl">
                    👛
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white">
                      Black Wallet
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      College • Yesterday
                    </p>
                  </div>

                  <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-bold text-red-300">
                    LOST
                  </span>

                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4 transition hover:bg-white/[0.07]">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-2xl">
                    🎧
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white">
                      Wireless Earbuds
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Library • 2 days ago
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                    FOUND
                  </span>

                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4 transition hover:bg-white/[0.07]">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 text-2xl">
                    🎒
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white">
                      Blue Backpack
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Campus • Today
                    </p>
                  </div>

                  <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-bold text-red-300">
                    LOST
                  </span>

                </div>

              </div>

              {/* Bottom */}
              <div className="mt-5 flex items-center justify-between rounded-2xl border border-violet-400/10 bg-violet-500/[0.06] px-4 py-3">

                <span className="text-xs text-slate-400">
                  Community is helping...
                </span>

                <span className="text-xs font-bold text-violet-300">
                  Live
                </span>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

          {[
            ["01", "Simple Reporting"],
            ["02", "Smart Discovery"],
            ["03", "Community Help"],
            ["04", "Easy Recovery"],
          ].map(([number, title]) => (
            <div
              key={number}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.06]"
            >
              <p className="text-xs font-black text-violet-400">
                {number}
              </p>

              <p className="mt-2 text-sm font-bold text-slate-200">
                {title}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10">

        <div className="mb-10 max-w-2xl">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
            How it works
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Simple steps.
            <span className="text-slate-500">
              {" "}Real connections.
            </span>
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-400 sm:text-base">
            LostLink makes the entire lost-and-found process simple,
            transparent and community driven.
          </p>

        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          {[
            {
              icon: "📝",
              number: "01",
              title: "Report",
              text: "Create a detailed lost or found item report.",
            },
            {
              icon: "🔎",
              number: "02",
              title: "Discover",
              text: "Browse reported items and find possible matches.",
            },
            {
              icon: "🤝",
              number: "03",
              title: "Connect",
              text: "Use item information to connect with the community.",
            },
            {
              icon: "❤️",
              number: "04",
              title: "Return",
              text: "Help belongings find their way back home.",
            },
          ].map((step) => (
            <div
              key={step.number}
              className="group rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-white/[0.055]"
            >

              <div className="flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-2xl">
                  {step.icon}
                </div>

                <span className="text-xs font-black text-slate-600">
                  {step.number}
                </span>

              </div>

              <h3 className="mt-6 text-lg font-black">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {step.text}
              </p>

            </div>
          ))}

        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="relative z-10 border-y border-white/10 bg-white/[0.02]">

        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                Built for people
              </p>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                More than a lost & found board.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                LostLink brings reporting, discovery, item details and
                community interaction together in one modern platform.
              </p>

            </div>

            <div className="grid gap-3 sm:grid-cols-2">

              {[
                ["⚡", "Fast", "Quickly report and browse items."],
                ["🔐", "Secure", "Protected user accounts and routes."],
                ["🧠", "Smart", "Designed for intelligent item discovery."],
                ["🌎", "Community", "Everyone can help return what matters."],
              ].map(([icon, title, text]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl"
                >
                  <div className="text-2xl">
                    {icon}
                  </div>

                  <h3 className="mt-3 font-black">
                    {title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {text}
                  </p>
                </div>
              ))}

            </div>

          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">

        <div className="relative overflow-hidden rounded-[2rem] border border-violet-400/15 bg-gradient-to-r from-violet-600/20 via-indigo-600/15 to-cyan-500/10 p-8 text-center sm:p-12">

          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
              Start with LostLink
            </p>

            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-black sm:text-4xl">
              Someone may have found what you're looking for.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400">
              Report your item or explore the community and help make
              someone's day a little better.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

              <Link
                to="/dashboard"
                className="rounded-xl bg-white px-6 py-3.5 text-sm font-black text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Explore Dashboard →
              </Link>

              <Link
                to="/create-lost"
                className="rounded-xl border border-white/10 bg-white/[0.06] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/[0.1]"
              >
                Report Lost Item
              </Link>

            </div>

          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 border-t border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-center sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:text-left lg:px-10">

          <div>
            <p className="font-black">
              Lost<span className="text-violet-400">Link</span>
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Find what you lost. Return what you found.
            </p>
          </div>

          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} LostLink. Built for the community.
          </p>

        </div>

      </footer>

    </div>
  );
};

export default Home;