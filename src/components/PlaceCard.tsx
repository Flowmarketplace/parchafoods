import { MapPin, Star, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Place } from '@/types/place';
import { useNavigate } from 'react-router-dom';

interface PlaceCardProps {
  place: Place;
}

const PlaceCard = ({ place }: PlaceCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div 
        className="relative h-48 overflow-hidden"
        onClick={() => navigate(`/place/${place.id}`)}
      >
        <img
          src={place.images[0]}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {place.featured && (
          <Badge className="absolute top-2 right-2 bg-secondary">
            Destacado
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{place.name}</h3>
          {place.rating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-secondary text-secondary" />
              <span className="font-medium">{place.rating}</span>
            </div>
          )}
        </div>
        
        <Badge variant="outline" className="mb-2">
          {place.category}
        </Badge>
        
        <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{place.address}</span>
        </div>
        
        {place.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Phone className="h-4 w-4" />
            <span>{place.phone}</span>
          </div>
        )}
        
        <Button 
          className="w-full"
          onClick={() => navigate(`/place/${place.id}`)}
        >
          Ver más detalles
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlaceCard;
