import { Menu, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    <header className="bg-background border-b border-border">
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
        
        {/* Search Bar only - no neighborhood selector */}
        {showFilter && onSearchChange && (
          <div className="pb-3">
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="¿Qué estás buscando?"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8 sm:pl-10 bg-muted/50 h-9 sm:h-10 text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
