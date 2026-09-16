import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import SellerLayout from '@/components/seller/SellerLayout';
import SaleDialog from '@/components/seller/SaleDialog';
import { useSeller } from '@/hooks/useSeller';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, UserPlus, Wallet, Percent, Video, StickyNote, Plus, Check, Target } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatMoney, subscriptionCommission, subscriptionValue } from '@/lib/sellerMath';
import {
  DAILY_CLIENT_GOAL,
  MONTHLY_CLIENT_GOAL,
  amountThisMonth,
  clientsThisMonth,
  clientsToday,
  goalProgress,
} from '@/lib/sellerGoals';

const SellerDashboard = () => {
  const { seller, loading } = useSeller();
  const [subs, setSubs] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [counts, setCounts] = useState({ prospects: 0, videos: 0, notes: 0 });

  const load = useCallback(async () => {
    if (!seller) return;
    const [{ data: subsData }, { data: salesData }, { count: prospects }, { count: videos }, { count: notes }] =
      await Promise.all([
        supabase
          .from('business_subscriptions')
          .select('*, businesses(name), subscription_plans(name, price, currency)')
          .eq('seller_id', seller.id)
          .order('start_date', { ascending: false }),
        supabase.from('seller_sales').select('*').eq('seller_id', seller.id).order('sale_date', { ascending: false }),
        supabase.from('prospects').select('id', { count: 'exact', head: true }).eq('seller_id', seller.id),
        supabase.from('seller_video_deliveries').select('id', { count: 'exact', head: true }).eq('seller_id', seller.id),
        supabase.from('seller_notes').select('id', { count: 'exact', head: true }).eq('seller_id', seller.id),
      ]);
    setSubs(subsData || []);
    setSales(salesData || []);
    setCounts({ prospects: prospects || 0, videos: videos || 0, notes: notes || 0 });
  }, [seller]);

  useEffect(() => {
    load();
  }, [load]);

  const totalSold = subs.reduce((sum, s) => sum + subscriptionValue(s), 0);
  const collected = subs.filter((s) => s.collected).reduce((sum, s) => sum + Number(s.collected_amount ?? subscriptionValue(s)), 0);
  const commission = subs.filter((s) => s.collected).reduce((sum, s) => sum + subscriptionCommission(s), 0);
  const pendingAmount = subs.filter((s) => !s.collected).reduce((sum, s) => sum + subscriptionValue(s), 0);
  const pendingCommission = subs.filter((s) => !s.collected).reduce((sum, s) => sum + subscriptionCommission(s), 0);

  const today = clientsToday(subs);
  const month = clientsThisMonth(subs);
  const monthMoney = amountThisMonth(sales);
  const dayDone = today.length >= DAILY_CLIENT_GOAL;

  return (
    <SellerLayout title={`Hola, ${seller?.full_name || 'vendedor'}`} description="Resumen de tu gestión comercial">
      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Cargando...</div>
      ) : (
        <div className="space-y-6">
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

          {/* Metas */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-base">Mis metas</CardTitle>
                  <CardDescription>{format(new Date(), "EEEE d 'de' MMMM", { locale: es })}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">Hoy: {today.length} de {DAILY_CLIENT_GOAL} clientes</span>
                  <Badge variant={dayDone ? 'default' : 'secondary'}>
                    {dayDone ? 'Meta cumplida' : `Faltan ${DAILY_CLIENT_GOAL - today.length}`}
                  </Badge>
                </div>
                <Progress value={goalProgress(today.length, DAILY_CLIENT_GOAL)} className="h-2" />
                <div className="flex gap-2 mt-3">
                  {Array.from({ length: DAILY_CLIENT_GOAL }).map((_, i) => {
                    const done = i < today.length;
                    return (
                      <div
                        key={i}
                        className={`flex-1 h-10 rounded-xl border flex items-center justify-center text-xs font-semibold ${
                          done
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-muted/40 text-muted-foreground border-border'
                        }`}
                      >
                        {done ? <Check className="h-4 w-4" /> : i + 1}
                      </div>
                    );
                  })}
                </div>
                {today.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Clientes de hoy: {today.map((s) => s.businesses?.name).filter(Boolean).join(', ')}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">Este mes: {month.length} de {MONTHLY_CLIENT_GOAL} clientes</span>
                  <span className="text-xs text-muted-foreground">{goalProgress(month.length, MONTHLY_CLIENT_GOAL)}%</span>
                </div>
                <Progress value={goalProgress(month.length, MONTHLY_CLIENT_GOAL)} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Registrado este mes: {formatMoney(monthMoney)}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subs.length}</div>
                <p className="text-xs text-muted-foreground">Suscripciones asignadas</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Prospectos</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{counts.prospects}</div>
                <p className="text-xs text-muted-foreground">En seguimiento</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Recaudo</CardTitle>
                <Wallet className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-green-600">{formatMoney(collected)}</div>
                <p className="text-xs text-muted-foreground">Vendido: {formatMoney(totalSold)}</p>
                <p className="text-xs text-muted-foreground">Pendiente: {formatMoney(pendingAmount)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Comisión</CardTitle>
                <Percent className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-primary">{formatMoney(commission)}</div>
                <p className="text-xs text-muted-foreground">25% sobre recaudo</p>
                <p className="text-xs text-muted-foreground">Por cobrar: {formatMoney(pendingCommission)}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Videos entregados</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-2xl font-bold">{counts.videos}</div>
                <Link to="/seller/videos"><Button variant="outline" size="sm">Ver</Button></Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Notas de seguimiento</CardTitle>
                <StickyNote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-2xl font-bold">{counts.notes}</div>
                <Link to="/seller/notes"><Button variant="outline" size="sm">Ver</Button></Link>
              </CardContent>
            </Card>
          </div>

          {sales.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Últimos registros</CardTitle>
                <CardDescription>Ventas y abonos que has registrado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {sales.slice(0, 8).map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-3 border rounded-lg p-2.5">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{s.client_name || 'Cliente'}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {format(new Date(`${s.sale_date}T12:00:00`), 'PP', { locale: es })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold">{formatMoney(Number(s.amount || 0))}</p>
                      <Badge variant={s.sale_type === 'venta' ? 'default' : 'secondary'}>
                        {s.sale_type === 'venta' ? 'Venta' : 'Abono'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Últimas suscripciones</CardTitle>
              <CardDescription>Clientes vendidos por ti</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {subs.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Aún no tienes clientes asignados. El administrador puede asignarte suscripciones.
                </p>
              )}
              {subs.slice(0, 6).map((sub) => (
                <div key={sub.id} className="flex items-center justify-between gap-3 border rounded-lg p-3">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{sub.businesses?.name || 'Negocio'}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(sub.start_date), 'PP', { locale: es })} · {sub.subscription_plans?.name}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold">{formatMoney(subscriptionValue(sub))}</p>
                    <Badge variant={sub.collected ? 'default' : 'secondary'}>
                      {sub.collected ? 'Recaudado' : 'Pendiente'}
                    </Badge>
                  </div>
                </div>
              ))}
              <Link to="/seller/clients">
                <Button variant="outline" className="w-full mt-2">Ver todos mis clientes</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </SellerLayout>
  );
};

export default SellerDashboard;
