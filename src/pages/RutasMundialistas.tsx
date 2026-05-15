import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Trophy, Route, Star, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import RouteMap from '@/components/RouteMap';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const routesDef = [
  { category: 'Comidas Rápidas', name: 'Ruta de las Comidas Rápidas', emoji: '🍔', color: 'from-orange-500 to-red-500', border: 'border-orange-500/30', accent: '#f97316' },
  { category: 'Tradicional', name: 'Ruta de la Comida Tradicional', emoji: '🍲', color: 'from-green-600 to-emerald-500', border: 'border-green-600/30', accent: '#16a34a' },
  { category: 'Café', name: 'La Ruta del Café', emoji: '☕', color: 'from-amber-700 to-yellow-600', border: 'border-amber-700/30', accent: '#b45309' },
  { category: 'Mexicana', name: 'Ruta de la Comida Mexicana', emoji: '🌮', color: 'from-green-500 to-lime-500', border: 'border-green-500/30', accent: '#22c55e' },
  { category: 'Asiática', name: 'La Ruta del Sushi', emoji: '🍣', color: 'from-pink-500 to-rose-500', border: 'border-pink-500/30', accent: '#ec4899' },
  { category: 'Food Truck', name: 'Ruta de los Food Trucks', emoji: '🚚', color: 'from-yellow-500 to-amber-500', border: 'border-yellow-500/30', accent: '#eab308' },
  { category: 'Bar', name: 'La Ruta de la Cerveza', emoji: '🍺', color: 'from-amber-500 to-yellow-600', border: 'border-amber-500/30', accent: '#f59e0b' },
  { category: 'Parrilla', name: 'Ruta Mundialista del Asado', emoji: '🥩', color: 'from-red-600 to-orange-600', border: 'border-red-600/30', accent: '#dc2626' },
  { category: 'Italiana', name: 'La Ruta Italiana', emoji: '🍕', color: 'from-red-500 to-orange-500', border: 'border-red-500/30', accent: '#ef4444' },
  { category: 'Rooftop', name: 'La Ruta de los Rooftops', emoji: '🏙️', color: 'from-sky-500 to-indigo-500', border: 'border-sky-500/30', accent: '#0ea5e9' },
  { category: 'Remate', name: 'La Ruta del Remate', emoji: '🎉', color: 'from-purple-500 to-pink-500', border: 'border-purple-500/30', accent: '#a855f7' },
];

const RutasMundialistas = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('businesses')
        .select('id, name, latitude, longitude, address, slug, neighborhood, category');
      setBusinesses(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const routesWithPlaces = routesDef
    .map(r => ({
      ...r,
      places: businesses.filter(b => b.category === r.category && b.latitude && b.longitude),
    }))
    .filter(r => r.places.length > 0);

  const filteredRoutes = activeFilter
    ? routesWithPlaces.filter(r => r.category === activeFilter)
    : routesWithPlaces;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 pt-14 md:pt-16">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0">
          {/* Hero header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary">
            {/* Decorative elements */}
            <div className="absolute inset-0">
              <div className="absolute top-4 right-8 text-6xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>⚽</div>
              <div className="absolute bottom-2 left-12 text-4xl opacity-15 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>🏆</div>
              <div className="absolute top-1/2 right-1/3 text-3xl opacity-10 animate-bounce" style={{ animationDuration: '5s', animationDelay: '2s' }}>🥅</div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
            </div>

            <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="h-8 w-8 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 mb-3"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center text-3xl sm:text-4xl shadow-lg border border-primary-foreground/20">
                  🗺️
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-foreground tracking-tight">
                    Rutas del Sabor
                  </h1>
                  <p className="text-sm text-primary-foreground/80 mt-1 max-w-md">
                    Recorre Cali, visita restaurantes y acumula goles ⚽ para desbloquear premios mundialistas
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-primary-foreground/90">
                      <Route className="h-4 w-4" />
                      <span className="text-sm font-semibold">{routesWithPlaces.length} rutas</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary-foreground/90">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        {routesWithPlaces.reduce((sum, r) => sum + r.places.length, 0)} paradas
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary-foreground/90">
                      <Trophy className="h-4 w-4" />
                      <span className="text-sm font-semibold">Premios</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Route filter chips */}
          <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-6 -mt-3 relative z-20">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setActiveFilter(null)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm ${
                  !activeFilter
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-card text-foreground border border-border hover:border-primary/30'
                }`}
              >
                Todas las rutas
              </button>
              {routesWithPlaces.map(r => (
                <button
                  key={r.category}
                  onClick={() => setActiveFilter(activeFilter === r.category ? null : r.category)}
                  className={`shrink-0 px-3 py-2 rounded-full text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5 ${
                    activeFilter === r.category
                      ? 'text-primary-foreground shadow-md'
                      : 'bg-card text-foreground border border-border hover:border-primary/30'
                  }`}
                  style={activeFilter === r.category ? { background: r.accent } : {}}
                >
                  <span>{r.emoji}</span>
                  <span className="hidden sm:inline">{r.name.replace('Ruta de ', '').replace('La Ruta ', '').replace('Ruta ', '')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Routes list */}
          <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 pb-20 md:pb-8">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-[300px] w-full rounded-2xl" />
                ))}
              </div>
            ) : filteredRoutes.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                  <Route className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">No hay rutas disponibles</h3>
                <p className="text-muted-foreground text-sm">Pronto agregaremos más rutas gastronómicas</p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredRoutes.map((route) => (
                  <RouteMap
                    key={route.category}
                    places={route.places}
                    category={route.category}
                    routeName={route.name}
                    routeEmoji={route.emoji}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export default RutasMundialistas;
