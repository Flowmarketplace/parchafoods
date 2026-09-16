import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getPanelsForRoles, PanelOption } from '@/lib/rolePanels';
import { ShieldCheck, Store, Megaphone, Briefcase, Home, ChevronRight } from 'lucide-react';

const ICONS = {
  admin: ShieldCheck,
  business: Store,
  sponsor: Megaphone,
  seller: Briefcase,
} as const;

const ChoosePanel = () => {
  const navigate = useNavigate();
  const [panels, setPanels] = useState<PanelOption[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/auth', { replace: true });
        return;
      }
      setName(
        (session.user.user_metadata?.full_name as string) || session.user.email || ''
      );
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);

      const available = getPanelsForRoles(roles);
      if (available.length === 0) {
        navigate('/', { replace: true });
        return;
      }
      if (available.length === 1) {
        navigate(available[0].path, { replace: true });
        return;
      }
      setPanels(available);
      setLoading(false);
    };
    load();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">¿Cómo quieres ingresar?</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {name ? `Hola ${name}. ` : ''}Tienes varios perfiles disponibles.
          </p>
        </div>

        <div className="space-y-3">
          {panels.map((panel) => {
            const Icon = ICONS[panel.key];
            return (
              <Card
                key={panel.key}
                className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
                onClick={() => navigate(panel.path)}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold">{panel.label}</h2>
                    <p className="text-xs text-muted-foreground">{panel.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Button variant="ghost" className="w-full mt-4" onClick={() => navigate('/app')}>
          <Home className="h-4 w-4 mr-2" />
          Entrar como usuario de la app
        </Button>
      </div>
    </div>
  );
};

export default ChoosePanel;
