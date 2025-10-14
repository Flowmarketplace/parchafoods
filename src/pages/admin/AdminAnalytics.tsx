import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, DollarSign, Store, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminAnalytics = () => {
  // Fetch analytics data
  const { data: stats } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const [usersData, businessesData, subscriptionsData] = await Promise.all([
        supabase.from('profiles').select('created_at', { count: 'exact' }),
        supabase.from('businesses').select('created_at', { count: 'exact' }),
        supabase.from('business_subscriptions').select('*'),
      ]);

      return {
        totalUsers: usersData.count || 0,
        totalBusinesses: businessesData.count || 0,
        totalRevenue: subscriptionsData.data?.reduce((sum, sub) => sum + (sub as any).amount || 0, 0) || 0,
        activeSubscriptions: subscriptionsData.data?.filter(s => s.status === 'active').length || 0,
      };
    },
  });

  // Mock data for charts
  const monthlyData = [
    { month: 'Ene', usuarios: 120, negocios: 45, ingresos: 45000 },
    { month: 'Feb', usuarios: 190, negocios: 67, ingresos: 67000 },
    { month: 'Mar', usuarios: 280, negocios: 89, ingresos: 89000 },
    { month: 'Abr', usuarios: 350, negocios: 112, ingresos: 112000 },
    { month: 'May', usuarios: 440, negocios: 134, ingresos: 134000 },
    { month: 'Jun', usuarios: 520, negocios: 156, ingresos: 156000 },
  ];

  const categoryData = [
    { name: 'Restaurantes', value: 45 },
    { name: 'Tiendas', value: 32 },
    { name: 'Servicios', value: 28 },
    { name: 'Entretenimiento', value: 18 },
    { name: 'Otros', value: 12 },
  ];

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Estadísticas y Analíticas</h1>
          <p className="text-muted-foreground">
            Vista general del rendimiento de la plataforma
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> vs mes anterior
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Negocios Activos</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalBusinesses || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> vs mes anterior
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Suscripciones Activas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeSubscriptions || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15%</span> vs mes anterior
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.totalRevenue.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+20%</span> vs mes anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Crecimiento Mensual</CardTitle>
              <CardDescription>Usuarios y negocios registrados por mes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="usuarios" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="negocios" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ingresos Mensuales</CardTitle>
              <CardDescription>Evolución de ingresos en los últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ingresos" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Categories Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Categorías</CardTitle>
            <CardDescription>Negocios registrados por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
