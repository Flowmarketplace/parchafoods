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
  return (
    <div className="w-full bg-card border-y border-border shadow-sm">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide pb-1 sm:pb-2 -mx-2 px-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            
            return (
              <Button
                key={category.id}
                variant={isActive ? 'default' : 'outline'}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-w-[70px] sm:min-w-[80px] h-auto py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap flex-shrink-0',
                  isActive && 'shadow-md'
                )}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-[10px] sm:text-xs font-medium">{category.name}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
