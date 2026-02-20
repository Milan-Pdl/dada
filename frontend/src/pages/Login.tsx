import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (e: string) => { setEmail(e); setPassword("password123"); };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-ink-900 p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">N</span>
          </div>
          <span className="font-display font-bold text-white text-lg">neplaunch</span>
        </Link>

        <div>
          <h2 className="font-display font-bold text-3xl text-white leading-tight mb-4">
            Nepal's startup ecosystem, connected.
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-sm">
            Founders find talent. Talent finds opportunity. Investors find the next big thing. All through one intelligent matching engine.
          </p>
        </div>

        <p className="text-xs text-white/20">Built for Nepal's builders</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-surface-1">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">N</span>
              </div>
              <span className="font-display font-bold text-ink-900 text-lg">neplaunch</span>
            </Link>
          </div>

          <h1 className="font-display font-bold text-2xl text-ink-900 mb-1">Welcome back</h1>
          <p className="text-sm text-ink-400 mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="mb-5 px-4 py-3 bg-danger-light text-danger text-sm rounded-lg border border-danger/10">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required />
            <Button type="submit" loading={loading} className="w-full" size="lg">Sign in</Button>
          </form>

          <p className="text-center text-xs text-ink-400 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-accent font-medium hover:underline">Create one</Link>
          </p>

          <div className="mt-8 pt-6 border-t border-ink-100">
            <p className="text-[10px] font-medium text-ink-300 uppercase tracking-widest text-center mb-3">Demo accounts</p>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={() => quickFill("aarav@example.com")}
                className="py-2 px-3 bg-white border border-ink-100 rounded-lg text-xs font-medium text-ink-500 hover:border-accent hover:text-accent transition">
                Founder
              </button>
              <button type="button" onClick={() => quickFill("suman@example.com")}
                className="py-2 px-3 bg-white border border-ink-100 rounded-lg text-xs font-medium text-ink-500 hover:border-success hover:text-success transition">
                Talent
              </button>
              <button type="button" onClick={() => quickFill("rajesh@example.com")}
                className="py-2 px-3 bg-white border border-ink-100 rounded-lg text-xs font-medium text-ink-500 hover:border-warn hover:text-warn transition">
                Investor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
