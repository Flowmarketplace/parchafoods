import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import SponsorSidebar, { SponsorSidebarDesktop } from './SponsorSidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Megaphone, LogOut, Home } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const signOutAndGo = async (navigate: (p: string) => void) => {
  await supabase.auth.signOut();
  toast.success('Sesión cerrada');
  navigate('/auth');
};

const ExitActions = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
      <Button variant="outline" size="sm" onClick={() => navigate('/app')}>
        <Home className="h-4 w-4 mr-2" /> Ir a la App
      </Button>
      <Button variant="destructive" size="sm" onClick={() => signOutAndGo(navigate)}>
        <LogOut className="h-4 w-4 mr-2" /> Cerrar sesión
      </Button>
    </div>
  );
};

interface SponsorLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export interface SponsorRecord {
  id: string;
  brand_name: string;
  status: string;
  current_plan_id: string | null;
  logo_url: string | null;
  email: string | null;
}

export const useSponsor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sponsor, setSponsor] = useState<SponsorRecord | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/auth');
        return;
      }
      const { data } = await supabase
        .from('sponsors')
        .select('id, brand_name, status, current_plan_id, logo_url, email')
        .eq('user_id', session.user.id)
        .maybeSingle();
      setSponsor(data as any);
      setLoading(false);
    })();
  }, [navigate]);

  return { sponsor, loading, setSponsor };
};

const SponsorLayout = ({ children, title, subtitle }: SponsorLayoutProps) => {
  const { sponsor, loading } = useSponsor();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!sponsor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md p-8 text-center space-y-4">
          <Megaphone className="h-12 w-12 mx-auto text-primary" />
          <h2 className="text-2xl font-bold">Sin perfil de patrocinador</h2>
          <p className="text-muted-foreground">No encontramos un perfil de patrocinador asociado a tu cuenta. Contacta al administrador.</p>
        </Card>
      </div>
    );
  }

  if (sponsor.status === 'pendiente') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md p-8 text-center space-y-4">
          <Megaphone className="h-12 w-12 mx-auto text-primary" />
          <h2 className="text-2xl font-bold">Cuenta en revisión</h2>
          <p className="text-muted-foreground">
            Tu cuenta de <strong>{sponsor.brand_name}</strong> está pendiente de aprobación por el administrador. Te contactaremos pronto.
          </p>
        </Card>
      </div>
    );
  }

  if (sponsor.status === 'rechazado' || sponsor.status === 'suspendido') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold">Cuenta {sponsor.status}</h2>
          <p className="text-muted-foreground">Tu cuenta no está activa. Contacta al administrador para más información.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SponsorSidebarDesktop />
      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SponsorSidebar />
            </SheetContent>
          </Sheet>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default SponsorLayout;
