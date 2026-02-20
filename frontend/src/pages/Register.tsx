import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Zap, Users, BarChart3 } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { UserRole } from "@/types";

const roles: { value: UserRole; label: string; desc: string; icon: typeof Zap; activeColor: string; activeBg: string }[] = [
  { value: "founder", label: "Founder", desc: "Building a startup", icon: Zap, activeColor: "text-accent", activeBg: "bg-accent-muted border-accent" },
  { value: "talent", label: "Talent", desc: "Looking for roles", icon: Users, activeColor: "text-success", activeBg: "bg-success-light border-success" },
  { value: "investor", label: "Investor", desc: "Investing in startups", icon: BarChart3, activeColor: "text-warn", activeBg: "bg-warn-light border-warn" },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("founder");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, password, fullName, role);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

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
            Join the ecosystem.
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-sm">
            Whether you're building, investing, or looking for your next opportunity — this is where Nepal's startup community connects.
          </p>
        </div>

        <p className="text-xs text-white/20">Takes less than 2 minutes</p>
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

          <h1 className="font-display font-bold text-2xl text-ink-900 mb-1">Create your account</h1>
          <p className="text-sm text-ink-400 mb-8">Choose your role to get started</p>

          {error && (
            <div className="mb-5 px-4 py-3 bg-danger-light text-danger text-sm rounded-lg border border-danger/10">
              {error}
            </div>
          )}

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map((r) => {
              const active = role === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`p-3.5 rounded-xl border-2 text-center transition-colors ${active ? r.activeBg : "border-ink-100 bg-white hover:border-ink-200"}`}
                >
                  <r.icon className={`h-5 w-5 mx-auto mb-1.5 ${active ? r.activeColor : "text-ink-300"}`} />
                  <p className={`text-xs font-semibold ${active ? "text-ink-900" : "text-ink-500"}`}>{r.label}</p>
                  <p className="text-[10px] text-ink-400 mt-0.5">{r.desc}</p>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" required />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} />
            <Button type="submit" loading={loading} className="w-full" size="lg">Create account</Button>
          </form>

          <p className="text-center text-xs text-ink-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-accent font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
