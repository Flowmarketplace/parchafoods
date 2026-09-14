import { Home, MapPinned, Navigation, Gift, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', name: 'Inicio', icon: Home, path: '/' },
    { id: 'listings', name: 'Negocios', icon: MapPinned, path: '/listings' },
    { id: 'nearme', name: 'Cerca', icon: Navigation, path: '/near-me' },
    { id: 'loyalty', name: 'Puntos', icon: Gift, path: '/my-loyalty' },
    { id: 'profile', name: 'Perfil', icon: User, path: '/profile' },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md md:hidden safe-area-inset-bottom"
      data-tour="bottom-nav"
    >
      <div className="flex items-stretch justify-around h-16 px-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              aria-label={item.name}
              aria-current={active ? 'page' : undefined}
              className="flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 touch-manipulation transition-all active:scale-95"
            >
              <span
                className={cn(
                  'flex items-center justify-center rounded-full px-4 py-1 transition-colors',
                  active ? 'bg-primary/12 text-primary' : 'text-muted-foreground'
                )}
              >
                <Icon className={cn('h-5 w-5', active && 'stroke-[2.5]')} />
              </span>
              <span
                className={cn(
                  'text-[9px] font-medium',
                  active ? 'text-primary font-semibold' : 'text-muted-foreground'
                )}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
