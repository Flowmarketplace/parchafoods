import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Gift, Sparkles, QrCode, ChevronRight, Share2, MapPin, Trophy, Copy, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoyaltyRow {
  id: string;
  business_id: string | null;
  points: number;
  reward_claimed: boolean;
  last_scan_at: string | null;
}

interface BusinessInfo {
  id: string;
  name: string;
  neighborhood: string | null;
  city: string | null;
  slug: string | null;
  loyalty_points_to_redeem: number | null;
  loyalty_reward_description: string | null;
}

const LoyaltyPointsCard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const [generalPoints, setGeneralPoints] = useState(0);
  const [rows, setRows] = useState<LoyaltyRow[]>([]);
  const [businesses, setBusinesses] = useState<Record<string, BusinessInfo>>({});
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const load = async (userId: string) => {
      setLoading(true);
      const [{ data: profile }, { data: loyalty }] = await Promise.all([
        supabase.from('profiles').select('general_points, referral_code').eq('id', userId).maybeSingle(),
        supabase.from('loyalty_points').select('*').eq('user_id', userId).order('points', { ascending: false }),
      ]);

      const list = (loyalty || []) as LoyaltyRow[];
      const businessPoints = list.reduce((sum, r) => sum + (r.points || 0), 0);
      setGeneralPoints(profile?.general_points || 0);
      setPoints((profile?.general_points || 0) + businessPoints);
      setRows(list);
      setReferralCode(profile?.referral_code || null);

      const ids = list.map((r) => r.business_id).filter(Boolean) as string[];
      if (ids.length) {
        const { data: biz } = await supabase
          .from('businesses')
          .select('id, name, neighborhood, city, slug, loyalty_points_to_redeem, loyalty_reward_description')
          .in('id', ids);
        const map: Record<string, BusinessInfo> = {};
        (biz || []).forEach((b: any) => { map[b.id] = b; });
        setBusinesses(map);
      } else {
        setBusinesses({});
      }
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session?.user);
      if (session?.user) load(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(!!session?.user);
      if (session?.user) setTimeout(() => load(session.user.id), 0);
      else { setPoints(0); setGeneralPoints(0); setRows([]); setBusinesses({}); setReferralCode(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const GOAL = 100;
  const pct = Math.min(100, Math.round((points % GOAL) / GOAL * 100));
  const topRows = rows.slice(0, 3);

  const share = async (text: string) => {
    const url = window.location.origin;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'La Ciudad en tus Manos', text, url });
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        toast({ title: 'Copiado', description: 'Texto listo para compartir' });
      }
    } catch { /* cancelado */ }
  };

  if (loggedIn === null || loading) {
    return (
      <section className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-4 animate-pulse">
        <div className="h-16 bg-muted/50 rounded-lg" />
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-4">
      {/* Encabezado */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/15 p-2 text-primary">
            <Trophy className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-bold leading-tight">Mis puntos de fidelización</h2>
            <p className="text-[11px] text-muted-foreground">
              {loggedIn ? `${rows.length} negocio${rows.length === 1 ? '' : 's'} · ${generalPoints} puntos generales` : 'Acumula puntos y gana premios'}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-extrabold text-primary leading-none">{loggedIn ? points : '—'}</p>
          <p className="text-[10px] text-muted-foreground">puntos</p>
        </div>
      </div>

      {loggedIn ? (
        <div className="mt-3 space-y-3">
          {/* Barra de avance general */}
          <div className="space-y-1.5">
            <Progress value={pct} className="h-2" />
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-accent" />
              Te faltan {GOAL - (points % GOAL)} puntos para tu próximo premio
            </p>
          </div>

          {/* Avance por negocio */}
          {topRows.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Avance por negocio</p>
              <div className="grid gap-2">
                {topRows.map((row) => {
                  const biz = row.business_id ? businesses[row.business_id] : undefined;
                  const goal = biz?.loyalty_points_to_redeem || 5;
                  const progress = Math.min(100, Math.round((row.points / goal) * 100));
                  const complete = row.points >= goal;
                  const name = biz?.name || 'Negocio';

                  return (
                    <Card key={row.id} className={complete ? 'border-primary/40 bg-primary/5' : 'bg-card/60'}>
                      <CardContent className="p-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <button
                              onClick={() => biz && navigate(`/place/${biz.slug || biz.id}`)}
                              className="text-xs font-bold truncate text-left hover:text-primary transition-colors block"
                            >
                              {name}
                            </button>
                            {(biz?.neighborhood || biz?.city) && (
                              <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                <MapPin className="h-3 w-3" />
                                {[biz?.neighborhood, biz?.city].filter(Boolean).join(' · ')}
                              </p>
                            )}
                          </div>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${complete ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            {row.points}/{goal}
                          </span>
                        </div>
                        <Progress value={progress} className="h-1.5 mt-2" />
                        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                          {complete ? (
                            <><Gift className="h-3 w-3 text-primary" /> ¡Premio disponible!</>
                          ) : (
                            <><Sparkles className="h-3 w-3 text-accent" /> Faltan {goal - row.points} para tu premio</>
                          )}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {rows.length > 3 && (
                <p className="text-[10px] text-muted-foreground text-center">+{rows.length - 3} negocios más</p>
              )}
            </div>
          )}

          {/* Código de invitación */}
          {referralCode && (
            <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card/60 p-2.5">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-accent" /> Invita y gana
                </p>
                <p className="text-[10px] text-muted-foreground">Código: <span className="font-mono font-bold">{referralCode}</span></p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="gap-1 text-[10px] h-7 px-2 shrink-0"
                onClick={() => share(`Únete a La Ciudad en tus Manos con mi código ${referralCode} y acumula puntos.`)}
              >
                <Copy className="h-3 w-3" /> Compartir
              </Button>
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 gap-1 text-xs" onClick={() => navigate('/my-loyalty')}>
              Ver mis puntos <ChevronRight className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => navigate('/near-me')}>
              <QrCode className="h-3.5 w-3.5" /> Escanear
            </Button>
            <Button size="sm" variant="outline" className="gap-1 text-xs px-2" onClick={() => share(`Llevo ${points} puntos acumulados en La Ciudad en tus Manos 🎉`)}>
              <Share2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          {/* Vista previa del diseño real (datos de ejemplo) */}
          <div className="relative space-y-3 rounded-lg border border-dashed border-border bg-muted/20 p-3">
            <span className="absolute -top-2 right-3 rounded-full bg-muted px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              Ejemplo
            </span>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold">Avance general</p>
                <p className="text-[11px] font-bold text-primary">60 / 100</p>
              </div>
              <Progress value={60} className="h-2" />
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-accent" />
                Te faltarían 40 puntos para tu próximo premio
              </p>
            </div>

            <div className="grid gap-2">
              {[
                { name: 'Restaurante del barrio', place: 'Centro · Barbosa', points: 4, goal: 5 },
                { name: 'Café de la esquina', place: 'Santa Fe · Barbosa', points: 5, goal: 5 },
              ].map((demo) => {
                const complete = demo.points >= demo.goal;
                return (
                  <Card key={demo.name} className={complete ? 'border-primary/40 bg-primary/5' : 'bg-card/60'}>
                    <CardContent className="p-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">{demo.name}</p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" />
                            {demo.place}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${complete ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                          {demo.points}/{demo.goal}
                        </span>
                      </div>
                      <Progress value={Math.round((demo.points / demo.goal) * 100)} className="h-1.5 mt-2" />
                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                        {complete ? (
                          <><Gift className="h-3 w-3 text-primary" /> ¡Premio disponible!</>
                        ) : (
                          <><Sparkles className="h-3 w-3 text-accent" /> Faltan {demo.goal - demo.points} para tu premio</>
                        )}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-border bg-card/60 p-2.5">
              <Star className="h-4 w-4 text-accent shrink-0" />
              <p className="text-[11px] text-muted-foreground">
                Así verás tus puntos reales: escanea el QR en cada negocio y acumula premios.
              </p>
            </div>
          </div>

          <Button size="sm" className="w-full gap-1 text-xs" onClick={() => navigate('/auth')}>
            Ingresa para acumular puntos <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      )}
    </section>
  );
};

export default LoyaltyPointsCard;
