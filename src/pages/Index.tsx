import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MapComponent from '@/components/MapComponent';
import CategoryBar from '@/components/CategoryBar';
import FilterBar from '@/components/FilterBar';
import PlacesList from '@/components/PlacesList';
import EventCard from '@/components/EventCard';
import BottomNav from '@/components/BottomNav';
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
      <Navbar 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedNeighborhood={selectedNeighborhood}
        onNeighborhoodChange={setSelectedNeighborhood}
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
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Todos">Todos los barrios</option>
                <option value="Granada">Granada</option>
                <option value="San Antonio">San Antonio</option>
                <option value="El Peñón">El Peñón</option>
                <option value="San Fernando">San Fernando</option>
                <option value="Ciudad Jardín">Ciudad Jardín</option>
                <option value="Juanchito">Juanchito</option>
              </select>
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
              {/* Events Section - Now first */}
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
              {selectedCategory !== 'Todos' && (
                <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card border rounded-lg p-3 sm:p-4 gap-3">
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
              <PlacesList places={filteredPlaces} />
            </div>
          )}
        </main>
      </div>
      
      {/* Bottom Navigation for mobile */}
      <BottomNav />
    </div>
  );
};

export default Index;
