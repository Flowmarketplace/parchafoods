import { useState, useEffect, useMemo } from 'react';
import { Filter, Grid, List as ListIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PlaceCard from '@/components/PlaceCard';
import { categories } from '@/data/places';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const Listings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'Todos';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Todos');
  const [places, setPlaces] = useState<any[]>([]);
  const [dbNeighborhoods, setDbNeighborhoods] = useState<string[]>(['Todos']);
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

        // Extract unique neighborhoods from DB
        const uniqueNeighborhoods = [...new Set(data.map((b: any) => b.neighborhood).filter(Boolean))] as string[];
        uniqueNeighborhoods.sort((a, b) => a.localeCompare(b, 'es'));
        setDbNeighborhoods(['Todos', ...uniqueNeighborhoods]);
      }
      setLoading(false);
    };
    loadBusinesses();
  }, []);

  const normalizeText = (t: string) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const categoryMatch = selectedCategory === 'Todos' || place.category === selectedCategory;
      const neighborhoodMatch = selectedNeighborhood === 'Todos' || normalizeText(place.neighborhood || '') === normalizeText(selectedNeighborhood);
      return categoryMatch && neighborhoodMatch;
    });
  }, [places, selectedCategory, selectedNeighborhood]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 pt-16 md:pt-28">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64">
          <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 pb-20 md:pb-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Explorar lugares</h1>
              <p className="text-muted-foreground">
                Descubre los mejores lugares de Cali
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
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
                  {dbNeighborhoods.map((neighborhood) => (
                    <SelectItem key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="ml-auto flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
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
            <div className="mb-4">
              <p className="text-muted-foreground">
                {loading ? 'Cargando...' : `${filteredPlaces.length} ${filteredPlaces.length === 1 ? 'resultado' : 'resultados'}`}
              </p>
            </div>

            {/* Places Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'flex flex-col gap-4'
              }>
                {filteredPlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            )}

            {!loading && filteredPlaces.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron lugares con estos filtros</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategory('Todos');
                    setSelectedNeighborhood('Todos');
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export default Listings;
