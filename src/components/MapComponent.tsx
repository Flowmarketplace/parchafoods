import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Place } from '@/types/place';
import { mockPlaces } from '@/data/places';
import { useNavigate } from 'react-router-dom';
import { getCategoryIcon, getCategoryColor } from '@/utils/categoryIcons';
import { neighborhoodLocations } from '@/data/neighborhoods';

// Mapbox public token (safe to expose in frontend)
const MAPBOX_TOKEN = 'pk.eyJ1IjoiaGFuZGNpdHkiLCJhIjoiY2syNmp3ZjUxMzJkMzNtcGl6dXR6ZTV0diJ9.0xE-C5rlwWBM80gUY1POzw';

interface MapComponentProps {
  selectedNeighborhood?: string;
  selectedCategory?: string;
  places?: Place[];
  focusCoordinates?: { lat: number; lng: number; zoom?: number; key?: string | number } | null;
  userPosition?: { lat: number; lng: number } | null;
}

const MapComponent = ({ selectedNeighborhood = 'Todos', selectedCategory = 'Todos', places, focusCoordinates, userPosition }: MapComponentProps) => {
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

  const drawRouteToPlace = async (place: Place) => {
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

      // Fit bounds to route
      const coords: [number, number][] = route.geometry.coordinates;
      const bounds = coords.reduce(
        (b, c) => b.extend(c as [number, number]),
        new mapboxgl.LngLatBounds(coords[0], coords[0])
      );
      map.current.fitBounds(bounds, { padding: 60, duration: 1200, maxZoom: 15 });

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
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?proximity=-76.5225,3.4516&country=co&limit=5&access_token=${MAPBOX_TOKEN}`;
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
      const iconSvg = getCategoryIcon(place.category);
      const color = getCategoryColor(place.category);
      
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

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 12px; min-width: 200px;">
          <h3 style="font-weight: 600; margin-bottom: 6px; font-size: 15px; color: #333;">${place.name}</h3>
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
            <span style="background: ${color}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">
              ${place.category}
            </span>
          </div>
          <p style="color: #666; font-size: 12px; margin-bottom: 4px;">📍 ${place.address}</p>
          ${place.rating ? `<p style="color: #ff5722; font-size: 12px; font-weight: 500;">⭐ ${place.rating}/5</p>` : ''}
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([place.longitude, place.latitude])
        .setPopup(popup)
        .addTo(map.current);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        drawRouteToPlace(place);
      });

      return marker;
    } catch (error) {
      console.error('Error creating marker for place:', place.name, error);
      return null;
    }
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
    const filteredPlaces = selectedCategory === 'Todos' 
      ? allPlaces 
      : allPlaces.filter(place => place.category === selectedCategory);

    // Add new markers
    filteredPlaces.forEach((place: Place) => {
      const marker = createMarker(place);
      if (marker) {
        markers.current.push(marker);
      }
    });
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
        center: [-76.5225, 3.4516], // Cali, Colombia
        zoom: isMobile ? 13.5 : 12,
        pitch: isMobile ? 0 : 0,
        maxBounds: isMobile ? [
          [-76.6, 3.35], // Southwest coordinates
          [-76.45, 3.55]  // Northeast coordinates
        ] : undefined,
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
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Cargando mapa...</p>
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
    </div>
  );
};

export default MapComponent;
