import { useState } from 'react';
import { Filter, Grid, List as ListIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PlaceCard from '@/components/PlaceCard';
import { mockPlaces } from '@/data/places';
import { categories, neighborhoods } from '@/data/places';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

const Listings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Todos');

  const filteredPlaces = mockPlaces.filter((place) => {
    const categoryMatch = selectedCategory === 'Todos' || place.category === selectedCategory;
    const neighborhoodMatch = selectedNeighborhood === 'Todos' || place.neighborhood === selectedNeighborhood;
    return categoryMatch && neighborhoodMatch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 pt-16 md:pt-28">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64">
          <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Explorar lugares</h1>
              <p className="text-muted-foreground">
                Descubre los mejores lugares de Cali
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedNeighborhood} onValueChange={setSelectedNeighborhood}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Barrio" />
                </SelectTrigger>
                <SelectContent>
                  {neighborhoods.map((neighborhood) => (
                    <SelectItem key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="ml-auto flex gap-2">
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

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategory !== 'Todos' && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory('Todos')}>
                  {selectedCategory} ✕
                </Badge>
              )}
              {selectedNeighborhood !== 'Todos' && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedNeighborhood('Todos')}>
                  {selectedNeighborhood} ✕
                </Badge>
              )}
            </div>

            {/* Results */}
            <div className="mb-4">
              <p className="text-muted-foreground">
                {filteredPlaces.length} {filteredPlaces.length === 1 ? 'resultado' : 'resultados'}
              </p>
            </div>

            {/* Places Grid/List */}
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-4'
            }>
              {filteredPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>

            {filteredPlaces.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron lugares con estos filtros</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategory('Todos');
                    setSelectedNeighborhood('Todos');
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Listings;
