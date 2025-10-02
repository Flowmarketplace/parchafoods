import { useProximityNotifications } from '@/hooks/useProximityNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation } from 'lucide-react';

export const ProximityTracker = () => {
  const { isTracking, startTracking, stopTracking } = useProximityNotifications();

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4" />
          Notificaciones de Proximidad
        </CardTitle>
        <CardDescription className="text-xs">
          Recibe alertas de negocios cercanos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isTracking ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">Activo</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={stopTracking}
              className="gap-2"
            >
              Detener
            </Button>
          </div>
        ) : (
          <Button
            onClick={startTracking}
            className="w-full gap-2"
            size="sm"
          >
            <Navigation className="h-4 w-4" />
            Activar
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
