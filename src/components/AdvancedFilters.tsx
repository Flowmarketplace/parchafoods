import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { neighborhoods } from '@/data/places';

export interface Filters {
  zone: string;
  neighborhood: string;
  priceRange: [number, number];
  rating: number;
  foodType: string[];
  familyFriendly: boolean;
  petFriendly: boolean;
  couples: boolean;
  kids: boolean;
}

interface AdvancedFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClearFilters: () => void;
}

const zones = ['Todos', 'Norte', 'Sur', 'Oriente', 'Occidente', 'Centro'];

const foodTypes = [
  'Colombiana',
  'Internacional',
  'Italiana',
  'Asiática',
  'Mexicana',
  'Vegetariana',
  'Vegana',
  'Mariscos',
  'Parrilla',
  'Comida Rápida'
];

const AdvancedFilters = ({ filters, onFiltersChange, onClearFilters }: AdvancedFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const updateFilter = (key: keyof Filters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleFoodType = (type: string) => {
    const newFoodTypes = filters.foodType.includes(type)
      ? filters.foodType.filter(t => t !== type)
      : [...filters.foodType, type];
    updateFilter('foodType', newFoodTypes);
  };

  const hasActiveFilters = 
    filters.zone !== 'Todos' ||
    filters.neighborhood !== 'Todos' ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 4 ||
    filters.rating > 0 ||
    filters.foodType.length > 0 ||
    filters.familyFriendly ||
    filters.petFriendly ||
    filters.couples ||
    filters.kids;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-8 text-xs"
            >
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <ScrollArea className="h-[calc(100vh-300px)] pr-4">
          {/* Zona */}
          <div className="space-y-2 mb-6">
            <Label>Zona</Label>
            <Select
              value={filters.zone}
              onValueChange={(value) => updateFilter('zone', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar zona" />
              </SelectTrigger>
              <SelectContent>
                {zones.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Barrio */}
          <div className="space-y-2 mb-6">
            <Label>Barrio</Label>
            <Select
              value={filters.neighborhood}
              onValueChange={(value) => updateFilter('neighborhood', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar barrio" />
              </SelectTrigger>
              <SelectContent>
                {neighborhoods.map((neighborhood) => (
                  <SelectItem key={neighborhood} value={neighborhood}>
                    {neighborhood}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rango de Precio */}
          <div className="space-y-3 mb-6">
            <Label>Rango de Precio</Label>
            <div className="flex gap-2 mb-2">
              {['$', '$$', '$$$', '$$$$'].map((price, index) => (
                <Badge
                  key={price}
                  variant={
                    filters.priceRange[0] <= index && filters.priceRange[1] >= index
                      ? 'default'
                      : 'outline'
                  }
                  className="cursor-pointer"
                >
                  {price}
                </Badge>
              ))}
            </div>
            <Slider
              min={0}
              max={4}
              step={1}
              value={[filters.priceRange[0], filters.priceRange[1]]}
              onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
              className="w-full"
            />
          </div>

          {/* Rating */}
          <div className="space-y-3 mb-6">
            <Label>Rating mínimo</Label>
            <div className="flex gap-2">
              {[0, 3, 4, 4.5].map((rating) => (
                <Button
                  key={rating}
                  variant={filters.rating === rating ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilter('rating', rating)}
                  className="flex-1"
                >
                  {rating === 0 ? 'Todos' : `${rating}+ ⭐`}
                </Button>
              ))}
            </div>
          </div>

          {/* Tipo de Comida */}
          <div className="space-y-3 mb-6">
            <Label>Tipo de Comida</Label>
            <div className="flex flex-wrap gap-2">
              {foodTypes.map((type) => (
                <Badge
                  key={type}
                  variant={filters.foodType.includes(type) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleFoodType(type)}
                >
                  {type}
                  {filters.foodType.includes(type) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Características */}
          <div className="space-y-3">
            <Label>Características</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="familyFriendly"
                  checked={filters.familyFriendly}
                  onCheckedChange={(checked) =>
                    updateFilter('familyFriendly', checked)
                  }
                />
                <label
                  htmlFor="familyFriendly"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  👨‍👩‍👧‍👦 Familiar
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="petFriendly"
                  checked={filters.petFriendly}
                  onCheckedChange={(checked) =>
                    updateFilter('petFriendly', checked)
                  }
                />
                <label
                  htmlFor="petFriendly"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  🐕 Pet Friendly
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="couples"
                  checked={filters.couples}
                  onCheckedChange={(checked) =>
                    updateFilter('couples', checked)
                  }
                />
                <label
                  htmlFor="couples"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  💑 Para Parejas
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="kids"
                  checked={filters.kids}
                  onCheckedChange={(checked) =>
                    updateFilter('kids', checked)
                  }
                />
                <label
                  htmlFor="kids"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  👶 Con Niños
                </label>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;
