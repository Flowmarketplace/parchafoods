import { Search, MapPin, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { neighborhoods } from '@/data/places';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedNeighborhood: string;
  onNeighborhoodChange: (value: string) => void;
  onAdvancedFilters?: () => void;
  isSearching?: boolean;
}

const FilterBar = ({ 
  searchQuery, 
  onSearchChange, 
  selectedNeighborhood, 
  onNeighborhoodChange,
  onAdvancedFilters,
  isSearching = false
}: FilterBarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row gap-2 sm:gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <label className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-1 sm:mb-1.5 block">
              Escribe el nombre o categoría
            </label>
            {isSearching ? (
              <Loader2 className="absolute left-2 sm:left-3 top-[26px] sm:top-7 h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary pointer-events-none animate-spin" />
            ) : (
              <Search className="absolute left-2 sm:left-3 top-[26px] sm:top-7 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground pointer-events-none" />
            )}
            <Input
              type="search"
              placeholder="Buscar lugares..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 sm:pl-10 h-9 sm:h-11 text-sm touch-manipulation"
            />
          </div>

          {/* Neighborhood Select with Search */}
          <div className="w-full md:w-[200px]">
            <label className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-1 sm:mb-1.5 block">
              Escoge el barrio
            </label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full h-9 sm:h-11 justify-between text-sm"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">
                      {selectedNeighborhood || "Barrio"}
                    </span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar barrio..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No se encontró barrio.</CommandEmpty>
                    <CommandGroup>
                      {neighborhoods.map((neighborhood) => (
                        <CommandItem
                          key={neighborhood}
                          value={neighborhood}
                          onSelect={() => {
                            onNeighborhoodChange(neighborhood);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedNeighborhood === neighborhood
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {neighborhood}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
