"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import "./pwa.css";

export default function PWASetup() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.warn("Service Worker registration failed:", err);
      });
    }

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      console.log("App installed");
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted install");
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="pwa-prompt">
      <div className="pwa-content">
        <Download size={20} />
        <div>
          <h3>Install Personal OS</h3>
          <p>Get quick access to your learning system on any device</p>
        </div>
        <button onClick={handleInstall} className="pwa-install">
          Install
        </button>
        <button onClick={() => setShowPrompt(false)} className="pwa-close">
          ✕
        </button>
      </div>
    </div>
  );
}
