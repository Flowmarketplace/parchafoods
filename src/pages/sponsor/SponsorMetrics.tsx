import { useEffect, useMemo, useState } from 'react';
import SponsorLayout from '@/components/sponsor/SponsorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { useSponsor } from '@/hooks/useSponsor';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line,
} from 'recharts';
import { TrendingUp, MousePointerClick, Eye, DollarSign, Target, Send } from 'lucide-react';

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(24 95% 53%)',
  'hsl(142 71% 45%)',
  'hsl(199 89% 48%)',
  'hsl(280 65% 60%)',
  'hsl(45 93% 58%)',
];

type Campaign = {
  id: string;
  title: string;
  status: string;
  sent_count: number | null;
  sent_at: string | null;
  created_at: string;
};

const SponsorMetrics = () => {
  const { sponsor } = useSponsor();
  const [byCategory, setByCategory] = useState<{ name: string; value: number }[]>([]);
  const [byZone, setByZone] = useState<{ name: string; value: number }[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [scansByDay, setScansByDay] = useState<{ day: string; count: number }[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: businesses }, { data: scans }] = await Promise.all([
        supabase.from('businesses').select('category, zone'),
        supabase.from('loyalty_history').select('scanned_at'),
      ]);

      const catMap: Record<string, number> = {};
      const zoneMap: Record<string, number> = {};
      businesses?.forEach((b: any) => {
        if (b.category) catMap[b.category] = (catMap[b.category] || 0) + 1;
        if (b.zone) zoneMap[b.zone] = (zoneMap[b.zone] || 0) + 1;
      });
      setByCategory(Object.entries(catMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value));
      setByZone(Object.entries(zoneMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value));

      const dayMap: Record<string, number> = {};
      scans?.forEach((s: any) => {
        const d = new Date(s.scanned_at).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' });
        dayMap[d] = (dayMap[d] || 0) + 1;
      });
      setScansByDay(Object.entries(dayMap).map(([day, count]) => ({ day, count })).slice(-14));

      if (sponsor?.id) {
        const { data: camps } = await supabase
          .from('sponsor_campaigns')
          .select('id, title, status, sent_count, sent_at, created_at')
          .eq('sponsor_id', sponsor.id)
          .order('created_at', { ascending: false });
        setCampaigns((camps || []) as Campaign[]);
      }
    })();
  }, [sponsor?.id]);

  // KPIs estimados con benchmarks de la industria (push notifications):
  // Apertura ~ 20%, CTR ~ 7%, conversión ~ 2%, costo promedio por envío $50 COP
  const kpis = useMemo(() => {
    const sent = campaigns.filter((c) => c.status === 'enviada' || c.sent_at);
    const totalSent = sent.reduce((acc, c) => acc + (c.sent_count || 0), 0);
    const opens = Math.round(totalSent * 0.22);
    const clicks = Math.round(totalSent * 0.075);
    const conversions = Math.round(totalSent * 0.018);
    const totalCost = totalSent * 50; // costo estimado por envío
    const openRate = totalSent ? (opens / totalSent) * 100 : 0;
    const ctr = totalSent ? (clicks / totalSent) * 100 : 0;
    const cvr = clicks ? (conversions / clicks) * 100 : 0;
    const cpc = clicks ? totalCost / clicks : 0;
    const cpa = conversions ? totalCost / conversions : 0;
    return {
      totalCampaigns: campaigns.length,
      sentCampaigns: sent.length,
      totalSent,
      opens,
      clicks,
      conversions,
      openRate,
      ctr,
      cvr,
      cpc,
      cpa,
      totalCost,
    };
  }, [campaigns]);

  const funnelData = [
    { stage: 'Enviadas', value: kpis.totalSent },
    { stage: 'Aperturas', value: kpis.opens },
    { stage: 'Clics', value: kpis.clicks },
    { stage: 'Conversiones', value: kpis.conversions },
  ];

  const statusData = useMemo(() => {
    const map: Record<string, number> = {};
    campaigns.forEach((c) => {
      const key = c.status || 'sin estado';
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [campaigns]);

  const perCampaign = useMemo(() => {
    return campaigns
      .filter((c) => (c.sent_count || 0) > 0)
      .slice(0, 8)
      .map((c) => {
        const sent = c.sent_count || 0;
        return {
          name: c.title.length > 18 ? c.title.slice(0, 18) + '…' : c.title,
          aperturas: Math.round(sent * 0.22),
          clics: Math.round(sent * 0.075),
          conversiones: Math.round(sent * 0.018),
        };
      });
  }, [campaigns]);

  const formatCOP = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

  return (
    <SponsorLayout title="Métricas" subtitle="Resultados de tus campañas y datos de la plataforma">
      {/* KPIs principales */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <KpiCard icon={<Send className="h-4 w-4" />} label="Envíos totales" value={kpis.totalSent.toLocaleString('es-CO')} accent="primary" />
        <KpiCard icon={<Eye className="h-4 w-4" />} label="Tasa de apertura" value={`${kpis.openRate.toFixed(1)}%`} sub={`${kpis.opens.toLocaleString('es-CO')} aperturas`} accent="secondary" />
        <KpiCard icon={<MousePointerClick className="h-4 w-4" />} label="CTR (clics)" value={`${kpis.ctr.toFixed(1)}%`} sub={`${kpis.clics?.toLocaleString?.('es-CO') ?? kpis.clicks.toLocaleString('es-CO')} clics`} accent="accent" />
        <KpiCard icon={<Target className="h-4 w-4" />} label="Conversión" value={`${kpis.cvr.toFixed(1)}%`} sub={`${kpis.conversions.toLocaleString('es-CO')} conv.`} accent="primary" />
        <KpiCard icon={<DollarSign className="h-4 w-4" />} label="CPC" value={formatCOP(kpis.cpc)} sub="costo por clic" accent="secondary" />
        <KpiCard icon={<TrendingUp className="h-4 w-4" />} label="CPA" value={formatCOP(kpis.cpa)} sub="costo por adquisición" accent="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Embudo de conversión */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Embudo de conversión de campañas</CardTitle>
          </CardHeader>
          <CardContent>
            {kpis.totalSent === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Aún no hay campañas enviadas para mostrar resultados.</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={funnelData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="stage" type="category" tick={{ fontSize: 12 }} width={100} />
                  <Tooltip formatter={(v: number) => v.toLocaleString('es-CO')} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {funnelData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Estado de campañas (torta) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Estado de mis campañas</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Sin campañas todavía.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(e: any) => `${e.name}: ${e.value}`}>
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Resultados por campaña */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resultados por campaña</CardTitle>
          </CardHeader>
          <CardContent>
            {perCampaign.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Aún sin datos por campaña.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={perCampaign}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="aperturas" stackId="a" fill={COLORS[0]} />
                  <Bar dataKey="clics" stackId="a" fill={COLORS[1]} />
                  <Bar dataKey="conversiones" stackId="a" fill={COLORS[2]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Restaurantes por categoría (torta) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Restaurantes por categoría</CardTitle>
          </CardHeader>
          <CardContent>
            {byCategory.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Sin datos</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={byCategory.slice(0, 8)} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
                    {byCategory.slice(0, 8).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Restaurantes por zona (torta) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Restaurantes por zona</CardTitle>
          </CardHeader>
          <CardContent>
            {byZone.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Sin datos</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={byZone} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(e: any) => `${e.name}`}>
                    {byZone.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Actividad de usuarios (línea) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Actividad de usuarios (últimos días)</CardTitle>
          </CardHeader>
          <CardContent>
            {scansByDay.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Sin escaneos registrados</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={scansByDay}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <p className="text-[10px] text-muted-foreground mt-4 text-center">
        * Las tasas de apertura, CTR y conversión se calculan con benchmarks de la industria de notificaciones push aplicados a los envíos reales de tus campañas.
        Costo estimado por envío: {formatCOP(50)}.
      </p>
    </SponsorLayout>
  );
};

const KpiCard = ({ icon, label, value, sub, accent = 'primary' }: { icon: React.ReactNode; label: string; value: string; sub?: string; accent?: 'primary' | 'secondary' | 'accent' }) => {
  const colorMap = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent-foreground',
  };
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-1.5">
          <div className={`h-7 w-7 rounded-md flex items-center justify-center ${colorMap[accent]}`}>{icon}</div>
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">{label}</span>
        </div>
        <div className="text-lg font-bold leading-tight">{value}</div>
        {sub && <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>}
      </CardContent>
    </Card>
  );
};

export default SponsorMetrics;
