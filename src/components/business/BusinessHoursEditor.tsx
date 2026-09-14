import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  businessId: string;
}

interface TimeRange {
  open_time: string;
  close_time: string;
}

interface DayRow {
  day_of_week: number;
  time_ranges: TimeRange[];
  is_closed: boolean;
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const defaultRows = (): DayRow[] =>
  DAYS.map((_, i) => ({
    day_of_week: i + 1 === 7 ? 0 : i + 1, // 0=Domingo, 1=Lunes...6=Sábado (igual que JS getDay)
    time_ranges: [{ open_time: '09:00', close_time: '18:00' }],
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
        .select('day_of_week, open_time, close_time, time_ranges, is_closed')
        .eq('business_id', businessId);
      if (data && data.length > 0) {
        const base = defaultRows();
        data.forEach((d: any) => {
          const idx = base.findIndex((r) => r.day_of_week === d.day_of_week);
          if (idx >= 0) {
            let ranges: TimeRange[] = [];
            if (Array.isArray(d.time_ranges) && d.time_ranges.length > 0) {
              ranges = d.time_ranges.map((tr: any) => ({
                open_time: (tr.open_time || '09:00').slice(0, 5),
                close_time: (tr.close_time || '18:00').slice(0, 5),
              }));
            } else if (d.open_time && d.close_time) {
              ranges = [
                {
                  open_time: d.open_time.slice(0, 5),
                  close_time: d.close_time.slice(0, 5),
                },
              ];
            }
            if (ranges.length === 0) {
              ranges = [{ open_time: '09:00', close_time: '18:00' }];
            }
            base[idx] = {
              day_of_week: d.day_of_week,
              time_ranges: ranges,
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

  const updateDay = (idx: number, patch: Partial<DayRow>) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const updateRange = (dayIdx: number, rangeIdx: number, patch: Partial<TimeRange>) => {
    setRows((prev) =>
      prev.map((r, i) => {
        if (i !== dayIdx) return r;
        const ranges = r.time_ranges.map((tr, j) => (j === rangeIdx ? { ...tr, ...patch } : tr));
        return { ...r, time_ranges: ranges };
      })
    );
  };

  const addRange = (dayIdx: number) => {
    setRows((prev) =>
      prev.map((r, i) =>
        i === dayIdx
          ? { ...r, time_ranges: [...r.time_ranges, { open_time: '14:00', close_time: '18:00' }] }
          : r
      )
    );
  };

  const removeRange = (dayIdx: number, rangeIdx: number) => {
    setRows((prev) =>
      prev.map((r, i) =>
        i === dayIdx && r.time_ranges.length > 1
          ? { ...r, time_ranges: r.time_ranges.filter((_, j) => j !== rangeIdx) }
          : r
      )
    );
  };

  const save = async () => {
    setSaving(true);
    try {
      await supabase.from('business_hours').delete().eq('business_id', businessId);
      const payload = rows.map((r) => ({
        business_id: businessId,
        day_of_week: r.day_of_week,
        open_time: r.is_closed ? null : r.time_ranges[0]?.open_time || null,
        close_time: r.is_closed ? null : r.time_ranges[0]?.close_time || null,
        time_ranges: r.is_closed ? '[]' : JSON.stringify(r.time_ranges),
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
        <CardDescription>Define los horarios en que tu negocio está abierto. Puedes agregar varios rangos por día.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando...</p>
        ) : (
          <>
            {rows.map((r, idx) => (
              <div key={r.day_of_week} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">{DAYS[idx]}</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!r.is_closed}
                      onCheckedChange={(checked) => updateDay(idx, { is_closed: !checked })}
                    />
                    <span className="text-xs text-muted-foreground w-12">{r.is_closed ? 'Cerrado' : 'Abierto'}</span>
                  </div>
                </div>
                {!r.is_closed && (
                  <div className="space-y-2 pl-1">
                    {r.time_ranges.map((tr, rangeIdx) => (
                      <div key={rangeIdx} className="grid grid-cols-12 gap-2 items-center">
                        <Input
                          type="time"
                          className="col-span-4"
                          value={tr.open_time}
                          onChange={(e) => updateRange(idx, rangeIdx, { open_time: e.target.value })}
                        />
                        <span className="col-span-1 text-center text-muted-foreground">a</span>
                        <Input
                          type="time"
                          className="col-span-4"
                          value={tr.close_time}
                          onChange={(e) => updateRange(idx, rangeIdx, { close_time: e.target.value })}
                        />
                        <div className="col-span-3 flex justify-end gap-1">
                          {r.time_ranges.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => removeRange(idx, rangeIdx)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          {rangeIdx === r.time_ranges.length - 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => addRange(idx)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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