import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import SellerLayout from '@/components/seller/SellerLayout';
import SaleDialog from '@/components/seller/SaleDialog';
import { useSeller } from '@/hooks/useSeller';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatMoney, subscriptionCommission, subscriptionValue } from '@/lib/sellerMath';
import { pickBusinessCoverUrl } from '@/utils/businessImages';
import { Pencil, ExternalLink, Plus, MapPin } from 'lucide-react';

const SellerClients = () => {
  const { seller, loading } = useSeller();
  const [subs, setSubs] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [collectedAmount, setCollectedAmount] = useState('');

  const load = useCallback(async () => {
    if (!seller) return;
    const [{ data }, { data: pays }] = await Promise.all([
      supabase
        .from('business_subscriptions')
        .select(
          '*, businesses(id, name, city, phone, slug, category, business_type, address, business_images(image_url, image_type, is_primary, display_order)), subscription_plans(name, price, currency)'
        )
        .eq('seller_id', seller.id)
        .order('start_date', { ascending: false }),
      supabase.from('seller_sales').select('*').eq('seller_id', seller.id),
    ]);
    setSubs(data || []);
    setPayments(pays || []);
  }, [seller]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleCollected = async (sub: any, value: boolean) => {
    const { error } = await supabase
      .from('business_subscriptions')
      .update({
        collected: value,
        collected_at: value ? new Date().toISOString() : null,
        collected_amount: value ? Number(sub.collected_amount ?? subscriptionValue(sub)) : null,
      })
      .eq('id', sub.id);
    if (error) return toast.error('No se pudo actualizar el recaudo');
    toast.success(value ? 'Marcado como recaudado' : 'Recaudo pendiente');
    load();
  };

  const openEdit = (sub: any) => {
    setEditing(sub);
    setPrice(String(sub.custom_price ?? sub.subscription_plans?.price ?? ''));
    setCollectedAmount(String(sub.collected_amount ?? ''));
    setNotes(sub.seller_notes || '');
  };

  const saveEdit = async () => {
    if (!editing) return;
    const { error } = await supabase
      .from('business_subscriptions')
      .update({
        custom_price: price === '' ? null : Number(price),
        collected_amount: collectedAmount === '' ? null : Number(collectedAmount),
        seller_notes: notes || null,
      })
      .eq('id', editing.id);
    if (error) return toast.error('No se pudo guardar');
    toast.success('Cliente actualizado');
    setEditing(null);
    load();
  };

  const paidFor = (subId: string, businessId?: string | null) =>
    payments
      .filter((p) => p.subscription_id === subId || (businessId && p.business_id === businessId))
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <SellerLayout title="Mis Clientes" description="Suscripciones, recaudo, abonos y comisión">
      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Cargando...</div>
      ) : (
        <div className="space-y-4">
          {seller && (
            <SaleDialog
              sellerId={seller.id}
              onSaved={load}
              trigger={
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-1" /> Registrar venta o abono
                </Button>
              }
            />
          )}

          {subs.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                Todavía no tienes clientes asignados.
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {subs.map((sub) => {
              const business = sub.businesses;
              const cover = pickBusinessCoverUrl(business?.business_images, business || {});
              const abonos = paidFor(sub.id, business?.id);
              return (
                <Card key={sub.id} className="overflow-hidden">
                  <div className="relative h-28 w-full">
                    <img src={cover} alt={business?.name || 'Negocio'} className="h-full w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
                    <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-sm leading-tight line-clamp-2">
                          {business?.name || 'Negocio'}
                        </p>
                        <p className="text-white/80 text-[11px] flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {business?.city || '—'}
                        </p>
                      </div>
                      <Badge variant={sub.collected ? 'default' : 'secondary'} className="shrink-0">
                        {sub.collected ? 'Pagado' : 'Pendiente'}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-3 space-y-3">
                    <p className="text-[11px] text-muted-foreground">
                      Desde {format(new Date(sub.start_date), 'PP', { locale: es })} · {sub.subscription_plans?.name} ·
                      vence {format(new Date(sub.end_date), 'PP', { locale: es })}
                    </p>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg bg-muted/50 py-2">
                        <p className="text-[10px] text-muted-foreground">Valor</p>
                        <p className="text-xs font-semibold">{formatMoney(subscriptionValue(sub))}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 py-2">
                        <p className="text-[10px] text-muted-foreground">Comisión</p>
                        <p className="text-xs font-semibold text-primary">{formatMoney(subscriptionCommission(sub))}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 py-2">
                        <p className="text-[10px] text-muted-foreground">Abonos</p>
                        <p className="text-xs font-semibold text-green-600">{formatMoney(abonos)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch checked={!!sub.collected} onCheckedChange={(v) => toggleCollected(sub, v)} />
                      <span className="text-xs text-muted-foreground">
                        {sub.collected ? 'Recaudo completo' : 'Marcar como pagado'}
                      </span>
                    </div>

                    {sub.seller_notes && (
                      <p className="text-xs bg-muted/50 rounded-md p-2 whitespace-pre-wrap">{sub.seller_notes}</p>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      {seller && (
                        <SaleDialog
                          sellerId={seller.id}
                          businessId={business?.id}
                          subscriptionId={sub.id}
                          defaultName={business?.name}
                          defaultAmount={subscriptionValue(sub)}
                          defaultType="abono"
                          onSaved={load}
                          trigger={
                            <Button size="sm" variant="secondary" className="w-full">
                              <Plus className="h-4 w-4 mr-1" /> Abono
                            </Button>
                          }
                        />
                      )}
                      <Link to={`/place/${business?.slug || business?.id}`} className="w-full">
                        <Button size="sm" variant="outline" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-1" /> Ver perfil
                        </Button>
                      </Link>
                    </div>

                    <Dialog open={editing?.id === sub.id} onOpenChange={(o) => (o ? openEdit(sub) : setEditing(null))}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full">
                          <Pencil className="h-4 w-4 mr-1" /> Editar valor y notas
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{business?.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                          <div>
                            <Label>Valor de la suscripción</Label>
                            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                          </div>
                          <div>
                            <Label>Valor recaudado</Label>
                            <Input
                              type="number"
                              value={collectedAmount}
                              onChange={(e) => setCollectedAmount(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Notas de seguimiento</Label>
                            <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
                          </div>
                          <Button className="w-full" onClick={saveEdit}>Guardar</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </SellerLayout>
  );
};

export default SellerClients;
