import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Video,
  StickyNote,
  UserCog,
  Home,
  ArrowLeft,
  LogOut,
  Repeat,
  Menu,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const menuItems = [
  { icon: LayoutDashboard, label: 'Resumen', path: '/seller' },
  { icon: Users, label: 'Mis Clientes', path: '/seller/clients' },
  { icon: UserPlus, label: 'Prospectos', path: '/seller/prospects' },
  { icon: Video, label: 'Videos Entregados', path: '/seller/videos' },
  { icon: StickyNote, label: 'Notas', path: '/seller/notes' },
  { icon: UserCog, label: 'Mi Perfil', path: '/seller/profile' },
];

export const SellerSidebar = ({ className }: { className?: string }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Sesión cerrada');
    navigate('/auth');
  };

  return (
    <aside className={cn('h-full w-64 bg-card border-r border-border overflow-y-auto flex flex-col', className)}>
      <div className="p-6 flex-1">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Vendedor</h2>
            <p className="text-xs text-muted-foreground">Panel Comercial</p>
          </div>
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
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/seller'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-border space-y-1">
        <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/panel')}>
          <Repeat className="h-4 w-4 mr-2" />
          Cambiar de perfil
        </Button>
        <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  );
};

interface SellerLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const SellerLayout = ({ title, description, children }: SellerLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <SellerSidebar className="hidden lg:flex fixed left-0 top-0" />
      <div className="flex-1 lg:ml-64 w-full">
        <header className="sticky top-0 z-30 bg-card border-b border-border px-3 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SellerSidebar />
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold">{title}</h1>
              {description && <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>}
            </div>
          </div>
        </header>
        <main className="p-3 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

export default SellerLayout;
