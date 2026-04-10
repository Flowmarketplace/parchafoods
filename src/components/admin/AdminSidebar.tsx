import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard,
  Store,
  CreditCard,
  Users,
  Bell,
  Settings,
  BarChart3,
  Palette,
  Shield,
  Package,
  Home,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminSidebarWrapperProps {
  className?: string;
}

const AdminSidebar = ({ className }: AdminSidebarWrapperProps = {}) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Store, label: 'Negocios', path: '/admin/businesses' },
    { icon: CreditCard, label: 'Suscripciones', path: '/admin/subscriptions' },
    { icon: Package, label: 'Paquetes', path: '/admin/packages' },
    { icon: Users, label: 'Usuarios', path: '/admin/users' },
    { icon: Shield, label: 'Eventos', path: '/admin/events' },
    { icon: BarChart3, label: 'Categorías', path: '/admin/categories' },
    { icon: BarChart3, label: 'Estadísticas', path: '/admin/analytics' },
    { icon: Bell, label: 'Notificaciones', path: '/admin/notifications' },
    { icon: Palette, label: 'Personalización', path: '/admin/customization' },
    { icon: Settings, label: 'Configuración', path: '/admin/settings' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Sesión cerrada');
    navigate('/auth');
  };

  return (
    <aside className={cn("h-full w-64 bg-card border-r border-border overflow-y-auto flex flex-col", className)}>
      <div className="p-6 flex-1">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Super Admin</h2>
            <p className="text-xs text-muted-foreground">Panel de Control</p>
          </div>
        </div>

        {/* Back to App Button */}
        <NavLink to="/" className="block mb-4">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Home className="h-4 w-4 mr-2" />
            Volver a la App
          </Button>
        </NavLink>

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
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
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
    </aside>
  );
};

export default AdminSidebar;
