import { useState, useMemo, useEffect, useRef } from 'react';
import { MapPin, Navigation, AlertCircle, Loader2, X, Search, SlidersHorizontal } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import PlaceCard from '@/components/PlaceCard';
import MapComponent from '@/components/MapComponent';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useGeolocation } from '@/hooks/useGeolocation';
import { calculateDistance, formatDistance } from '@/utils/distance';
import { supabase } from '@/integrations/supabase/client';
import { pickBusinessCoverUrl } from '@/utils/businessImages';
import { useCity } from '@/contexts/CityContext';
import { BUSINESS_CATEGORIES, resolveBusinessType, resolveSubcategory, getSubcategories } from '@/data/categories';
import { getSubcategoryIcon } from '@/utils/subcategoryIcons';
import { LayoutGrid } from 'lucide-react';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiaGFuZGNpdHkiLCJhIjoiY2syNmp3ZjUxMzJkMzNtcGl6dXR6ZTV0diJ9.0xE-C5rlwWBM80gUY1POzw';

interface NearPlace {
  id: string;
  slug?: string;
  name: string;
  category: string;
  businessType: string;
  address: string;
  neighborhood: string;
  phone?: string;
  description?: string;
  images: string[];
  latitude: number;
  longitude: number;
  priceRange?: string;
  featured?: boolean;
  rating: number;
  distance: number;
}

