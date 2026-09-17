import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Bell,
  Building2,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  MapPin,
  Menu,
  Percent,
  Store,
  Target,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AdminSidebar, { AdminSidebarDesktop } from '@/components/admin/AdminSidebar';
import { toast } from 'sonner';
import { formatMoney, subscriptionValue } from '@/lib/sellerMath';
import { DAILY_CLIENT_GOAL, MONTHLY_CLIENT_GOAL, goalProgress } from '@/lib/sellerGoals';
import { ACTIVE_CITIES, useAdminCommercialStats } from '@/hooks/useAdminCommercialStats';
import barbosaImage from '@/assets/admin-barbosa.jpg';
import santanaImage from '@/assets/admin-santana.jpg';

const CITY_IMAGES: Record<string, string> = {
  Barbosa: barbosaImage,
  Santana: santanaImage,
};

type MetricTone = 'primary' | 'secondary' | 'accent' | 'destructive';

interface MetricCardProps {
  label: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  tone: MetricTone;
}

const TONE_CLASSES: Record<MetricTone, string> = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  accent: 'bg-accent/15 text-accent-foreground',
  destructive: 'bg-destructive/10 text-destructive',
};

const MetricCard = ({ label, value, detail, icon: Icon, tone }: MetricCardProps) => (
  <div className="rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${TONE_CLASSES[tone]}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <span className="rounded-md bg-muted px-2 py-1 text-[10px] font-semibold uppercase text-muted-foreground">
        Barbosa + Santana
      </span>
    </div>
    <p className="mt-4 text-xs font-semibold uppercase text-muted-foreground">{label}</p>
    <p className="mt-1 text-xl font-bold text-foreground sm:text-2xl">{value}</p>
    <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const stats = useAdminCommercialStats();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (!roleData) {
          toast.error('No tienes permisos de administrador');
          navigate('/');
          return;
        }
        setChecking(false);
      } catch (error) {
        console.error('Error checking admin access:', error);
        navigate('/');
      }
    };

    checkAdminAccess();
  }, [navigate]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-muted border-b-primary" />
          <p className="text-muted-foreground">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <AdminSidebarDesktop />

      <div className="w-full flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 px-3 py-3 backdrop-blur sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0 lg:hidden" aria-label="Abrir menú">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <AdminSidebar />
                </SheetContent>
              </Sheet>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-bold text-foreground sm:text-2xl">Panel de Administración</h1>
                <p className="truncate text-xs text-muted-foreground sm:text-sm">
                  Resumen comercial de {ACTIVE_CITIES.join(' y ')}
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="hidden sm:flex">
              <Link to="/admin/analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                Ver estadísticas
              </Link>
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-5 p-3 sm:space-y-6 sm:p-6">
          <section className="overflow-hidden rounded-lg border border-border bg-primary text-primary-foreground shadow-md">
            <div className="grid md:grid-cols-[1.2fr_0.8fr]">
              <div className="flex flex-col justify-center p-5 sm:p-7">
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase text-primary-foreground/80">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  Operación comercial activa
                </div>
                <h2 className="max-w-xl text-2xl font-bold sm:text-3xl">Tu ciudad crece con cada negocio conectado</h2>
                <p className="mt-2 max-w-xl text-sm text-primary-foreground/80">
                  Una vista clara de las ventas, el recaudo y el crecimiento local en Barbosa y Santana.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button asChild variant="secondary" size="sm">
                    <Link to="/admin/sellers">Ver vendedores <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground">
                    <Link to="/admin/subscriptions">Membresías</Link>
                  </Button>
                </div>
              </div>
              <div className="relative hidden min-h-52 md:block">
                <img src={barbosaImage} alt="Vista urbana de Barbosa" className="absolute inset-0 h-full w-full object-cover" width={1200} height={800} />
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/40 to-transparent" />
              </div>
            </div>
          </section>

          <section aria-label="Resumen comercial" className="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4">
            <MetricCard label="Ventas totales" value={formatMoney(stats.totalSold)} detail={`${stats.activeSubscriptions} membresías activas`} icon={TrendingUp} tone="primary" />
            <MetricCard label="Recaudo" value={formatMoney(stats.totalCollected)} detail={`${formatMoney(stats.totalPending)} pendiente`} icon={Wallet} tone="secondary" />
            <MetricCard label="Comisiones" value={formatMoney(stats.totalCommission)} detail="Calculadas sobre recaudo" icon={Percent} tone="accent" />
            <MetricCard label="Clientes" value={stats.totalClients} detail={`${stats.monthSubscriptions} nuevos este mes`} icon={Users} tone="destructive" />
          </section>

          <section>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-foreground">Ciudades activas</h2>
                <p className="text-xs text-muted-foreground">Cobertura y desempeño de la guía local</p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-lg font-bold">{stats.totalBusinesses}</p>
                <p className="text-xs text-muted-foreground">negocios publicados</p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {stats.cities.map((city, index) => (
                <article key={city.city} className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                  <div className="grid min-h-40 grid-cols-[42%_58%] sm:min-h-44">
                    <div className="relative overflow-hidden">
                      <img
                        src={CITY_IMAGES[city.city] || barbosaImage}
                        alt={`Vista de ${city.city}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        width={1200}
                        height={800}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-semibold text-primary-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {city.city}
                      </div>
                    </div>
                    <div className="flex flex-col justify-between p-4">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-muted-foreground">Negocios</p>
                          <span className={`h-2.5 w-2.5 rounded-full ${index === 0 ? 'bg-secondary' : 'bg-accent'}`} />
                        </div>
                        <p className="mt-1 text-3xl font-bold text-foreground">{city.businesses}</p>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3">
                        <div>
                          <p className="text-lg font-bold">{city.subscriptions}</p>
                          <p className="text-[10px] text-muted-foreground">Membresías</p>
                        </div>
                        <div>
                          <p className="truncate text-sm font-bold">{formatMoney(city.collected)}</p>
                          <p className="text-[10px] text-muted-foreground">Recaudado</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border bg-muted/30 p-4 sm:p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <h2 className="font-bold">Ventas por asesor</h2>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Resultados y avance mensual</p>
                </div>
                <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
                  <Link to="/admin/sellers">Ver todos</Link>
                </Button>
              </div>
              <div className="divide-y divide-border">
                {stats.sellers.length === 0 && <p className="p-5 text-sm text-muted-foreground">Aún no hay vendedores con ventas registradas.</p>}
                {stats.sellers.map((seller) => {
                  const initials = seller.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <div key={seller.id} className="p-4 transition-colors hover:bg-muted/30 sm:p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{initials}</div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold">{seller.name}</p>
                            <p className="text-xs text-muted-foreground">{seller.clients} clientes · {formatMoney(seller.sold)} vendido</p>
                          </div>
                        </div>
                        <Button asChild size="icon" variant="ghost" aria-label={`Abrir panel de ${seller.name}`}>
                          <Link to={`/admin/seller/${seller.id}`}><ArrowRight className="h-4 w-4" /></Link>
                        </Button>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                        <div><p className="text-muted-foreground">Recaudo</p><p className="font-semibold">{formatMoney(seller.collected)}</p></div>
                        <div><p className="text-muted-foreground">Pendiente</p><p className="font-semibold">{formatMoney(seller.pending)}</p></div>
                        <div><p className="text-muted-foreground">Comisión</p><p className="font-semibold">{formatMoney(seller.commission)}</p></div>
                      </div>
                      <div className="mt-4">
                        <div className="mb-1.5 flex justify-between text-xs">
                          <span className="text-muted-foreground">Meta mensual</span>
                          <span className="font-semibold">{seller.month} / {MONTHLY_CLIENT_GOAL}</span>
                        </div>
                        <Progress value={goalProgress(seller.month, MONTHLY_CLIENT_GOAL)} className="h-2" />
                        <p className="mt-1.5 text-[10px] text-muted-foreground">Hoy: {seller.today} de {DAILY_CLIENT_GOAL} clientes</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border bg-muted/30 p-4 sm:p-5">
                <div>
                  <h2 className="font-bold">Últimas membresías</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Ventas registradas recientemente</p>
                </div>
                <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
                  <Link to="/admin/subscriptions">Historial</Link>
                </Button>
              </div>
              <div className="divide-y divide-border">
                {stats.recent.length === 0 && <p className="p-5 text-sm text-muted-foreground">Sin membresías registradas.</p>}
                {stats.recent.map((subscription: any) => (
                  <div key={subscription.id} className="flex items-center justify-between gap-3 p-3.5 transition-colors hover:bg-muted/30 sm:px-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${subscription.collected ? 'bg-secondary/10 text-secondary' : 'bg-accent/15 text-accent-foreground'}`}>
                        {subscription.collected ? <CheckCircle2 className="h-4 w-4" /> : <CircleDollarSign className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{subscription.businesses?.name || 'Negocio'}</p>
                        <p className="truncate text-[10px] text-muted-foreground">
                          {subscription.businesses?.city || '—'} · {subscription.sellers?.full_name || 'Sin vendedor'}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-bold">{formatMoney(subscriptionValue(subscription))}</p>
                      <Badge variant={subscription.collected ? 'default' : 'secondary'} className="mt-1 text-[9px]">
                        {subscription.collected ? 'Pagado' : 'Pendiente'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <div className="mb-3">
              <h2 className="text-lg font-bold">Accesos de gestión</h2>
              <p className="text-xs text-muted-foreground">Administra las áreas principales</p>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              {[
                { title: 'Negocios', description: 'Directorio publicado', icon: Store, href: '/admin/businesses', tone: 'bg-primary/10 text-primary' },
                { title: 'Membresías', description: 'Planes y recaudo', icon: CreditCard, href: '/admin/subscriptions', tone: 'bg-secondary/10 text-secondary' },
                { title: 'Vendedores', description: 'Equipo comercial', icon: Users, href: '/admin/sellers', tone: 'bg-accent/15 text-accent-foreground' },
                { title: 'Estadísticas', description: 'Análisis completo', icon: TrendingUp, href: '/admin/analytics', tone: 'bg-primary/10 text-primary' },
                { title: 'Notificaciones', description: 'Mensajes y avisos', icon: Bell, href: '/admin/notifications', tone: 'bg-destructive/10 text-destructive' },
                { title: 'Personalización', description: 'Apariencia de la app', icon: Activity, href: '/admin/customization', tone: 'bg-secondary/10 text-secondary' },
              ].map((item) => (
                <Button
                  key={item.href}
                  type="button"
                  variant="ghost"
                  onClick={() => navigate(item.href)}
                  className="group h-auto min-h-28 w-full flex-col items-start justify-between whitespace-normal rounded-lg border border-border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card hover:shadow-md"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.tone}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{item.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </section>

          <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> Datos de Barbosa y Santana</div>
            <span>{stats.totalUsers} usuarios registrados</span>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;