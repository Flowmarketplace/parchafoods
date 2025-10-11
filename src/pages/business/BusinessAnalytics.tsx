import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import BusinessSidebar from '@/components/business/BusinessSidebar';
import BusinessBottomNav from '@/components/business/BusinessBottomNav';
import { 
  ArrowLeft,
  Users, 
  QrCode, 
  TrendingUp, 
  Gift,
  BarChart3,
  Menu as MenuIcon,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BusinessStats {
  totalCustomers: number;
  qrScans: number;
  rewardsRedeemed: number;
  returnRate: number;
  customersChange: number;
  scansChange: number;
  rewardsChange: number;
  returnRateChange: number;
}

const BusinessAnalytics = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<BusinessStats>({
    totalCustomers: 0,
    qrScans: 0,
    rewardsRedeemed: 0,
    returnRate: 0,
    customersChange: 0,
    scansChange: 0,
    rewardsChange: 0,
    returnRateChange: 0,
  });
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate('/auth');
        return;
      }

      // Get business
      const { data: businessData } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', session.user.id)
        .single();

      if (!businessData) {
        navigate('/business-dashboard');
        return;
      }

      setBusinessId(businessData.id);
      await fetchBusinessStats(businessData.id);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessStats = async (businessId: string) => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Fetch current month stats
      const { data: currentMonthScans } = await supabase
        .from('loyalty_history')
        .select('*', { count: 'exact' })
        .eq('business_id', businessId)
        .gte('scanned_at', startOfMonth.toISOString());

      const { data: lastMonthScans } = await supabase
        .from('loyalty_history')
        .select('*', { count: 'exact' })
        .eq('business_id', businessId)
        .gte('scanned_at', startOfLastMonth.toISOString())
        .lte('scanned_at', endOfLastMonth.toISOString());

      // Fetch unique customers
      const { data: currentMonthCustomers } = await supabase
        .from('loyalty_points')
        .select('user_id')
        .eq('business_id', businessId)
        .gte('created_at', startOfMonth.toISOString());

      const { data: lastMonthCustomers } = await supabase
        .from('loyalty_points')
        .select('user_id')
        .eq('business_id', businessId)
        .gte('created_at', startOfLastMonth.toISOString())
        .lte('created_at', endOfLastMonth.toISOString());

      // Fetch rewards redeemed
      const { data: currentRewards } = await supabase
        .from('loyalty_points')
        .select('*', { count: 'exact' })
        .eq('business_id', businessId)
        .eq('reward_claimed', true)
        .gte('updated_at', startOfMonth.toISOString());

      const { data: lastRewards } = await supabase
        .from('loyalty_points')
        .select('*', { count: 'exact' })
        .eq('business_id', businessId)
        .eq('reward_claimed', true)
        .gte('updated_at', startOfLastMonth.toISOString())
        .lte('updated_at', endOfLastMonth.toISOString());

      // Calculate unique customers
      const uniqueCurrentCustomers = new Set(currentMonthCustomers?.map(c => c.user_id) || []).size;
      const uniqueLastCustomers = new Set(lastMonthCustomers?.map(c => c.user_id) || []).size;

      // Calculate return rate (customers with more than 1 scan)
      const { data: repeatCustomers } = await supabase
        .from('loyalty_history')
        .select('user_id')
        .eq('business_id', businessId)
        .gte('scanned_at', startOfMonth.toISOString());

      const userScanCounts = repeatCustomers?.reduce((acc: any, curr) => {
        acc[curr.user_id] = (acc[curr.user_id] || 0) + 1;
        return acc;
      }, {});

      const returningCustomers = Object.values(userScanCounts || {}).filter((count: any) => count > 1).length;
      const returnRate = uniqueCurrentCustomers > 0 ? (returningCustomers / uniqueCurrentCustomers) * 100 : 0;

      // Calculate changes
      const customersChange = uniqueLastCustomers > 0 
        ? ((uniqueCurrentCustomers - uniqueLastCustomers) / uniqueLastCustomers) * 100 
        : 0;

      const scansChange = (lastMonthScans?.length || 0) > 0
        ? (((currentMonthScans?.length || 0) - (lastMonthScans?.length || 0)) / (lastMonthScans?.length || 1)) * 100
        : 0;

      const rewardsChange = (lastRewards?.length || 0) > 0
        ? (((currentRewards?.length || 0) - (lastRewards?.length || 0)) / (lastRewards?.length || 1)) * 100
        : 0;

      setStats({
        totalCustomers: uniqueCurrentCustomers,
        qrScans: currentMonthScans?.length || 0,
        rewardsRedeemed: currentRewards?.length || 0,
        returnRate: Math.round(returnRate),
        customersChange: Math.round(customersChange),
        scansChange: Math.round(scansChange),
        rewardsChange: Math.round(rewardsChange),
        returnRateChange: 0,
      });

      // Fetch weekly and monthly data
      await fetchWeeklyData(businessId);
      await fetchMonthlyData(businessId);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchWeeklyData = async (businessId: string) => {
    try {
      const now = new Date();
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const { data: scans } = await supabase
        .from('loyalty_history')
        .select('scanned_at')
        .eq('business_id', businessId)
        .gte('scanned_at', last7Days.toISOString());

      // Group by day
      const dayMap: any = {};
      scans?.forEach(scan => {
        const date = new Date(scan.scanned_at);
        const dayKey = date.toLocaleDateString('es-ES', { weekday: 'short' });
        dayMap[dayKey] = (dayMap[dayKey] || 0) + 1;
      });

      const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
      const chartData = daysOfWeek.map(day => ({
        day,
        escaneos: dayMap[day] || 0,
      }));

      setWeeklyData(chartData);
    } catch (error) {
      console.error('Error fetching weekly data:', error);
    }
  };

  const fetchMonthlyData = async (businessId: string) => {
    try {
      const now = new Date();
      const last6Months = new Date(now.getFullYear(), now.getMonth() - 5, 1);

      const { data: scans } = await supabase
        .from('loyalty_history')
        .select('scanned_at')
        .eq('business_id', businessId)
        .gte('scanned_at', last6Months.toISOString());

      const { data: rewards } = await supabase
        .from('loyalty_points')
        .select('updated_at')
        .eq('business_id', businessId)
        .eq('reward_claimed', true)
        .gte('updated_at', last6Months.toISOString());

      // Group by month
      const monthMap: any = {};
      scans?.forEach(scan => {
        const date = new Date(scan.scanned_at);
        const monthKey = date.toLocaleDateString('es-ES', { month: 'short' });
        if (!monthMap[monthKey]) monthMap[monthKey] = { escaneos: 0, recompensas: 0 };
        monthMap[monthKey].escaneos++;
      });

      rewards?.forEach(reward => {
        const date = new Date(reward.updated_at);
        const monthKey = date.toLocaleDateString('es-ES', { month: 'short' });
        if (!monthMap[monthKey]) monthMap[monthKey] = { escaneos: 0, recompensas: 0 };
        monthMap[monthKey].recompensas++;
      });

      const chartData = Object.keys(monthMap).map(month => ({
        mes: month,
        escaneos: monthMap[month].escaneos,
        recompensas: monthMap[month].recompensas,
      }));

      setMonthlyData(chartData);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-16 lg:pb-0">
      <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:ml-64">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <MenuIcon className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/business-dashboard')}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Analíticas</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 lg:ml-64">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 animate-fade-in">
          <Card className="hover-scale hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clientes
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {stats.totalCustomers}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {stats.customersChange >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <p className={`text-xs ${stats.customersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(stats.customersChange)}% vs mes anterior
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Escaneos QR
              </CardTitle>
              <div className="p-2 rounded-lg bg-purple-500/10">
                <QrCode className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {stats.qrScans}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {stats.scansChange >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <p className={`text-xs ${stats.scansChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(stats.scansChange)}% vs mes anterior
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recompensas Canjeadas
              </CardTitle>
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Gift className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {stats.rewardsRedeemed}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {stats.rewardsChange >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <p className={`text-xs ${stats.rewardsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(stats.rewardsChange)}% vs mes anterior
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tasa de Retorno
              </CardTitle>
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {stats.returnRate}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Clientes que regresan
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos de Analíticas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Gráfico Semanal */}
          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Actividad Semanal
              </CardTitle>
              <CardDescription>Escaneos QR de los últimos 7 días</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="escaneos" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico Mensual */}
          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Tendencia Mensual
              </CardTitle>
              <CardDescription>Comparativa de los últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="mes" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="escaneos" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Escaneos"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="recompensas" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                    name="Recompensas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>

      <BusinessBottomNav onMenuClick={() => setSidebarOpen(true)} />
    </div>
  );
};

export default BusinessAnalytics;