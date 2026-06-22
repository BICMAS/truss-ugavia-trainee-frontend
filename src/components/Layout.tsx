import React, { useMemo, useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  UserCircle,
  Wifi,
  WifiOff,
  Award,
  MessageCircle,
  X,
  Download,
  Camera,
} from "lucide-react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useAuth } from "@/context/AuthContext";
import { useOfflineStatus } from "@/hooks/useOfflineStatus";
import { BRAND } from "@/config/brand";

type NavItemConfig = {
  id: string;
  label: string;
  path: string;
  icon: React.ElementType;
  title: string;
};

const NAV_ITEMS: NavItemConfig[] = [
  {
    id: "dashboard",
    label: "Home",
    path: "/",
    icon: LayoutDashboard,
    title: "My Dashboard",
  },
  {
    id: "library",
    label: "Courses",
    path: "/library",
    icon: BookOpen,
    title: "Course Library",
  },
  {
    id: "assessment",
    label: "Field Task",
    path: "/assessment",
    icon: Camera,
    title: "Field Task",
  },
  {
    id: "community",
    label: "Forum",
    path: "/community",
    icon: MessageCircle,
    title: "Community",
  },
  {
    id: "certificates",
    label: "Awards",
    path: "/certificates",
    icon: Award,
    title: "My Certificates",
  },
  {
    id: "profile",
    label: "Profile",
    path: "/profile",
    icon: UserCircle,
    title: "User Profile",
  },
];

const FALLBACK_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=12704c&color=f4b609";

type NavItemProps = {
  item: NavItemConfig;
  isActive: boolean;
  onNavigate: (path: string) => void;
  mobile?: boolean;
};

const NavItem: React.FC<NavItemProps> = ({
  item,
  isActive,
  onNavigate,
  mobile = false,
}) => {
  const Icon = item.icon;

  if (mobile) {
    return (
      <button
        type="button"
        onClick={() => onNavigate(item.path)}
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
          isActive
            ? "text-brand-green bg-brand-yellow/20"
            : "text-slate-500 hover:text-brand-green hover:bg-brand-green/5"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        <Icon size={22} className="mb-0.5" />
        <span className="text-[10px] font-semibold uppercase tracking-wide">
          {item.label}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onNavigate(item.path)}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
        isActive
          ? "bg-brand-yellow text-brand-green-dark shadow-sm"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon size={20} />
      <span className="text-sm font-medium">{item.label}</span>
    </button>
  );
};

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isOffline = useOfflineStatus();
  const { isInstallable, promptInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  const activeItem = useMemo(
    () =>
      NAV_ITEMS.find((item) =>
        item.path === "/"
          ? location.pathname === "/"
          : location.pathname.startsWith(item.path),
      ) ?? NAV_ITEMS[0],
    [location.pathname],
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen brand-gradient-soft flex flex-col md:flex-row">
      {isInstallable && !dismissed && (
        <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-brand-green text-white rounded-2xl shadow-xl p-4 flex items-center gap-3 z-50 border border-brand-yellow/30">
          <div className="p-2 rounded-lg bg-brand-yellow/20">
            <Download size={20} className="text-brand-yellow" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Install {BRAND.name}</p>
            <p className="text-xs text-white/70">
              Learn offline. Faster access. No browser needed.
            </p>
          </div>

          <button
            type="button"
            onClick={promptInstall}
            className="brand-btn-primary px-3 py-1.5 text-sm"
          >
            Install
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-white/50 hover:text-white"
            aria-label="Dismiss install prompt"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <aside className="hidden md:flex w-64 brand-gradient flex-col shrink-0 fixed h-full z-10 shadow-xl">
        <div className="px-6 py-8 border-b border-white/10">
          <img
            src={BRAND.logo}
            alt={BRAND.name}
            className="w-full max-w-[15rem] h-auto object-contain brightness-0 invert"
          />
          <p className="text-brand-yellow text-xs font-semibold uppercase tracking-widest mt-3">
            Learning Portal
          </p>
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-4 py-6">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeItem.id === item.id}
              onNavigate={navigate}
            />
          ))}
        </nav>

        <div className="px-4 py-6 border-t border-white/10 space-y-4">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${
              isOffline
                ? "bg-orange-500/20 text-orange-200"
                : "bg-white/10 text-white/80"
            }`}
          >
            {isOffline ? <WifiOff size={16} /> : <Wifi size={16} />}
            {isOffline ? "Offline Mode" : "Online"}
          </div>

          <div className="flex items-center gap-3 px-2">
            <img
              src={user.avatar || FALLBACK_AVATAR}
              alt={user.name}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src !== FALLBACK_AVATAR) {
                  target.src = FALLBACK_AVATAR;
                }
              }}
              className="w-10 h-10 rounded-full border-2 border-brand-yellow/50"
            />
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                {user.name}
              </p>
              <p className="text-white/50 text-xs truncate">{user.role}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 pb-20 md:pb-0 min-h-screen">
        <header className="bg-white/90 backdrop-blur-md sticky top-0 z-20 px-6 py-4 border-b border-brand-green/10 flex justify-between items-center shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-brand-green">
              {activeItem.title}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              {BRAND.name} · {BRAND.tagline}
            </p>
          </div>

          <div className="flex md:hidden items-center gap-3">
            <img
              src={BRAND.logo}
              alt={BRAND.name}
              className="h-14 w-auto object-contain"
            />
            <div
              className={`p-2 rounded-full ${
                isOffline
                  ? "bg-orange-100 text-orange-600"
                  : "bg-brand-green/10 text-brand-green"
              }`}
              title={isOffline ? "You are offline" : "You are online"}
            >
              {isOffline ? <WifiOff size={18} /> : <Wifi size={18} />}
            </div>
            <img
              src={user.avatar || FALLBACK_AVATAR}
              alt={user.name}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src !== FALLBACK_AVATAR) {
                  target.src = FALLBACK_AVATAR;
                }
              }}
              className="w-8 h-8 rounded-full border-2 border-brand-yellow/50"
            />
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isOffline ? (
              <div className="text-xs text-orange-700 font-semibold px-3 py-1.5 bg-orange-50 rounded-full border border-orange-100">
                Offline Mode
              </div>
            ) : (
              <div className="text-xs text-brand-green font-semibold px-3 py-1.5 bg-brand-green/10 rounded-full border border-brand-green/20">
                Online
              </div>
            )}
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
          <Outlet />
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-brand-green/10 flex justify-around p-2 z-40 pb-safe shadow-[0_-4px_20px_rgba(18,112,76,0.08)]">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={activeItem.id === item.id}
            onNavigate={navigate}
            mobile
          />
        ))}
      </nav>
    </div>
  );
};
