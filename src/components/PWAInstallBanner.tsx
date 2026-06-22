import { usePWAInstall } from "@/hooks/usePWAInstall";
import { BRAND } from "@/config/brand";

export function PWAInstallBanner() {
  const { isInstallable, promptInstall, isInstalled } = usePWAInstall();

  if (!isInstallable || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-brand-green text-white p-4 rounded-2xl shadow-xl flex items-center justify-between z-50 border border-brand-yellow/30">
      <span className="text-sm">
        Install {BRAND.name} for faster access and offline use
      </span>

      <button
        onClick={promptInstall}
        className="brand-btn-primary px-4 py-1.5 text-sm"
      >
        Install
      </button>
    </div>
  );
}
