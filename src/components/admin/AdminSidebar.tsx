import { NavLink } from 'react-router-dom';
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
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarWrapperProps {
  className?: string;
}

const AdminSidebar = ({ className }: AdminSidebarWrapperProps = {}) => {
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

  return (
    <aside className={cn("h-full w-64 bg-card border-r border-border overflow-y-auto", className)}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Super Admin</h2>
            <p className="text-xs text-muted-foreground">Panel de Control</p>
          </div>
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
    </aside>
  );
};

// Desktop version (fixed sidebar)
export const AdminSidebarDesktop = () => {
  return (
    <div className="hidden lg:block fixed top-0 left-0 h-full z-40">
      <AdminSidebar />
    </div>
  );
};

export default AdminSidebar;
