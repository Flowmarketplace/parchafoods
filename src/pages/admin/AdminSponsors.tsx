import { useEffect, useState } from 'react';
import { AdminSidebarDesktop } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Check, X, Eye, Send } from 'lucide-react';

const AdminSponsors = () => {
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [planRequests, setPlanRequests] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [reviewing, setReviewing] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');

  const load = async () => {
    const [s, c, r, p] = await Promise.all([
      supabase.from('sponsors').select('*').order('created_at', { ascending: false }),
      supabase.from('sponsor_campaigns').select('*, sponsors(brand_name)').order('created_at', { ascending: false }),
      supabase.from('sponsor_plan_requests').select('*, sponsors(brand_name), sponsor_plans(name, price)').order('created_at', { ascending: false }),
      supabase.from('sponsor_plans').select('*').order('display_order'),
    ]);
    setSponsors(s.data || []);
    setCampaigns(c.data || []);
    setPlanRequests(r.data || []);
    setPlans(p.data || []);
  };

  useEffect(() => { load(); }, []);

  const updateSponsorStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('sponsors').update({ status }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Patrocinador ${status}`);
    load();
  };

  const reviewCampaign = async (id: string, action: 'aprobada' | 'rechazada') => {
    const update: any = { status: action };
    if (action === 'rechazada') update.rejection_reason = rejectReason || 'No cumple políticas';
    if (action === 'aprobada') update.sent_at = new Date().toISOString();
    const { error } = await supabase.from('sponsor_campaigns').update(update).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Campaña ${action}`);
    setReviewing(null);
    setRejectReason('');
    load();
  };

  const handlePlanRequest = async (id: string, status: string, planId?: string, sponsorId?: string) => {
    const { error } = await supabase.from('sponsor_plan_requests').update({ status }).eq('id', id);
    if (status === 'aprobada' && planId && sponsorId) {
      const start = new Date();
      const end = new Date(); end.setFullYear(end.getFullYear() + 1);
      await supabase.from('sponsors').update({
        current_plan_id: planId,
        plan_start_date: start.toISOString().slice(0, 10),
        plan_end_date: end.toISOString().slice(0, 10),
      }).eq('id', sponsorId);
    }
    if (error) { toast.error(error.message); return; }
    toast.success('Actualizado');
    load();
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebarDesktop />
      <div className="lg:ml-64 p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-4">Patrocinadores</h1>

        <Tabs defaultValue="sponsors">
          <TabsList>
            <TabsTrigger value="sponsors">Cuentas ({sponsors.length})</TabsTrigger>
            <TabsTrigger value="campaigns">Campañas ({campaigns.filter(c => c.status === 'pendiente').length} pend.)</TabsTrigger>
            <TabsTrigger value="requests">Solicitudes plan ({planRequests.filter(r => r.status === 'pendiente').length})</TabsTrigger>
            <TabsTrigger value="plans">Planes</TabsTrigger>
          </TabsList>

          <TabsContent value="sponsors" className="space-y-3">
            {sponsors.map((s) => (
              <Card key={s.id}>
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {s.logo_url && <img src={s.logo_url} alt="" className="h-10 w-10 object-contain rounded bg-muted" />}
                    <div>
                      <p className="font-semibold">{s.brand_name}</p>
                      <p className="text-xs text-muted-foreground">{s.email} · {s.contact_person}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={s.status === 'aprobado' ? 'default' : s.status === 'pendiente' ? 'secondary' : 'destructive'}>{s.status}</Badge>
                    {s.status === 'pendiente' && (
                      <>
                        <Button size="sm" onClick={() => updateSponsorStatus(s.id, 'aprobado')}><Check className="h-4 w-4" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => updateSponsorStatus(s.id, 'rechazado')}><X className="h-4 w-4" /></Button>
                      </>
                    )}
                    {s.status === 'aprobado' && (
                      <Button size="sm" variant="outline" onClick={() => updateSponsorStatus(s.id, 'suspendido')}>Suspender</Button>
                    )}
                    {s.status === 'suspendido' && (
                      <Button size="sm" onClick={() => updateSponsorStatus(s.id, 'aprobado')}>Reactivar</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-3">
            {campaigns.map((c) => (
              <Card key={c.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold">{c.title}</span>
                        <Badge variant="outline">{c.sponsors?.brand_name}</Badge>
                        <Badge>{c.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{c.message}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setReviewing(c)}><Eye className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="requests" className="space-y-3">
            {planRequests.map((r) => (
              <Card key={r.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{r.sponsors?.brand_name} → {r.sponsor_plans?.name}</p>
                    <p className="text-xs text-muted-foreground">${Number(r.sponsor_plans?.price || 0).toLocaleString()} · {new Date(r.created_at).toLocaleDateString('es-CO')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{r.status}</Badge>
                    {r.status === 'pendiente' && (
                      <>
                        <Button size="sm" onClick={() => handlePlanRequest(r.id, 'aprobada', r.plan_id, r.sponsor_id)}>Aprobar</Button>
                        <Button size="sm" variant="destructive" onClick={() => handlePlanRequest(r.id, 'rechazada')}>Rechazar</Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="plans" className="space-y-3">
            {plans.map((p) => (
              <Card key={p.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-sm text-muted-foreground">${Number(p.price).toLocaleString()} {p.currency} · {p.monthly_push_limit} push/mes · {p.main_banners} banners</p>
                    </div>
                    <Badge>{p.tier}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <Dialog open={!!reviewing} onOpenChange={() => setReviewing(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>{reviewing?.title}</DialogTitle></DialogHeader>
            {reviewing && (
              <div className="space-y-3">
                <p className="text-sm">{reviewing.message}</p>
                <div className="text-xs text-muted-foreground">
                  Marca: {reviewing.sponsors?.brand_name} · Audiencia: {reviewing.target_audience}
                  {reviewing.geo_enabled && <> · Geo: {reviewing.geo_radius_km}km</>}
                </div>
                {reviewing.cta_label && <p className="text-sm">CTA: <strong>{reviewing.cta_label}</strong> ({reviewing.cta_action_type} → {reviewing.cta_action_value})</p>}
                {reviewing.status === 'pendiente' && (
                  <>
                    <div>
                      <Label>Motivo de rechazo (si aplica)</Label>
                      <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => reviewCampaign(reviewing.id, 'aprobada')} className="flex-1"><Check className="h-4 w-4 mr-2" />Aprobar y enviar</Button>
                      <Button onClick={() => reviewCampaign(reviewing.id, 'rechazada')} variant="destructive" className="flex-1"><X className="h-4 w-4 mr-2" />Rechazar</Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminSponsors;
