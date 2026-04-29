import { useEffect, useState } from 'react';
import SponsorLayout, { useSponsor } from '@/components/sponsor/SponsorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import {
  Store,
  Users,
  QrCode,
  Bell,
  TrendingUp,
  Megaphone,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Target,
  BarChart3,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Star } from 'lucide-react';

interface StatCardProps {
  icon: any;
  label: string;
  value: number | string;
  hint?: string;
  trend?: string;
  gradient: string;
  iconColor: string;
}

const StatCard = ({ icon: Icon, label, value, hint, trend, gradient, iconColor }: StatCardProps) => (
  <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
    <div className={`absolute inset-0 opacity-10 ${gradient}`} />
    <div className={`absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 rounded-full opacity-20 blur-2xl ${gradient}`} />
    <CardContent className="p-5 relative">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${iconColor} shadow-sm`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        {trend && (
          <Badge variant="secondary" className="text-xs gap-1">
            <ArrowUpRight className="h-3 w-3" /> {trend}
          </Badge>
        )}
      </div>
      <p className="text-3xl font-bold tracking-tight">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      <p className="text-sm font-medium text-foreground/80 mt-1">{label}</p>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </CardContent>
  </Card>
);

const SponsorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    businesses: 0,
    users: 0,
    qrScans: 0,
    campaigns: 0,
    activeCampaigns: 0,
    pendingCampaigns: 0,
    draftCampaigns: 0,
  });
  const [planName, setPlanName] = useState<string | null>(null);
  const [planLimit, setPlanLimit] = useState<number>(0);
  const [recentCampaigns, setRecentCampaigns] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data: sponsor } = await supabase
        .from('sponsors')
        .select('id, current_plan_id, sponsor_plans(name, monthly_push_limit)')
        .eq('user_id', session.user.id)
        .maybeSingle();

      const sponsorPlan: any = (sponsor as any)?.sponsor_plans;
      if (sponsorPlan) {
        setPlanName(sponsorPlan.name);
        setPlanLimit(sponsorPlan.monthly_push_limit || 0);
      }

      const [biz, profiles, scans, camps, recent] = await Promise.all([
        supabase.from('businesses').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('loyalty_history').select('*', { count: 'exact', head: true }),
        supabase.from('sponsor_campaigns').select('status').eq('sponsor_id', (sponsor as any)?.id || ''),
        supabase
          .from('sponsor_campaigns')
          .select('id, title, status, created_at, target_audience')
          .eq('sponsor_id', (sponsor as any)?.id || '')
          .order('created_at', { ascending: false })
          .limit(4),
      ]);

      const allCamps = camps.data || [];
      setStats({
        businesses: biz.count || 0,
        users: profiles.count || 0,
        qrScans: scans.count || 0,
        campaigns: allCamps.length,
        activeCampaigns: allCamps.filter((c: any) => c.status === 'aprobada' || c.status === 'enviada').length,
        pendingCampaigns: allCamps.filter((c: any) => c.status === 'pendiente').length,
        draftCampaigns: allCamps.filter((c: any) => c.status === 'borrador').length,
      });
      setRecentCampaigns(recent.data || []);

      const { data: bizList } = await supabase
        .from('businesses')
        .select('id, name, category, neighborhood, zone, address, price_range, featured')
        .order('featured', { ascending: false })
        .order('name', { ascending: true });
      setBusinesses(bizList || []);
    })();
  }, []);

  const categories = Array.from(new Set(businesses.map((b) => b.category).filter(Boolean))).sort();
  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch =
      !searchTerm ||
      b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.neighborhood?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const usagePercent = planLimit > 0 ? Math.min(100, (stats.activeCampaigns / planLimit) * 100) : 0;

  const statusBadge = (status: string) => {
    const map: Record<string, { variant: any; label: string; icon: any }> = {
      borrador: { variant: 'outline', label: 'Borrador', icon: Clock },
      pendiente: { variant: 'secondary', label: 'Pendiente', icon: Clock },
      aprobada: { variant: 'default', label: 'Aprobada', icon: CheckCircle2 },
      enviada: { variant: 'default', label: 'Enviada', icon: CheckCircle2 },
      rechazada: { variant: 'destructive', label: 'Rechazada', icon: Clock },
    };
    const cfg = map[status] || map.borrador;
    const Icon = cfg.icon;
    return (
      <Badge variant={cfg.variant} className="gap-1 text-xs">
        <Icon className="h-3 w-3" /> {cfg.label}
      </Badge>
    );
  };

  return (
    <SponsorLayout title="Dashboard" subtitle="Visión general de la app y tus campañas">
      <div className="space-y-6">
        {/* Hero card */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />
          <CardContent className="relative p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium opacity-90">Panel de Patrocinador</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                ¡Bienvenido de nuevo!
              </h2>
              <p className="text-sm md:text-base opacity-90 max-w-xl">
                Aquí puedes monitorear el impacto de tu marca en la red de Sabor 360 y lanzar nuevas campañas dirigidas.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Button
                onClick={() => navigate('/sponsor/campaigns')}
                size="lg"
                variant="secondary"
                className="gap-2 shadow-md"
              >
                <Megaphone className="h-4 w-4" /> Nueva campaña
              </Button>
              <Button
                onClick={() => navigate('/sponsor/metrics')}
                size="lg"
                variant="outline"
                className="gap-2 bg-white/10 border-white/30 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
              >
                <BarChart3 className="h-4 w-4" /> Ver métricas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard
            icon={Store}
            label="Restaurantes"
            value={stats.businesses}
            hint="Inscritos activos"
            gradient="bg-gradient-to-br from-orange-500 to-red-600"
            iconColor="bg-gradient-to-br from-orange-500 to-red-600"
          />
          <StatCard
            icon={Users}
            label="Comensales"
            value={stats.users}
            hint="Usuarios registrados"
            gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
            iconColor="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
          <StatCard
            icon={QrCode}
            label="Escaneos QR"
            value={stats.qrScans}
            hint="Total acumulado"
            gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
            iconColor="bg-gradient-to-br from-blue-500 to-indigo-600"
          />
          <StatCard
            icon={Bell}
            label="Campañas activas"
            value={stats.activeCampaigns}
            hint={`de ${stats.campaigns} totales`}
            gradient="bg-gradient-to-br from-purple-500 to-pink-600"
            iconColor="bg-gradient-to-br from-purple-500 to-pink-600"
          />
        </div>

        {/* Plan & quick stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Plan usage */}
          <Card className="lg:col-span-2 border-0 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Zap className="h-4 w-4 text-primary" /> Tu plan actual
                  </CardTitle>
                  <p className="text-2xl font-bold mt-2">{planName || 'Sin plan asignado'}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate('/sponsor/plans')} className="gap-1">
                  Mejorar <ArrowUpRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {planLimit > 0 ? (
                <>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Campañas usadas este mes</span>
                      <span className="font-semibold">
                        {stats.activeCampaigns} / {planLimit}
                      </span>
                    </div>
                    <Progress value={usagePercent} className="h-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-xl font-bold text-primary">{stats.draftCampaigns}</p>
                      <p className="text-xs text-muted-foreground mt-1">Borradores</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-xl font-bold text-amber-600">{stats.pendingCampaigns}</p>
                      <p className="text-xs text-muted-foreground mt-1">Pendientes</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-xl font-bold text-emerald-600">{stats.activeCampaigns}</p>
                      <p className="text-xs text-muted-foreground mt-1">Activas</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Aún no tienes un plan activo. Elige uno para comenzar a publicar campañas.
                  </p>
                  <Button onClick={() => navigate('/sponsor/plans')} className="gap-2">
                    <TrendingUp className="h-4 w-4" /> Ver planes disponibles
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick action: target */}
          <Card className="border-0 shadow-md bg-gradient-to-br from-secondary/10 to-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4 text-primary" /> Segmentación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Llega a comensales por geolocalización, zona, categoría o tipo de público.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Geo radial</Badge>
                <Badge variant="outline">Por zona</Badge>
                <Badge variant="outline">Categoría</Badge>
                <Badge variant="outline">Restaurantes</Badge>
                <Badge variant="outline">Comensales</Badge>
              </div>
              <Button
                size="sm"
                className="w-full gap-1"
                onClick={() => navigate('/sponsor/campaigns')}
              >
                Crear campaña <ArrowUpRight className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent campaigns */}
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-primary" /> Campañas recientes
            </CardTitle>
            <Button size="sm" variant="ghost" onClick={() => navigate('/sponsor/campaigns')} className="gap-1">
              Ver todas <ArrowUpRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            {recentCampaigns.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Bell className="h-10 w-10 mx-auto text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Aún no has creado campañas</p>
                <Button size="sm" onClick={() => navigate('/sponsor/campaigns')}>
                  Crear primera campaña
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {recentCampaigns.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate('/sponsor/campaigns')}
                  >
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Megaphone className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{c.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString()} · Público: {c.target_audience}
                      </p>
                    </div>
                    {statusBadge(c.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SponsorLayout>
  );
};

export default SponsorDashboard;
