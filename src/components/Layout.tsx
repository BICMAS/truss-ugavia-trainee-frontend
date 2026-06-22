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
        className={`flex min-h-[52px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 py-1 transition-all ${
          isActive
            ? "text-brand-green bg-brand-yellow/20"
            : "text-slate-500 active:bg-brand-green/5"
        }`}
        aria-current={isActive ? "page" : undefined}
        aria-label={item.label}
      >
        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
        <span className="max-w-full truncate text-[9px] font-semibold uppercase tracking-wide sm:text-[10px]">
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
        <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-3 right-3 z-50 flex flex-col gap-3 rounded-2xl border border-brand-yellow/30 bg-brand-green p-4 text-white shadow-xl sm:bottom-4 sm:left-auto sm:right-4 sm:w-96 sm:flex-row sm:items-center md:bottom-4">
          <div className="flex items-start gap-3 sm:flex-1">
            <div className="shrink-0 rounded-lg bg-brand-yellow/20 p-2">
              <Download size={20} className="text-brand-yellow" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Install {BRAND.name}</p>
              <p className="text-xs text-white/70">
                Learn offline. Faster access. No browser needed.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="shrink-0 text-white/50 active:text-white sm:hidden"
              aria-label="Dismiss install prompt"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:shrink-0">
            <button
              type="button"
              onClick={promptInstall}
              className="brand-btn-primary min-h-10 flex-1 px-4 py-2 text-sm sm:flex-none"
            >
              Install
            </button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="hidden text-white/50 hover:text-white sm:block"
              aria-label="Dismiss install prompt"
            >
              <X size={16} />
            </button>
          </div>
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

      <main className="flex min-h-dvh flex-1 flex-col md:ml-64">
        <header className="sticky top-0 z-20 flex shrink-0 items-center justify-between gap-3 border-b border-brand-green/10 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-md sm:px-6 sm:py-4 pt-safe">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-brand-green sm:text-xl">
              {activeItem.title}
            </h1>
            <p className="hidden truncate text-xs text-slate-500 sm:block">
              {BRAND.name} · {BRAND.tagline}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:hidden">
            <img
              src={BRAND.logo}
              alt={BRAND.name}
              className="h-8 w-auto object-contain min-[400px]:block sm:h-10 hidden"
            />
            <div
              className={`rounded-full p-2 ${
                isOffline
                  ? "bg-orange-100 text-orange-600"
                  : "bg-brand-green/10 text-brand-green"
              }`}
              title={isOffline ? "You are offline" : "You are online"}
            >
              {isOffline ? <WifiOff size={16} /> : <Wifi size={16} />}
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
              className="h-8 w-8 rounded-full border-2 border-brand-yellow/50 sm:h-9 sm:w-9"
            />
          </div>

          <div className="hidden items-center gap-4 md:flex">
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

        <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar sm:p-6 max-w-7xl mx-auto w-full pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-6">
          <Outlet />
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-brand-green/10 bg-white px-1 pb-safe pt-1 shadow-[0_-4px_20px_rgba(18,112,76,0.08)] md:hidden">
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
