import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  businessId: string;
}

interface DayRow {
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const defaultRows = (): DayRow[] =>
  DAYS.map((_, i) => ({
    day_of_week: i + 1, // 1..7 (Mon..Sun)
    open_time: '09:00',
    close_time: '20:00',
    is_closed: false,
  }));

const BusinessHoursEditor = ({ businessId }: Props) => {
  const { toast } = useToast();
  const [rows, setRows] = useState<DayRow[]>(defaultRows());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('business_hours')
        .select('day_of_week, open_time, close_time, is_closed')
        .eq('business_id', businessId);
      if (data && data.length > 0) {
        const base = defaultRows();
        data.forEach((d: any) => {
          const idx = base.findIndex((r) => r.day_of_week === d.day_of_week);
          if (idx >= 0) {
            base[idx] = {
              day_of_week: d.day_of_week,
              open_time: (d.open_time || '09:00').slice(0, 5),
              close_time: (d.close_time || '20:00').slice(0, 5),
              is_closed: !!d.is_closed,
            };
          }
        });
        setRows(base);
      }
      setLoading(false);
    };
    if (businessId) load();
  }, [businessId]);

  const update = (idx: number, patch: Partial<DayRow>) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const save = async () => {
    setSaving(true);
    try {
      await supabase.from('business_hours').delete().eq('business_id', businessId);
      const payload = rows.map((r) => ({
        business_id: businessId,
        day_of_week: r.day_of_week,
        open_time: r.is_closed ? null : r.open_time,
        close_time: r.is_closed ? null : r.close_time,
        is_closed: r.is_closed,
      }));
      const { error } = await supabase.from('business_hours').insert(payload);
      if (error) throw error;
      toast({ title: '¡Horarios actualizados!', description: 'Tus horarios fueron guardados.' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'No se pudo guardar', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" /> Horarios de Atención
        </CardTitle>
        <CardDescription>Define los horarios en que tu negocio está abierto</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando...</p>
        ) : (
          <>
            {rows.map((r, idx) => (
              <div key={r.day_of_week} className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-3 text-sm">{DAYS[idx]}</Label>
                <div className="col-span-2 flex items-center gap-2">
                  <Switch
                    checked={!r.is_closed}
                    onCheckedChange={(checked) => update(idx, { is_closed: !checked })}
                  />
                  <span className="text-xs text-muted-foreground">{r.is_closed ? 'Cerrado' : 'Abierto'}</span>
                </div>
                <Input
                  type="time"
                  className="col-span-3"
                  value={r.open_time}
                  onChange={(e) => update(idx, { open_time: e.target.value })}
                  disabled={r.is_closed}
                />
                <span className="col-span-1 text-center text-muted-foreground">a</span>
                <Input
                  type="time"
                  className="col-span-3"
                  value={r.close_time}
                  onChange={(e) => update(idx, { close_time: e.target.value })}
                  disabled={r.is_closed}
                />
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <Button type="button" onClick={save} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar Horarios'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessHoursEditor;
