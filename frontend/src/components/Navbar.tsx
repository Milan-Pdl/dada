import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Bell } from "lucide-react";
import Badge from "./ui/Badge";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-ink-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-14 items-center">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">N</span>
            </div>
            <span className="font-display font-bold text-ink-900 text-lg tracking-tight">
              nep<span className="text-accent">launch</span>
            </span>
          </Link>

          {user && (
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-surface-2 text-ink-400 transition relative" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
              </button>

              <div className="h-6 w-px bg-ink-100" />

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-medium text-ink-900 leading-tight">{user.full_name}</p>
                  <Badge variant="accent" className="mt-0.5 !py-0 !px-1.5 !text-[10px]">{user.role}</Badge>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-danger-light text-ink-400 hover:text-danger transition"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
