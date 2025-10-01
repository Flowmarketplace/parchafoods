import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Place } from '@/types/place';
import { mockPlaces } from '@/data/places';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const navigate = useNavigate();

  const initializeMap = (token: string) => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-76.5225, 3.4516], // Cali, Colombia
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for places
    mockPlaces.forEach((place: Place) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.cursor = 'pointer';
      el.innerHTML = `
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #007bff, #ff5722);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
          border: 3px solid white;
        ">
          <svg 
            style="transform: rotate(45deg); width: 20px; height: 20px;" 
            fill="white" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px;">
          <h3 style="font-weight: 600; margin-bottom: 4px; font-size: 14px;">${place.name}</h3>
          <p style="color: #666; margin-bottom: 4px; font-size: 12px;">${place.category}</p>
          <p style="color: #888; font-size: 11px;">${place.address}</p>
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([place.longitude, place.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      el.addEventListener('click', () => {
        navigate(`/place/${place.id}`);
      });
    });
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setShowTokenInput(false);
      initializeMap(mapboxToken);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
      setShowTokenInput(false);
      initializeMap(savedToken);
    }

    return () => {
      map.current?.remove();
    };
  }, []);

  if (showTokenInput) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/30">
        <Card className="p-6 max-w-md w-full mx-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Configurar Mapa</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Para mostrar el mapa interactivo, necesitas un token público de Mapbox.
          </p>
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Ingresa tu token público de Mapbox"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Obtén tu token en{' '}
                <a
                  href="https://mapbox.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  mapbox.com
                </a>
              </p>
            </div>
            <Button type="submit" className="w-full">
              Cargar Mapa
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default MapComponent;
