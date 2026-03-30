import { useState } from 'react';
import { 
  Grid, 
  Coffee, 
  Pizza, 
  Flame, 
  Truck, 
  Sandwich, 
  Fish,
  Beer,
  Building2,
  UtensilsCrossed,
  PartyPopper
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
  { id: 'Comidas Rápidas', name: 'Rápidas', icon: Sandwich },
  { id: 'Café', name: 'Cafés', icon: Coffee },
  { id: 'Food Truck', name: 'Food Truck', icon: Truck },
  { id: 'Mexicana', name: 'Mexicana', icon: UtensilsCrossed },
  { id: 'Asiática', name: 'Sushi', icon: Fish },
  { id: 'Parrilla', name: 'Parrilla', icon: Flame },
  { id: 'Italiana', name: 'Italiana', icon: Pizza },
  { id: 'Bar', name: 'Cerveza', icon: Beer },
  { id: 'Rooftop', name: 'Rooftop', icon: Building2 },
  { id: 'Tradicional', name: 'Tradicional', icon: UtensilsCrossed },
  { id: 'Remate', name: 'Remate', icon: PartyPopper },
];

const CategoryBar = ({ selectedCategory, onCategoryChange }: CategoryBarProps) => {
  const [showAll, setShowAll] = useState(false);
  
  const visibleCategories = showAll ? categories : categories.slice(0, 7);
  
  return (
    <div className="w-full bg-card border-y border-border shadow-sm" data-tour="category-bar">
      <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3">
        {/* Mobile: 2 rows of 4 (7 categories + Ver todos) */}
        <div className="grid grid-cols-4 gap-1.5 sm:hidden">
          {visibleCategories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            
            return (
              <Button
                key={category.id}
                variant={isActive ? 'default' : 'outline'}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 h-auto py-2 px-1 whitespace-nowrap active:scale-95 transition-transform touch-manipulation',
                  isActive && 'shadow-md'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-[9px] font-medium leading-tight text-center">{category.name}</span>
              </Button>
            );
          })}
          
          {!showAll && (
            <Button
              variant="outline"
              onClick={() => setShowAll(true)}
              className="flex flex-col items-center justify-center gap-1 h-auto py-3 px-2 active:scale-95 transition-transform touch-manipulation"
            >
              <Grid className="h-5 w-5" />
              <span className="text-[10px] font-medium leading-tight text-center">Ver todos</span>
            </Button>
          )}
        </div>
        
        {/* Desktop: Horizontal scroll/wrap */}
        <div className="hidden sm:flex gap-2 flex-wrap">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            
            return (
              <Button
                key={category.id}
                variant={isActive ? 'default' : 'outline'}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 min-w-[80px] h-auto py-3 px-4 whitespace-nowrap active:scale-95 transition-transform touch-manipulation',
                  isActive && 'shadow-md'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{category.name}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
