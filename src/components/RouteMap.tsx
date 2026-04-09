import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getCategoryColor } from '@/utils/categoryIcons';
import { MapPin, Navigation, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiaGFuZGNpdHkiLCJhIjoiY2syNmp3ZjUxMzJkMzNtcGl6dXR6ZTV0diJ9.0xE-C5rlwWBM80gUY1POzw';

interface RoutePlace {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  slug?: string;
}

interface RouteMapProps {
  places: RoutePlace[];
  category: string;
  routeName: string;
  routeEmoji?: string;
}

const RouteMap = ({ places, category, routeName, routeEmoji = '🗺️' }: RouteMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [expanded, setExpanded] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  const validPlaces = places.filter(p => p.latitude && p.longitude && p.latitude !== 0 && p.longitude !== 0);

  useEffect(() => {
    if (!mapContainer.current || validPlaces.length === 0) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const bounds = new mapboxgl.LngLatBounds();
    validPlaces.forEach(p => bounds.extend([p.longitude, p.latitude]));

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      bounds,
      fitBoundsOptions: { padding: 60, maxZoom: 14 },
    });

    map.current = m;

    m.addControl(new mapboxgl.NavigationControl(), 'top-right');

    m.on('load', () => {
      setMapReady(true);
      const color = getCategoryColor(category);

      // Add numbered markers
      validPlaces.forEach((place, index) => {
        const el = document.createElement('div');
        el.style.cssText = `
          width: 36px; height: 36px; cursor: pointer;
          position: relative;
        `;
        el.innerHTML = `
          <div style="
            width: 36px; height: 36px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: white; font-weight: 800; font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            position: relative; z-index: 2;
          ">${index + 1}</div>
        `;

        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setHTML(`
            <div style="padding: 4px 8px; max-width: 200px;">
              <div style="font-weight: 700; font-size: 13px; margin-bottom: 2px;">
                ${index + 1}. ${place.name}
              </div>
              ${place.address ? `<div style="font-size: 11px; color: #666;">${place.address}</div>` : ''}
            </div>
          `);

        new mapboxgl.Marker({ element: el })
          .setLngLat([place.longitude, place.latitude])
          .setPopup(popup)
          .addTo(m);
      });

      // Draw route line connecting all places in order
      if (validPlaces.length >= 2) {
        const coordinates = validPlaces.map(p => [p.longitude, p.latitude]);
        
        m.addSource('route-line', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates,
            },
          },
        });

        // Dashed background line
        m.addLayer({
          id: 'route-bg',
          type: 'line',
          source: 'route-line',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': color,
            'line-width': 4,
            'line-opacity': 0.25,
          },
        });

        // Main route line dashed
        m.addLayer({
          id: 'route-main',
          type: 'line',
          source: 'route-line',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': color,
            'line-width': 3,
            'line-dasharray': [2, 2],
            'line-opacity': 0.7,
          },
        });
      }
    });

    return () => {
      m.remove();
      map.current = null;
      setMapReady(false);
    };
  }, [validPlaces.length, category]);

  if (validPlaces.length === 0) return null;

  return (
    <div className="mb-4 sm:mb-6 rounded-xl overflow-hidden border border-border bg-card shadow-sm">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted/70 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{routeEmoji}</span>
          <div className="text-left">
            <h3 className="text-sm font-bold">{routeName}</h3>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {validPlaces.length} paradas · Ruta recomendada
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {expanded && (
        <div className="relative">
          {/* Map */}
          <div ref={mapContainer} className="w-full h-[250px] sm:h-[300px]" />

          {/* Route legend overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent px-3 py-2">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
              {validPlaces.map((p, i) => (
                <div
                  key={p.id}
                  className="shrink-0 flex items-center gap-1 bg-card/90 backdrop-blur-sm border rounded-full px-2 py-0.5 text-[10px]"
                >
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                    style={{ background: getCategoryColor(category) }}
                  >
                    {i + 1}
                  </span>
                  <span className="truncate max-w-[80px] font-medium">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteMap;
