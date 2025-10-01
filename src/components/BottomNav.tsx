import { Home, MapPin, Calendar, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', name: 'Inicio', icon: Home, path: '/' },
    { id: 'places', name: 'Lugares', icon: MapPin, path: '/listings' },
    { id: 'events', name: 'Eventos', icon: Calendar, path: '/events-all' },
    { id: 'settings', name: 'Ajustes', icon: Settings, path: '/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 py-2 px-1 rounded-lg transition-all active:scale-95 touch-manipulation',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className={cn('h-6 w-6', active && 'stroke-[2.5]')} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
