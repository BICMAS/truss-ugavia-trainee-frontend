import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { LogOut, Mail, Shield } from "lucide-react";
import { BRAND } from "@/config/brand";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="brand-card p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-24 brand-gradient opacity-90" />

        <div className="relative z-10">
          <img
            src={user?.avatar}
            alt="Profile"
            className="w-28 h-28 rounded-full mx-auto border-4 border-brand-yellow shadow-lg"
          />

          <h2 className="text-2xl font-bold mt-5 text-brand-green">{user?.name}</h2>

          <div className="flex items-center justify-center gap-2 mt-2 text-slate-500 text-sm">
            <Shield size={14} className="text-brand-yellow-dark" />
            {user?.role}
          </div>

          {user?.email && (
            <div className="flex items-center justify-center gap-2 mt-1 text-slate-400 text-sm">
              <Mail size={14} />
              {user.email}
            </div>
          )}

          <button
            onClick={logout}
            className="mt-8 px-6 py-2.5 bg-brand-green/5 text-brand-green rounded-xl flex items-center gap-2 mx-auto font-medium hover:bg-brand-green/10 transition-colors border border-brand-green/10"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      <div className="brand-card p-6 flex items-center gap-4">
        <img src={BRAND.logo} alt={BRAND.name} className="h-20 w-auto object-contain" />
        <div>
          <p className="font-semibold text-brand-green">{BRAND.name}</p>
          <p className="text-sm text-slate-500">{BRAND.tagline}</p>
        </div>
      </div>
    </div>
  );
}
