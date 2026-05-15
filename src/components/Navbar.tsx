import { Menu, MapPin, Search, Navigation, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { ProximityDialog } from '@/components/ProximityDialog';
import { NotificationsPanel } from '@/components/NotificationsPanel';

interface NavbarProps {
  onMenuClick: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedNeighborhood?: string;
  onNeighborhoodChange?: (neighborhood: string) => void;
  isSearching?: boolean;
}

const Navbar = ({ onMenuClick, searchQuery, onSearchChange, selectedNeighborhood, onNeighborhoodChange, isSearching = false }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const showFilter = searchQuery !== undefined && onSearchChange && selectedNeighborhood !== undefined && onNeighborhoodChange;
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <header className="bg-background border-b border-border">
      <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="active:scale-95 transition-transform touch-manipulation shrink-0 h-9 w-9"
              data-tour="sidebar-trigger"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0" onClick={() => navigate('/')} role="button">
              <img src="/mundial-sabor-icon.png" alt="El Mundial del Sabor" className="h-9 sm:h-12 w-auto shrink-0 drop-shadow-md" />
              <div className="flex flex-col leading-none min-w-0">
                <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground">🏆 2026</span>
                <h1 className="text-xs sm:text-base font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent truncate">
                  El Mundial del Sabor
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={location.pathname === '/near-me' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate('/near-me')}
              className={cn(
                'gap-2 hidden md:flex',
                location.pathname === '/near-me' && 'bg-primary text-primary-foreground'
              )}
            >
              <Navigation className="h-4 w-4" />
              Cerca de mí
            </Button>

            {/* Notifications Panel */}
            {user && <NotificationsPanel />}

            {/* Proximity notifications toggle */}
            {user && <ProximityDialog />}

            {user ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/profile')}
                className="rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate('/auth')}
                className="gap-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Ingresar</span>
              </Button>
            )}
          </div>
        </div>
        
        {/* Search Bar only - no neighborhood selector */}
        {showFilter && onSearchChange && (
          <div className="pb-2 sm:pb-3 max-w-2xl" data-tour="navbar-search">
            <div className="relative">
              {isSearching ? (
                <Loader2 className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary animate-spin" />
              ) : (
                <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              )}
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
