import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, AlertCircle, Loader2, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import PlaceCard from '@/components/PlaceCard';
import MapComponent from '@/components/MapComponent';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { mockPlaces } from '@/data/places';
import { useGeolocation } from '@/hooks/useGeolocation';
import { calculateDistance, formatDistance } from '@/utils/distance';
import { Place, Category } from '@/types/place';
import { categoryIcons } from '@/utils/categoryIcons';

interface PlaceWithDistance extends Place {
  distance: number;
}

const categories: Category[] = [
  'Comidas Rápidas',
  'Café',
  'Food Truck',
  'Italiana',
  'Parrilla',
  'Tradicional',
  'Saludable',
  'Mariscos',
  'Postres',
  'Panadería',
  'Asiática',
];

const NearMe = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { position, error, loading, permissionDenied, requestLocation } = useGeolocation();
  const [maxDistance, setMaxDistance] = useState(5); // km

  useEffect(() => {
    // Auto-request location on mount
    requestLocation();
  }, []);

  const nearbyPlaces = useMemo<PlaceWithDistance[]>(() => {
    if (!position) return [];

    const placesWithDistance = mockPlaces.map(place => ({
      ...place,
      distance: calculateDistance(
        position.latitude,
        position.longitude,
        place.latitude,
        place.longitude
      )
    }));

    let filtered = placesWithDistance.filter(place => place.distance <= maxDistance);
    
    // Filter by category if selected
    if (selectedCategory) {
      filtered = filtered.filter(place => place.category === selectedCategory);
    }

    return filtered.sort((a, b) => a.distance - b.distance);
  }, [position, maxDistance, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="w-full max-w-screen-2xl mx-auto px-4 sm:px-4 md:px-6 pt-4 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
              <Navigation className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Cerca de Mí</h1>
          </div>
          <p className="text-muted-foreground">
            Descubre lugares interesantes cerca de tu ubicación
          </p>
        </div>

        {/* Permission Request / Error State */}
        {!position && !loading && (
          <div className="mb-6">
            {error ? (
              <Alert variant={permissionDenied ? "destructive" : "default"}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex flex-col gap-3">
                  <p>{error}</p>
                  {!permissionDenied && (
                    <Button onClick={requestLocation} size="sm" className="w-fit">
                      <Navigation className="h-4 w-4 mr-2" />
                      Intentar de nuevo
                    </Button>
                  )}
                  {permissionDenied && (
                    <div className="text-sm">
                      <p className="font-medium mb-2">Para habilitar la ubicación:</p>
                      <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                        <li>Haz clic en el icono de candado en la barra de direcciones</li>
                        <li>Busca "Ubicación" y selecciona "Permitir"</li>
                        <li>Recarga la página</li>
                      </ol>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ) : (
              <Button onClick={requestLocation} size="lg" className="w-full">
                <Navigation className="h-5 w-5 mr-2" />
                Activar mi ubicación
              </Button>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Obteniendo tu ubicación...</p>
          </div>
        )}

        {/* Results */}
        {position && (
          <>
            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Filtrar por categoría</h3>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === null ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1.5"
                  onClick={() => setSelectedCategory(null)}
                >
                  Todas
                  {selectedCategory === null && <X className="ml-1.5 h-3 w-3" />}
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1.5"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                    {selectedCategory === category && <X className="ml-1.5 h-3 w-3" />}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Distance Filter */}
            <div className="mb-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Radio de búsqueda</label>
                <span className="text-sm font-bold text-primary">{maxDistance} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 km</span>
                <span>20 km</span>
              </div>
            </div>

            {/* Current Location Info */}
            <div className="mb-4 p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>
                  Mostrando {selectedCategory ? `${selectedCategory.toLowerCase()}s` : 'lugares'} en un radio de <strong>{maxDistance} km</strong>
                </span>
              </div>
            </div>

            {/* Places List */}
            {nearbyPlaces.length > 0 ? (
              <>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Encontramos <strong className="text-foreground">{nearbyPlaces.length}</strong> lugares cerca de ti
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nearbyPlaces.map((place) => (
                    <div key={place.id} className="relative">
                      <PlaceCard place={place} />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          const hasCoords =
                            typeof place.latitude === 'number' &&
                            typeof place.longitude === 'number' &&
                            !isNaN(place.latitude) &&
                            !isNaN(place.longitude);
                          const url = hasCoords
                            ? `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}(${encodeURIComponent(place.name)})`
                            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.address || ''} Cali`)}`;
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }}
                        aria-label={`Abrir ${place.name} en Google Maps`}
                        className="absolute bottom-14 right-2 z-10 bg-primary text-primary-foreground px-2.5 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 hover:bg-primary/90 active:scale-95 transition-all"
                      >
                        <Navigation className="h-3 w-3" />
                        {formatDistance(place.distance)}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No hay lugares cerca</h3>
                <p className="text-muted-foreground mb-4">
                  Intenta aumentar el radio de búsqueda para encontrar más lugares
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default NearMe;
