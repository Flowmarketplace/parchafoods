import { useState, useCallback, useRef, useEffect } from 'react';
import { MapPin, Star, Heart, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Place } from '@/types/place';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

interface PlaceCardProps {
  place: Place;
  featured?: boolean;
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

const PlaceCard = ({ place, featured }: PlaceCardProps) => {
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

  const isFeaturedCard = featured || place.featured;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer active:scale-[0.97] transition-all duration-300 touch-manipulation bg-card border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20"
      onClick={handleClick}
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

      {/* Image section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={place.images[0]}
          alt={place.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top badges row */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex gap-1.5">
            {isFeaturedCard && (
              <span className="px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold shadow-lg">
                ⭐ Destacado
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full bg-card/90 backdrop-blur-md text-foreground text-xs font-medium shadow-sm">
              {place.category}
            </span>
          </div>
          
          {userId && (
            <button
              onClick={toggleFavorite}
              className="w-9 h-9 rounded-full bg-card/80 backdrop-blur-md flex items-center justify-center shadow-sm hover:bg-card transition-colors"
            >
              <Heart className={`h-4 w-4 transition-all ${isFavorite ? 'fill-destructive text-destructive scale-110' : 'text-foreground'}`} />
            </button>
          )}
        </div>

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1 line-clamp-1 drop-shadow-md">
            {place.name}
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-white/80" />
              <span className="text-xs text-white/90 line-clamp-1">{place.neighborhood || place.address}</span>
            </div>
            {place.rating && (
              <div className="flex items-center gap-1 bg-accent/90 px-2 py-0.5 rounded-full">
                <Star className="h-3 w-3 fill-accent-foreground text-accent-foreground" />
                <span className="text-xs font-bold text-accent-foreground">{place.rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="p-4">
        {/* Price and details */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-wrap gap-1.5">
            {place.priceRange && (
              <Badge variant="secondary" className="text-xs font-medium">
                💰 {place.priceRange}
              </Badge>
            )}
            {place.zone && (
              <Badge variant="outline" className="text-xs">
                📍 {place.zone}
              </Badge>
            )}
          </div>
        </div>

        {/* Quick tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {place.familyFriendly && <span className="text-xs bg-muted px-2 py-0.5 rounded-full">👨‍👩‍👧‍👦 Familiar</span>}
          {place.petFriendly && <span className="text-xs bg-muted px-2 py-0.5 rounded-full">🐕 Pet Friendly</span>}
          {place.goodForCouples && <span className="text-xs bg-muted px-2 py-0.5 rounded-full">💑 Parejas</span>}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-sm font-medium text-primary">Ver detalles</span>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <ArrowRight className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaceCard;
