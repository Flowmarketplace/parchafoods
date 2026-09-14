import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useCity } from '@/contexts/CityContext';
import { Place } from '@/types/place';
import { mockPlaces } from '@/data/places';
import { useNavigate } from 'react-router-dom';
import { getCategoryIcon, getCategoryColor } from '@/utils/categoryIcons';
import { resolveBusinessType } from '@/data/categories';
import { neighborhoodLocations } from '@/data/neighborhoods';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Search, Maximize2, Minimize2 } from 'lucide-react';

// Mapbox public token (safe to expose in frontend)
const MAPBOX_TOKEN = 'pk.eyJ1IjoiaGFuZGNpdHkiLCJhIjoiY2syNmp3ZjUxMzJkMzNtcGl6dXR6ZTV0diJ9.0xE-C5rlwWBM80gUY1POzw';

interface MapComponentProps {
  selectedNeighborhood?: string;
  selectedCategory?: string;
  places?: Place[];
  focusCoordinates?: { lat: number; lng: number; zoom?: number; key?: string | number } | null;
  userPosition?: { lat: number; lng: number } | null;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

const MapComponent = ({ selectedNeighborhood = 'Todos', selectedCategory = 'Todos', places, focusCoordinates, userPosition, expanded = false, onToggleExpand }: MapComponentProps) => {
  const { city } = useCity();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const manualOriginMarker = useRef<mapboxgl.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ name: string; distanceKm: number; durationMin: number; lat: number; lng: number } | null>(null);
  const [manualOrigin, setManualOrigin] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [originDialogOpen, setOriginDialogOpen] = useState(false);
  const [originQuery, setOriginQuery] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState<Array<{ label: string; lat: number; lng: number }>>([]);
  const [searchingOrigin, setSearchingOrigin] = useState(false);
  const [originError, setOriginError] = useState<string | null>(null);
  const [activePlace, setActivePlace] = useState<Place | null>(null);
  const pendingPlace = useRef<Place | null>(null);
  const navigate = useNavigate();

  const clearRoute = () => {
    if (!map.current) return;
    if (map.current.getLayer('route-line')) map.current.removeLayer('route-line');
    if (map.current.getSource('route')) map.current.removeSource('route');
    setRouteInfo(null);
  };

  const getOrigin = (): { lat: number; lng: number } | null => {
    if (userPosition) return userPosition;
    if (manualOrigin) return { lat: manualOrigin.lat, lng: manualOrigin.lng };
    return null;
  };

  const drawRouteToPlace = async (place: Place, options?: { fitBounds?: boolean }) => {
    if (!map.current || !mapLoaded) return;
    const origin = getOrigin();
    if (!origin) {
      // No origin available — open manual origin dialog
      pendingPlace.current = place;
      setOriginDialogOpen(true);
      return;
    }
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${place.longitude},${place.latitude}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;
      const res = await fetch(url);
      const data = await res.json();
      const route = data?.routes?.[0];
      if (!route) return;

      const geojson: any = {
        type: 'Feature',
        properties: {},
        geometry: route.geometry,
      };

      if (map.current.getSource('route')) {
        (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData(geojson);
      } else {
        map.current.addSource('route', { type: 'geojson', data: geojson });
        map.current.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#2563eb', 'line-width': 5, 'line-opacity': 0.85 },
        });
      }

      // Fit bounds to route only on initial creation (avoid jumpy camera on auto-recalcs)
      if (options?.fitBounds !== false) {
        const coords: [number, number][] = route.geometry.coordinates;
        const bounds = coords.reduce(
          (b, c) => b.extend(c as [number, number]),
          new mapboxgl.LngLatBounds(coords[0], coords[0])
        );
        map.current.fitBounds(bounds, { padding: 60, duration: 1200, maxZoom: 15 });
      }

