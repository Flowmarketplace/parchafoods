import { useState, useCallback, useRef, useEffect } from 'react';
import { MapPin, Star, Phone, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Place } from '@/types/place';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface PlaceCardProps {
  place: Place;
}

const EMOJIS = ['⚽', '🏆', '🎉', '⭐', '🥅'];

interface Spark {
  id: number;
  emoji: string;
  x: number;
  y: number;
  angle: number;
  distance: number;
}

const PlaceCard = ({ place }: PlaceCardProps) => {
  const navigate = useNavigate();
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        supabase
          .from('user_favorites')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('business_id', place.id)
          .maybeSingle()
          .then(({ data }) => setIsFavorite(!!data));
      }
    });
  }, [place.id]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) return;
    if (isFavorite) {
      await supabase.from('user_favorites').delete().eq('user_id', userId).eq('business_id', place.id);
      setIsFavorite(false);
    } else {
      await supabase.from('user_favorites').insert({ user_id: userId, business_id: place.id });
      setIsFavorite(true);
    }
  };

  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newSparks: Spark[] = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      emoji: EMOJIS[i % EMOJIS.length],
      x,
      y,
      angle: (360 / 6) * i + Math.random() * 30,
      distance: 30 + Math.random() * 30,
    }));

    setSparks(newSparks);
    setTimeout(() => setSparks([]), 600);
    setTimeout(() => navigate(`/place/${place.slug || place.id}`), 200);
  }, [navigate, place.slug, place.id]);

  return (
    <Card
      ref={cardRef}
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group active:scale-[0.98] touch-manipulation relative"
    >
      {/* Micro-burst sparks */}
      {sparks.map((s) => (
        <span
          key={s.id}
          className="absolute z-20 pointer-events-none animate-card-spark"
          style={{
            left: s.x,
            top: s.y,
            fontSize: '14px',
            '--spark-x': `${Math.cos((s.angle * Math.PI) / 180) * s.distance}px`,
            '--spark-y': `${Math.sin((s.angle * Math.PI) / 180) * s.distance}px`,
          } as React.CSSProperties}
        >
          {s.emoji}
        </span>
      ))}

      <div className="relative h-40 sm:h-48 overflow-hidden" onClick={handleClick}>
        <img
          src={place.images[0]}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {place.featured && (
          <Badge className="absolute top-2 right-2 bg-secondary">Destacado</Badge>
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

        <div className="flex flex-wrap gap-1.5 mb-1.5 sm:mb-2">
          <Badge variant="outline" className="text-xs">
            {place.category}
          </Badge>
          {place.priceRange && (
            <Badge variant="secondary" className="text-[10px] sm:text-xs">
              💰 {place.priceRange}
            </Badge>
          )}
        </div>

        {place.foodType && place.foodType.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1.5 sm:mb-2">
            {place.foodType.slice(0, 2).map((type) => (
              <Badge key={type} variant="secondary" className="text-[10px] sm:text-xs">
                🍽️ {type}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
          {place.familyFriendly && <Badge variant="outline" className="text-xs">👨‍👩‍👧‍👦</Badge>}
          {place.petFriendly && <Badge variant="outline" className="text-xs">🐕</Badge>}
          {place.goodForCouples && <Badge variant="outline" className="text-xs">💑</Badge>}
          {place.goodForKids && <Badge variant="outline" className="text-xs">👶</Badge>}
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
          onClick={handleClick}
        >
          Ver más detalles
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlaceCard;
