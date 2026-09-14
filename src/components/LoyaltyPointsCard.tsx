import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Gift, Sparkles, QrCode, ChevronRight } from 'lucide-react';

const GOAL = 100;

const LoyaltyPointsCard = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [points, setPoints] = useState(0);
  const [businesses, setBusinesses] = useState(0);

  useEffect(() => {
    const load = async (userId: string) => {
      const [{ data: profile }, { data: rows }] = await Promise.all([
        supabase.from('profiles').select('general_points').eq('id', userId).maybeSingle(),
        supabase.from('loyalty_points').select('points, business_id').eq('user_id', userId),
      ]);
      const businessPoints = (rows || []).reduce((sum, r: any) => sum + (r.points || 0), 0);
      setPoints((profile?.general_points || 0) + businessPoints);
      setBusinesses((rows || []).length);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session?.user);
      if (session?.user) load(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(!!session?.user);
      if (session?.user) setTimeout(() => load(session.user.id), 0);
      else { setPoints(0); setBusinesses(0); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const pct = Math.min(100, Math.round((points % GOAL) / GOAL * 100));

  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/15 p-2 text-primary">
            <Gift className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-bold leading-tight">Mis puntos de fidelización</h2>
            <p className="text-[11px] text-muted-foreground">
              {loggedIn ? `${businesses} negocio${businesses === 1 ? '' : 's'} acumulando puntos` : 'Acumula puntos y gana premios'}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-extrabold text-primary leading-none">{loggedIn ? points : '—'}</p>
          <p className="text-[10px] text-muted-foreground">puntos</p>
        </div>
      </div>

      {loggedIn ? (
        <div className="mt-3 space-y-2">
          <Progress value={pct} className="h-2" />
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-accent" />
            Te faltan {GOAL - (points % GOAL)} puntos para tu próximo premio
          </p>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 gap-1 text-xs" onClick={() => navigate('/my-loyalty')}>
              Ver mis puntos <ChevronRight className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => navigate('/near-me')}>
              <QrCode className="h-3.5 w-3.5" /> Escanear
            </Button>
          </div>
        </div>
      ) : (
        <Button size="sm" className="mt-3 w-full gap-1 text-xs" onClick={() => navigate('/auth')}>
          Ingresa para acumular puntos <ChevronRight className="h-3 w-3" />
        </Button>
      )}
    </section>
  );
};

export default LoyaltyPointsCard;
