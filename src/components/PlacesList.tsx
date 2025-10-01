import { useState } from 'react';
import PlaceCard from './PlaceCard';
import { Place } from '@/types/place';
import { Button } from '@/components/ui/button';
import { Grid3x3, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlacesListProps {
  places: Place[];
  title?: string;
}

const PlacesList = ({ places, title = 'Lugares encontrados' }: PlacesListProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="w-full bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-muted-foreground">
              {places.length} {places.length === 1 ? 'lugar' : 'lugares'}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="h-10 w-10"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="h-10 w-10"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Places Grid/List */}
        {places.length > 0 ? (
          <div
            className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-4'
            )}
          >
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No se encontraron lugares con los filtros seleccionados
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacesList;
