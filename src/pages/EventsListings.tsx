import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid, List as ListIcon, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EventCard from '@/components/EventCard';
import EventFiltersComponent, { EventFilters } from '@/components/EventFilters';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { mockEvents } from '@/data/events';
import { Event } from '@/types/event';

const EventsListings = () => {
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [filters, setFilters] = useState<EventFilters>({
    searchName: '',
    date: undefined,
    type: 'Todos',
    priceRange: 'Todos',
    isFree: false,
    isNew: false,
    hasPromotion: false,
    familyFriendly: false,
    goodForCouples: false,
  });

  const normalizeText = (t: string) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event: Event) => {
      // Name search filter
      if (filters.searchName) {
        const search = normalizeText(filters.searchName);
        const text = normalizeText([event.name, event.venue, event.address, event.description].join(' '));
        if (!text.includes(search)) return false;
      }

      // Date filter - compare only the date part
      if (filters.date) {
        const eventDate = new Date(event.date);
        const filterDate = new Date(filters.date);
        // Reset time to compare only dates
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
      searchName: '',
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 pt-16 md:pt-28">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 min-w-0">
          <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
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
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-primary" />
                  <div>
                    <h1 className="text-3xl font-bold">Todos los Eventos</h1>
                    <p className="text-muted-foreground">
                      {filteredEvents.length} {filteredEvents.length === 1 ? 'evento' : 'eventos'}
                    </p>
                  </div>
                </div>
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

            {/* Main Content */}
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
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-12 bg-card rounded-lg border">
                    <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No se encontraron eventos con estos filtros
                    </p>
                    <Button variant="outline" onClick={handleClearFilters}>
                      Limpiar filtros
                    </Button>
                  </div>
                ) : (
                  <div className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'flex flex-col gap-4'
                  }>
                    {filteredEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
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

export default EventsListings;
