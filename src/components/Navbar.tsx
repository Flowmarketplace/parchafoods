import { Menu, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FilterBar from './FilterBar';

interface NavbarProps {
  onMenuClick: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedNeighborhood?: string;
  onNeighborhoodChange?: (neighborhood: string) => void;
}

const Navbar = ({ onMenuClick, searchQuery, onSearchChange, selectedNeighborhood, onNeighborhoodChange }: NavbarProps) => {
  const showFilter = searchQuery !== undefined && onSearchChange && selectedNeighborhood !== undefined && onNeighborhoodChange;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-4 md:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="lg:hidden active:scale-95 transition-transform touch-manipulation"
            >
              <Menu className="h-6 w-6" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-primary to-secondary p-1.5 sm:p-2 rounded-lg">
                <MapPin className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Guía Cali
              </h1>
            </div>
          </div>
        </div>
        
        {/* Filter Bar below logo - only show on home page */}
        {showFilter && (
          <div className="pb-3">
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              selectedNeighborhood={selectedNeighborhood}
              onNeighborhoodChange={onNeighborhoodChange}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
