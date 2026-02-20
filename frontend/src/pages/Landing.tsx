import { Link } from "react-router-dom";
import { ArrowRight, Zap, Users, BarChart3, Sparkles, Globe, Shield } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white border-b border-ink-100">
        <div className="max-w-6xl mx-auto px-6 flex justify-between h-16 items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-display font-bold text-base">N</span>
            </div>
            <span className="font-display font-bold text-ink-900 text-xl tracking-tight">
              nep<span className="text-accent">launch</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-5 py-2.5 text-base font-medium text-ink-500 hover:text-ink-900 transition">
              Log in
            </Link>
            <Link to="/register" className="px-5 py-2.5 text-base font-medium bg-accent text-white rounded-lg hover:bg-accent-dark transition">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-muted rounded-full mb-8">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent-dark">AI-powered matching for Nepal's ecosystem</span>
          </div>

          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-ink-900 leading-[1.08] mb-8 tracking-tight">
            Where Nepal's startups
            <br />
            <span className="text-accent">find their people</span>
          </h1>

          <p className="text-xl sm:text-2xl text-ink-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            The intelligent platform connecting founders with the right talent and investors.
            One engine. Three perspectives. Zero guesswork.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-accent text-white rounded-xl font-semibold text-lg hover:bg-accent-dark transition"
            >
              Start building <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 px-8 py-4 text-ink-500 font-medium text-lg hover:text-ink-700 transition"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Visual */}
        <div className="max-w-4xl mx-auto mt-20">
          <div className="bg-surface-1 rounded-2xl border border-ink-100 p-10">
            <div className="grid grid-cols-3 gap-6">
              {/* Founder card */}
              <div className="bg-white rounded-xl p-6 border border-ink-100">
                <div className="w-11 h-11 rounded-lg bg-accent-muted flex items-center justify-center mb-4">
                  <Zap className="h-5 w-5 text-accent" />
                </div>
                <p className="text-base font-bold text-ink-900 mb-1">PaySewa</p>
                <p className="text-sm text-ink-400 mb-4">Fintech · MVP stage</p>
                <div className="flex gap-1.5">
                  <span className="px-2 py-1 bg-success-light text-success text-xs font-medium rounded">React</span>
                  <span className="px-2 py-1 bg-success-light text-success text-xs font-medium rounded">Python</span>
                  <span className="px-2 py-1 bg-surface-2 text-ink-400 text-xs font-medium rounded">+2</span>
                </div>
              </div>

              {/* Center matching visual */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mb-4">
                  <Sparkles className="h-9 w-9 text-white" />
                </div>
                <p className="text-xs font-bold text-ink-900 uppercase tracking-widest mb-1">Match engine</p>
                <p className="text-sm text-ink-400">60% skill · 40% semantic</p>
                <div className="flex gap-1.5 mt-4">
                  <div className="w-10 h-1.5 bg-accent rounded-full" />
                  <div className="w-10 h-1.5 bg-ink-200 rounded-full" />
                </div>
              </div>

              {/* Talent card */}
              <div className="bg-white rounded-xl p-6 border border-ink-100">
                <div className="w-11 h-11 rounded-lg bg-success-light flex items-center justify-center mb-4">
                  <Users className="h-5 w-5 text-success" />
                </div>
                <p className="text-base font-bold text-ink-900 mb-1">Suman T.</p>
                <p className="text-sm text-ink-400 mb-4">Full-stack · TU '25</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-surface-2 rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: "85%" }} />
                  </div>
                  <span className="text-sm font-bold text-success">85%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three sides */}
      <section id="how" className="py-24 px-6 bg-surface-1">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-accent uppercase tracking-widest mb-3">Three sides, one platform</p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-ink-900">Built for every role in the ecosystem</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-8 border border-ink-100 hover:border-ink-200 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent-muted flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-display font-bold text-xl text-ink-900 mb-3">Founders</h3>
              <p className="text-base text-ink-500 leading-relaxed mb-6">
                Post roles, get ranked talent matches with skill overlap scores, and connect with thesis-aligned investors.
              </p>
              <ul className="space-y-3">
                {["Smart talent matching", "AI Pitch Co-Pilot", "Team gap analysis", "Investor matching"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-ink-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 border border-ink-100 hover:border-ink-200 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-success-light flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-display font-bold text-xl text-ink-900 mb-3">Talent</h3>
              <p className="text-base text-ink-500 leading-relaxed mb-6">
                Build your skill profile, see exactly which skills match each role, and find your path into startups.
              </p>
              <ul className="space-y-3">
                {["Visual match scores", "Opportunity browser", "Co-founder matching", "Skill badge system"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-ink-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 border border-ink-100 hover:border-ink-200 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-warn-light flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-warn" />
              </div>
              <h3 className="font-display font-bold text-xl text-ink-900 mb-3">Investors</h3>
              <p className="text-base text-ink-500 leading-relaxed mb-6">
                Receive curated deal flow matched to your thesis, stage, and check size. No manual filtering.
              </p>
              <ul className="space-y-3">
                {["Thesis-aligned deals", "Team quality signals", "Diaspora network", "Portfolio tracker"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-ink-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-warn shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-10 text-center">
            <div>
              <div className="w-12 h-12 rounded-lg bg-surface-2 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <p className="text-lg font-semibold text-ink-900 mb-1">Hybrid AI matching</p>
              <p className="text-base text-ink-400">60% skill overlap + 40% semantic embeddings</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-lg bg-surface-2 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-accent" />
              </div>
              <p className="text-lg font-semibold text-ink-900 mb-1">Nepal-first</p>
              <p className="text-base text-ink-400">Built for the Nepali startup ecosystem</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-lg bg-surface-2 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <p className="text-lg font-semibold text-ink-900 mb-1">Private by default</p>
              <p className="text-base text-ink-400">Your data stays yours. Connect on your terms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-ink-900 mb-5">Ready to launch?</h2>
          <p className="text-xl text-ink-500 mb-10">Join the platform that's building the connective tissue Nepal's startup ecosystem needs.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2.5 px-10 py-4 bg-accent text-white rounded-xl font-semibold text-lg hover:bg-accent-dark transition"
          >
            Create your profile <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-100 py-10 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
              <span className="text-white font-display font-bold text-xs">N</span>
            </div>
            <span className="text-sm text-ink-400">NepLaunch</span>
          </div>
          <p className="text-sm text-ink-300">Built for Nepal's builders</p>
        </div>
      </footer>
    </div>
  );
}
