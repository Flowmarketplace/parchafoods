import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid, List as ListIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PlaceCard from '@/components/PlaceCard';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import RouteMap from '@/components/RouteMap';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { categories, neighborhoods } from '@/data/places';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const ROUTE_META: Record<string, { name: string; emoji: string }> = {
  'Comidas Rápidas': { name: 'Ruta de las Comidas Rápidas', emoji: '🍔' },
  'Tradicional': { name: 'Ruta de la Comida Tradicional', emoji: '🍲' },
  'Café': { name: 'La Ruta del Café', emoji: '☕' },
  'Mexicana': { name: 'Ruta de la Comida Mexicana', emoji: '🌮' },
  'Asiática': { name: 'La Ruta del Sushi', emoji: '🍣' },
  'Food Truck': { name: 'Ruta de los Food Trucks', emoji: '🚚' },
  'Bar': { name: 'La Ruta de la Cerveza', emoji: '🍺' },
  'Parrilla': { name: 'Ruta Mundialista del Asado', emoji: '🥩' },
  'Italiana': { name: 'La Ruta Italiana', emoji: '🍕' },
  'Rooftop': { name: 'La Ruta de los Rooftops', emoji: '🏙️' },
  'Remate': { name: 'La Ruta del Remate', emoji: '🎉' },
};

const CategoryListings = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialCategory = searchParams.get('category') || 'Todos';

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Todos');
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const loadBusinesses = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('businesses')
        .select(`*, business_images (image_url, image_type, is_primary, display_order)`)
        .order('featured', { ascending: false })
        .order('name');

      if (data) {
        const transformed = data.map((b: any) => {
          const profileImg = b.business_images?.find((img: any) => img.image_type === 'profile');
          const primaryImg = b.business_images?.find((img: any) => img.is_primary);
          const firstGallery = b.business_images?.sort((a: any, b2: any) => (a.display_order || 0) - (b2.display_order || 0))[0];
          const imageUrl = profileImg?.image_url || primaryImg?.image_url || firstGallery?.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80';

          return {
            id: b.id,
            slug: b.slug,
            name: b.name,
            category: b.category,
            address: b.address,
            neighborhood: b.neighborhood,
            zone: b.zone,
            phone: b.phone,
            description: b.description,
            images: [imageUrl],
            latitude: Number(b.latitude) || 0,
            longitude: Number(b.longitude) || 0,
            priceRange: b.price_range,
            featured: b.featured,
            rating: 4.5,
          };
        });
        setPlaces(transformed);
      }
      setLoading(false);
    };
    loadBusinesses();
  }, []);

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const categoryMatch = selectedCategory === 'Todos' || place.category === selectedCategory;
      const neighborhoodMatch = selectedNeighborhood === 'Todos' || place.neighborhood === selectedNeighborhood;
      return categoryMatch && neighborhoodMatch;
    });
  }, [places, selectedCategory, selectedNeighborhood]);

  const routeMeta = ROUTE_META[selectedCategory];
  const hasRoute = routeMeta && selectedCategory !== 'Todos';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 pt-14 md:pt-16">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 lg:ml-64">
          <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 pb-20 md:pb-8">
            {/* Header */}
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/')}
                  className="h-8 w-8 sm:h-10 sm:w-10"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                    {selectedCategory === 'Todos' ? 'Todos los restaurantes' : selectedCategory}
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {loading ? 'Cargando...' : `${filteredPlaces.length} ${filteredPlaces.length === 1 ? 'resultado' : 'resultados'}`}
                  </p>
                </div>
              </div>

              <div className="flex gap-1.5 sm:gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="h-7 w-7 sm:h-9 sm:w-9"
                >
                  <Grid className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="h-7 w-7 sm:h-9 sm:w-9"
                >
                  <ListIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            {/* Route Map - shown at top when a specific category is selected */}
            {hasRoute && !loading && filteredPlaces.length > 0 && (
              <RouteMap
                places={filteredPlaces}
                category={selectedCategory}
                routeName={routeMeta.name}
                routeEmoji={routeMeta.emoji}
              />
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedNeighborhood} onValueChange={setSelectedNeighborhood}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Barrio" />
                </SelectTrigger>
                <SelectContent>
                  {neighborhoods.map((neighborhood) => (
                    <SelectItem key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategory !== 'Todos' && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory('Todos')}>
                  {selectedCategory} ✕
                </Badge>
              )}
              {selectedNeighborhood !== 'Todos' && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedNeighborhood('Todos')}>
                  {selectedNeighborhood} ✕
                </Badge>
              )}
            </div>

            {/* Results */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-xl" />
                ))}
              </div>
            ) : filteredPlaces.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border">
                <p className="text-muted-foreground mb-4">No se encontraron lugares con estos filtros</p>
                <Button variant="outline" onClick={() => { setSelectedCategory('Todos'); setSelectedNeighborhood('Todos'); }}>
                  Limpiar filtros
                </Button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
                  : 'flex flex-col gap-3 sm:gap-4'
              }>
                {filteredPlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} />
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

export default CategoryListings;