const normalizeText = (t: string) =>
  t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const NearMe = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { city } = useCity();

  // Step 1: what are you looking for
  const [step, setStep] = useState<'search' | 'results'>('search');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const { position, error, loading, permissionDenied, requestLocation } = useGeolocation();
  const [maxDistance, setMaxDistance] = useState(5);
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const [focusCoords, setFocusCoords] = useState<{ lat: number; lng: number; key: number } | null>(null);

  // Manual origin
  const [manualPos, setManualPos] = useState<{ latitude: number; longitude: number; label: string } | null>(null);
  const [originDialogOpen, setOriginDialogOpen] = useState(false);
  const [originQuery, setOriginQuery] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState<Array<{ label: string; lat: number; lng: number }>>([]);
  const [searchingOrigin, setSearchingOrigin] = useState(false);
  const [originError, setOriginError] = useState<string | null>(null);

  // Data
  const [places, setPlaces] = useState<Omit<NearPlace, 'distance'>[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);

  const effectivePos =
    position || (manualPos ? { latitude: manualPos.latitude, longitude: manualPos.longitude } : null);

  useEffect(() => {
    const load = async () => {
      setLoadingPlaces(true);
      const { data } = await supabase
        .from('businesses')
        .select(`*, business_images (image_url, image_type, is_primary, display_order)`)
        .eq('city', city.id)
        .order('featured', { ascending: false })
        .order('name');

      setPlaces(
        (data || []).map((b: any) => ({
          id: b.id,
          slug: b.slug,
          name: b.name,
          category: b.category,
          businessType: resolveBusinessType(b.business_type || b.category),
          address: b.address,
          neighborhood: b.neighborhood,
          phone: b.phone,
          description: b.description,
          images: [pickBusinessCoverUrl(b.business_images, b)],
          latitude: Number(b.latitude) || 0,
          longitude: Number(b.longitude) || 0,
          priceRange: b.price_range,
          featured: b.featured,
          rating: 4.5,
        })),
      );
      setLoadingPlaces(false);
    };
    load();
  }, [city.id]);

  const focusOnMap = (lat: number, lng: number) => {
    setFocusCoords({ lat, lng, key: Date.now() });
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const startSearch = () => {
    setStep('results');
    if (!effectivePos) requestLocation();
  };

  const searchOrigin = async () => {
    const q = originQuery.trim();
    if (q.length < 3) {
      setOriginError('Escribe al menos 3 caracteres');
      return;
    }
    setSearchingOrigin(true);
    setOriginError(null);
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?proximity=${city.longitude},${city.latitude}&country=co&limit=5&access_token=${MAPBOX_TOKEN}`;
      const res = await fetch(url);
      const data = await res.json();
      const features = (data?.features || []) as any[];
      if (features.length === 0) {
        setOriginSuggestions([]);
        setOriginError('No encontramos esa dirección. Intenta con otra.');
      } else {
        setOriginSuggestions(features.map((f) => ({ label: f.place_name, lng: f.center[0], lat: f.center[1] })));
      }
    } catch (e) {
      console.error('Geocoding error:', e);
      setOriginError('Error buscando la dirección. Intenta de nuevo.');
    } finally {
      setSearchingOrigin(false);
    }
  };

  const selectOrigin = (s: { label: string; lat: number; lng: number }) => {
    setManualPos({ latitude: s.lat, longitude: s.lng, label: s.label });
    setOriginDialogOpen(false);
    setOriginSuggestions([]);
    setOriginQuery('');
    setOriginError(null);
    setStep('results');
  };

  const matchesSearch = (p: Omit<NearPlace, 'distance'>) => {
    const catMatch = selectedCategory === 'Todos' || p.businessType === selectedCategory;
    const subMatch =
      !selectedSubcategory ||
      resolveSubcategory(p.category, p.businessType, p.name) === selectedSubcategory;
    const q = normalizeText(query.trim());
    const textMatch =
      !q ||
      normalizeText([p.name, p.category, p.address, p.neighborhood, p.description || ''].join(' ')).includes(q);
    return catMatch && subMatch && textMatch;
  };

  const subcategoryOptions = useMemo(() => {
    if (selectedCategory === 'Todos') return [];
    const counts = new Map<string, number>();
    places
      .filter((p) => p.businessType === selectedCategory)
      .forEach((p) => {
        const sub = resolveSubcategory(p.category, p.businessType, p.name);
        if (sub) counts.set(sub, (counts.get(sub) || 0) + 1);
      });
    return getSubcategories(selectedCategory)
      .filter((s) => counts.has(s))
      .map((s) => ({ name: s, count: counts.get(s) || 0 }));
  }, [selectedCategory, places]);

  const nearbyPlaces = useMemo<NearPlace[]>(() => {
    if (!effectivePos) return [];
    return places
      .filter((p) => p.latitude && p.longitude)
      .filter(matchesSearch)
      .map((p) => ({
        ...p,
        distance: calculateDistance(effectivePos.latitude, effectivePos.longitude, p.latitude, p.longitude),
      }))
      .filter((p) => p.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);
  }, [places, effectivePos?.latitude, effectivePos?.longitude, maxDistance, selectedCategory, selectedSubcategory, query]);

  const activeLabel =
    selectedSubcategory ||
    (selectedCategory === 'Todos' ? 'todo tipo de lugares' : selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="w-full max-w-screen-2xl mx-auto px-4 sm:px-4 md:px-6 pt-4 pb-24 md:pb-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
              <Navigation className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Cerca de Mí</h1>
          </div>
          <p className="text-muted-foreground">
            Dinos qué buscas y te mostramos lo más cercano en {city.name}
          </p>
        </div>

        {step === 'search' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-1">¿Qué estás buscando?</h2>
              <p className="text-sm text-muted-foreground mb-3">
                Escoge una categoría o escribe lo que necesitas.
              </p>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Ej: droguería, pizza, hotel, ferretería..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); startSearch(); } }}
                  className="pl-9 h-11"
                />
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5">
                <button
                  type="button"
                  onClick={() => { setSelectedCategory('Todos'); setSelectedSubcategory(null); }}
                  className={`flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-2xl border transition-all ${
                    selectedCategory === 'Todos'
                      ? 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'bg-card text-muted-foreground border-border hover:border-primary/30'
                  }`}
                >
                  <LayoutGrid className="h-5 w-5" />
                  <span className="text-[11px] sm:text-xs font-medium">Todas</span>
                </button>
                {BUSINESS_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const active = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => { setSelectedCategory(cat.id); setSelectedSubcategory(null); }}
                      className={`flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-2xl border transition-all ${
                        active
                          ? 'bg-primary text-primary-foreground border-primary shadow-md'
                          : 'bg-card text-muted-foreground border-border hover:border-primary/30'
                      }`}
                    >
                      <Icon className="h-5 w-5" style={active ? undefined : { color: cat.color }} />
                      <span className="text-[11px] sm:text-xs font-medium text-center leading-tight">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {subcategoryOptions.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Escoge una subcategoría</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedSubcategory(null)}
                    className={`flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-2xl border transition-all ${
                      !selectedSubcategory
                        ? 'bg-primary text-primary-foreground border-primary shadow-md'
                        : 'bg-card text-muted-foreground border-border hover:border-primary/30'
                    }`}
                  >
                    <LayoutGrid className="h-5 w-5" />
                    <span className="text-[11px] sm:text-xs font-medium">Todas</span>
                  </button>
                  {subcategoryOptions.map((s) => {
                    const Icon = getSubcategoryIcon(s.name);
                    const active = selectedSubcategory === s.name;
                    return (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => setSelectedSubcategory(active ? null : s.name)}
                        className={`flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-2xl border transition-all ${
                          active
                            ? 'bg-primary text-primary-foreground border-primary shadow-md'
                            : 'bg-card text-muted-foreground border-border hover:border-primary/30'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-[11px] sm:text-xs font-medium text-center leading-tight line-clamp-2">{s.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                          {s.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={startSearch} size="lg" className="flex-1" disabled={loadingPlaces}>
                <Navigation className="h-5 w-5 mr-2" />
                Buscar cerca de mí
              </Button>
              <Button onClick={() => setOriginDialogOpen(true)} size="lg" variant="outline" className="flex-1">
                <Search className="h-5 w-5 mr-2" />
                Elegir otra ubicación
              </Button>
            </div>
          </div>
        )}

        {step === 'results' && (
          <>
            <div className="mb-4 flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => setStep('search')}>
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Cambiar búsqueda
              </Button>
              <span className="text-sm text-muted-foreground">
                Buscando: <strong className="text-foreground">{query.trim() || activeLabel}</strong>
              </span>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Obteniendo tu ubicación...</p>
              </div>
            )}

            {!effectivePos && !loading && (
              <div className="mb-6">
                <Alert variant={permissionDenied ? 'destructive' : 'default'}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex flex-col gap-3">
                    <p>{error || 'Necesitamos tu ubicación para calcular las distancias.'}</p>
                    {permissionDenied ? (
                      <div className="text-sm">
                        <p className="font-medium mb-2">Para habilitar la ubicación:</p>
                        <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                          <li>Toca el icono de candado en la barra de direcciones</li>
                          <li>Busca "Ubicación" y selecciona "Permitir"</li>
                          <li>Recarga la página</li>
                        </ol>
                      </div>
                    ) : (
                      <Button onClick={requestLocation} size="sm" className="w-fit">
                        <Navigation className="h-4 w-4 mr-2" />
                        Activar mi ubicación
                      </Button>
                    )}
                    <Button onClick={() => setOriginDialogOpen(true)} size="sm" variant="outline" className="w-fit">
                      <Search className="h-4 w-4 mr-2" />
                      Ingresar ubicación manualmente
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {!position && manualPos && (
              <div className="mb-4 p-3 bg-secondary/15 border border-secondary/30 rounded-lg flex items-center gap-2 flex-wrap">
                <MapPin className="h-4 w-4 text-secondary shrink-0" />
                <span className="text-sm">
                  Saliendo desde: <strong>{manualPos.label}</strong>
                </span>
                <div className="ml-auto flex gap-2">
                  <Button onClick={() => setOriginDialogOpen(true)} size="sm" variant="outline">
                    Cambiar
                  </Button>
                  <Button onClick={() => setManualPos(null)} size="sm" variant="ghost">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {effectivePos && (
              <>
                <div className="mb-6 p-4 bg-muted/50 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Radio de búsqueda</span>
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

                {loadingPlaces ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-64 w-full rounded-xl" />
                    ))}
                  </div>
                ) : nearbyPlaces.length > 0 ? (
                  <>
                    <div ref={mapSectionRef} className="mb-6 rounded-2xl overflow-hidden border border-border shadow-sm">
                      <div className="h-64 sm:h-80 w-full">
                        <MapComponent
                          places={nearbyPlaces as any}
                          selectedCategory="Todos"
                          focusCoordinates={focusCoords}
                          userPosition={{ lat: effectivePos.latitude, lng: effectivePos.longitude }}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">
                        Encontramos <strong className="text-foreground">{nearbyPlaces.length}</strong> lugares en un radio de{' '}
                        <strong className="text-foreground">{maxDistance} km</strong>
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {nearbyPlaces.map((place) => (
                        <div key={place.id} className="relative">
                          <PlaceCard place={place as any} />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              focusOnMap(place.latitude, place.longitude);
                            }}
                            aria-label={`Ver ${place.name} en el mapa`}
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
                    <h3 className="text-lg font-semibold mb-2">No encontramos {activeLabel} cerca</h3>
                    <p className="text-muted-foreground mb-4">
                      Amplía el radio de búsqueda o cambia lo que estás buscando.
                    </p>
                    <Button variant="outline" onClick={() => setMaxDistance(Math.min(20, maxDistance + 5))}>
                      Ampliar a {Math.min(20, maxDistance + 5)} km
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      <BottomNav />

      <Dialog
        open={originDialogOpen}
        onOpenChange={(open) => {
          setOriginDialogOpen(open);
          if (!open) {
            setOriginError(null);
            setOriginSuggestions([]);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ingresa tu ubicación de salida</DialogTitle>
            <DialogDescription>
              Escribe una dirección, barrio o lugar conocido para calcular distancias y trazar rutas.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Ej: Calle 9 #10-20, ${city.name}`}
                value={originQuery}
                onChange={(e) => setOriginQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); searchOrigin(); } }}
                maxLength={120}
                className="pl-9"
                autoFocus
              />
            </div>
            <Button onClick={searchOrigin} disabled={searchingOrigin || originQuery.trim().length < 3}>
              {searchingOrigin ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buscar'}
            </Button>
          </div>

          {originError && <p className="text-xs text-destructive">{originError}</p>}

          {originSuggestions.length > 0 && (
            <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto">
              {originSuggestions.map((s, i) => (
                <button
                  key={`${s.lat}-${s.lng}-${i}`}
                  onClick={() => selectOrigin(s)}
                  className="text-left flex items-start gap-2 p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground">{s.label}</span>
                </button>
              ))}
            </div>
          )}

          <p className="text-[11px] text-muted-foreground">
            Tu ubicación de salida se usará solo para calcular la ruta dentro de la app.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NearMe;
