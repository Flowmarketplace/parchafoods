import { Event } from '@/types/event';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();

  // Format date
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
      onClick={() => navigate(`/event/${event.id}`)}
    >
      <div className="relative h-36 sm:h-40 md:h-48 overflow-hidden">
        <img
          src={event.images[0]}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {event.featured && (
          <Badge className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-secondary text-xs">
            Destacado
          </Badge>
        )}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
          <Badge variant="outline" className="bg-background/90 backdrop-blur-sm text-xs">
            {event.type}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-3 sm:p-4">
        <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {event.name}
        </h3>

        {/* Event Tags */}
        <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
          {event.isFree && (
            <Badge variant="secondary" className="text-[10px] sm:text-xs">
              🎟️ Gratis
            </Badge>
          )}
          {event.isNew && (
            <Badge variant="secondary" className="text-[10px] sm:text-xs">
              ✨ Nuevo
            </Badge>
          )}
          {event.hasPromotion && (
            <Badge variant="secondary" className="text-[10px] sm:text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
              🎁 Promoción
            </Badge>
          )}
          {event.familyFriendly && (
            <Badge variant="outline" className="text-[10px] sm:text-xs">
              👨‍👩‍👧‍👦
            </Badge>
          )}
          {event.goodForCouples && (
            <Badge variant="outline" className="text-[10px] sm:text-xs">
              💑
            </Badge>
          )}
        </div>
        
        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-start gap-1.5 sm:gap-2">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />
            <span className="capitalize">{formattedDate}</span>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-start gap-1.5 sm:gap-2">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0 text-primary" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Ticket className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="font-semibold text-foreground">{event.price}</span>
          </div>
        </div>
        
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3 line-clamp-2">
          {event.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default EventCard;
