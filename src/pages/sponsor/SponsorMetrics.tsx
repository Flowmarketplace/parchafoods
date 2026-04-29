import { useEffect, useState } from 'react';
import SponsorLayout from '@/components/sponsor/SponsorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

const SponsorMetrics = () => {
  const [byCategory, setByCategory] = useState<{ category: string; count: number }[]>([]);
  const [byZone, setByZone] = useState<{ zone: string; count: number }[]>([]);
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
      setByCategory(Object.entries(catMap).map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count));
      setByZone(Object.entries(zoneMap).map(([zone, count]) => ({ zone, count })).sort((a, b) => b.count - a.count));

      const dayMap: Record<string, number> = {};
      scans?.forEach((s: any) => {
        const d = new Date(s.scanned_at).toLocaleDateString('es-CO');
        dayMap[d] = (dayMap[d] || 0) + 1;
      });
      setScansByDay(Object.entries(dayMap).map(([day, count]) => ({ day, count })).slice(-14));
    })();
  }, []);

  return (
    <SponsorLayout title="Métricas" subtitle="Datos agregados de la plataforma">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Restaurantes por categoría</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {byCategory.length === 0 && <p className="text-sm text-muted-foreground">Sin datos</p>}
            {byCategory.map((c) => (
              <div key={c.category} className="flex items-center justify-between p-2 rounded bg-muted/40">
                <span className="text-sm">{c.category}</span>
                <Badge variant="secondary">{c.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Restaurantes por zona</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {byZone.length === 0 && <p className="text-sm text-muted-foreground">Sin datos</p>}
            {byZone.map((z) => (
              <div key={z.zone} className="flex items-center justify-between p-2 rounded bg-muted/40">
                <span className="text-sm">{z.zone}</span>
                <Badge variant="secondary">{z.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Escaneos QR (últimos días)</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {scansByDay.length === 0 && <p className="text-sm text-muted-foreground">Sin datos</p>}
            {scansByDay.map((s) => (
              <div key={s.day} className="flex items-center gap-2">
                <span className="text-xs w-24 text-muted-foreground">{s.day}</span>
                <div className="flex-1 bg-muted rounded h-3 overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: `${Math.min(100, s.count * 5)}%` }} />
                </div>
                <span className="text-xs w-10 text-right">{s.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </SponsorLayout>
  );
};

export default SponsorMetrics;
