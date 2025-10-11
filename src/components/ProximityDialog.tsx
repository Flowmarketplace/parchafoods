import { useEffect, useState } from 'react';
import { useProximityNotifications } from '@/hooks/useProximityNotifications';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Navigation, X } from 'lucide-react';

export const ProximityDialog = () => {
  const { isTracking, startTracking, stopTracking } = useProximityNotifications();
  const [showDialog, setShowDialog] = useState(false);
  const [hasSeenDialog, setHasSeenDialog] = useState(false);

  useEffect(() => {
    // Check if user has already seen the dialog
    const seen = localStorage.getItem('proximityDialogSeen');
    if (!seen) {
      // Show dialog after a short delay when app loads
      const timer = setTimeout(() => {
        setShowDialog(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setHasSeenDialog(true);
    }
  }, []);

  const handleClose = () => {
    setShowDialog(false);
    setHasSeenDialog(true);
    localStorage.setItem('proximityDialogSeen', 'true');
  };

  const handleActivate = () => {
    startTracking();
    handleClose();
  };

  const handleToggle = () => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  };

  return (
    <>
      {/* Initial popup dialog */}
      <Dialog open={showDialog && !hasSeenDialog} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <MapPin className="h-6 w-6 text-primary" />
              Notificaciones de Proximidad
            </DialogTitle>
            <DialogDescription className="text-base">
              Recibe alertas automáticas cuando estés cerca de negocios con ofertas especiales
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">✨ Beneficios:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ofertas exclusivas de negocios cercanos</li>
                <li>• Descubre lugares nuevos en tu ruta</li>
                <li>• Notificaciones solo cuando estés cerca</li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleActivate}
                className="w-full gap-2"
                size="lg"
              >
                <Navigation className="h-5 w-5" />
                Activar Notificaciones
              </Button>
              <Button
                onClick={handleClose}
                variant="ghost"
                className="w-full"
              >
                Ahora no
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Icon button in navbar */}
      <Button
        variant={isTracking ? 'default' : 'ghost'}
        size="icon"
        onClick={handleToggle}
        className="relative"
        title={isTracking ? 'Notificaciones activas' : 'Activar notificaciones de proximidad'}
      >
        <MapPin className="h-5 w-5" />
        {isTracking && (
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse border-2 border-background" />
        )}
      </Button>
    </>
  );
};
