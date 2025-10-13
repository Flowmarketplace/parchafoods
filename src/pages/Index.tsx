import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { WelcomeDialog } from '@/components/WelcomeDialog';
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
import { ChevronRight, Home, Star, Calendar, Video, MapPin, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ShortCard from '@/components/ShortCard';
import ShortsCarousel from '@/components/ShortsCarousel';
import PlaceChat from '@/components/PlaceChat';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Todos');
  const [isSearching, setIsSearching] = useState(false);
  const [neighborhoodOpen, setNeighborhoodOpen] = useState(false);
  const navigate = useNavigate();

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
    return mockPlaces
      .filter(place => place.featured || (place.rating && place.rating >= 4.5))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6);
  }, []);

  // Get featured events
  const featuredEvents = useMemo(() => {
    return mockEvents
      .filter(event => event.featured)
      .slice(0, 4);
  }, []);

  // Filter shorts by category
  const filteredShorts = useMemo(() => {
    if (selectedCategory === 'Todos') {
      return mockShorts;
    }
    return mockShorts.filter(short => short.category === selectedCategory);
  }, [selectedCategory]);

  // Filter places based on all criteria (for the filtered view)
  const filteredPlaces = useMemo(() => {
    return mockPlaces.filter((place) => {
      const categoryMatch = selectedCategory === 'Todos' || place.category === selectedCategory;
      const neighborhoodMatch = selectedNeighborhood === 'Todos' || place.neighborhood === selectedNeighborhood;
      
      // Enhanced search: search in name, category, address, neighborhood, and foodType
      const searchLower = searchQuery.toLowerCase();
      const searchMatch = searchQuery === '' || 
        place.name.toLowerCase().includes(searchLower) ||
        place.category.toLowerCase().includes(searchLower) ||
        place.address.toLowerCase().includes(searchLower) ||
        place.neighborhood.toLowerCase().includes(searchLower) ||
        (place.foodType && place.foodType.some(type => type.toLowerCase().includes(searchLower))) ||
        (place.description && place.description.toLowerCase().includes(searchLower));
      
      return categoryMatch && neighborhoodMatch && searchMatch;
    });
  }, [selectedCategory, selectedNeighborhood, searchQuery]);

  const showFilters = selectedCategory !== 'Todos' || searchQuery !== '' || selectedNeighborhood !== 'Todos';

  return (
    <div className="min-h-screen w-full flex flex-col">
      <WelcomeDialog />
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
          <div className="w-full bg-card border-b border-border">
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
            <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-6 sm:space-y-8 md:space-y-12 pb-20 md:pb-8">
              {/* Nuestros Recomendados Button */}
              <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-purple-500/10 -mx-4 sm:-mx-4 md:-mx-6 px-4 sm:px-4 md:px-6 py-6 sm:py-8 rounded-lg border-t-2 border-primary/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Nuestros Recomendados
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Descubre qué hacer cada día de la semana en Cali
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate('/recommendations')}
                    size="lg"
                    className="gap-2 w-full sm:w-auto"
                  >
                    Ver recomendaciones
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </section>

              {/* Recomendados - Shorts Section */}
              <section className="bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-primary/5 -mx-4 sm:-mx-4 md:-mx-6 px-4 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 rounded-lg border-t-2 border-purple-500/20">
                <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                      <Video className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Recomendados
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                        {selectedCategory === 'Todos' 
                          ? 'Videos cortos de creadores locales'
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

              {/* Events Section */}
              <section className="bg-gradient-to-br from-primary/5 to-secondary/5 -mx-4 sm:-mx-4 md:-mx-6 px-4 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 rounded-lg border-t-2 border-primary/20">
                <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold">¿Qué hay para hacer?</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Eventos, conciertos, teatro, cine y más</p>
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

              {/* Featured/Popular Places Section */}
              <section className="py-2">
                <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Star className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                    </div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Lugares Destacados</h2>
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
                  {selectedCategory !== 'Todos' && (
                    <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card border rounded-lg p-3 sm:p-4 gap-3 animate-fade-in">
                      <p className="text-sm sm:text-base text-muted-foreground font-normal">
                        {filteredPlaces.length} {filteredPlaces.length === 1 ? 'lugar encontrado' : 'lugares encontrados'}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/listings?category=${selectedCategory}`)}
                        className="gap-1.5 sm:gap-2 w-full sm:w-auto text-xs sm:text-sm"
                      >
                        Ver todas con filtros
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
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
      <FloatingAIChat />
    </div>
  );
};

export default Index;
