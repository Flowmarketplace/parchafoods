import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

import MapComponent from '@/components/MapComponent';
import CategoryBar from '@/components/CategoryBar';
import FilterBar from '@/components/FilterBar';
import PlacesList from '@/components/PlacesList';
import EventCard from '@/components/EventCard';
import BottomNav from '@/components/BottomNav';
import FloatingAIChat from '@/components/FloatingAIChat';
import { mockPlaces, neighborhoods } from '@/data/places';
import { mockEvents } from '@/data/events';
import { mockShorts } from '@/data/shorts';
import { Button } from '@/components/ui/button';
import { ChevronRight, Home, Star, Calendar, Video, MapPin, Check, Trophy, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ShortCard from '@/components/ShortCard';
import ShortsCarousel from '@/components/ShortsCarousel';
import PlaceChat from '@/components/PlaceChat';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import WorldCupCalendar from '@/components/WorldCupCalendar';
import ColombiaProgress from '@/components/ColombiaProgress';

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
  const navigate = useNavigate();

  // Load businesses from database
  useEffect(() => {
    const loadBusinesses = async () => {
      setLoadingPlaces(true);
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('featured', { ascending: false })
        .order('name');
      
      if (data) {
        // Transform database format to Place format
        const transformedPlaces = data.map(business => ({
          id: business.id,
          slug: business.slug,
          name: business.name,
          category: business.category,
          address: business.address,
          neighborhood: business.neighborhood,
          zone: business.zone,
          phone: business.phone,
          description: business.description,
          images: [business.loyalty_reward_image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'],
          latitude: Number(business.latitude) || 0,
          longitude: Number(business.longitude) || 0,
          priceRange: business.price_range,
          featured: business.featured,
          rating: 4.5, // Default rating
        }));
        setPlaces(transformedPlaces);
      }
      setLoadingPlaces(false);
    };
    
    loadBusinesses();
  }, []);

  // Load shorts from database
  useEffect(() => {
    const loadShorts = async () => {
      const { data, error } = await supabase
        .from('business_shorts')
        .select(`
          *,
          businesses (
            id,
            name,
            category
          )
        `)
        .eq('active', true)
        .order('created_at', { ascending: false });
      
      console.log('Shorts from DB:', data);
      
      if (data) {
        // Transform database format to Short format
        const transformedShorts = data.map((short: any) => ({
          id: short.id,
          title: short.title,
          description: short.description,
          videoUrl: short.video_url,
          thumbnailUrl: short.thumbnail_url,
          creator: {
            name: short.businesses.name,
            username: `@${short.businesses.name.toLowerCase().replace(/\s+/g, '')}`,
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
            verified: true
          },
          views: short.views || 0,
          likes: short.likes || 0,
          category: short.businesses.category,
          placeId: short.business_id,
          placeName: short.businesses.name,
          createdAt: new Date(short.created_at).toISOString().split('T')[0]
        }));
        
        console.log('Transformed shorts:', transformedShorts);
        console.log('Mock shorts:', mockShorts);
        
        // Combine with mock shorts
        const allShorts = [...transformedShorts, ...mockShorts];
        console.log('All shorts combined:', allShorts);
        setShorts(allShorts);
      } else {
        console.log('No data from DB, using mock shorts');
        // Fallback to mock data if database query fails
        setShorts(mockShorts);
      }
    };
    
    loadShorts();
  }, []);

  // Handle search with loading state
  useEffect(() => {
    if (searchQuery === '' && selectedCategory === 'Todos' && selectedNeighborhood === 'Todos') {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 800); // Increased to make loading more visible

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedNeighborhood]);

  // Get featured/top rated places
  const featuredPlaces = useMemo(() => {
    const allPlaces = places.length > 0 ? places : mockPlaces;
    return allPlaces
      .filter(place => place.featured || (place.rating && place.rating >= 4.5))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6);
  }, [places]);

  // Get featured events
  const featuredEvents = useMemo(() => {
    return mockEvents
      .filter(event => event.featured)
      .slice(0, 4);
  }, []);

  // Filter shorts by category
  const filteredShorts = useMemo(() => {
    if (selectedCategory === 'Todos') {
      return shorts;
    }
    return shorts.filter(short => short.category === selectedCategory);
  }, [selectedCategory, shorts]);

  // Filter places based on all criteria (for the filtered view)
  const filteredPlaces = useMemo(() => {
    const allPlaces = places.length > 0 ? places : mockPlaces;
    
    // Si no hay búsqueda activa, aplicar solo filtros de categoría y barrio
    if (!searchQuery || searchQuery.trim() === '') {
      return allPlaces.filter((place) => {
        const categoryMatch = selectedCategory === 'Todos' || place.category === selectedCategory;
        const neighborhoodMatch = selectedNeighborhood === 'Todos' || place.neighborhood === selectedNeighborhood;
        return categoryMatch && neighborhoodMatch;
      });
    }
    
    // Mapeo de términos de búsqueda comunes a categorías
    const categoryAliases: { [key: string]: string[] } = {
      'cafe': ['café', 'cafetería', 'coffee'],
      'gym': ['gimnasio', 'gym', 'fitness'],
      'gasolinera': ['gasolinera', 'gas', 'estación de servicio'],
      'restaurante': ['restaurante', 'comida', 'restaurant'],
      'parque': ['parque', 'park'],
      'farmacia': ['farmacia', 'droguería', 'pharmacy'],
      'banco': ['banco', 'bank'],
      'supermercado': ['supermercado', 'super', 'market'],
      'hospital': ['hospital', 'clínica', 'clinic'],
      'hotel': ['hotel', 'hospedaje'],
      'bar': ['bar', 'pub', 'cantina'],
      'pizza': ['pizza', 'pizzería'],
      'panaderia': ['panadería', 'bakery', 'pan'],
      'peluqueria': ['peluquería', 'barbería', 'salon']
    };
    
    // Normalizar texto (quitar acentos y convertir a minúsculas)
    const normalizeText = (text: string) => {
      return text.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };
    
    const searchLower = normalizeText(searchQuery.trim());
    
    return allPlaces.filter((place) => {
      // Cuando hay búsqueda activa, los filtros son opcionales
      const categoryMatch = selectedCategory === 'Todos' || place.category === selectedCategory;
      const neighborhoodMatch = selectedNeighborhood === 'Todos' || place.neighborhood === selectedNeighborhood;
      
      // Combinar todos los campos buscables
      const searchableText = normalizeText([
        place.name,
        place.category,
        place.address,
        place.neighborhood,
        place.description || '',
        ...(place.foodType || [])
      ].join(' '));
      
      // Buscar coincidencias directas en el texto
      let searchMatch = searchableText.includes(searchLower);
      
      // Si no hay coincidencia directa, buscar por aliases de categoría
      if (!searchMatch) {
        for (const [key, aliases] of Object.entries(categoryAliases)) {
          if (normalizeText(key).includes(searchLower) || aliases.some(alias => normalizeText(alias).includes(searchLower))) {
            // Si encontramos un alias, verificar si la categoría del lugar coincide
            searchMatch = aliases.some(alias => searchableText.includes(normalizeText(alias)));
            if (searchMatch) break;
          }
        }
      }
      
      return searchMatch && categoryMatch && neighborhoodMatch;
    });
  }, [selectedCategory, selectedNeighborhood, searchQuery, places]);

  const showFilters = selectedCategory !== 'Todos' || searchQuery !== '' || selectedNeighborhood !== 'Todos';

  return (
    <div className="min-h-screen w-full flex flex-col">
      
      <Navbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedNeighborhood={selectedNeighborhood}
        onNeighborhoodChange={setSelectedNeighborhood}
        isSearching={isSearching}
      />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64">
          {/* Map Section */}
          <div className="h-[35vh] sm:h-[35vh] md:h-[40vh] lg:h-[60vh] w-full">
            <MapComponent 
              selectedNeighborhood={selectedNeighborhood}
              selectedCategory={selectedCategory}
            />
          </div>

          {/* Neighborhood Selector below map */}
          <div className="w-full bg-card border-b border-border" data-tour="neighborhood-selector">
            <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-4 md:px-6 py-3">
              <Popover open={neighborhoodOpen} onOpenChange={setNeighborhoodOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={neighborhoodOpen}
                    className="w-full sm:w-auto justify-between min-w-[200px]"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedNeighborhood || "Todos los barrios"}</span>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar barrio..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No se encontró barrio.</CommandEmpty>
                      <CommandGroup>
                        {neighborhoods.map((neighborhood) => (
                          <CommandItem
                            key={neighborhood}
                            value={neighborhood}
                            onSelect={() => {
                              setSelectedNeighborhood(neighborhood);
                              setNeighborhoodOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedNeighborhood === neighborhood
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {neighborhood}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Category Bar */}
          <CategoryBar 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Content Sections */}
          {!showFilters ? (
            <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-6 sm:space-y-8 pb-20 md:pb-8">
              
              {/* 🏆 World Cup Hero Banner — compact */}
              <section className="relative -mx-4 sm:-mx-4 md:-mx-6 px-4 sm:px-6 md:px-8 py-5 sm:py-6 rounded-xl overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-secondary text-primary-foreground">
                <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
                  <span className="text-4xl sm:text-5xl">⚽</span>
                  <div className="text-center sm:text-left flex-1">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight">
                      El Mundial del Sabor 2026
                    </h2>
                    <p className="text-xs sm:text-sm opacity-90 mt-1">
                      Vive cada partido con los mejores restaurantes de Cali 🇨🇴
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/recommendations')}
                    className="gap-1.5 whitespace-nowrap"
                  >
                    ¿Dónde ver los partidos?
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </section>

              {/* 🍽️ Restaurantes Destacados — PRIMERO */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Star className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Restaurantes Destacados</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Los mejores lugares para disfrutar la comida en Cali</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="gap-1 sm:gap-2 h-8 sm:h-10 text-xs sm:text-sm"
                    onClick={() => navigate('/listings')}
                  >
                    Ver todos
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
                <PlacesList places={featuredPlaces} />
              </section>

              {/* 📹 Shorts / Recomendados */}
              <section className="bg-muted/30 -mx-4 sm:-mx-4 md:-mx-6 px-4 sm:px-4 md:px-6 py-5 sm:py-6 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Video className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold">Videos Recomendados</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                        {selectedCategory === 'Todos' 
                          ? 'Descubre sabores en video'
                          : `Videos de ${selectedCategory}`
                        }
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="gap-1 sm:gap-2 h-8 sm:h-10 text-xs sm:text-sm"
                    onClick={() => navigate('/shorts')}
                  >
                    Ver todos
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
                <ShortsCarousel shorts={filteredShorts} />
              </section>

              {/* ⚽ Partidos de Colombia — compacto con CTA a restaurantes */}
              <section className="bg-card -mx-4 sm:-mx-4 md:-mx-6 px-4 sm:px-4 md:px-6 py-5 sm:py-6 rounded-xl border border-border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-2xl">🇨🇴</span>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold">Colombia en el Mundial</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Próximos partidos y tabla de posiciones</p>
                    </div>
                  </div>
                </div>
                <ColombiaProgress />
              </section>

              {/* 📅 Calendario general */}
              <section className="bg-muted/20 -mx-4 sm:-mx-4 md:-mx-6 px-4 sm:px-4 md:px-6 py-5 sm:py-6 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold">Calendario de Partidos</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Todos los encuentros del Mundial 2026</p>
                    </div>
                  </div>
                </div>
                <WorldCupCalendar />
              </section>

              {/* 🎉 Eventos gastronómicos */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold">Eventos en Cali</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Eventos gastronómicos y actividades</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="gap-1 sm:gap-2 h-8 sm:h-10 text-xs sm:text-sm"
                    onClick={() => navigate('/events-all')}
                  >
                    Ver todos
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {featuredEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            </div>
          ) : (
            /* Filtered Results */
            <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 pb-20 md:pb-8">
              {isSearching ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-center py-12 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20"></div>
                        <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-primary"></div>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-foreground">Buscando lugares...</p>
                        <p className="text-sm text-muted-foreground mt-1">Esto tomará solo un momento</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="space-y-3 bg-card rounded-lg p-4 border">
                        <Skeleton className="h-48 w-full rounded-lg" />
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex gap-2">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {(selectedCategory !== 'Todos' || searchQuery) && (
                    <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card border rounded-lg p-3 sm:p-4 gap-3 animate-fade-in">
                      <div>
                        <p className="text-sm sm:text-base text-muted-foreground font-normal">
                          {filteredPlaces.length} {filteredPlaces.length === 1 ? 'lugar encontrado' : 'lugares encontrados'}
                        </p>
                        {searchQuery && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Búsqueda: "{searchQuery}"
                          </p>
                        )}
                      </div>
                      {selectedCategory !== 'Todos' && (
                        <Button
                          size="sm"
                          onClick={() => navigate(`/listings?category=${selectedCategory}`)}
                          className="gap-1.5 sm:gap-2 w-full sm:w-auto text-xs sm:text-sm"
                        >
                          Ver todas con filtros
                          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      )}
                    </div>
                  )}
                  <div className="animate-fade-in">
                    <PlacesList places={filteredPlaces} />
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>
      
      {/* Bottom Navigation for mobile */}
      <BottomNav />
      
      {/* Floating AI Chat */}
      <FloatingAIChat isHidden={isTourActive} />
    </div>
  );
};

export default Index;
