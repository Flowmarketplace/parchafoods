import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Store, CreditCard, Bell, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BusinessBottomNavProps {
  onMenuClick: () => void;
}

const BusinessBottomNav = ({ onMenuClick }: BusinessBottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Inicio', path: '/business-dashboard' },
    { icon: CreditCard, label: 'Plan', path: '/business-subscription' },
    { icon: Store, label: 'Negocio', path: '/business-manage' },
    { icon: Bell, label: 'Campañas', path: '/business-notifications' },
    { icon: Menu, label: 'Menú', action: 'menu' },
  ];

  const handleClick = (item: typeof navItems[0]) => {
    if (item.action === 'menu') {
      onMenuClick();
    } else {
      navigate(item.path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden z-40">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.label}
              onClick={() => handleClick(item)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BusinessBottomNav;
