import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, ChevronRight } from 'lucide-react';
import { getBusinessTypeColor } from '@/data/categories';

interface RecommendedPlansProps {
  places: any[];
  cityLabel: string;
}

const PLAN_TYPES: { type: string; label: string; emoji: string }[] = [
  { type: 'Comida', label: 'Dónde comer', emoji: '🍽️' },
  { type: 'Hospedaje', label: 'Dónde dormir', emoji: '🛏️' },
  { type: 'Entretenimiento', label: 'Qué hacer', emoji: '🎉' },
];

const RecommendedPlans = ({ places, cityLabel }: RecommendedPlansProps) => {
  const navigate = useNavigate();

  const plans = useMemo(() => {
    const result: any[] = [];
    PLAN_TYPES.forEach(({ type, label, emoji }) => {
      const matches = places
        .filter((p) => p.businessType === type)
        .sort((a, b) => Number(b.featured) - Number(a.featured) || (b.rating || 0) - (a.rating || 0))
        .slice(0, 2);
      matches.forEach((p) => result.push({ ...p, planLabel: label, planEmoji: emoji, planType: type }));
    });
    // Intercalar para que el carrusel alterne tipos
    const ordered: any[] = [];
    for (let i = 0; i < 2; i++) {
      PLAN_TYPES.forEach(({ type }) => {
        const item = result.filter((r) => r.planType === type)[i];
        if (item) ordered.push(item);
      });
    }
    return ordered;
  }, [places]);

  if (plans.length === 0) return null;

  return (
    <Carousel opts={{ align: 'start', loop: plans.length > 2 }} className="w-full">
      <CarouselContent className="-ml-2">
        {plans.map((plan) => (
          <CarouselItem key={plan.id} className="pl-2 basis-[85%] sm:basis-1/2 lg:basis-1/3">
            <button
              onClick={() => navigate(`/place/${plan.slug || plan.id}`)}
              className="group w-full text-left rounded-xl overflow-hidden border border-border bg-card shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
            >
              <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-muted">
                {plan.images?.[0] && (
                  <img
                    src={plan.images[0]}
                    alt={`${plan.planLabel} en ${cityLabel}: ${plan.name}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                <Badge
                  className="absolute top-2 left-2 border-0 text-[10px] text-primary-foreground"
                  style={{ backgroundColor: getBusinessTypeColor(plan.planType) }}
                >
                  {plan.planEmoji} {plan.planLabel}
                </Badge>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold leading-tight line-clamp-1">{plan.name}</h3>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground line-clamp-1">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {plan.address || plan.neighborhood || cityLabel}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                  Ver plan <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </button>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex -left-3" />
      <CarouselNext className="hidden sm:flex -right-3" />
    </Carousel>
  );
};

export default RecommendedPlans;
