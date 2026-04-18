import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DISMISS_KEY = 'pwa-install-dismissed';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY) === 'true';
    if (dismissed) return;

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-20 z-[70] rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur md:bottom-6 md:left-auto md:right-6 md:max-w-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-xl bg-emerald-500/15 p-2 text-emerald-400">
          <Download className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Add SocietyOne to home screen</p>
          <p className="mt-1 text-sm text-slate-400">Install the PWA for faster guard-side access and offline shell caching.</p>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleInstall} className="bg-emerald-500 text-white hover:bg-emerald-600">
              Install
            </Button>
            <Button onClick={handleDismiss} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              Not now
            </Button>
          </div>
        </div>
        <button type="button" onClick={handleDismiss} className="text-slate-500 transition hover:text-slate-300">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
