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
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar lugares, negocios..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-11"
            />
          </div>

          {/* Neighborhood Select */}
          <Select value={selectedNeighborhood} onValueChange={onNeighborhoodChange}>
            <SelectTrigger className="w-full md:w-[200px] h-11">
              <MapPin className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Barrio" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {neighborhoods.map((neighborhood) => (
                <SelectItem key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Advanced Filters Button */}
          <Button
            variant="outline"
            onClick={onAdvancedFilters}
            className="w-full md:w-auto h-11"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
