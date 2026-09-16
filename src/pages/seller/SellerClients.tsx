import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import SellerLayout from '@/components/seller/SellerLayout';
import { useSeller } from '@/hooks/useSeller';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Pencil } from 'lucide-react';

const SellerClients = () => {
  const { seller, loading } = useSeller();
  const [subs, setSubs] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [collectedAmount, setCollectedAmount] = useState('');

  const load = useCallback(async () => {
    if (!seller) return;
    const { data } = await supabase
      .from('business_subscriptions')
      .select('*, businesses(name, city, phone), subscription_plans(name, price, currency)')
      .eq('seller_id', seller.id)
      .order('start_date', { ascending: false });
    setSubs(data || []);
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

  return (
    <SellerLayout title="Mis Clientes" description="Suscripciones asignadas, recaudo y comisión">
      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Cargando...</div>
      ) : (
        <div className="space-y-4">
          {subs.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                Todavía no tienes clientes asignados.
              </CardContent>
            </Card>
          )}

          {subs.map((sub) => (
            <Card key={sub.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="text-base truncate">{sub.businesses?.name || 'Negocio'}</CardTitle>
                    <CardDescription>
                      Suscrito el {format(new Date(sub.start_date), 'PP', { locale: es })} ·{' '}
                      {sub.subscription_plans?.name} · vence {format(new Date(sub.end_date), 'PP', { locale: es })}
                    </CardDescription>
                  </div>
                  <Badge variant={sub.status === 'active' ? 'default' : 'secondary'}>{sub.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Valor</p>
                    <p className="font-semibold">{formatMoney(subscriptionValue(sub))}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Comisión ({sub.commission_percentage ?? 25}%)</p>
                    <p className="font-semibold text-primary">{formatMoney(subscriptionCommission(sub))}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Recaudado</p>
                    <p className="font-semibold text-green-600">
                      {sub.collected ? formatMoney(Number(sub.collected_amount ?? subscriptionValue(sub))) : '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={!!sub.collected} onCheckedChange={(v) => toggleCollected(sub, v)} />
                    <span className="text-xs text-muted-foreground">{sub.collected ? 'Pagado' : 'Pendiente'}</span>
                  </div>
                </div>

                {sub.seller_notes && (
                  <p className="text-sm bg-muted/50 rounded-md p-2 whitespace-pre-wrap">{sub.seller_notes}</p>
                )}

                <Dialog open={editing?.id === sub.id} onOpenChange={(o) => (o ? openEdit(sub) : setEditing(null))}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4 mr-1" /> Editar valor y notas
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{sub.businesses?.name}</DialogTitle>
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
          ))}
        </div>
      )}
    </SellerLayout>
  );
};

export default SellerClients;
