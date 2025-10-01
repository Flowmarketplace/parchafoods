import React from 'react';
import { 
  Grid, 
  Utensils, 
  Coffee, 
  ShoppingBag, 
  Hotel, 
  Dumbbell, 
  Heart, 
  Landmark,
  Stethoscope,
  Car,
  GraduationCap,
  Film
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface CategoryItem {
  id: string;
  name: string;
  icon: any;
}

interface CategoryBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories: CategoryItem[] = [
  { id: 'Todos', name: 'Todos', icon: Grid },
  { id: 'Restaurante', name: 'Restaurante', icon: Utensils },
  { id: 'Café', name: 'Café', icon: Coffee },
  { id: 'Centro Comercial', name: 'Tiendas', icon: ShoppingBag },
  { id: 'Hotel', name: 'Hotel', icon: Hotel },
  { id: 'Parque', name: 'Parque', icon: Heart },
  { id: 'Hospital', name: 'Salud', icon: Stethoscope },
  { id: 'Banco', name: 'Banco', icon: Landmark },
  { id: 'Entretenimiento', name: 'Ocio', icon: Film },
  { id: 'Servicios', name: 'Servicios', icon: Car },
];

const CategoryBar = ({ selectedCategory, onCategoryChange }: CategoryBarProps) => {
  const [showAll, setShowAll] = React.useState(false);
  
  // Show only first 5 categories on mobile when not expanded
  const visibleCategories = showAll ? categories : categories.slice(0, 5);
  
  return (
    <div className="w-full bg-card border-y border-border shadow-sm">
      <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3">
        <div className="flex gap-1.5 sm:gap-2 pb-1 sm:pb-2">
          {/* Categories - scrollable on mobile, wrap on desktop */}
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto sm:overflow-visible sm:flex-wrap scrollbar-hide flex-1 -mx-2 px-2 sm:mx-0 sm:px-0">
            {visibleCategories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <Button
                  key={category.id}
                  variant={isActive ? 'default' : 'outline'}
                  onClick={() => onCategoryChange(category.id)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-w-[70px] sm:min-w-[80px] h-auto py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap flex-shrink-0 active:scale-95 transition-transform touch-manipulation',
                    isActive && 'shadow-md'
                  )}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-[10px] sm:text-xs font-medium">{category.name}</span>
                </Button>
              );
            })}
          </div>
          
          {/* Ver todos button - only visible on mobile when not all categories are shown */}
          {!showAll && (
            <Button
              variant="outline"
              onClick={() => setShowAll(true)}
              className="sm:hidden flex-shrink-0 min-w-[70px] h-auto py-2 px-2 flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform touch-manipulation"
            >
              <Grid className="h-4 w-4" />
              <span className="text-[10px] font-medium">Ver todos</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
