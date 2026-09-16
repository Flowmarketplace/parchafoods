import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import SellerLayout from '@/components/seller/SellerLayout';
import { useSeller } from '@/hooks/useSeller';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format, differenceInCalendarDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatMoney, subscriptionCommission, subscriptionValue } from '@/lib/sellerMath';
import { CalendarClock, ExternalLink } from 'lucide-react';

const SellerSubscriptions = () => {
  const { seller, loading } = useSeller();
  const [subs, setSubs] = useState<any[]>([]);

  const load = useCallback(async () => {
    if (!seller) return;
    const { data } = await supabase
      .from('business_subscriptions')
      .select('*, businesses(id, name, city, slug), subscription_plans(name, price, currency)')
      .eq('seller_id', seller.id)
      .order('end_date', { ascending: true });
    setSubs(data || []);
  }, [seller]);

  useEffect(() => {
    load();
  }, [load]);

  const totals = useMemo(() => {
    const monthly = subs.reduce((sum, s) => sum + subscriptionValue(s), 0);
    const collected = subs.filter((s) => s.collected).reduce((sum, s) => sum + Number(s.collected_amount ?? subscriptionValue(s)), 0);
    const pending = subs.filter((s) => !s.collected).reduce((sum, s) => sum + subscriptionValue(s), 0);
    const commission = subs.filter((s) => s.collected).reduce((sum, s) => sum + subscriptionCommission(s), 0);
    return { monthly, collected, pending, commission };
  }, [subs]);

  return (
    <SellerLayout title="Suscripciones" description="Pagos de tus clientes y fechas de renovación">
      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Cargando...</div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Facturación mensual', value: formatMoney(totals.monthly), className: '' },
              { label: 'Recaudado', value: formatMoney(totals.collected), className: 'text-green-600' },
              { label: 'Pendiente', value: formatMoney(totals.pending), className: 'text-amber-600' },
              { label: 'Mi comisión', value: formatMoney(totals.commission), className: 'text-primary' },
            ].map((item) => (
              <Card key={item.label}>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className={`text-lg font-bold ${item.className}`}>{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {subs.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                Todavía no tienes suscripciones asignadas.
              </CardContent>
            </Card>
          )}

          {subs.map((sub) => {
            const days = differenceInCalendarDays(new Date(sub.end_date), new Date());
            const renewSoon = days <= 7;
            return (
              <Card key={sub.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="text-base truncate">{sub.businesses?.name || 'Negocio'}</CardTitle>
                      <CardDescription className="truncate">
                        {[sub.businesses?.city, sub.subscription_plans?.name].filter(Boolean).join(' · ')}
                      </CardDescription>
                    </div>
                    <Badge variant={sub.collected ? 'default' : 'secondary'}>
                      {sub.collected ? 'Pagado' : 'Pendiente de pago'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Valor mensual</p>
                      <p className="font-semibold">{formatMoney(subscriptionValue(sub))}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Mi comisión</p>
                      <p className="font-semibold text-primary">{formatMoney(subscriptionCommission(sub))}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Inicio</p>
                      <p className="font-semibold">{format(new Date(sub.start_date), 'PP', { locale: es })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Renueva</p>
                      <p className={`font-semibold ${renewSoon ? 'text-amber-600' : ''}`}>
                        {format(new Date(sub.end_date), 'PP', { locale: es })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={renewSoon ? 'destructive' : 'outline'} className="gap-1">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {days < 0 ? `Vencida hace ${Math.abs(days)} días` : days === 0 ? 'Renueva hoy' : `Renueva en ${days} días`}
                    </Badge>
                    {sub.businesses?.slug && (
                      <Link to={`/place/${sub.businesses.slug}`} target="_blank">
                        <Button variant="outline" size="sm" className="gap-1">
                          <ExternalLink className="h-3.5 w-3.5" /> Ver perfil
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </SellerLayout>
  );
};

export default SellerSubscriptions;
