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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group active:scale-[0.98] touch-manipulation">
      <div 
        className="relative h-40 sm:h-48 overflow-hidden"
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
      
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-1.5 sm:mb-2">
          <h3 className="font-semibold text-base sm:text-lg line-clamp-1">{place.name}</h3>
          {place.rating && (
            <div className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm">
              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-secondary text-secondary" />
              <span className="font-medium">{place.rating}</span>
            </div>
          )}
        </div>
        
        <Badge variant="outline" className="mb-1.5 sm:mb-2 text-xs">
          {place.category}
        </Badge>

        {/* Food Types - Only for Restaurants */}
        {place.foodType && place.foodType.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1.5 sm:mb-2">
            {place.foodType.slice(0, 2).map((type) => (
              <Badge key={type} variant="secondary" className="text-[10px] sm:text-xs">
                🍽️ {type}
              </Badge>
            ))}
          </div>
        )}

        {/* Características */}
        <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
          {place.familyFriendly && (
            <Badge variant="outline" className="text-xs">
              👨‍👩‍👧‍👦
            </Badge>
          )}
          {place.petFriendly && (
            <Badge variant="outline" className="text-xs">
              🐕
            </Badge>
          )}
          {place.goodForCouples && (
            <Badge variant="outline" className="text-xs">
              💑
            </Badge>
          )}
          {place.goodForKids && (
            <Badge variant="outline" className="text-xs">
              👶
            </Badge>
          )}
        </div>
        
        <div className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">
          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{place.address}</span>
        </div>
        
        {place.phone && (
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
            <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{place.phone}</span>
          </div>
        )}
        
        <Button 
          className="w-full h-9 sm:h-10 text-sm active:scale-95 transition-transform touch-manipulation"
          onClick={() => navigate(`/place/${place.id}`)}
        >
          Ver más detalles
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlaceCard;
