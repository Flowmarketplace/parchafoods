import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Place } from '@/types/place';
import { mockPlaces } from '@/data/places';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { getCategoryIcon, getCategoryColor } from '@/utils/categoryIcons';
import { neighborhoodLocations } from '@/data/neighborhoods';
import { supabase } from '@/integrations/supabase/client';

interface MapComponentProps {
  selectedNeighborhood?: string;
  selectedCategory?: string;
}

const MapComponent = ({ selectedNeighborhood = 'Todos', selectedCategory = 'Todos' }: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const navigate = useNavigate();

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

      el.addEventListener('click', () => {
        navigate(`/place/${place.id}`);
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

    // Filter places based on category
    const filteredPlaces = selectedCategory === 'Todos' 
      ? mockPlaces 
      : mockPlaces.filter(place => place.category === selectedCategory);

    // Add new markers
    filteredPlaces.forEach((place: Place) => {
      const marker = createMarker(place);
      if (marker) {
        markers.current.push(marker);
      }
    });
  };

  const initializeMap = (token: string) => {
    if (!mapContainer.current) {
      console.log('Map container not ready');
      return;
    }

    console.log('Initializing map with token');
    setIsLoading(true);
    
    try {
      mapboxgl.accessToken = token;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-76.5225, 3.4516], // Cali, Colombia
        zoom: 12,
      });

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
    if (map.current && mapLoaded && !showTokenInput) {
      console.log('Updating markers for category:', selectedCategory);
      updateMarkers();
    }
  }, [selectedCategory, mapLoaded, showTokenInput]);

  // Effect to center map on selected neighborhood
  useEffect(() => {
    if (map.current && mapLoaded && selectedNeighborhood && !showTokenInput) {
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
  }, [selectedNeighborhood, mapLoaded, showTokenInput]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken.trim()) {
      console.log('Saving token and initializing map');
      localStorage.setItem('mapbox_token', mapboxToken);
      setShowTokenInput(false);
      setTimeout(() => {
        initializeMap(mapboxToken);
      }, 100);
    }
  };

  // Try to fetch token from backend, fallback to localStorage or manual input
  useEffect(() => {
    const fetchTokenAndInitMap = async () => {
      try {
        console.log('Attempting to fetch Mapbox token from backend');
        setIsLoading(true);
        
        const { data, error: fetchError } = await supabase.functions.invoke('get-mapbox-token');
        
        if (!fetchError && data?.token) {
          console.log('Token received from backend, initializing map');
          setTimeout(() => {
            initializeMap(data.token);
          }, 100);
          return;
        }
        
        // Fallback to localStorage
        const savedToken = localStorage.getItem('mapbox_token');
        if (savedToken) {
          console.log('Using saved token from localStorage');
          setMapboxToken(savedToken);
          setShowTokenInput(false);
          setTimeout(() => {
            initializeMap(savedToken);
          }, 100);
        } else {
          console.log('No token found, showing input form');
          setShowTokenInput(true);
          setIsLoading(false);
        }
        
      } catch (err) {
        console.error('Error fetching token:', err);
        // Fallback to localStorage
        const savedToken = localStorage.getItem('mapbox_token');
        if (savedToken) {
          console.log('Using saved token from localStorage after error');
          setMapboxToken(savedToken);
          setShowTokenInput(false);
          setTimeout(() => {
            initializeMap(savedToken);
          }, 100);
        } else {
          setShowTokenInput(true);
          setIsLoading(false);
        }
      }
    };

    fetchTokenAndInitMap();

    return () => {
      if (map.current) {
        console.log('Cleaning up map');
        markers.current.forEach(marker => marker.remove());
        map.current.remove();
        setMapLoaded(false);
      }
    };
  }, []);

  if (showTokenInput) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/30 p-4">
        <Card className="p-4 sm:p-6 max-w-md w-full">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <h2 className="text-lg sm:text-xl font-semibold">Configurar Mapa</h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            Para mostrar el mapa interactivo, ingresa tu token público de Mapbox.
          </p>
          <form onSubmit={handleTokenSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <Input
                type="text"
                placeholder="pk.eyJ1Ij..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="w-full text-sm"
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
            <Button type="submit" className="w-full text-sm">
              Cargar Mapa
            </Button>
          </form>
        </Card>
      </div>
    );
  }

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
    </div>
  );
};

export default MapComponent;
