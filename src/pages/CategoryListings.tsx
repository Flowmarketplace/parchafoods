import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, SlidersHorizontal, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import PlaceCard from '@/components/PlaceCard';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { ALL_CATEGORY, BUSINESS_CATEGORIES, resolveBusinessType, resolveSubcategory, getSubcategories } from '@/data/categories';
import { useCity } from '@/contexts/CityContext';
import { motion, AnimatePresence } from 'framer-motion';
import { pickBusinessCoverUrl } from '@/utils/businessImages';

const CATEGORY_ITEMS = [ALL_CATEGORY, ...BUSINESS_CATEGORIES];

const CategoryListings = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { city } = useCity();
  const initialCategory = searchParams.get('category') || 'Todos';

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
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
        .eq('city', city.id)
        .order('featured', { ascending: false })
        .order('name');

      if (data) {
        const transformed = data.map((b: any) => {
          const imageUrl = pickBusinessCoverUrl(b.business_images, b);

          return {
            id: b.id,
            slug: b.slug,
            name: b.name,
            category: b.category,
            businessType: resolveBusinessType(b.business_type || b.category),
            subcategory: resolveSubcategory(b.category, b.business_type, b.name),
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
  }, [city.id]);

  const normalizeText = (t: string) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const categoryMatch = selectedCategory === 'Todos' || place.businessType === selectedCategory;
      const subcategoryMatch = !selectedSubcategory || place.subcategory === selectedSubcategory;
      const neighborhoodMatch = selectedNeighborhood === 'Todos' || normalizeText(place.neighborhood || '') === normalizeText(selectedNeighborhood);
      const searchMatch = !searchQuery || normalizeText(place.name).includes(normalizeText(searchQuery)) || normalizeText(place.address || '').includes(normalizeText(searchQuery));
      return categoryMatch && subcategoryMatch && neighborhoodMatch && searchMatch;
    });
  }, [places, selectedCategory, selectedSubcategory, selectedNeighborhood, searchQuery]);

  /** Subcategories of the selected macro category that actually have places. */
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === 'Todos') return [] as { name: string; count: number }[];
    const inCategory = places.filter((p) => p.businessType === selectedCategory);
    const counts = new Map<string, number>();
    inCategory.forEach((p) => {
      if (p.subcategory) counts.set(p.subcategory, (counts.get(p.subcategory) || 0) + 1);
    });
    const ordered = getSubcategories(selectedCategory)
      .filter((s) => counts.has(s))
      .map((s) => ({ name: s, count: counts.get(s)! }));
    const extras = [...counts.entries()]
      .filter(([name]) => !ordered.some((o) => o.name === name))
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    return [...ordered, ...extras];
  }, [places, selectedCategory]);

  const selectCategory = (id: string) => {
    setSelectedCategory(id);
    setSelectedSubcategory(null);
  };

  const activeFilters =
    (selectedCategory !== 'Todos' ? 1 : 0) +
    (selectedSubcategory ? 1 : 0) +
    (selectedNeighborhood !== 'Todos' ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 pt-16 md:pt-20">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 min-w-0">
          {/* Hero Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary py-8 sm:py-10 px-4 sm:px-6 md:px-8">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-8 text-6xl animate-bounce" style={{ animationDuration: '3s' }}>
                🏙️
              </div>
              <div className="absolute bottom-4 left-12 text-5xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>📍</div>
            </div>

            <div className="relative max-w-screen-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-1.5 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-3 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver al inicio
                </button>

                <div className="flex items-center gap-3 mb-2">
                  <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary-foreground">
                      {selectedCategory === 'Todos' ? `Negocios en ${city.name}` : `${selectedCategory} en ${city.name}`}
                    </h1>
                    <p className="text-primary-foreground/70 text-sm">
                      {loading ? 'Cargando...' : (
                        <>
                          <span className="font-semibold text-primary-foreground">{filteredPlaces.length}</span>{' '}
                          {filteredPlaces.length === 1 ? 'lugar encontrado' : 'lugares encontrados'}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Search bar */}
              <motion.div
                className="mt-5 flex gap-2 max-w-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre o dirección..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 rounded-xl bg-card/95 backdrop-blur-sm border-0 shadow-lg text-foreground placeholder:text-muted-foreground"
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
                  className="h-11 w-11 rounded-xl shadow-lg relative"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {activeFilters > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                      {activeFilters}
                    </span>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>

          <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6">
            {/* Category chips */}
            <div className="py-4 -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 min-w-max">
                {CATEGORY_ITEMS.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => selectCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-md scale-105'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subcategory chips */}
            {availableSubcategories.length > 0 && (
              <div className="pb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Subcategorías
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedSubcategory(null)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      !selectedSubcategory
                        ? 'bg-secondary text-secondary-foreground shadow-sm'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    Todas
                  </button>
                  {availableSubcategories.map((sub) => (
                    <button
                      key={sub.name}
                      onClick={() =>
                        setSelectedSubcategory(selectedSubcategory === sub.name ? null : sub.name)
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedSubcategory === sub.name
                          ? 'bg-secondary text-secondary-foreground shadow-sm'
                          : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {sub.name} <span className="opacity-60">({sub.count})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                    onClick={() => selectCategory('Todos')}
                  >
                    {selectedCategory}
                    <X className="h-3 w-3" />
                  </Badge>
                )}
                {selectedSubcategory && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors gap-1"
                    onClick={() => setSelectedSubcategory(null)}
                  >
                    {selectedSubcategory}
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


            {/* Results */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 pb-24">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-border/50">
                    <Skeleton className="aspect-[4/3]" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-8 w-full" />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 pb-24">
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
