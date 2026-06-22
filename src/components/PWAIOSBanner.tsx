import { isIOS, isStandalone } from "@/utils/pws";
import { useEffect, useState } from "react";

export function PWAIOSBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isIOS() && !isStandalone()) {
      let dismissed: string | null = null;
      try {
        dismissed = localStorage.getItem("ios-install-dismissed");
      } catch (error) {
        // Ignore storage errors (e.g., private browsing)
      }

      if (!dismissed) {
        setShow(true);
      }
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-brand-green text-white p-4 rounded-2xl shadow-xl z-50 border border-brand-yellow/30">
      <p className="text-sm">
        Install this app: Tap the <strong>Share</strong> icon and select{" "}
        <strong>Add to Home Screen</strong>.
      </p>

      <button
        className="mt-2 text-xs underline"
        onClick={() => {
          try {
            localStorage.setItem("ios-install-dismissed", "true");
          } catch (error) {
            // Ignore storage errors
          } finally {
            setShow(false);
          }
        }}
      >
        Dismiss
      </button>
    </div>
  );
}
