import { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PlaceCard from '@/components/PlaceCard';
import { categories } from '@/data/places';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORY_EMOJIS: Record<string, string> = {
  'Todos': '🍽️',
  'Comidas Rápidas': '🍔',
  'Café': '☕',
  'Food Truck': '🚚',
  'Mexicana': '🌮',
  'Asiática': '🍣',
  'Bar': '🍺',
  'Parrilla': '🥩',
  'Italiana': '🍕',
  'Rooftop': '🏙️',
  'Tradicional': '🍲',
  'Remate': '🎉',
};

const Listings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'Todos';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState<any[]>([]);
  const [dbNeighborhoods, setDbNeighborhoods] = useState<string[]>(['Todos']);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

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
      const searchMatch = !searchQuery || normalizeText(place.name).includes(normalizeText(searchQuery)) || normalizeText(place.address || '').includes(normalizeText(searchQuery));
      return categoryMatch && neighborhoodMatch && searchMatch;
    });
  }, [places, selectedCategory, selectedNeighborhood, searchQuery]);

  const featuredPlaces = filteredPlaces.filter(p => p.featured);
  const regularPlaces = filteredPlaces.filter(p => !p.featured);
  const activeFilters = (selectedCategory !== 'Todos' ? 1 : 0) + (selectedNeighborhood !== 'Todos' ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 pt-16 md:pt-20">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64">
          {/* Hero Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary py-5 sm:py-10 md:py-12 px-3 sm:px-6 md:px-8">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-2 right-4 sm:top-4 sm:right-8 text-4xl sm:text-6xl animate-bounce" style={{ animationDuration: '3s' }}>⚽</div>
              <div className="absolute bottom-2 left-6 sm:bottom-4 sm:left-12 text-3xl sm:text-5xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>🏆</div>
              <div className="absolute top-1/2 right-1/3 text-2xl sm:text-4xl animate-bounce hidden sm:block" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>🍽️</div>
            </div>
            
            <div className="relative max-w-screen-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                  <span className="text-xs sm:text-sm font-medium text-primary-foreground/80">Explora Cali</span>
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-primary-foreground mb-1.5 sm:mb-2 leading-tight">
                  Descubre los mejores
                  <br />
                  <span className="text-accent">sabores de Cali</span>
                </h1>
                <p className="text-primary-foreground/70 text-xs sm:text-base max-w-lg hidden sm:block">
                  Encuentra restaurantes, cafés, bares y mucho más en tu ciudad
                </p>
              </motion.div>

              {/* Search bar */}
              <motion.div 
                className="mt-4 sm:mt-6 flex gap-2 max-w-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar restaurantes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-9 h-11 sm:h-12 rounded-xl bg-card/95 backdrop-blur-sm border-0 shadow-lg text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl shadow-lg relative shrink-0"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {activeFilters > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {activeFilters}
                    </span>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>

          <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6">
            {/* Category chips */}
            <div className="py-3 sm:py-4 -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6 overflow-x-auto scrollbar-hide">
              <div className="flex gap-1.5 sm:gap-2 min-w-max">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-md scale-105'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                      }`}
                    >
                      <span>{CATEGORY_EMOJIS[cat] || '🍽️'}</span>
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Neighborhood filter (expandable) */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pb-4 border-b border-border/50 mb-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Barrio</p>
                    <div className="flex flex-wrap gap-1.5">
                      {dbNeighborhoods.map((n) => (
                        <button
                          key={n}
                          onClick={() => setSelectedNeighborhood(n)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            selectedNeighborhood === n
                              ? 'bg-secondary text-secondary-foreground shadow-sm'
                              : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active filters pills */}
            {activeFilters > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs text-muted-foreground">Filtros:</span>
                {selectedCategory !== 'Todos' && (
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors gap-1"
                    onClick={() => setSelectedCategory('Todos')}
                  >
                    {CATEGORY_EMOJIS[selectedCategory]} {selectedCategory}
                    <X className="h-3 w-3" />
                  </Badge>
                )}
                {selectedNeighborhood !== 'Todos' && (
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors gap-1"
                    onClick={() => setSelectedNeighborhood('Todos')}
                  >
                    📍 {selectedNeighborhood}
                    <X className="h-3 w-3" />
                  </Badge>
                )}
                <button
                  onClick={() => { setSelectedCategory('Todos'); setSelectedNeighborhood('Todos'); }}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Limpiar todo
                </button>
              </div>
            )}

            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {loading ? 'Cargando...' : (
                  <>
                    <span className="font-semibold text-foreground">{filteredPlaces.length}</span>{' '}
                    {filteredPlaces.length === 1 ? 'resultado' : 'resultados'}
                  </>
                )}
              </p>
            </div>

            {/* Loading skeleton */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 pb-28 md:pb-12">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-border/50">
                    <Skeleton className="aspect-[4/3]" />
                    <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                      <Skeleton className="h-4 sm:h-5 w-3/4" />
                      <Skeleton className="h-3 sm:h-4 w-1/2" />
                      <Skeleton className="h-7 sm:h-8 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPlaces.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 sm:py-20"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">No encontramos resultados</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Intenta cambiar los filtros o buscar algo diferente
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory('Todos');
                    setSelectedNeighborhood('Todos');
                    setSearchQuery('');
                  }}
                  className="rounded-full"
                >
                  Limpiar filtros
                </Button>
              </motion.div>
            ) : (
              <div className="pb-28 md:pb-12 space-y-6 sm:space-y-8">
                {/* Featured section */}
                {featuredPlaces.length > 0 && selectedCategory === 'Todos' && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <span className="text-base sm:text-lg">⭐</span>
                      <h2 className="text-base sm:text-lg font-bold">Destacados</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                      {featuredPlaces.map((place) => (
                        <PlaceCard key={place.id} place={place} featured />
                      ))}
                    </div>
                  </div>
                )}

                {/* All results */}
                <div>
                  {featuredPlaces.length > 0 && selectedCategory === 'Todos' && (
                    <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Todos los lugares</h2>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                    {(selectedCategory === 'Todos' ? regularPlaces : filteredPlaces).map((place) => (
                      <PlaceCard key={place.id} place={place} />
                    ))}
                  </div>
                </div>
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
