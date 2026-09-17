import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Menu, Store, Users, CreditCard, TrendingUp, Wallet, Percent, Bell, Activity, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AdminSidebar, { AdminSidebarDesktop } from '@/components/admin/AdminSidebar';
import { toast } from 'sonner';
import { formatMoney, subscriptionValue } from '@/lib/sellerMath';
import { DAILY_CLIENT_GOAL, MONTHLY_CLIENT_GOAL, goalProgress } from '@/lib/sellerGoals';
import { ACTIVE_CITIES, useAdminCommercialStats } from '@/hooks/useAdminCommercialStats';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const stats = useAdminCommercialStats();

  useEffect(() => {
    checkAdminAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminSidebarDesktop />

      <div className="flex-1 lg:ml-64 w-full">
        <header className="sticky top-0 z-30 bg-card border-b border-border px-3 sm:px-4 py-3">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <AdminSidebar />
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold">Panel de Administración</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Operación en {ACTIVE_CITIES.join(' y ')}
              </p>
            </div>
          </div>
        </header>

        <main className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Comercial */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Ventas totales</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{formatMoney(stats.totalSold)}</div>
                <p className="text-xs text-muted-foreground">{stats.activeSubscriptions} membresías activas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Recaudo</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{formatMoney(stats.totalCollected)}</div>
                <p className="text-xs text-muted-foreground">Pendiente {formatMoney(stats.totalPending)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Comisiones</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{formatMoney(stats.totalCommission)}</div>
                <p className="text-xs text-muted-foreground">Pagadas sobre recaudo</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{stats.totalClients}</div>
                <p className="text-xs text-muted-foreground">{stats.monthSubscriptions} nuevos este mes</p>
              </CardContent>
            </Card>
          </div>

          {/* Plataforma */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Negocios publicados</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBusinesses}</div>
                <p className="text-xs text-muted-foreground">{ACTIVE_CITIES.join(' + ')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">Registrados en la app</p>
              </CardContent>
            </Card>
            {stats.cities.map((c) => (
              <Card key={c.city}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{c.city}</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{c.businesses}</div>
                  <p className="text-xs text-muted-foreground">
                    {c.subscriptions} membresías · {formatMoney(c.collected)} recaudado
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Ventas por asesor */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle>Ventas por asesor</CardTitle>
              </div>
              <CardDescription>Clientes, recaudo, comisión y avance de metas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.sellers.length === 0 && (
                <p className="text-sm text-muted-foreground">Aún no hay vendedores con ventas registradas.</p>
              )}
              {stats.sellers.map((s) => (
                <div key={s.id} className="rounded-xl border border-border p-3 sm:p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.clients} clientes</p>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/admin/seller/${s.id}`}>Entrar a su panel</Link>
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Vendido</p>
                      <p className="font-semibold">{formatMoney(s.sold)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Recaudado</p>
                      <p className="font-semibold">{formatMoney(s.collected)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pendiente</p>
                      <p className="font-semibold">{formatMoney(s.pending)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Comisión</p>
                      <p className="font-semibold">{formatMoney(s.commission)}</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Hoy</span>
                        <span>{s.today} / {DAILY_CLIENT_GOAL}</span>
                      </div>
                      <Progress value={goalProgress(s.today, DAILY_CLIENT_GOAL)} />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Este mes</span>
                        <span>{s.month} / {MONTHLY_CLIENT_GOAL}</span>
                      </div>
                      <Progress value={goalProgress(s.month, MONTHLY_CLIENT_GOAL)} />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Últimas membresías */}
          <Card>
            <CardHeader>
              <CardTitle>Últimas membresías</CardTitle>
              <CardDescription>Ventas más recientes registradas por los asesores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.recent.length === 0 && (
                <p className="text-sm text-muted-foreground">Sin membresías registradas.</p>
              )}
              {stats.recent.map((s: any) => (
                <div key={s.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-border last:border-0 py-2">
                  <div>
                    <p className="font-medium text-sm">{s.businesses?.name || 'Negocio'}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.businesses?.city || '—'} · {s.sellers?.full_name || 'Sin vendedor'} ·{' '}
                      {(s.start_date || '').slice(0, 10)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{formatMoney(subscriptionValue(s))}</span>
                    <Badge variant={s.collected ? 'default' : 'secondary'}>
                      {s.collected ? 'Pagado' : 'Pendiente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/businesses')}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  <CardTitle>Gestionar Negocios</CardTitle>
                </div>
                <CardDescription>Ver y administrar todos los negocios registrados</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/subscriptions')}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <CardTitle>Membresías</CardTitle>
                </div>
                <CardDescription>Asignar vendedor, valor y recaudo</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/sellers')}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>Vendedores</CardTitle>
                </div>
                <CardDescription>Seguimiento de cada asesor comercial</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/analytics')}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle>Ver Estadísticas</CardTitle>
                </div>
                <CardDescription>Análisis detallado del sistema</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/notifications')}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <CardTitle>Enviar Notificaciones</CardTitle>
                </div>
                <CardDescription>Comunicarse con negocios y usuarios</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/customization')}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <CardTitle>Personalización</CardTitle>
                </div>
                <CardDescription>Editar diseño y apariencia</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
