import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ALL_CATEGORY, BUSINESS_CATEGORIES } from '@/data/categories';

interface CategoryBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const items = [ALL_CATEGORY, ...BUSINESS_CATEGORIES];

const CategoryBar = ({ selectedCategory, onCategoryChange }: CategoryBarProps) => {
  return (
    <div className="w-full bg-card border-y border-border shadow-sm" data-tour="category-bar">
      <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3">
        {/* Mobile: grid */}
        <div className="grid grid-cols-5 gap-1.5 sm:hidden">
          {items.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;

            return (
              <Button
                key={category.id}
                variant={isActive ? 'default' : 'outline'}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 h-auto py-2 px-1 whitespace-nowrap active:scale-95 transition-transform touch-manipulation',
                  isActive && 'shadow-md',
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-[9px] font-medium leading-tight text-center">{category.name}</span>
              </Button>
            );
          })}
        </div>

        {/* Desktop */}
        <div className="hidden sm:flex gap-2 flex-wrap">
          {items.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;

            return (
              <Button
                key={category.id}
                variant={isActive ? 'default' : 'outline'}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 min-w-[86px] h-auto py-3 px-4 whitespace-nowrap active:scale-95 transition-transform touch-manipulation',
                  isActive && 'shadow-md',
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{category.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
