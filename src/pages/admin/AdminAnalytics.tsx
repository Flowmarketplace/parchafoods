import AdminSidebar, { AdminSidebarDesktop } from '@/components/admin/AdminSidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, Wallet, Percent, Store, TrendingUp, Menu } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatMoney } from '@/lib/sellerMath';
import { DAILY_CLIENT_GOAL, MONTHLY_CLIENT_GOAL, goalProgress } from '@/lib/sellerGoals';
import { ACTIVE_CITIES, useAdminCommercialStats } from '@/hooks/useAdminCommercialStats';

const AdminAnalytics = () => {
  const stats = useAdminCommercialStats();

  const sellerChart = stats.sellers.map((s) => ({
    name: s.name.split(' ')[0],
    vendido: s.sold,
    recaudado: s.collected,
  }));

  const cityChart = stats.cities.map((c) => ({
    name: c.city,
    negocios: c.businesses,
    membresias: c.subscriptions,
  }));

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
              <h1 className="text-lg sm:text-3xl font-bold">Estadísticas y Analíticas</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Datos reales de {ACTIVE_CITIES.join(' y ')}
              </p>
            </div>
          </div>
        </header>
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
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
                <p className="text-xs text-muted-foreground">Sobre lo recaudado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Negocios</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{stats.totalBusinesses}</div>
                <p className="text-xs text-muted-foreground">{stats.totalClients} clientes activos</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Membresías y negocios por mes</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="membresias" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="negocios" stroke="hsl(var(--accent))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recaudo mensual</CardTitle>
                <CardDescription>Dinero efectivamente cobrado</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(v: any) => formatMoney(Number(v))} />
                    <Bar dataKey="ingresos" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ventas por asesor</CardTitle>
                <CardDescription>Vendido vs. recaudado</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sellerChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(v: any) => formatMoney(Number(v))} />
                    <Legend />
                    <Bar dataKey="vendido" fill="hsl(var(--primary))" />
                    <Bar dataKey="recaudado" fill="hsl(var(--accent))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Por ciudad</CardTitle>
                <CardDescription>Negocios y membresías en {ACTIVE_CITIES.join(' y ')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cityChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="negocios" fill="hsl(var(--primary))" />
                    <Bar dataKey="membresias" fill="hsl(var(--accent))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Metas por asesor */}
          <Card>
            <CardHeader>
              <CardTitle>Metas de los asesores</CardTitle>
              <CardDescription>
                {DAILY_CLIENT_GOAL} clientes por día · {MONTHLY_CLIENT_GOAL} clientes al mes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.sellers.map((s) => (
                <div key={s.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-muted-foreground">
                      {s.month} / {MONTHLY_CLIENT_GOAL} este mes · hoy {s.today} / {DAILY_CLIENT_GOAL}
                    </span>
                  </div>
                  <Progress value={goalProgress(s.month, MONTHLY_CLIENT_GOAL)} />
                </div>
              ))}
              {stats.sellers.length === 0 && (
                <p className="text-sm text-muted-foreground">Sin vendedores registrados.</p>
              )}
            </CardContent>
          </Card>

          {/* Categories Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución por categorías</CardTitle>
              <CardDescription>Negocios publicados por tipo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={stats.categories} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={110} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
