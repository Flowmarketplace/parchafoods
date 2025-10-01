import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MapComponent from '@/components/MapComponent';
import CategoryBar from '@/components/CategoryBar';
import FilterBar from '@/components/FilterBar';
import PlacesList from '@/components/PlacesList';
import EventCard from '@/components/EventCard';
import { mockPlaces } from '@/data/places';
import { mockEvents } from '@/data/events';
import { Button } from '@/components/ui/button';
import { ChevronRight, Home, Star, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Todos');
  const navigate = useNavigate();

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
          <div className="h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh]">
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
                    onClick={() => navigate('/listings')}
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
                    <Calendar className="h-6 w-6 text-primary" />
                    <div>
                      <h2 className="text-2xl font-bold">¿Qué hay para hacer?</h2>
                      <p className="text-sm text-muted-foreground">Eventos, conciertos, teatro, cine y más</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="gap-2"
                    onClick={() => navigate('/events-all')}
                  >
                    Ver todos
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {featuredEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            </div>
          ) : (
            /* Filtered Results */
            <div className="px-4 py-8">
              {selectedCategory !== 'Todos' && (
                <div className="mb-6 flex items-center justify-between bg-card border rounded-lg p-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{selectedCategory}</h2>
                    <p className="text-sm text-muted-foreground">
                      {filteredPlaces.length} {filteredPlaces.length === 1 ? 'resultado' : 'resultados'} encontrados
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => navigate(`/listings?category=${selectedCategory}`)}
                    className="gap-2"
                  >
                    Ver todas con filtros avanzados
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              )}
              <PlacesList places={filteredPlaces} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
