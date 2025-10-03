import { useState, useEffect } from 'react';
import { Car, Bike, FootprintsIcon, Navigation2, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface DirectionsPanelProps {
  destinationLat: number;
  destinationLng: number;
  destinationName: string;
}

interface RouteInfo {
  distance: string;
  duration: string;
  steps: string[];
}

type TransportMode = 'driving' | 'cycling' | 'walking';

const DirectionsPanel = ({ destinationLat, destinationLng, destinationName }: DirectionsPanelProps) => {
  const [selectedMode, setSelectedMode] = useState<TransportMode>('driving');
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [routes, setRoutes] = useState<Record<TransportMode, RouteInfo | null>>({
    driving: null,
    cycling: null,
    walking: null
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          toast({
            title: "Error de ubicación",
            description: "No pudimos obtener tu ubicación actual. Por favor habilita el GPS.",
            variant: "destructive"
          });
        }
      );
    }
  }, [toast]);

  const getDirectionsUrl = (mode: TransportMode) => {
    if (!userLocation) return '#';
    
    const googleMapsMode = mode === 'driving' ? 'driving' : mode === 'cycling' ? 'bicycling' : 'walking';
    return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destinationLat},${destinationLng}&travelmode=${googleMapsMode}`;
  };

  const openInGoogleMaps = () => {
    if (!userLocation) {
      toast({
        title: "Ubicación requerida",
        description: "Necesitamos tu ubicación para calcular la ruta.",
        variant: "destructive"
      });
      return;
    }

    window.open(getDirectionsUrl(selectedMode), '_blank');
  };

  const getModeIcon = (mode: TransportMode) => {
    switch (mode) {
      case 'driving':
        return <Car className="h-5 w-5" />;
      case 'cycling':
        return <Bike className="h-5 w-5" />;
      case 'walking':
        return <FootprintsIcon className="h-5 w-5" />;
    }
  };

  const getModeLabel = (mode: TransportMode) => {
    switch (mode) {
      case 'driving':
        return 'En Carro';
      case 'cycling':
        return 'En Moto/Bici';
      case 'walking':
        return 'A Pie';
    }
  };

  // Simulated route estimation (in a real app, you'd use a routing API)
  const estimateRoute = (mode: TransportMode): RouteInfo => {
    if (!userLocation) return { distance: '-', duration: '-', steps: [] };

    const R = 6371; // Earth's radius in km
    const dLat = (destinationLat - userLocation.lat) * Math.PI / 180;
    const dLon = (destinationLng - userLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(destinationLat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    // Estimated speeds (km/h)
    const speeds = { driving: 40, cycling: 15, walking: 5 };
    const duration = (distance / speeds[mode]) * 60; // in minutes

    return {
      distance: distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`,
      duration: duration < 60 ? `${Math.round(duration)} min` : `${Math.floor(duration / 60)} h ${Math.round(duration % 60)} min`,
      steps: [
        'Dirígete hacia el norte por tu ubicación actual',
        `Continúa por ${Math.round(distance * 0.7)} km`,
        `Llegarás a ${destinationName}`
      ]
    };
  };

  const currentRoute = userLocation ? estimateRoute(selectedMode) : null;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Navigation2 className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold">¿Cómo llegar?</h3>
        </div>

        {!userLocation ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Obteniendo tu ubicación...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Transport Mode Selector */}
            <Tabs value={selectedMode} onValueChange={(v) => setSelectedMode(v as TransportMode)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="driving" className="gap-2">
                  <Car className="h-4 w-4" />
                  <span className="hidden sm:inline">Carro</span>
                </TabsTrigger>
                <TabsTrigger value="cycling" className="gap-2">
                  <Bike className="h-4 w-4" />
                  <span className="hidden sm:inline">Moto/Bici</span>
                </TabsTrigger>
                <TabsTrigger value="walking" className="gap-2">
                  <FootprintsIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">A Pie</span>
                </TabsTrigger>
              </TabsList>

              {/* Route Information */}
              {currentRoute && (
                <div className="space-y-4">
                  {/* Duration and Distance */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-primary" />
                        <p className="text-xs text-muted-foreground">Duración</p>
                      </div>
                      <p className="text-lg font-bold text-primary">{currentRoute.duration}</p>
                    </div>
                    <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Navigation2 className="h-4 w-4 text-secondary" />
                        <p className="text-xs text-muted-foreground">Distancia</p>
                      </div>
                      <p className="text-lg font-bold text-secondary">{currentRoute.distance}</p>
                    </div>
                  </div>

                  {/* Route Preview */}
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {getModeIcon(selectedMode)}
                      <p className="font-medium">{getModeLabel(selectedMode)}</p>
                    </div>
                    <div className="space-y-2">
                      {currentRoute.steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Open in Google Maps Button */}
                  <Button 
                    onClick={openInGoogleMaps} 
                    className="w-full gap-2"
                    size="lg"
                  >
                    <Navigation2 className="h-5 w-5" />
                    Abrir en Google Maps
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Se abrirá Google Maps con direcciones detalladas
                  </p>
                </div>
              )}
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DirectionsPanel;