import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Megaphone,
  CreditCard,
  Settings,
  BarChart3,
  Home,
  ArrowLeft,
  LogOut,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SponsorSidebar = ({ className }: { className?: string }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/sponsor' },
    { icon: BarChart3, label: 'Métricas', path: '/sponsor/metrics' },
    { icon: Bell, label: 'Campañas Push', path: '/sponsor/campaigns' },
    { icon: CreditCard, label: 'Mis Planes', path: '/sponsor/plans' },
    { icon: Settings, label: 'Mi Perfil', path: '/sponsor/profile' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Sesión cerrada');
    navigate('/auth');
  };

  return (
    <aside className={cn('h-full w-64 bg-card border-r border-border overflow-y-auto flex flex-col', className)}>
      <div className="p-6 flex-1">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
            <Megaphone className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Patrocinador</h2>
            <p className="text-xs text-muted-foreground">Panel de Marca</p>
          </div>
        </div>

        <NavLink to="/app" className="block mb-4">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Home className="h-4 w-4 mr-2" />
            Ver la App
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
                end={item.path === '/sponsor'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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

export const SponsorSidebarDesktop = () => (
  <div className="hidden lg:block fixed top-0 left-0 h-full z-40">
    <SponsorSidebar />
  </div>
);

export default SponsorSidebar;
