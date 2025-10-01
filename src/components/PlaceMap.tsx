import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { getCategoryIcon, getCategoryColor } from '@/utils/categoryIcons';
import { useMapboxToken } from '@/hooks/useMapboxToken';

interface PlaceMapProps {
  latitude: number;
  longitude: number;
  placeName: string;
  category: string;
}

const PlaceMap = ({ latitude, longitude, placeName, category }: PlaceMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { token: mapboxToken, isLoading, error } = useMapboxToken();

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: 15,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Create custom marker
    const iconSvg = getCategoryIcon(category);
    const color = getCategoryColor(category);
    
    const el = document.createElement('div');
    el.style.width = '50px';
    el.style.height = '50px';
    el.innerHTML = `
      <div style="
        width: 50px;
        height: 50px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        border: 4px solid white;
      ">
        <svg 
          style="transform: rotate(45deg); width: 24px; height: 24px;" 
          fill="white" 
          viewBox="0 0 24 24"
        >
          ${iconSvg}
        </svg>
      </div>
    `;

    new mapboxgl.Marker(el)
      .setLngLat([longitude, latitude])
      .addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude, placeName, category, mapboxToken]);

  if (isLoading) {
    return (
      <div className="w-full h-full bg-muted flex items-center justify-center rounded-lg">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  if (error || !mapboxToken) {
    return (
      <div className="w-full h-full bg-muted flex items-center justify-center rounded-lg">
        <div className="text-center p-6">
          <p className="text-muted-foreground">
            {error || 'No se pudo cargar el mapa'}
          </p>
        </div>
      </div>
    );
  }

  return <div ref={mapContainer} className="w-full h-full rounded-lg" />;
};

export default PlaceMap;
