import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

const routes = [
  {
    id: 'comidas-rapidas',
    name: 'Ruta de las Comidas Rápidas',
    emoji: '🍔',
    description: 'Hamburguesas, hot dogs, empanadas y más',
    color: 'from-orange-500/20 to-red-500/20',
    border: 'border-orange-500/30',
    places: 8,
    category: 'Comidas Rápidas',
  },
  {
    id: 'mexicana',
    name: 'Ruta de la Comida Mexicana',
    emoji: '🌮',
    description: 'Tacos, burritos, nachos y sabor azteca',
    color: 'from-green-500/20 to-red-500/20',
    border: 'border-green-500/30',
    places: 5,
    category: 'Mexicana',
  },
  {
    id: 'sushi',
    name: 'La Ruta del Sushi',
    emoji: '🍣',
    description: 'Los mejores rolls y sashimi de la ciudad',
    color: 'from-pink-500/20 to-rose-500/20',
    border: 'border-pink-500/30',
    places: 6,
    category: 'Asiática',
  },
  {
    id: 'food-trucks',
    name: 'Ruta de los Food Trucks',
    emoji: '🚚',
    description: 'Comida callejera gourmet sobre ruedas',
    color: 'from-yellow-500/20 to-amber-500/20',
    border: 'border-yellow-500/30',
    places: 7,
    category: 'Food Truck',
  },
  {
    id: 'cerveza',
    name: 'La Ruta de la Cerveza',
    emoji: '🍺',
    description: 'Cervecerías artesanales y bares deportivos',
    color: 'from-amber-500/20 to-yellow-600/20',
    border: 'border-amber-500/30',
    places: 6,
    category: 'Bar',
  },
  {
    id: 'asado',
    name: 'Ruta Mundialista del Asado',
    emoji: '🥩',
    description: 'Parrillas, cortes premium y churrasco',
    color: 'from-red-600/20 to-orange-600/20',
    border: 'border-red-600/30',
    places: 5,
    category: 'Parrilla',
  },
  {
    id: 'rooftop',
    name: 'La Ruta de los Rooftops',
    emoji: '🏙️',
    description: 'Terrazas con vista para vivir el mundial',
    color: 'from-sky-500/20 to-indigo-500/20',
    border: 'border-sky-500/30',
    places: 4,
    category: 'Rooftop',
  },
];

const WorldCupRoutes = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const speed = 0.5; // px per frame
    let animId: number;

    const step = () => {
      if (!paused && el) {
        el.scrollLeft += speed;
        // Loop back when reaching the end
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
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0"
      >
        {routes.map((route) => (
          <button
            key={route.id}
            onClick={() => navigate(`/listings?category=${route.category}`)}
            className={`snap-start shrink-0 w-[160px] sm:w-[180px] rounded-xl border ${route.border} bg-gradient-to-br ${route.color} p-3 text-left transition-all active:scale-[0.97] hover:shadow-md`}
          >
            <span className="text-2xl">{route.emoji}</span>
            <h3 className="text-xs font-bold mt-1.5 leading-tight line-clamp-2">{route.name}</h3>
            <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{route.description}</p>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{route.places} lugares</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WorldCupRoutes;
