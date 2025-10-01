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
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.images[0]}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {event.featured && (
          <Badge className="absolute top-3 right-3 bg-secondary">
            Destacado
          </Badge>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
            {event.type}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {event.name}
        </h3>

        {/* Event Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {event.isFree && (
            <Badge variant="secondary" className="text-xs">
              🎟️ Gratis
            </Badge>
          )}
          {event.isNew && (
            <Badge variant="secondary" className="text-xs">
              ✨ Nuevo
            </Badge>
          )}
          {event.hasPromotion && (
            <Badge variant="secondary" className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
              🎁 Promoción
            </Badge>
          )}
          {event.familyFriendly && (
            <Badge variant="outline" className="text-xs">
              👨‍👩‍👧‍👦
            </Badge>
          )}
          {event.goodForCouples && (
            <Badge variant="outline" className="text-xs">
              💑
            </Badge>
          )}
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="capitalize">{formattedDate}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 flex-shrink-0" />
            <span className="font-semibold text-foreground">{event.price}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
          {event.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default EventCard;
