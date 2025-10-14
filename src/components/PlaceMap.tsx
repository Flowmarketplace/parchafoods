import { useState } from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlaceMapProps {
  latitude: number;
  longitude: number;
  placeName: string;
  category: string;
}

const PlaceMap = ({ latitude, longitude, placeName }: PlaceMapProps) => {
  const [mapError, setMapError] = useState(false);
  const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const openInMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  const handleMapError = () => {
    setMapError(true);
  };

  if (mapError) {
    return (
      <div className="w-full h-full rounded-lg bg-muted/30 flex flex-col items-center justify-center gap-4 p-6">
        <MapPin className="h-12 w-12 text-muted-foreground" />
        <p className="text-sm text-muted-foreground text-center">
          No pudimos cargar el mapa
        </p>
        <Button
          onClick={() => window.open(openInMapsUrl, '_blank')}
          className="gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Abrir en Google Maps
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <iframe
        src={mapUrl}
        className="w-full h-full rounded-lg"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Mapa de ${placeName}`}
        onError={handleMapError}
      />
      <Button
        onClick={() => window.open(openInMapsUrl, '_blank')}
        className="absolute bottom-4 right-4 gap-2 shadow-lg"
        size="sm"
      >
        <ExternalLink className="h-4 w-4" />
        Abrir en Maps
      </Button>
    </div>
  );
};

export default PlaceMap;
