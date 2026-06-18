import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show in iframes (Lovable preview)
    try {
      if (window.self !== window.top) return;
    } catch { return; }

    if (window.location.hostname.includes('id-preview--')) return;

    const dismissed = sessionStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      setDismissed(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!deferredPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-36 left-3 right-3 md:left-auto md:right-4 md:bottom-24 md:w-[360px] z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-card border border-border rounded-xl shadow-xl p-3.5 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <img src="/icon-192.png" alt="Logo" className="w-8 h-8 rounded-lg" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight">Instala la app ⚽</p>
          <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
            Accede rápido a Parchafoods
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button size="sm" className="h-8 text-xs gap-1 px-3" onClick={handleInstall}>
            <Download className="h-3.5 w-3.5" /> Instalar
          </Button>
          <button onClick={handleDismiss} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;
