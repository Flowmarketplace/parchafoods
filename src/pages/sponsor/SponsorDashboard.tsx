import { useEffect, useState } from 'react';
import SponsorLayout from '@/components/sponsor/SponsorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Store, Users, QrCode, Bell, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, hint }: any) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
        </div>
        <div className="bg-primary/10 p-3 rounded-lg">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
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
  });

  useEffect(() => {
    (async () => {
      const [biz, profiles, scans, camps] = await Promise.all([
        supabase.from('businesses').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('loyalty_history').select('*', { count: 'exact', head: true }),
        supabase.from('sponsor_campaigns').select('status'),
      ]);
      setStats({
        businesses: biz.count || 0,
        users: profiles.count || 0,
        qrScans: scans.count || 0,
        campaigns: camps.data?.length || 0,
        activeCampaigns: camps.data?.filter((c: any) => c.status === 'aprobada' || c.status === 'enviada').length || 0,
      });
    })();
  }, []);

  return (
    <SponsorLayout title="Dashboard" subtitle="Visión general de la app y tus campañas">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Store} label="Restaurantes inscritos" value={stats.businesses} hint="Activos en la plataforma" />
          <StatCard icon={Users} label="Usuarios registrados" value={stats.users} hint="Comensales en la app" />
          <StatCard icon={QrCode} label="Escaneos QR" value={stats.qrScans} hint="Total acumulado" />
          <StatCard icon={Bell} label="Campañas activas" value={stats.activeCampaigns} hint={`de ${stats.campaigns} totales`} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" /> Crear nueva campaña
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Diseña notificaciones push segmentadas por geolocalización, categoría, zona y público objetivo.
              </p>
              <Button onClick={() => navigate('/sponsor/campaigns')} className="w-full">
                Ir a campañas
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Mejora tu plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Conoce los beneficios de los planes Bronce, Plata y Oro para potenciar tu visibilidad.
              </p>
              <Button onClick={() => navigate('/sponsor/plans')} variant="outline" className="w-full">
                Ver planes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SponsorLayout>
  );
};

export default SponsorDashboard;
