import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const routesDef = [
  {
    id: 'comidas-rapidas',
    name: 'Ruta de las Comidas Rápidas',
    emoji: '🍔',
    description: 'Hamburguesas, hot dogs, empanadas y más',
    gradient: 'from-orange-500 to-red-500',
    category: 'Comidas Rápidas',
  },
  {
    id: 'tradicional',
    name: 'Ruta de la Comida Tradicional',
    emoji: '🍲',
    description: 'Sancocho, bandeja paisa, fritanga valluna',
    gradient: 'from-green-600 to-emerald-500',
    category: 'Tradicional',
  },
  {
    id: 'cafe',
    name: 'La Ruta del Café',
    emoji: '☕',
    description: 'Los mejores cafés especiales de Cali',
    gradient: 'from-amber-700 to-yellow-600',
    category: 'Café',
  },
  {
    id: 'mexicana',
    name: 'Ruta de la Comida Mexicana',
    emoji: '🌮',
    description: 'Tacos, burritos, nachos y sabor azteca',
    gradient: 'from-green-500 to-lime-500',
    category: 'Mexicana',
  },
  {
    id: 'sushi',
    name: 'La Ruta del Sushi',
    emoji: '🍣',
    description: 'Los mejores rolls y sashimi de la ciudad',
    gradient: 'from-pink-500 to-rose-500',
    category: 'Asiática',
  },
  {
    id: 'food-trucks',
    name: 'Ruta de los Food Trucks',
    emoji: '🚚',
    description: 'Comida callejera gourmet sobre ruedas',
    gradient: 'from-yellow-500 to-amber-500',
    category: 'Food Truck',
  },
  {
    id: 'cerveza',
    name: 'La Ruta de la Cerveza',
    emoji: '🍺',
    description: 'Cervecerías artesanales y bares',
    gradient: 'from-amber-500 to-yellow-600',
    category: 'Bar',
  },
  {
    id: 'asado',
    name: 'Ruta Mundialista del Asado',
    emoji: '🥩',
    description: 'Parrillas, cortes premium y churrasco',
    gradient: 'from-red-600 to-orange-600',
    category: 'Parrilla',
  },
  {
    id: 'italiana',
    name: 'La Ruta Italiana',
    emoji: '🍕',
    description: 'Pizzas, pastas y risottos artesanales',
    gradient: 'from-red-500 to-orange-500',
    category: 'Italiana',
  },
  {
    id: 'rooftop',
    name: 'La Ruta de los Rooftops',
    emoji: '🏙️',
    description: 'Terrazas con vista para vivir el mundial',
    gradient: 'from-sky-500 to-indigo-500',
    category: 'Rooftop',
  },
  {
    id: 'remate',
    name: 'La Ruta del Remate',
    emoji: '🎉',
    description: 'Discotecas, salsa y rumba después del partido',
    gradient: 'from-purple-500 to-pink-500',
    category: 'Remate',
  },
];

const WorldCupRoutes = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadCounts = async () => {
      const { data } = await supabase
        .from('businesses')
        .select('category');
      if (data) {
        const c: Record<string, number> = {};
        data.forEach((b: any) => {
          c[b.category] = (c[b.category] || 0) + 1;
        });
        setCounts(c);
      }
    };
    loadCounts();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const speed = 0.5;
    let animId: number;

    const step = () => {
      if (!paused && el) {
        el.scrollLeft += speed;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          el.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [paused]);

  return (
    <div
      className="space-y-2"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setTimeout(() => setPaused(false), 3000)}
    >
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0"
      >
        {routesDef.map((route) => {
          const count = counts[route.category] || 0;
          return (
            <button
              key={route.id}
              onClick={() => navigate(`/listings?category=${route.category}`)}
              className="snap-start shrink-0 w-[170px] sm:w-[190px] rounded-2xl overflow-hidden transition-all active:scale-[0.97] hover:shadow-lg group relative"
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${route.gradient} opacity-90`} />
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '12px 12px' }} />

              <div className="relative p-4 flex flex-col h-full min-h-[130px]">
                {/* Emoji + count */}
                <div className="flex items-start justify-between">
                  <span className="text-3xl drop-shadow-md">{route.emoji}</span>
                  {count > 0 && (
                    <span className="bg-white/25 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <MapPin className="h-2.5 w-2.5" />
                      {count}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white mt-auto leading-tight line-clamp-2 drop-shadow-sm">
                  {route.name}
                </h3>
                <p className="text-[10px] text-white/80 mt-1 line-clamp-1">{route.description}</p>

                {/* Arrow indicator */}
                <div className="flex items-center gap-1 mt-2 text-white/70 group-hover:text-white transition-colors">
                  <span className="text-[10px] font-semibold">Explorar</span>
                  <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WorldCupRoutes;
