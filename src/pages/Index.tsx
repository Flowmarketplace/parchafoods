import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MapComponent from '@/components/MapComponent';

import PlacesList from '@/components/PlacesList';
import EventCard from '@/components/EventCard';
import BottomNav from '@/components/BottomNav';
import FloatingAIChat from '@/components/FloatingAIChat';
import { neighborhoods } from '@/data/places';
import { Button } from '@/components/ui/button';
import { ChevronRight, Star, Sparkles, MapPin, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RecommendedPlans from '@/components/RecommendedPlans';
import LoyaltyPointsCard from '@/components/LoyaltyPointsCard';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { pickBusinessCoverUrl } from '@/utils/businessImages';
import { useCity } from '@/contexts/CityContext';
import { BUSINESS_CATEGORIES, resolveBusinessType, resolveSubcategory, getSubcategories } from '@/data/categories';
import { getSubcategoryIcon } from '@/utils/subcategoryIcons';
import { LayoutGrid } from 'lucide-react';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Todos');
  const [isSearching, setIsSearching] = useState(false);
  const [neighborhoodOpen, setNeighborhoodOpen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [places, setPlaces] = useState<any[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [shorts, setShorts] = useState<any[]>([]);
  const [dbNeighborhoods, setDbNeighborhoods] = useState<string[]>([]);
  const [mapExpanded, setMapExpanded] = useState(false);
  const navigate = useNavigate();
  const { city } = useCity();

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
        .eq('city', city.id)
        .order('featured', { ascending: false })
        .order('name');
      
      if (data) {
        const transformedPlaces = data.map((business: any) => {
          const imageUrl = pickBusinessCoverUrl(business.business_images, business);
          
          return {
            id: business.id,
            slug: business.slug,
            name: business.name,
            category: business.category,
            businessType: resolveBusinessType(business.business_type || business.category),
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
            createdAt: business.created_at,
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
  }, [city.id]);

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
            name: 'La Ciudad en tus Manos',
            username: '@laciudadentusmanos',
            avatarUrl: '/ciudad-logo.png',
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
        setShorts([]);
      }
    };
    loadShorts();
  }, [city.name]);

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
    const allPlaces = places;
    const featured = allPlaces
      .filter(place => place.featured || (place.rating && place.rating >= 4.5));
    featured.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return featured.slice(0, 6);
  }, [places]);


  const filteredShorts = useMemo(() => {
    if (selectedCategory === 'Todos') return shorts;
    return shorts.filter(s => resolveBusinessType(s.category) === selectedCategory);
  }, [selectedCategory, shorts]);

  const filteredPlaces = useMemo(() => {
    const allPlaces = places;
    const normalizeText = (t: string) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (!searchQuery || searchQuery.trim() === '') {
      return allPlaces.filter((p) => {
        const catMatch = selectedCategory === 'Todos' || resolveBusinessType(p.business_type || p.category) === selectedCategory;
        const nMatch = selectedNeighborhood === 'Todos' || normalizeText(p.neighborhood || '') === normalizeText(selectedNeighborhood);
        return catMatch && nMatch;
      });
    }

    const searchLower = normalizeText(searchQuery.trim());
    return allPlaces.filter((p) => {
      const catMatch = selectedCategory === 'Todos' || resolveBusinessType(p.business_type || p.category) === selectedCategory;
      const nMatch = selectedNeighborhood === 'Todos' || normalizeText(p.neighborhood || '') === normalizeText(selectedNeighborhood);
      const text = normalizeText([p.name, p.category, p.address, p.neighborhood, p.description || '', ...(p.foodType || [])].join(' '));
      return text.includes(searchLower) && catMatch && nMatch;
    });
  }, [selectedCategory, selectedNeighborhood, searchQuery, places]);

  const subcategoryOptions = useMemo(() => {
    if (selectedCategory === 'Todos') return [];
    const counts = new Map<string, number>();
    filteredPlaces.forEach((p: any) => {
      const sub = resolveSubcategory(p.category, p.business_type || p.businessType, p.name);
      if (sub) counts.set(sub, (counts.get(sub) || 0) + 1);
    });
    return getSubcategories(selectedCategory)
      .filter((s) => counts.has(s))
      .map((s) => ({ name: s, count: counts.get(s) || 0 }));
  }, [selectedCategory, filteredPlaces]);

  const visiblePlaces = useMemo(() => {
    if (!selectedSubcategory) return filteredPlaces;
    return filteredPlaces.filter((p: any) =>
      resolveSubcategory(p.category, p.business_type || p.businessType, p.name) === selectedSubcategory
    );
  }, [filteredPlaces, selectedSubcategory]);

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
        
        <main className="flex-1 min-w-0">
          {/* Map */}
          {mapExpanded && (
            <div className="fixed inset-0 z-[60] bg-background flex flex-col">
              <div className="flex-1 relative">
                <MapComponent
                  selectedNeighborhood={selectedNeighborhood}
                  selectedCategory={selectedCategory}
                  places={places as any}
                  expanded={true}
                  onToggleExpand={() => setMapExpanded(false)}
                />
              </div>
            </div>
          )}
          <div className="relative z-20 h-[28vh] sm:h-[35vh] md:h-[40vh] lg:h-[60vh] w-full">
            <MapComponent
              selectedNeighborhood={selectedNeighborhood}
              selectedCategory={selectedCategory}
              places={places as any}
              expanded={false}
              onToggleExpand={() => setMapExpanded(true)}
            />
          </div>

          {/* Neighborhood Selector */}
          <div className="relative z-0 w-full bg-card border-b border-border">
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
                        {(dbNeighborhoods.length > 1 ? dbNeighborhoods : neighborhoods).map((n) => (
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

          

          {/* Categorías (unificada: filtra el mapa y la lista) */}
          <section className="px-3 sm:px-4 md:px-6 pt-3 sm:pt-5">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-lg">🧭</span>
              <h2 className="text-sm sm:text-lg font-bold">Explora por categoría</h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              <button
                onClick={() => { setSelectedCategory('Todos'); setSelectedSubcategory(null); }}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all hover:shadow-md active:scale-95",
                  selectedCategory === 'Todos' ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card"
                )}
              >
                <span className="rounded-full p-2 bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </span>
                <span className="text-[11px] font-medium text-center leading-tight">Todas</span>
              </button>
              {BUSINESS_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(isActive ? 'Todos' : cat.id); setSelectedSubcategory(null); }}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all hover:shadow-md active:scale-95",
                      isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card"
                    )}
                  >
                    <span className="rounded-full p-2" style={{ backgroundColor: `${cat.color}1A`, color: cat.color }}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-[11px] font-medium text-center leading-tight">{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {subcategoryOptions.length > 0 && (
              <div className="mt-3">
                <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Escoge una subcategoría</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5">
                  <button
                    onClick={() => setSelectedSubcategory(null)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1.5 rounded-2xl border px-2 py-3 transition-all active:scale-95",
                      !selectedSubcategory ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground hover:shadow-sm"
                    )}
                  >
                    <LayoutGrid className="h-5 w-5" />
                    <span className="text-[11px] sm:text-xs font-medium leading-tight text-center">Todas</span>
                  </button>
                  {subcategoryOptions.map((sub) => {
                    const SubIcon = getSubcategoryIcon(sub.name);
                    const active = selectedSubcategory === sub.name;
                    return (
                      <button
                        key={sub.name}
                        onClick={() => setSelectedSubcategory(active ? null : sub.name)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1.5 rounded-2xl border px-2 py-3 transition-all active:scale-95",
                          active ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground hover:shadow-sm"
                        )}
                      >
                        <SubIcon className="h-5 w-5" />
                        <span className="text-[11px] sm:text-xs font-medium leading-tight text-center">{sub.name}</span>
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full leading-none", active ? "bg-white/20 text-primary-foreground" : "bg-muted text-muted-foreground")}>{sub.count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {!showFilters ? (
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-5 space-y-4 sm:space-y-6 pb-20 md:pb-8">

              {/* Hero */}
              <section className="relative rounded-xl overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-secondary text-primary-foreground p-3 sm:p-5">
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="relative z-10 flex items-center gap-3">
                  <img src="/ciudad-logo.png" alt="" className="h-12 w-12 sm:h-16 sm:w-16 object-contain shrink-0 drop-shadow" />
                  <div className="flex-1 min-w-0">
                    <h1 className="text-base sm:text-xl md:text-2xl font-extrabold leading-tight">
                      La Ciudad en tus Manos — Guía de negocios de {city.label}
                    </h1>
                    <p className="text-[10px] sm:text-xs opacity-90 mt-0.5">
                      Comida, salud, belleza, ropa, hogar, servicios y mucho más cerca de ti.
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/listings')}
                  className="gap-1 mt-2 w-full sm:w-auto text-xs"
                >
                  Explorar negocios <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </section>


              {/* Restaurantes Destacados */}
              <section>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-accent/10 rounded-md">
                      <Star className="h-4 w-4 text-accent" />
                    </div>
                    <h2 className="text-sm sm:text-lg font-bold">Negocios Destacados</h2>
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
                  Ver todos los negocios
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </section>


              {/* Planes recomendados */}
              <section className="bg-muted/30 -mx-3 sm:mx-0 px-3 sm:px-0 py-3 sm:py-0 sm:bg-transparent">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-primary/10 rounded-md">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <h2 className="text-sm sm:text-lg font-bold">Planes recomendados en {city.label} ✨</h2>
                  </div>
                  <Button variant="ghost" className="gap-1 h-7 text-[11px] shrink-0 px-2" onClick={() => navigate('/listings')}>
                    Ver más <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
                <RecommendedPlans places={places} cityLabel={city.label} />
              </section>

              {/* Puntos de fidelización */}
              <LoyaltyPointsCard />


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
                        {visiblePlaces.length} {visiblePlaces.length === 1 ? 'lugar' : 'lugares'}
                        {searchQuery && <span className="block text-[10px]">"{searchQuery}"</span>}
                      </p>
                      {selectedCategory !== 'Todos' && (
                        <Button size="sm" className="gap-1 text-[11px] h-7" onClick={() => navigate(`/listings?category=${selectedCategory}`)}>
                          Ver todos <ChevronRight className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                  <PlacesList places={visiblePlaces} />
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
