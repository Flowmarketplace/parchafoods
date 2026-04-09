import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import RouteMap from '@/components/RouteMap';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const routesDef = [
  { category: 'Comidas Rápidas', name: 'Ruta de las Comidas Rápidas', emoji: '🍔', color: 'from-orange-500/20 to-red-500/20', border: 'border-orange-500/30' },
  { category: 'Tradicional', name: 'Ruta de la Comida Tradicional', emoji: '🍲', color: 'from-green-600/20 to-emerald-500/20', border: 'border-green-600/30' },
  { category: 'Café', name: 'La Ruta del Café', emoji: '☕', color: 'from-amber-700/20 to-yellow-600/20', border: 'border-amber-700/30' },
  { category: 'Mexicana', name: 'Ruta de la Comida Mexicana', emoji: '🌮', color: 'from-green-500/20 to-red-500/20', border: 'border-green-500/30' },
  { category: 'Asiática', name: 'La Ruta del Sushi', emoji: '🍣', color: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/30' },
  { category: 'Food Truck', name: 'Ruta de los Food Trucks', emoji: '🚚', color: 'from-yellow-500/20 to-amber-500/20', border: 'border-yellow-500/30' },
  { category: 'Bar', name: 'La Ruta de la Cerveza', emoji: '🍺', color: 'from-amber-500/20 to-yellow-600/20', border: 'border-amber-500/30' },
  { category: 'Parrilla', name: 'Ruta Mundialista del Asado', emoji: '🥩', color: 'from-red-600/20 to-orange-600/20', border: 'border-red-600/30' },
  { category: 'Italiana', name: 'La Ruta Italiana', emoji: '🍕', color: 'from-red-500/20 to-green-500/20', border: 'border-red-500/30' },
  { category: 'Rooftop', name: 'La Ruta de los Rooftops', emoji: '🏙️', color: 'from-sky-500/20 to-indigo-500/20', border: 'border-sky-500/30' },
  { category: 'Remate', name: 'La Ruta del Remate', emoji: '🎉', color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30' },
];

const RutasMundialistas = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 pt-14 md:pt-16">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64">
          <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 pb-20 md:pb-8">
            {/* Header */}
            <div className="mb-4 flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  🗺️ Rutas Mundialistas
                </h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  {routesWithPlaces.length} rutas · Completa cada ruta y gana goles ⚽
                </p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
                ))}
              </div>
            ) : routesWithPlaces.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No hay rutas disponibles aún</p>
              </div>
            ) : (
              <div className="space-y-4">
                {routesWithPlaces.map(route => (
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
