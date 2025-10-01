import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MapComponent from '@/components/MapComponent';
import CategoryBar from '@/components/CategoryBar';
import FilterBar from '@/components/FilterBar';
import PlacesList from '@/components/PlacesList';
import { mockPlaces } from '@/data/places';
import { Button } from '@/components/ui/button';
import { ChevronRight, Home, Star, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Todos');
  const navigate = useNavigate();

  // Get featured/top rated places (non real estate)
  const featuredPlaces = useMemo(() => {
    return mockPlaces
      .filter(place => place.category !== 'Inmobiliaria' && (place.featured || (place.rating && place.rating >= 4.5)))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6);
  }, []);

  // Get real estate properties
  const realEstatePlaces = useMemo(() => {
    return mockPlaces
      .filter(place => place.category === 'Inmobiliaria')
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }, []);

  // Filter places based on all criteria (for the filtered view)
  const filteredPlaces = useMemo(() => {
    return mockPlaces.filter((place) => {
      const categoryMatch = selectedCategory === 'Todos' || place.category === selectedCategory;
      const neighborhoodMatch = selectedNeighborhood === 'Todos' || place.neighborhood === selectedNeighborhood;
      const searchMatch = searchQuery === '' || 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      return categoryMatch && neighborhoodMatch && searchMatch;
    });
  }, [selectedCategory, selectedNeighborhood, searchQuery]);

  const showFilters = selectedCategory !== 'Todos' || searchQuery !== '' || selectedNeighborhood !== 'Todos';

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 pt-16 md:pt-28">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64">
          {/* Map Section */}
          <div className="h-[50vh] md:h-[60vh]">
            <MapComponent 
              selectedNeighborhood={selectedNeighborhood}
              selectedCategory={selectedCategory}
            />
          </div>

          {/* Category Bar */}
          <CategoryBar 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Filter Bar */}
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedNeighborhood={selectedNeighborhood}
            onNeighborhoodChange={setSelectedNeighborhood}
          />

          {/* Content Sections */}
          {!showFilters ? (
            <div className="px-4 py-8 space-y-12">
              {/* Featured/Popular Places Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Star className="h-6 w-6 text-secondary" />
                    <h2 className="text-2xl font-bold">Lugares Destacados</h2>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="gap-2"
                    onClick={() => setSelectedCategory('Todos')}
                  >
                    Ver todos
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <PlacesList places={featuredPlaces} />
              </section>

              {/* Real Estate Section */}
              <section className="bg-muted/30 -mx-4 px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-primary" />
                    <div>
                      <h2 className="text-2xl font-bold">Inmobiliaria</h2>
                      <p className="text-sm text-muted-foreground">Casas y apartamentos en arriendo o venta</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="gap-2"
                    onClick={() => setSelectedCategory('Inmobiliaria')}
                  >
                    Ver todas
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <PlacesList places={realEstatePlaces} />
              </section>

              {/* CTA to view all */}
              <section className="text-center py-8">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/listings')}
                  className="gap-2"
                >
                  <Home className="h-5 w-5" />
                  Explorar Todos los Lugares
                </Button>
              </section>
            </div>
          ) : (
            /* Filtered Results */
            <PlacesList places={filteredPlaces} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
