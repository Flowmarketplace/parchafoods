import { NavLink, useNavigate } from 'react-router-dom';
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
  Brain,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BusinessSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const BusinessSidebar = ({ isOpen, onClose }: BusinessSidebarProps) => {
  const navigate = useNavigate();
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
    { icon: BarChart3, label: 'Analíticas', path: '/business-analytics' },
    { icon: Users, label: 'Clientes', path: '/business-customers' },
    { icon: Settings, label: 'Configuración', path: '/business-settings' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Sesión cerrada');
    navigate('/auth');
  };

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

        <div className="flex gap-2 mb-4">
          <Button variant="outline" className="flex-1" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Atrás
          </Button>
          <NavLink to="/app" className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              <Home className="h-4 w-4 mr-1" />
              App
            </Button>
          </NavLink>
        </div>

        <Separator className="mb-4" />

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
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )
                  }
                  onClick={() => onClose()}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Logout button at bottom */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </>
  );
};

export default BusinessSidebar;
