import { useCallback, useEffect, useState } from 'react';
import AdminSidebar, { AdminSidebarDesktop } from '@/components/admin/AdminSidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Menu, Plus, Video, StickyNote } from 'lucide-react';
import { formatMoney, subscriptionCommission, subscriptionValue } from '@/lib/sellerMath';
import {
  DAILY_CLIENT_GOAL,
  MONTHLY_CLIENT_GOAL,
  goalProgress,
  salesThisMonth,
  salesToday,
} from '@/lib/sellerGoals';

const AdminSellers = () => {
  const [sellers, setSellers] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', commission_percentage: '25' });

  const load = useCallback(async () => {
    const [{ data: s }, { data: sub }, { data: v }, { data: n }, { data: sl }] = await Promise.all([
      supabase.from('sellers').select('*').order('created_at', { ascending: false }),
      supabase.from('business_subscriptions').select('*, businesses(name), subscription_plans(price)').not('seller_id', 'is', null),
      supabase.from('seller_video_deliveries').select('id, seller_id'),
      supabase.from('seller_notes').select('id, seller_id'),
      supabase.from('seller_sales').select('id, seller_id, sale_type, amount, sale_date'),
    ]);
    setSellers(s || []);
    setSubs(sub || []);
    setVideos(v || []);
    setNotes(n || []);
    setSales(sl || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);


  const create = async () => {
    if (!form.full_name.trim()) return toast.error('Escribe el nombre del vendedor');
    const { error } = await supabase.from('sellers').insert({
      full_name: form.full_name.trim(),
      email: form.email || null,
      phone: form.phone || null,
      commission_percentage: Number(form.commission_percentage || 25),
    });
    if (error) return toast.error('No se pudo crear el vendedor');
    toast.success('Vendedor creado');
    setOpen(false);
    setForm({ full_name: '', email: '', phone: '', commission_percentage: '25' });
    load();
  };

  const update = async (id: string, values: any) => {
    const { error } = await supabase.from('sellers').update(values).eq('id', id);
    if (error) return toast.error('No se pudo actualizar');
    load();
  };

  const statsFor = (sellerId: string) => {
    const mine = subs.filter((s) => s.seller_id === sellerId);
    const collected = mine.filter((s) => s.collected);
    const mySales = sales.filter((s) => s.seller_id === sellerId);
    return {
      clients: mine.length,
      sold: mine.reduce((sum, s) => sum + subscriptionValue(s), 0),
      collected: collected.reduce((sum, s) => sum + Number(s.collected_amount ?? subscriptionValue(s)), 0),
      commission: collected.reduce((sum, s) => sum + subscriptionCommission(s), 0),
      videos: videos.filter((v) => v.seller_id === sellerId).length,
      notes: notes.filter((n) => n.seller_id === sellerId).length,
      today: salesToday(mySales).length,
      month: salesThisMonth(mySales).length,
    };
  };


  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminSidebarDesktop />
      <div className="flex-1 lg:ml-64 w-full">
        <header className="sticky top-0 z-30 bg-card border-b border-border px-3 sm:px-4 py-3">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden"><Menu className="h-5 w-5" /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64"><AdminSidebar /></SheetContent>
            </Sheet>
            <div>
              <h1 className="text-lg sm:text-3xl font-bold">Vendedores</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Comisiones, recaudo y seguimiento comercial</p>
            </div>
          </div>
        </header>

        <div className="p-3 sm:p-6 space-y-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-1" /> Nuevo vendedor</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nuevo vendedor</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Nombre</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
                <div><Label>Correo</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div><Label>Teléfono</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div><Label>Comisión (%)</Label><Input type="number" value={form.commission_percentage} onChange={(e) => setForm({ ...form, commission_percentage: e.target.value })} /></div>
                <Button className="w-full" onClick={create}>Guardar</Button>
              </div>
            </DialogContent>
          </Dialog>

          {sellers.length === 0 && (
            <Card><CardContent className="py-10 text-center text-muted-foreground">Aún no hay vendedores registrados.</CardContent></Card>
          )}

          {sellers.map((s) => {
            const st = statsFor(s.id);
            return (
              <Card key={s.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="text-base truncate">{s.full_name}</CardTitle>
                      <CardDescription className="truncate">
                        {[s.email, s.phone].filter(Boolean).join(' · ') || 'Sin datos de contacto'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={s.user_id ? 'default' : 'secondary'}>{s.user_id ? 'Con acceso' : 'Sin cuenta'}</Badge>
                      <Switch checked={s.active} onCheckedChange={(v) => update(s.id, { active: v })} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div><p className="text-xs text-muted-foreground">Clientes</p><p className="font-semibold">{st.clients}</p></div>
                    <div><p className="text-xs text-muted-foreground">Vendido</p><p className="font-semibold">{formatMoney(st.sold)}</p></div>
                    <div><p className="text-xs text-muted-foreground">Recaudado</p><p className="font-semibold text-green-600">{formatMoney(st.collected)}</p></div>
                    <div><p className="text-xs text-muted-foreground">Comisión</p><p className="font-semibold text-primary">{formatMoney(st.commission)}</p></div>
                  </div>
                  <div className="space-y-3 rounded-lg border p-3">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium">Hoy: {st.today} de {DAILY_CLIENT_GOAL} clientes</span>
                        <Badge variant={st.today >= DAILY_CLIENT_GOAL ? 'default' : 'secondary'}>
                          {st.today >= DAILY_CLIENT_GOAL ? 'Meta cumplida' : `Faltan ${DAILY_CLIENT_GOAL - st.today}`}
                        </Badge>
                      </div>
                      <Progress value={goalProgress(st.today, DAILY_CLIENT_GOAL)} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium">Este mes: {st.month} de {MONTHLY_CLIENT_GOAL} clientes</span>
                        <span className="text-muted-foreground">{goalProgress(st.month, MONTHLY_CLIENT_GOAL)}%</span>
                      </div>
                      <Progress value={goalProgress(st.month, MONTHLY_CLIENT_GOAL)} className="h-2" />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Video className="h-3.5 w-3.5" /> {st.videos} videos</span>
                    <span className="flex items-center gap-1"><StickyNote className="h-3.5 w-3.5" /> {st.notes} notas</span>
                  </div>

                  <div className="flex items-end gap-2 max-w-xs">
                    <div className="flex-1">
                      <Label className="text-xs">Comisión (%)</Label>
                      <Input
                        type="number"
                        defaultValue={s.commission_percentage}
                        onBlur={(e) => {
                          const value = Number(e.target.value);
                          if (value !== Number(s.commission_percentage)) update(s.id, { commission_percentage: value });
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminSellers;
