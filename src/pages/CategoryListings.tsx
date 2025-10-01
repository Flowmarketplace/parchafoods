import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid, List as ListIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PlaceCard from '@/components/PlaceCard';
import MapComponent from '@/components/MapComponent';
import AdvancedFilters, { Filters } from '@/components/AdvancedFilters';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { mockPlaces } from '@/data/places';
import { Place } from '@/types/place';

const CategoryListings = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get('category') || 'Todos';
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMap, setShowMap] = useState(true);
  
  const [filters, setFilters] = useState<Filters>({
    zone: 'Todos',
    neighborhood: 'Todos',
    priceRange: [0, 4],
    rating: 0,
    foodType: [],
    familyFriendly: false,
    petFriendly: false,
    couples: false,
    kids: false,
  });

  const filteredPlaces = useMemo(() => {
    return mockPlaces.filter((place: Place) => {
      // Category filter
      if (category !== 'Todos' && place.category !== category) return false;
      
      // Zone filter
      if (filters.zone !== 'Todos' && place.zone !== filters.zone) return false;
      
      // Neighborhood filter
      if (filters.neighborhood !== 'Todos' && place.neighborhood !== filters.neighborhood) return false;
      
      // Price range filter
      const placePrice = place.priceRange?.length || 1;
      if (placePrice < filters.priceRange[0] || placePrice > filters.priceRange[1]) return false;
      
      // Rating filter
      if (filters.rating > 0 && (!place.rating || place.rating < filters.rating)) return false;
      
      // Food type filter (only for restaurants)
      if (filters.foodType.length > 0 && place.category === 'Restaurante') {
        if (!place.foodType || !filters.foodType.some(type => place.foodType?.includes(type))) {
          return false;
        }
      }
      
      // Characteristics filters
      if (filters.familyFriendly && !place.familyFriendly) return false;
      if (filters.petFriendly && !place.petFriendly) return false;
      if (filters.couples && !place.goodForCouples) return false;
      if (filters.kids && !place.goodForKids) return false;
      
      return true;
    });
  }, [category, filters]);

  const handleClearFilters = () => {
    setFilters({
      zone: 'Todos',
      neighborhood: 'Todos',
      priceRange: [0, 4],
      rating: 0,
      foodType: [],
      familyFriendly: false,
      petFriendly: false,
      couples: false,
      kids: false,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 pt-16 md:pt-28">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64">
          <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/')}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">{category}</h1>
                  <p className="text-muted-foreground">
                    {filteredPlaces.length} {filteredPlaces.length === 1 ? 'resultado' : 'resultados'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMap(!showMap)}
                >
                  {showMap ? 'Ocultar' : 'Mostrar'} Mapa
                </Button>
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

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Filters Sidebar */}
              <div className="w-full lg:w-80 flex-shrink-0">
                <div className="lg:sticky lg:top-24">
                  <AdvancedFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 min-w-0">
                <div className={showMap ? 'grid grid-cols-1 xl:grid-cols-2 gap-6' : ''}>
                  {/* Places List */}
                  <div className={viewMode === 'grid' ? 'space-y-6' : 'space-y-4'}>
                    {filteredPlaces.length === 0 ? (
                      <div className="text-center py-12 bg-card rounded-lg border">
                        <p className="text-muted-foreground mb-4">
                          No se encontraron lugares con estos filtros
                        </p>
                        <Button variant="outline" onClick={handleClearFilters}>
                          Limpiar filtros
                        </Button>
                      </div>
                    ) : (
                      <div className={
                        viewMode === 'grid'
                          ? 'grid grid-cols-1 sm:grid-cols-2 gap-6'
                          : 'flex flex-col gap-4'
                      }>
                        {filteredPlaces.map((place) => (
                          <PlaceCard key={place.id} place={place} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Map */}
                  {showMap && (
                    <div className="hidden xl:block">
                      <div className="sticky top-24 h-[calc(100vh-120px)] rounded-lg overflow-hidden border shadow-lg">
                        <MapComponent
                          selectedCategory={category}
                          selectedNeighborhood={filters.neighborhood}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoryListings;
