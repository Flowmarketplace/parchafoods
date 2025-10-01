import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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

export interface EventFilters {
  type: string;
  priceRange: string;
  isFree: boolean;
  isNew: boolean;
  hasPromotion: boolean;
  familyFriendly: boolean;
  goodForCouples: boolean;
}

interface EventFiltersProps {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
  onClearFilters: () => void;
}

const eventTypes = [
  'Todos',
  'Concierto',
  'Teatro',
  'Cine',
  'Festival',
  'Deportes',
  'Arte',
  'Otro'
];

const priceRanges = [
  'Todos',
  'Gratis',
  '$',
  '$$',
  '$$$'
];

const EventFiltersComponent = ({ filters, onFiltersChange, onClearFilters }: EventFiltersProps) => {
  const updateFilter = (key: keyof EventFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = 
    filters.type !== 'Todos' ||
    filters.priceRange !== 'Todos' ||
    filters.isFree ||
    filters.isNew ||
    filters.hasPromotion ||
    filters.familyFriendly ||
    filters.goodForCouples;

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
          {/* Tipo de Evento */}
          <div className="space-y-2 mb-6">
            <Label>Tipo de Evento</Label>
            <Select
              value={filters.type}
              onValueChange={(value) => updateFilter('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rango de Precio */}
          <div className="space-y-3 mb-6">
            <Label>Rango de Precio</Label>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map((range) => (
                <Button
                  key={range}
                  variant={filters.priceRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilter('priceRange', range)}
                  className="flex-1 min-w-[70px]"
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>

          {/* Características Especiales */}
          <div className="space-y-3 mb-6">
            <Label>Características Especiales</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFree"
                  checked={filters.isFree}
                  onCheckedChange={(checked) =>
                    updateFilter('isFree', checked)
                  }
                />
                <label
                  htmlFor="isFree"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  🎟️ Gratis / Entrada Libre
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isNew"
                  checked={filters.isNew}
                  onCheckedChange={(checked) =>
                    updateFilter('isNew', checked)
                  }
                />
                <label
                  htmlFor="isNew"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  ✨ Nuevo / Próximamente
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasPromotion"
                  checked={filters.hasPromotion}
                  onCheckedChange={(checked) =>
                    updateFilter('hasPromotion', checked)
                  }
                />
                <label
                  htmlFor="hasPromotion"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  🎁 En Promoción
                </label>
              </div>
            </div>
          </div>

          {/* Ideal Para */}
          <div className="space-y-3">
            <Label>Ideal Para</Label>
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
                  👨‍👩‍👧‍👦 Plan Familiar
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="goodForCouples"
                  checked={filters.goodForCouples}
                  onCheckedChange={(checked) =>
                    updateFilter('goodForCouples', checked)
                  }
                />
                <label
                  htmlFor="goodForCouples"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  💑 Plan en Pareja
                </label>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default EventFiltersComponent;
