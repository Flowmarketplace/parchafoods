import { Menu, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from './SearchBar';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="lg:hidden"
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

          <div className="hidden md:block flex-1 max-w-md mx-4">
            <SearchBar />
          </div>
        </div>
        
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