      setRouteInfo({
        name: place.name,
        distanceKm: route.distance / 1000,
        durationMin: Math.round(route.duration / 60),
        lat: place.latitude,
        lng: place.longitude,
      });
    } catch (err) {
      console.error('Error fetching route:', err);
    }
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
        setOriginSuggestions(
          features.map((f) => ({
            label: f.place_name,
            lng: f.center[0],
            lat: f.center[1],
          }))
        );
      }
    } catch (e) {
      console.error('Geocoding error:', e);
      setOriginError('Error buscando la dirección. Intenta de nuevo.');
    } finally {
      setSearchingOrigin(false);
    }
  };

  const selectOrigin = (s: { label: string; lat: number; lng: number }) => {
    setManualOrigin(s);
    setOriginDialogOpen(false);
    setOriginSuggestions([]);
    setOriginQuery('');
    // Place a marker at the manual origin
    if (manualOriginMarker.current) {
      manualOriginMarker.current.remove();
      manualOriginMarker.current = null;
    }
    if (map.current) {
      const el = document.createElement('div');
      el.style.cssText = 'width:18px;height:18px;border-radius:50%;background:#16a34a;border:3px solid white;box-shadow:0 0 0 4px rgba(22,163,74,0.3);';
      manualOriginMarker.current = new mapboxgl.Marker(el).setLngLat([s.lng, s.lat]).addTo(map.current);
    }
    // If we had a pending place, draw the route now
    if (pendingPlace.current) {
      const place = pendingPlace.current;
      pendingPlace.current = null;
      // wait next tick so state has settled (drawRouteToPlace reads manualOrigin via getOrigin)
      setTimeout(() => drawRouteToPlace(place), 0);
    }
  };

  const clearManualOrigin = () => {
    setManualOrigin(null);
    if (manualOriginMarker.current) {
      manualOriginMarker.current.remove();
      manualOriginMarker.current = null;
    }
    clearRoute();
  };



  const createMarker = (place: Place) => {
    if (!map.current) {
      console.error('Map not initialized, cannot create marker');
      return null;
    }

    try {
      const placeType = resolveBusinessType((place as any).businessType || place.category);
      const iconSvg = getCategoryIcon(placeType);
      const color = getCategoryColor(placeType);
      
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.cursor = 'pointer';
      el.innerHTML = `
        <div style="
          width: 40px;
          height: 40px;
          background: ${color};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          border: 3px solid white;
          transition: transform 0.2s;
        "
        onmouseover="this.style.transform='rotate(-45deg) scale(1.1)'"
        onmouseout="this.style.transform='rotate(-45deg) scale(1)'"
        >
          <svg 
            style="transform: rotate(45deg); width: 20px; height: 20px;" 
            fill="white" 
            viewBox="0 0 24 24"
          >
            ${iconSvg}
          </svg>
        </div>
      `;

      el.addEventListener('click', (event) => {
        event.stopPropagation();
        setActivePlace(place);
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([place.longitude, place.latitude])
        .addTo(map.current);

      return marker;
    } catch (error) {
      console.error('Error creating marker for place:', place.name, error);
      return null;
    }
  };

  // Grouped ("cluster") marker: icon bubble + count badge + label
  const createGroupMarker = (
    lng: number,
    lat: number,
    opts: { label: string; count: number; color: string; iconSvg?: string; onClick: () => void }
  ) => {
    if (!map.current) return null;
    const el = document.createElement('div');
    el.style.cursor = 'pointer';
    el.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;transition:transform .15s;">
        <div style="
          min-width:26px;height:22px;padding:0 7px;margin-bottom:-6px;
          background:white;color:${opts.color};border:2px solid ${opts.color};
          border-radius:999px;display:flex;align-items:center;justify-content:center;
          font-size:12px;font-weight:800;line-height:1;box-shadow:0 2px 6px rgba(0,0,0,.25);z-index:2;
        ">${opts.count}</div>
        <div style="
          width:46px;height:46px;background:${opts.color};border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          border:3px solid white;box-shadow:0 4px 14px rgba(0,0,0,.3);
        ">
          ${opts.iconSvg ? `<svg style="width:22px;height:22px" fill="white" viewBox="0 0 24 24">${opts.iconSvg}</svg>` : ''}
        </div>
        <div style="
          margin-top:4px;max-width:110px;padding:2px 6px;background:rgba(255,255,255,.95);
          border-radius:6px;font-size:10px;font-weight:600;color:#111;white-space:nowrap;
          overflow:hidden;text-overflow:ellipsis;box-shadow:0 1px 4px rgba(0,0,0,.2);
        ">${opts.label}</div>
      </div>
    `;
    el.addEventListener('click', (event) => {
      event.stopPropagation();
      opts.onClick();
    });
    return new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map.current);
  };

  const fitToPlaces = (list: Place[]) => {
    if (!map.current || list.length === 0) return;
    if (list.length === 1) {
      map.current.flyTo({ center: [list[0].longitude, list[0].latitude], zoom: 16, duration: 900 });
      return;
    }
    const bounds = new mapboxgl.LngLatBounds(
      [list[0].longitude, list[0].latitude],
      [list[0].longitude, list[0].latitude]
    );
    list.forEach((p) => bounds.extend([p.longitude, p.latitude]));
    map.current.fitBounds(bounds, { padding: 70, duration: 900, maxZoom: 16 });
  };

  const updateMarkers = () => {
    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    if (!map.current || !mapLoaded) {
      console.log('Map not ready for markers');
      return;
    }

    // Use provided places or fallback to mock
    const allPlaces = places && places.length > 0 ? places : mockPlaces;
    const filteredPlaces = (selectedCategory === 'Todos'
      ? allPlaces
      : allPlaces.filter((place: Place) => {
          const type = resolveBusinessType((place as any).businessType || place.category);
          return type === selectedCategory || place.category === selectedCategory;
        })
    ).filter((p: Place) => Number(p.latitude) && Number(p.longitude));

    const centroid = (list: Place[]) => {
      const lat = list.reduce((s, p) => s + Number(p.latitude), 0) / list.length;
      const lng = list.reduce((s, p) => s + Number(p.longitude), 0) / list.length;
      return { lat, lng };
    };

    const addAll = (list: Place[]) => {
      list.forEach((place: Place) => {
        const marker = createMarker(place);
        if (marker) markers.current.push(marker);
      });
    };

    const effectiveCategory = selectedCategory !== 'Todos' ? selectedCategory : expandedCategory;

    // LEVEL 1 — one marker per category
    if (!effectiveCategory) {
      const byType = new Map<string, Place[]>();
      filteredPlaces.forEach((p: Place) => {
        const type = resolveBusinessType((p as any).businessType || p.category);
        byType.set(type, [...(byType.get(type) || []), p]);
      });
      if (byType.size <= 1) {
        addAll(filteredPlaces);
        return;
      }
      byType.forEach((list, type) => {
        const c = centroid(list);
        const marker = createGroupMarker(c.lng, c.lat, {
          label: type,
          count: list.length,
          color: getCategoryColor(type),
          iconSvg: getCategoryIcon(type),
          onClick: () => {
            setExpandedCategory(type);
            setExpandedZone(null);
            fitToPlaces(list);
          },
        });
        if (marker) markers.current.push(marker);
      });
      return;
    }

    const inCategory = filteredPlaces.filter((p: Place) => {
      const type = resolveBusinessType((p as any).businessType || p.category);
      return type === effectiveCategory || p.category === effectiveCategory;
    });

    const color = getCategoryColor(effectiveCategory);
    const iconSvg = getCategoryIcon(effectiveCategory);

    // LEVEL 2 — group that category by zone / neighborhood
    if (!expandedZone) {
      const byZone = new Map<string, Place[]>();
      inCategory.forEach((p: Place) => {
        const zone = (p.neighborhood || p.zone || 'Otras zonas').toString();
        byZone.set(zone, [...(byZone.get(zone) || []), p]);
      });
      if (byZone.size <= 1 || inCategory.length <= 6) {
        addAll(inCategory);
        return;
      }
      byZone.forEach((list, zone) => {
        const c = centroid(list);
        const marker = createGroupMarker(c.lng, c.lat, {
          label: zone,
          count: list.length,
          color,
          iconSvg,
          onClick: () => {
            setExpandedZone(zone);
            fitToPlaces(list);
          },
        });
        if (marker) markers.current.push(marker);
      });
      return;
    }

    // LEVEL 3 — individual businesses inside the zone
    addAll(
      inCategory.filter(
        (p: Place) => (p.neighborhood || p.zone || 'Otras zonas').toString() === expandedZone
      )
    );
  };


  const initializeMap = () => {
    if (!mapContainer.current) {
      console.log('Map container not ready');
      return;
    }

    console.log('Initializing map');
    setIsLoading(true);
    
    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;

      // Check if mobile
      const isMobile = window.innerWidth < 768;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [city.longitude, city.latitude],
        zoom: isMobile ? city.zoom + 0.5 : city.zoom,
        pitch: 0,
      });
      
      // On mobile, keep basic interactions but disable scroll zoom to avoid conflicts with page scrolling
      if (isMobile) {
        map.current.scrollZoom.disable();
      }

      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setIsLoading(false);
        setMapLoaded(true);
      });

      map.current.on('click', () => {
        setActivePlace(null);
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    } catch (error) {
      console.error('Error initializing map:', error);
      setIsLoading(false);
    }
  };

  // Effect to update markers when category changes or map loads
  useEffect(() => {
    if (map.current && mapLoaded) {
      console.log('Updating markers for category:', selectedCategory);
      updateMarkers();
    }
  }, [selectedCategory, mapLoaded, places]);

  // Effect to center map on selected neighborhood
  useEffect(() => {
    if (map.current && mapLoaded && selectedNeighborhood) {
      const location = neighborhoodLocations[selectedNeighborhood];
      if (location) {
        console.log('Flying to neighborhood:', selectedNeighborhood);
        map.current.flyTo({
          center: location.coordinates,
          zoom: location.zoom,
          duration: 1500,
          essential: true
        });
      }
    }
  }, [selectedNeighborhood, mapLoaded]);

  // Recenter when the selected city changes
  useEffect(() => {
    if (map.current && mapLoaded) {
      map.current.flyTo({
        center: [city.longitude, city.latitude],
        zoom: city.zoom,
        duration: 1200,
        essential: true,
      });
    }
  }, [city.id, mapLoaded]);

  // Fly to focused coordinates when badge is clicked
  useEffect(() => {
    if (map.current && mapLoaded && focusCoordinates) {
      map.current.flyTo({
        center: [focusCoordinates.lng, focusCoordinates.lat],
        zoom: focusCoordinates.zoom ?? 16,
        duration: 1200,
        essential: true,
      });
    }
  }, [focusCoordinates?.key, focusCoordinates?.lat, focusCoordinates?.lng, mapLoaded]);

  // Add user-location marker
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    if (userMarker.current) {
      userMarker.current.remove();
      userMarker.current = null;
    }
    if (userPosition) {
      const el = document.createElement('div');
      el.style.cssText = 'width:18px;height:18px;border-radius:50%;background:#2563eb;border:3px solid white;box-shadow:0 0 0 4px rgba(37,99,235,0.3);';
      userMarker.current = new mapboxgl.Marker(el)
        .setLngLat([userPosition.lng, userPosition.lat])
        .addTo(map.current);
    }
  }, [userPosition?.lat, userPosition?.lng, mapLoaded]);

  // Auto-recalculate active route when origin (user position or manual) changes
  useEffect(() => {
    if (!routeInfo) return;
    const origin = getOrigin();
    if (!origin) return;
    // Re-fetch directions to the same destination using the new origin
    drawRouteToPlace({
      id: 'active-route',
      name: routeInfo.name,
      latitude: routeInfo.lat,
      longitude: routeInfo.lng,
    } as unknown as Place, { fitBounds: false });
    // We intentionally exclude routeInfo to avoid feedback loops; we trigger on origin change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPosition?.lat, userPosition?.lng, manualOrigin?.lat, manualOrigin?.lng, mapLoaded]);

  // Initialize map on mount
  useEffect(() => {
    if (!mapContainer.current) return;
    
    console.log('Initializing map on mount');
    initializeMap();

    return () => {
      if (map.current) {
        console.log('Cleaning up map');
        markers.current.forEach(marker => marker.remove());
        map.current.remove();
        setMapLoaded(false);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-background">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      {onToggleExpand && (
        <button
          onClick={onToggleExpand}
          aria-label={expanded ? 'Reducir mapa' : 'Ampliar mapa'}
          className="absolute top-2 right-2 z-[1] bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-md p-2 hover:bg-card active:scale-95 transition-all"
          style={{ marginTop: expanded ? '0' : '0' }}
        >
          {expanded ? <Minimize2 className="h-4 w-4 text-foreground" /> : <Maximize2 className="h-4 w-4 text-foreground" />}
        </button>
      )}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Cargando mapa...</p>
          </div>
        </div>
      )}
      {activePlace && (
        <div className="absolute left-2 right-2 bottom-2 z-30 sm:left-4 sm:right-auto sm:bottom-4 sm:w-[320px] max-w-[calc(100%-1rem)] sm:max-w-[min(320px,calc(100%-2rem))]">
          <div className="rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur-md">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-foreground">{activePlace.name}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-flex rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                    {activePlace.category}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">📍 {activePlace.address}</p>
                {activePlace.rating ? (
                  <p className="mt-1 text-xs font-medium text-foreground">⭐ {activePlace.rating}/5</p>
                ) : null}
              </div>
              <button
                onClick={() => setActivePlace(null)}
                aria-label="Cerrar información del lugar"
                className="shrink-0 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setActivePlace(null);
                  navigate(`/place/${activePlace.id}`);
                }}
                className="w-full"
              >
                Ver lugar
              </Button>
              <Button
                size="sm"
                onClick={() => drawRouteToPlace(activePlace)}
                className="w-full"
              >
                Cómo llegar
              </Button>
            </div>
          </div>
        </div>
      )}
      {routeInfo && (
        <div className="absolute left-2 right-2 bottom-2 z-20 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-lg p-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">🚗 Ruta a {routeInfo.name}</p>
            <p className="text-xs text-muted-foreground">
              {routeInfo.distanceKm.toFixed(1)} km · ~{routeInfo.durationMin} min en auto
            </p>
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${routeInfo.lat},${routeInfo.lng}&travelmode=driving`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:bg-primary/90 active:scale-95 transition-all whitespace-nowrap"
          >
            Navegar
          </a>
          <button
            onClick={clearRoute}
            aria-label="Cerrar ruta"
            className="text-xs font-bold bg-muted text-foreground w-8 h-8 rounded-lg hover:bg-muted/80 active:scale-95 transition-all flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      )}

      {/* Manual origin chip (when used) */}
      {!userPosition && manualOrigin && !routeInfo && (
        <div className="absolute left-2 top-2 z-20 bg-card/95 backdrop-blur-md border border-border rounded-full shadow-md px-3 py-1.5 flex items-center gap-2 max-w-[calc(100%-1rem)]">
          <MapPin className="h-3.5 w-3.5 text-green-600 shrink-0" />
          <span className="text-xs text-foreground truncate">Saliendo desde: <strong>{manualOrigin.label}</strong></span>
          <button
            onClick={() => setOriginDialogOpen(true)}
            className="text-xs font-semibold text-primary hover:underline shrink-0"
          >
            cambiar
          </button>
          <button
            onClick={clearManualOrigin}
            aria-label="Quitar origen manual"
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* Manual origin dialog */}
      <Dialog open={originDialogOpen} onOpenChange={(open) => {
        setOriginDialogOpen(open);
        if (!open) {
          setOriginError(null);
          setOriginSuggestions([]);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ingresa tu ubicación de salida</DialogTitle>
            <DialogDescription>
              No detectamos tu ubicación. Escribe una dirección, barrio o lugar conocido para trazar la ruta.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ej: Avenida 6N #25-50, Granada"
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

          {originError && (
            <p className="text-xs text-destructive">{originError}</p>
          )}

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

export default MapComponent;
