import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import SellerLayout from '@/components/seller/SellerLayout';
import { useSeller } from '@/hooks/useSeller';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Wallet, Percent, Video, StickyNote } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatMoney, subscriptionCommission, subscriptionValue } from '@/lib/sellerMath';

const SellerDashboard = () => {
  const { seller, loading } = useSeller();
  const [subs, setSubs] = useState<any[]>([]);
  const [counts, setCounts] = useState({ prospects: 0, videos: 0, notes: 0 });

  useEffect(() => {
    if (!seller) return;
    const load = async () => {
      const [{ data: subsData }, { count: prospects }, { count: videos }, { count: notes }] = await Promise.all([
        supabase
          .from('business_subscriptions')
          .select('*, businesses(name), subscription_plans(name, price, currency)')
          .eq('seller_id', seller.id)
          .order('start_date', { ascending: false }),
        supabase.from('prospects').select('id', { count: 'exact', head: true }).eq('seller_id', seller.id),
        supabase.from('seller_video_deliveries').select('id', { count: 'exact', head: true }).eq('seller_id', seller.id),
        supabase.from('seller_notes').select('id', { count: 'exact', head: true }).eq('seller_id', seller.id),
      ]);
      setSubs(subsData || []);
      setCounts({ prospects: prospects || 0, videos: videos || 0, notes: notes || 0 });
    };
    load();
  }, [seller]);

  const totalSold = subs.reduce((sum, s) => sum + subscriptionValue(s), 0);
  const collected = subs.filter((s) => s.collected).reduce((sum, s) => sum + Number(s.collected_amount ?? subscriptionValue(s)), 0);
  const commission = subs.filter((s) => s.collected).reduce((sum, s) => sum + subscriptionCommission(s), 0);

  return (
    <SellerLayout title={`Hola, ${seller?.full_name || 'vendedor'}`} description="Resumen de tu gestión comercial">
      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Cargando...</div>
      ) : (
        <div className="space-y-6">
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
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Comisión</CardTitle>
                <Percent className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-primary">{formatMoney(commission)}</div>
                <p className="text-xs text-muted-foreground">{seller?.commission_percentage ?? 25}% sobre recaudo</p>
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
