// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/medibridge-bg.jpg')" }}
    >
      {/* Light overlay over the background */}
      <div className="min-h-screen bg-white/50">
        {/* Navbar */}
        <header className="w-full border-b bg-white/80 backdrop-blur">
          <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-sky-700">MediBridge</span>
            </div>

            <div className="hidden md:flex items-center gap-6 text-sm">
              <a
                href="#how-it-works"
                className="text-slate-600 hover:text-slate-900"
              >
                How it works
              </a>
              <a href="#roles" className="text-slate-600 hover:text-slate-900">
                Roles
              </a>
            </div>
          </nav>
        </header>

        {/* Hero content (no per-section bg now) */}
        <section className="flex-1 flex flex-col md:flex-row items-center justify-center gap-10 px-8 py-12">
          <div className="max-w-xl space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Match healthcare supplies and blood with the clinics that need them
              most.
            </h1>
            <p className="text-slate-700">
              Reduce shortages and waste by connecting donors, NGOs and
              healthcare facilities on a single transparent platform.
            </p>
          </div>

          {/* Clickable role cards */}
          <div id="roles" className="grid gap-4 w-full max-w-md">
            {/* Donor card */}
            <Link
              href="/donor/login"
              className="rounded-2xl border bg-white/90 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Donor</h2>
                <span className="text-xs px-2 py-1 rounded-full bg-sky-100 text-sky-700">
                  Individuals / Organizations
                </span>
              </div>
              <p className="text-sm text-slate-700">
                Donate blood units or medical equipment and track how your
                contribution is used.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                  Real-time needs
                </span>
                <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                  Pickup scheduling
                </span>
                <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                  Impact tracking
                </span>
              </div>
            </Link>

            {/* NGO card */}
            <Link
              href="/ngo/login"
              className="rounded-2xl border bg-white/90 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">
                  NGO / MediBridge Team
                </h2>
                <span className="text-xs px-2 py-1 rounded-full bg-violet-100 text-violet-700">
                  Coordinators
                </span>
              </div>
              <p className="text-sm text-slate-700">
                Verify requests, route donations, and ensure transparent, fair
                distribution of resources.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-violet-50 text-violet-700">
                  Verification
                </span>
                <span className="px-2 py-1 rounded-full bg-violet-50 text-violet-700">
                  Matching engine
                </span>
                <span className="px-2 py-1 rounded-full bg-violet-50 text-violet-700">
                  Reports
                </span>
              </div>
            </Link>

            {/* Clinic card */}
            <Link
              href="/clinic/login"
              className="rounded-2xl border bg-white/90 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">
                  Clinics / Hospitals
                </h2>
                <span className="text-xs px-2 py-1 rounded-full bg-rose-100 text-rose-700">
                  Requesters
                </span>
              </div>
              <p className="text-sm text-slate-700">
                Post urgent needs for blood units, medicines, or equipment and
                receive matched donations.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-rose-50 text-rose-700">
                  Priority scoring
                </span>
                <span className="px-2 py-1 rounded-full bg-rose-50 text-rose-700">
                  Stock overview
                </span>
                <span className="px-2 py-1 rounded-full bg-rose-50 text-rose-700">
                  Delivery status
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* How it works section */}
        <section
          id="how-it-works"
          className="bg-white/95 border-t py-10 px-6 flex justify-center"
        >
          <ol className="max-w-4xl grid gap-6 md:grid-cols-3 text-sm text-slate-700">
            <li>
              <h3 className="font-semibold text-slate-900 mb-1">
                1. Post or view needs
              </h3>
              <p>
                Clinics list their shortages, and donors see a live dashboard of
                what is required most.
              </p>
            </li>
            <li>
              <h3 className="font-semibold text-slate-900 mb-1">
                2. Smart matching
              </h3>
              <p>
                The platform matches available donors and supplies with the
                closest, highest-priority requests.
              </p>
            </li>
            <li>
              <h3 className="font-semibold text-slate-900 mb-1">
                3. Track deliveries
              </h3>
              <p>
                NGOs coordinate pickup and delivery while everyone tracks status
                and impact in real time.
              </p>
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}
