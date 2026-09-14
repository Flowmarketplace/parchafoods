import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Star, Gift, QrCode, Share2, Sparkles, MapPin, Trophy, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

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
  loyalty_reward_image: string | null;
}

const MyLoyalty = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<LoyaltyRow[]>([]);
  const [businesses, setBusinesses] = useState<Record<string, BusinessInfo>>({});
  const [generalPoints, setGeneralPoints] = useState(0);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate('/auth');
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate('/auth');
      else setTimeout(() => loadData(session.user.id), 0);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadData = async (userId: string) => {
    try {
      const [{ data: loyalty, error }, { data: profile }] = await Promise.all([
        supabase.from('loyalty_points').select('*').eq('user_id', userId).order('points', { ascending: false }),
        supabase.from('profiles').select('general_points, referral_code').eq('id', userId).maybeSingle(),
      ]);
      if (error) throw error;

      const list = (loyalty || []) as LoyaltyRow[];
      setRows(list);
      setGeneralPoints(profile?.general_points || 0);
      setReferralCode(profile?.referral_code || null);

      const ids = list.map((r) => r.business_id).filter(Boolean) as string[];
      if (ids.length) {
        const { data: biz } = await supabase
          .from('businesses')
          .select('id, name, neighborhood, city, slug, loyalty_points_to_redeem, loyalty_reward_description, loyalty_reward_image')
          .in('id', ids);
        const map: Record<string, BusinessInfo> = {};
        (biz || []).forEach((b: any) => { map[b.id] = b; });
        setBusinesses(map);
      }
    } catch (e) {
      toast({ title: 'Error', description: 'No se pudieron cargar tus puntos', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = async (businessId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('loyalty_points')
        .update({ points: 0, reward_claimed: true })
        .eq('user_id', user.id)
        .eq('business_id', businessId);
      if (error) throw error;
      toast({ title: '¡Premio reclamado!', description: 'Muestra esta confirmación en el establecimiento' });
      loadData(user.id);
    } catch {
      toast({ title: 'Error', description: 'No se pudo reclamar el premio', variant: 'destructive' });
    }
  };

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

  const totalBusinessPoints = rows.reduce((sum, r) => sum + (r.points || 0), 0);
  const totalPoints = totalBusinessPoints + generalPoints;
  const goalOf = (b?: BusinessInfo) => b?.loyalty_points_to_redeem || 5;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Cargando tus puntos...</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Button>

        {/* Resumen */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/15 via-card to-accent/15 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Mis puntos de fidelización</p>
              <p className="text-4xl font-extrabold text-primary leading-tight">{totalPoints}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {rows.length} negocio{rows.length === 1 ? '' : 's'} · {generalPoints} puntos generales
              </p>
            </div>
            <span className="rounded-2xl bg-primary/15 p-3 text-primary">
              <Trophy className="h-7 w-7" />
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button size="sm" className="gap-1.5 text-xs" onClick={() => navigate('/near-me')}>
              <QrCode className="h-4 w-4" /> Escanear QR
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs"
              onClick={() => share(`Llevo ${totalPoints} puntos acumulados en La Ciudad en tus Manos 🎉`)}
            >
              <Share2 className="h-4 w-4" /> Compartir
            </Button>
          </div>
        </section>

        {/* Código de invitación */}
        {referralCode && (
          <Card className="mt-4">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-accent" /> Invita y gana puntos
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Tu código: <span className="font-mono font-bold">{referralCode}</span></p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="gap-1.5 text-xs shrink-0"
                onClick={() => share(`Únete a La Ciudad en tus Manos con mi código ${referralCode} y acumula puntos.`)}
              >
                <Copy className="h-3.5 w-3.5" /> Compartir
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Por negocio */}
        <h2 className="text-base font-bold mt-6 mb-3">Avance por negocio</h2>

        {rows.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Star className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Aún no tienes puntos acumulados.
                <br />Escanea el código QR de los negocios para empezar.
              </p>
              <Button className="mt-4 gap-1.5" size="sm" onClick={() => navigate('/near-me')}>
                <QrCode className="h-4 w-4" /> Buscar negocios cerca
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {rows.map((row) => {
              const biz = row.business_id ? businesses[row.business_id] : undefined;
              const goal = goalOf(biz);
              const pct = Math.min(100, Math.round((row.points / goal) * 100));
              const complete = row.points >= goal;
              const name = biz?.name || 'Negocio';

              return (
                <Card key={row.id} className={complete ? 'border-primary/60 shadow-md' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <button
                          className="text-sm font-bold truncate text-left hover:text-primary transition-colors"
                          onClick={() => biz && navigate(`/place/${biz.slug || biz.id}`)}
                        >
                          {name}
                        </button>
                        {(biz?.neighborhood || biz?.city) && (
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" />
                            {[biz?.neighborhood, biz?.city].filter(Boolean).join(' · ')}
                          </p>
                        )}
                      </div>
                      <Badge variant={complete ? 'default' : 'secondary'} className="shrink-0">
                        {row.points}/{goal}
                      </Badge>
                    </div>

                    <Progress value={pct} className="h-2 mt-3" />

                    <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                      {complete ? (
                        <><Gift className="h-3.5 w-3.5 text-primary" /> ¡Premio disponible! {biz?.loyalty_reward_description || 'Reclama tu recompensa'}</>
                      ) : (
                        <><Sparkles className="h-3.5 w-3.5 text-accent" /> Te faltan {goal - row.points} punto{goal - row.points === 1 ? '' : 's'} para tu premio</>
                      )}
                    </p>

                    <div className="flex gap-2 mt-3">
                      {complete && !row.reward_claimed && row.business_id && (
                        <Button size="sm" className="flex-1 gap-1.5 text-xs" onClick={() => handleClaimReward(row.business_id!)}>
                          <Gift className="h-3.5 w-3.5" /> Reclamar premio
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-xs flex-1"
                        onClick={() => share(`Ya llevo ${row.points} de ${goal} puntos en ${name} 🎁`)}
                      >
                        <Share2 className="h-3.5 w-3.5" /> Compartir
                      </Button>
                    </div>

                    {row.last_scan_at && (
                      <p className="text-[10px] text-muted-foreground mt-2">
                        Último escaneo: {new Date(row.last_scan_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLoyalty;
