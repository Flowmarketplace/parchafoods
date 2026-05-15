import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import EventCard from '@/components/EventCard';
import EventFiltersComponent, { EventFilters } from '@/components/EventFilters';
import { mockEvents } from '@/data/events';
import { Button } from '@/components/ui/button';
import { Calendar, Grid, List as ListIcon } from 'lucide-react';
import { Event } from '@/types/event';

const Events = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [filters, setFilters] = useState<EventFilters>({
    date: undefined,
    type: 'Todos',
    priceRange: 'Todos',
    isFree: false,
    isNew: false,
    hasPromotion: false,
    familyFriendly: false,
    goodForCouples: false,
  });

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event: Event) => {
      // Date filter
      if (filters.date) {
        const eventDate = new Date(event.date);
        const filterDate = new Date(filters.date);
        eventDate.setHours(0, 0, 0, 0);
        filterDate.setHours(0, 0, 0, 0);
        if (eventDate.getTime() !== filterDate.getTime()) return false;
      }
      
      // Type filter
      if (filters.type !== 'Todos' && event.type !== filters.type) return false;
      
      // Price range filter
      if (filters.priceRange !== 'Todos') {
        if (filters.priceRange === 'Gratis' && event.priceRange !== 'Gratis') return false;
        if (filters.priceRange !== 'Gratis' && event.priceRange !== filters.priceRange) return false;
      }
      
      // Special characteristics
      if (filters.isFree && !event.isFree) return false;
      if (filters.isNew && !event.isNew) return false;
      if (filters.hasPromotion && !event.hasPromotion) return false;
      if (filters.familyFriendly && !event.familyFriendly) return false;
      if (filters.goodForCouples && !event.goodForCouples) return false;
      
      return true;
    });
  }, [filters]);

  const handleClearFilters = () => {
    setFilters({
      date: undefined,
      type: 'Todos',
      priceRange: 'Todos',
      isFree: false,
      isNew: false,
      hasPromotion: false,
      familyFriendly: false,
      goodForCouples: false,
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 pt-16 md:pt-28">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 min-w-0">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-8 md:py-12 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Calendar className="h-8 md:h-10 w-8 md:w-10 text-primary" />
                <h1 className="text-2xl md:text-4xl font-bold">Eventos en Cali</h1>
              </div>
              <p className="text-base md:text-lg text-muted-foreground">
                Descubre conciertos, teatro, cine y más actividades en tu ciudad
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Filters Sidebar */}
              <div className="w-full lg:w-80 flex-shrink-0">
                <div className="lg:sticky lg:top-24">
                  <EventFiltersComponent
                    filters={filters}
                    onFiltersChange={setFilters}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              </div>

              {/* Events Grid/List */}
              <div className="flex-1 min-w-0">
                {/* Header with view mode toggle */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-2">
                      {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado{filteredEvents.length !== 1 ? 's' : ''}
                    </h2>
                  </div>
                  <div className="flex gap-2">
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

                {filteredEvents.length > 0 ? (
                  <div className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'
                      : 'flex flex-col gap-4'
                  }>
                    {filteredEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 md:py-16 bg-card rounded-lg border">
                    <Calendar className="h-12 md:h-16 w-12 md:w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg md:text-xl font-semibold mb-2">No se encontraron eventos</h3>
                    <p className="text-muted-foreground mb-6">
                      Intenta cambiar los filtros
                    </p>
                    <Button onClick={handleClearFilters}>
                      Limpiar todos los filtros
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Events;
