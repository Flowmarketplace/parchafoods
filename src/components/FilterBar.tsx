import { Search, MapPin, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { neighborhoods } from '@/data/places';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedNeighborhood: string;
  onNeighborhoodChange: (value: string) => void;
  onAdvancedFilters?: () => void;
}

const FilterBar = ({ 
  searchQuery, 
  onSearchChange, 
  selectedNeighborhood, 
  onNeighborhoodChange,
  onAdvancedFilters 
}: FilterBarProps) => {
  return (
    <div className="w-full bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row gap-2 sm:gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <label className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-1 sm:mb-1.5 block">
              Escribe el nombre o categoría
            </label>
            <Search className="absolute left-2 sm:left-3 top-[26px] sm:top-7 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Buscar lugares..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 sm:pl-10 h-9 sm:h-11 text-sm touch-manipulation"
            />
          </div>

          {/* Neighborhood Select */}
          <div className="w-full md:w-[200px]">
            <label className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-1 sm:mb-1.5 block">
              Escoge el barrio
            </label>
            <Select value={selectedNeighborhood} onValueChange={onNeighborhoodChange}>
              <SelectTrigger className="w-full h-9 sm:h-11 text-sm">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <SelectValue placeholder="Barrio" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {neighborhoods.map((neighborhood) => (
                  <SelectItem key={neighborhood} value={neighborhood} className="text-sm">
                    {neighborhood}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Filters Button */}
          <Button
            variant="outline"
            onClick={onAdvancedFilters}
            className="w-full md:w-auto h-9 sm:h-11 text-sm touch-manipulation active:scale-95 transition-transform"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            Filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
