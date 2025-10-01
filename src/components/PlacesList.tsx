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
      <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">{title}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {places.length} {places.length === 1 ? 'lugar' : 'lugares'}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-1.5 sm:gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 sm:h-10 sm:w-10"
            >
              <Grid3x3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 sm:h-10 sm:w-10"
            >
              <List className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        {/* Places Grid/List */}
        {places.length > 0 ? (
          <div
            className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6'
                : 'flex flex-col gap-2 sm:gap-3 md:gap-4'
            )}
          >
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-10 md:py-12">
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
              No se encontraron lugares con los filtros seleccionados
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacesList;
