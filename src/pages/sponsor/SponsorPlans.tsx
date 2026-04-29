import { useEffect, useState } from 'react';
import SponsorLayout, { useSponsor } from '@/components/sponsor/SponsorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Check, Crown, Award, Gem } from 'lucide-react';

const tierIcon: Record<string, any> = { bronce: Award, plata: Gem, oro: Crown };
const tierColor: Record<string, string> = {
  bronce: 'from-orange-700 to-orange-500',
  plata: 'from-slate-500 to-slate-300',
  oro: 'from-yellow-600 to-yellow-400',
};

const Inner = () => {
  const { sponsor } = useSponsor();
  const [plans, setPlans] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  const load = async () => {
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from('sponsor_plans').select('*').eq('active', true).order('display_order'),
      sponsor ? supabase.from('sponsor_plan_requests').select('*, sponsor_plans(name, tier)').eq('sponsor_id', sponsor.id).order('created_at', { ascending: false }) : Promise.resolve({ data: [] }),
    ]);
    setPlans(p || []);
    setRequests(r || []);
  };

  useEffect(() => { load(); }, [sponsor]);

  const requestPlan = async (planId: string) => {
    if (!sponsor) return;
    const { error } = await supabase.from('sponsor_plan_requests').insert({
      sponsor_id: sponsor.id,
      plan_id: planId,
      status: 'pendiente',
      message: 'Solicitud de contratación desde el dashboard',
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Solicitud enviada. El administrador te contactará pronto.');
    load();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => {
          const Icon = tierIcon[p.tier] || Award;
          const isCurrent = sponsor?.current_plan_id === p.id;
          return (
            <Card key={p.id} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tierColor[p.tier]}`} />
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon className="h-6 w-6 text-primary" />
                  <CardTitle>{p.name}</CardTitle>
                </div>
                <p className="text-3xl font-bold mt-2">${(p.price / 1_000_000).toFixed(0)}M <span className="text-sm font-normal text-muted-foreground">{p.currency}</span></p>
                <p className="text-sm text-muted-foreground">{p.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2">
                  {(p.features as string[]).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Badge className="w-full justify-center py-2">Plan actual</Badge>
                ) : (
                  <Button onClick={() => requestPlan(p.id)} className="w-full">Solicitar contacto</Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {requests.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Mis solicitudes</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {requests.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded bg-muted/40">
                <div>
                  <p className="font-medium text-sm">{r.sponsor_plans?.name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString('es-CO')}</p>
                </div>
                <Badge variant={r.status === 'aprobada' ? 'default' : r.status === 'rechazada' ? 'destructive' : 'secondary'}>{r.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const SponsorPlans = () => (
  <SponsorLayout title="Planes de Patrocinio" subtitle="Elige el plan que mejor se adapte a tu marca">
    <Inner />
  </SponsorLayout>
);

export default SponsorPlans;
