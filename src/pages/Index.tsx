import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MapComponent from '@/components/MapComponent';
import CategoryBar from '@/components/CategoryBar';
import PlacesList from '@/components/PlacesList';
import EventCard from '@/components/EventCard';
import BottomNav from '@/components/BottomNav';
import FloatingAIChat from '@/components/FloatingAIChat';
import { mockPlaces, neighborhoods } from '@/data/places';
import { mockEvents } from '@/data/events';
import { mockShorts } from '@/data/shorts';
import { Button } from '@/components/ui/button';
import { ChevronRight, Star, Calendar, Video, MapPin, Check, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ShortsCarousel from '@/components/ShortsCarousel';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import WorldCupCalendar from '@/components/WorldCupCalendar';
import ColombiaProgress from '@/components/ColombiaProgress';
import WorldCupProgress from '@/components/WorldCupProgress';
import WorldCupRoutes from '@/components/WorldCupRoutes';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Todos');
  const [isSearching, setIsSearching] = useState(false);
  const [neighborhoodOpen, setNeighborhoodOpen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [places, setPlaces] = useState<any[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [shorts, setShorts] = useState<any[]>([]);
  const [dbNeighborhoods, setDbNeighborhoods] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBusinesses = async () => {
      setLoadingPlaces(true);
      const { data } = await supabase
        .from('businesses')
        .select(`
          *,
          business_images (
            image_url,
            image_type,
            is_primary,
            display_order
          )
        `)
        .order('featured', { ascending: false })
        .order('name');
      
      if (data) {
        const transformedPlaces = data.map((business: any) => {
          // Get profile image first, then gallery images, then fallback
          const profileImg = business.business_images?.find((img: any) => img.image_type === 'profile');
          const primaryImg = business.business_images?.find((img: any) => img.is_primary);
          const firstGallery = business.business_images?.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))[0];
          const imageUrl = profileImg?.image_url || primaryImg?.image_url || firstGallery?.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80';
          
          return {
            id: business.id,
            slug: business.slug,
            name: business.name,
            category: business.category,
            address: business.address,
            neighborhood: business.neighborhood,
            zone: business.zone,
            phone: business.phone,
            description: business.description,
            images: [imageUrl],
            latitude: Number(business.latitude) || 0,
            longitude: Number(business.longitude) || 0,
            priceRange: business.price_range,
            featured: business.featured,
            rating: 4.5,
          };
        });
        setPlaces(transformedPlaces);
        
        // Extract unique neighborhoods from DB
        const uniqueNeighborhoods = [...new Set(data.map((b: any) => b.neighborhood).filter(Boolean))] as string[];
        uniqueNeighborhoods.sort((a, b) => a.localeCompare(b, 'es'));
        setDbNeighborhoods(['Todos', ...uniqueNeighborhoods]);
      }
      setLoadingPlaces(false);
    };
    loadBusinesses();
  }, []);

  useEffect(() => {
    const loadShorts = async () => {
      const { data } = await supabase
        .from('business_shorts')
        .select(`*, businesses (id, name, category)`)
        .eq('active', true)
        .order('created_at', { ascending: false });
      
      if (data) {
        const transformedShorts = data.map((short: any) => ({
          id: short.id,
          title: short.title,
          description: short.description,
          videoUrl: short.video_url,
          thumbnailUrl: short.thumbnail_url,
          creator: {
            name: 'Sabor 360',
            username: '@sabor360',
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
            verified: true
          },
          views: short.views || 0,
          likes: short.likes || 0,
          category: short.businesses.category,
          placeId: short.business_id,
          placeName: 'Cali',
          createdAt: new Date(short.created_at).toISOString().split('T')[0]
        }));
        setShorts(transformedShorts);
      } else {
        setShorts(mockShorts);
      }
    };
    loadShorts();
  }, []);

  useEffect(() => {
    if (searchQuery === '' && selectedCategory === 'Todos' && selectedNeighborhood === 'Todos') {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => setIsSearching(false), 800);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedNeighborhood]);

  const featuredPlaces = useMemo(() => {
    const allPlaces = places.length > 0 ? places : mockPlaces;
    const featured = allPlaces
      .filter(place => place.featured || (place.rating && place.rating >= 4.5));
    // Perreiranos siempre de primero
    featured.sort((a, b) => {
      if (a.name === 'Perreiranos') return -1;
      if (b.name === 'Perreiranos') return 1;
      return (b.rating || 0) - (a.rating || 0);
    });
    return featured.slice(0, 6);
  }, [places]);

  const featuredEvents = useMemo(() => mockEvents.filter(e => e.featured).slice(0, 4), []);

  const filteredShorts = useMemo(() => {
    if (selectedCategory === 'Todos') return shorts;
    return shorts.filter(s => s.category === selectedCategory);
  }, [selectedCategory, shorts]);

  const filteredPlaces = useMemo(() => {
    const allPlaces = places.length > 0 ? places : mockPlaces;
    const normalizeText = (t: string) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (!searchQuery || searchQuery.trim() === '') {
      return allPlaces.filter((p) => {
        const catMatch = selectedCategory === 'Todos' || p.category === selectedCategory;
        const nMatch = selectedNeighborhood === 'Todos' || normalizeText(p.neighborhood || '') === normalizeText(selectedNeighborhood);
        return catMatch && nMatch;
      });
    }

    const searchLower = normalizeText(searchQuery.trim());
    return allPlaces.filter((p) => {
      const catMatch = selectedCategory === 'Todos' || p.category === selectedCategory;
      const nMatch = selectedNeighborhood === 'Todos' || normalizeText(p.neighborhood || '') === normalizeText(selectedNeighborhood);
      const text = normalizeText([p.name, p.category, p.address, p.neighborhood, p.description || '', ...(p.foodType || [])].join(' '));
      return text.includes(searchLower) && catMatch && nMatch;
    });
  }, [selectedCategory, selectedNeighborhood, searchQuery, places]);

  const showFilters = selectedCategory !== 'Todos' || searchQuery !== '' || selectedNeighborhood !== 'Todos';

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden flex flex-col">
      <Navbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedNeighborhood={selectedNeighborhood}
        onNeighborhoodChange={setSelectedNeighborhood}
        isSearching={isSearching}
      />
      
      <div className="flex flex-1 overflow-x-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 min-w-0 lg:ml-64">
          {/* Map */}
          <div className="h-[28vh] sm:h-[35vh] md:h-[40vh] lg:h-[60vh] w-full">
            <MapComponent selectedNeighborhood={selectedNeighborhood} selectedCategory={selectedCategory} places={places as any} />
          </div>

          {/* Neighborhood Selector */}
          <div className="w-full bg-card border-b border-border">
            <div className="px-3 sm:px-4 md:px-6 py-2">
              <Popover open={neighborhoodOpen} onOpenChange={setNeighborhoodOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full sm:w-auto justify-between h-8 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="truncate">{selectedNeighborhood || "Todos los barrios"}</span>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar barrio..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No se encontró barrio.</CommandEmpty>
                      <CommandGroup>
                        {neighborhoods.map((n) => (
                          <CommandItem key={n} value={n} onSelect={() => { setSelectedNeighborhood(n); setNeighborhoodOpen(false); }}>
                            <Check className={cn("mr-2 h-4 w-4", selectedNeighborhood === n ? "opacity-100" : "opacity-0")} />
                            {n}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <CategoryBar selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

          {!showFilters ? (
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-5 space-y-4 sm:space-y-6 pb-20 md:pb-8">

              {/* World Cup Hero Banner */}
              <section className="relative rounded-xl overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-secondary text-primary-foreground p-3 sm:p-5">
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="relative z-10 flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl shrink-0">⚽</span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base sm:text-xl md:text-2xl font-extrabold leading-tight">
                      El Mundial del Sabor 2026
                    </h2>
                    <p className="text-[10px] sm:text-xs opacity-90 mt-0.5">
                      Vive cada partido con los mejores restaurantes 🇨🇴
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/recommendations')}
                  className="gap-1 mt-2 w-full sm:w-auto text-xs"
                >
                  ¿Dónde ver los partidos? <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </section>

              {/* Rutas Mundialistas */}
              <section>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🗺️</span>
                    <h2 className="text-sm sm:text-lg font-bold">Las Rutas Mundialistas</h2>
                  </div>
                  <Button variant="ghost" className="gap-1 h-7 text-[11px] shrink-0 px-2" onClick={() => navigate('/rutas')}>
                    Ver todas <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
                <WorldCupRoutes />
              </section>

              {/* Restaurantes Destacados */}
              <section>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-accent/10 rounded-md">
                      <Star className="h-4 w-4 text-accent" />
                    </div>
                    <h2 className="text-sm sm:text-lg font-bold">Restaurantes Destacados</h2>
                  </div>
                  <Button variant="ghost" className="gap-1 h-7 text-[11px] shrink-0 px-2" onClick={() => navigate('/listings')}>
                    Ver todos <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
                <PlacesList places={featuredPlaces} />
              </section>

              {/* Ver todos los restaurantes */}
              <section className="flex justify-center">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2 text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all"
                  onClick={() => navigate('/listings')}
                >
                  <MapPin className="h-4 w-4" />
                  Ver todos los restaurantes
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </section>

              {/* Mi Avance Mundialista */}
              <section>
                <WorldCupProgress />
              </section>

              {/* Videos Recomendados */}
              <section className="bg-muted/30 -mx-3 sm:mx-0 px-3 sm:px-0 py-3 sm:py-0 sm:bg-transparent">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-primary/10 rounded-md">
                      <Video className="h-4 w-4 text-primary" />
                    </div>
                    <h2 className="text-sm sm:text-lg font-bold">Videos Mundialistas 🎬⚽</h2>
                  </div>
                  <Button variant="ghost" className="gap-1 h-7 text-[11px] shrink-0 px-2" onClick={() => navigate('/shorts')}>
                    Ver todos <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
                <ShortsCarousel shorts={filteredShorts} />
              </section>

              {/* Colombia en el Mundial */}
              <section>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-lg sm:text-xl">🇨🇴</span>
                  <h2 className="text-sm sm:text-lg font-bold">Colombia en el Mundial</h2>
                </div>
                <ColombiaProgress />
              </section>

              {/* Calendario */}
              <section>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="p-1 bg-secondary/10 rounded-md">
                    <Calendar className="h-4 w-4 text-secondary" />
                  </div>
                  <h2 className="text-sm sm:text-lg font-bold">Calendario de Partidos</h2>
                </div>
                <WorldCupCalendar />
              </section>


            </div>
          ) : (
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-5 pb-20 md:pb-8">
              {isSearching ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center py-10 bg-muted/30 rounded-lg border border-border">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20" />
                        <div className="absolute top-0 left-0 animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-primary" />
                      </div>
                      <p className="text-sm font-semibold">Buscando lugares...</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {(selectedCategory !== 'Todos' || searchQuery) && (
                    <div className="mb-3 flex items-center justify-between bg-card border rounded-lg p-2.5 gap-2">
                      <p className="text-xs text-muted-foreground">
                        {filteredPlaces.length} {filteredPlaces.length === 1 ? 'lugar' : 'lugares'}
                        {searchQuery && <span className="block text-[10px]">"{searchQuery}"</span>}
                      </p>
                      {selectedCategory !== 'Todos' && (
                        <Button size="sm" className="gap-1 text-[11px] h-7" onClick={() => navigate(`/listings?category=${selectedCategory}`)}>
                          Ver todos <ChevronRight className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                  <PlacesList places={filteredPlaces} />
                </>
              )}
            </div>
          )}
        </main>
      </div>
      
      <BottomNav />
      <FloatingAIChat isHidden={isTourActive} />
    </div>
  );
};

export default Index;
