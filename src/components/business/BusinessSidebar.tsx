import { NavLink } from 'react-router-dom';
import { 
  Store, 
  CreditCard,
  Bell, 
  MapPin,
  Image, 
  Menu as MenuIcon,
  Gift, 
  Film,
  BarChart3,
  Users,
  Settings,
  Home,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BusinessSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const BusinessSidebar = ({ isOpen, onClose }: BusinessSidebarProps) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/business-dashboard' },
    { icon: CreditCard, label: 'Mi Suscripción', path: '/business-subscription' },
    { icon: Store, label: 'Mi Establecimiento', path: '/business-manage' },
    { icon: Image, label: 'Galería', path: '/business-images' },
    { icon: MenuIcon, label: 'Menú/Servicios', path: '/business-menu' },
    { icon: Gift, label: 'Promociones', path: '/business-promotions' },
    { icon: Film, label: 'Shorts/Reels', path: '/business-shorts' },
    { icon: Gift, label: 'Lealtad', path: '/business-loyalty' },
    { icon: Brain, label: 'Configuración IA', path: '/business-ai-config' },
    { icon: Bell, label: 'Campañas Push', path: '/business-notifications' },
    { icon: MapPin, label: 'Proximidad GPS', path: '/business-proximity' },
    { icon: BarChart3, label: 'Analíticas', path: '#', disabled: true },
    { icon: Users, label: 'Clientes', path: '#', disabled: true },
    { icon: Settings, label: 'Configuración', path: '#', disabled: true },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 transition-transform duration-300 overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
              <Store className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold">Panel de Negocio</h2>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      item.disabled && "opacity-50 cursor-not-allowed"
                    )
                  }
                  onClick={(e) => {
                    if (item.disabled) {
                      e.preventDefault();
                    } else {
                      onClose();
                    }
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {item.disabled && (
                    <span className="ml-auto text-xs">Próximamente</span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default BusinessSidebar;
