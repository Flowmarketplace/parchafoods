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
  LogOut,
  UserCheck,
  ShieldCheck,
  UserCog,
  Briefcase
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

  const menuSections = [
    {
      title: 'Inicio',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: BarChart3, label: 'Estadísticas', path: '/admin/analytics' },
      ],
    },
    {
      title: 'Comercial',
      items: [
        { icon: UserCheck, label: 'Clientes', path: '/admin/clients' },
        { icon: Briefcase, label: 'Vendedores', path: '/admin/sellers' },
        { icon: CreditCard, label: 'Suscripciones', path: '/admin/subscriptions' },
        { icon: Package, label: 'Paquetes', path: '/admin/packages' },
      ],
    },
    {
      title: 'Directorio',
      items: [
        { icon: Store, label: 'Negocios', path: '/admin/businesses' },
        { icon: BarChart3, label: 'Categorías', path: '/admin/categories' },
        { icon: Shield, label: 'Eventos', path: '/admin/events' },
      ],
    },
    {
      title: 'Usuarios y acceso',
      items: [
        { icon: Users, label: 'Usuarios', path: '/admin/users' },
        { icon: ShieldCheck, label: 'Aprobaciones y Roles', path: '/admin/approvals' },
        { icon: Bell, label: 'Notificaciones', path: '/admin/notifications' },
      ],
    },
    {
      title: 'Configuración',
      items: [
        { icon: Palette, label: 'Personalización', path: '/admin/customization' },
        { icon: Settings, label: 'Configuración', path: '/admin/settings' },
        { icon: UserCog, label: 'Mi Perfil', path: '/admin/profile' },
      ],
    },
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
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Super Admin</h2>
            <p className="text-xs text-muted-foreground">Panel de Control</p>
          </div>
        </div>

        {/* Back + Home buttons */}
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

        <nav className="space-y-5">
          {menuSections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
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
                      <Icon className="h-5 w-5 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Logout button at bottom */}
      <div className="p-4 border-t border-border space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start"
          size="sm"
          onClick={() => navigate('/panel')}
        >
          <UserCog className="h-4 w-4 mr-2" />
          Cambiar de perfil
        </Button>
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


// Desktop version (fixed sidebar)
export const AdminSidebarDesktop = () => {
  return (
    <div className="hidden lg:block fixed top-0 left-0 h-full z-40">
      <AdminSidebar />
    </div>
  );
};

export default AdminSidebar;
