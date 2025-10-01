import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import EventCard from '@/components/EventCard';
import { mockEvents } from '@/data/events';
import { eventTypes } from '@/data/events';
import { neighborhoods } from '@/data/places';
import { Button } from '@/components/ui/button';
import { Calendar, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const Events = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event) => {
      const typeMatch = selectedType === 'Todos' || event.type === selectedType;
      const neighborhoodMatch = selectedNeighborhood === 'Todos' || event.neighborhood === selectedNeighborhood;
      const searchMatch = searchQuery === '' || 
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase());
      
      return typeMatch && neighborhoodMatch && searchMatch;
    });
  }, [selectedType, selectedNeighborhood, searchQuery]);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 pt-16 md:pt-28">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Calendar className="h-10 w-10 text-primary" />
                <h1 className="text-4xl font-bold">Eventos en Cali</h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Descubre conciertos, teatro, cine y más actividades en tu ciudad
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="sticky top-16 md:top-28 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="px-4 py-4">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Filtros:</span>
                </div>
                
                <Input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 md:max-w-xs"
                />

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Tipo de evento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos los tipos</SelectItem>
                    {eventTypes.filter(type => type !== 'Todos').map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedNeighborhood} onValueChange={setSelectedNeighborhood}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Barrio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos los barrios</SelectItem>
                    {neighborhoods.filter(n => n !== 'Todos').map((neighborhood) => (
                      <SelectItem key={neighborhood} value={neighborhood}>
                        {neighborhood}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(selectedType !== 'Todos' || selectedNeighborhood !== 'Todos' || searchQuery !== '') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedType('Todos');
                      setSelectedNeighborhood('Todos');
                      setSearchQuery('');
                    }}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="px-4 py-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado{filteredEvents.length !== 1 ? 's' : ''}
              </h2>
              {(selectedType !== 'Todos' || selectedNeighborhood !== 'Todos' || searchQuery !== '') && (
                <p className="text-muted-foreground">
                  {selectedType !== 'Todos' && `Tipo: ${selectedType} • `}
                  {selectedNeighborhood !== 'Todos' && `Barrio: ${selectedNeighborhood} • `}
                  {searchQuery !== '' && `Búsqueda: "${searchQuery}"`}
                </p>
              )}
            </div>

            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No se encontraron eventos</h3>
                <p className="text-muted-foreground mb-6">
                  Intenta cambiar los filtros o buscar algo diferente
                </p>
                <Button
                  onClick={() => {
                    setSelectedType('Todos');
                    setSelectedNeighborhood('Todos');
                    setSearchQuery('');
                  }}
                >
                  Ver todos los eventos
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Events;
