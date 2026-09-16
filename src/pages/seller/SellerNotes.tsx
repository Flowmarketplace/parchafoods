import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import SellerLayout from '@/components/seller/SellerLayout';
import { useSeller } from '@/hooks/useSeller';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const SellerNotes = () => {
  const { seller, loading } = useSeller();
  const [notes, setNotes] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ subject: '', content: '', follow_up_date: '' });

  const load = useCallback(async () => {
    if (!seller) return;
    const { data } = await supabase
      .from('seller_notes')
      .select('*')
      .eq('seller_id', seller.id)
      .order('created_at', { ascending: false });
    setNotes(data || []);
  }, [seller]);

  useEffect(() => {
    load();
  }, [load]);

  const create = async () => {
    if (!seller || !form.content.trim()) return toast.error('Escribe la nota');
    const { error } = await supabase.from('seller_notes').insert({
      seller_id: seller.id,
      subject: form.subject || null,
      content: form.content.trim(),
      follow_up_date: form.follow_up_date || null,
    });
    if (error) return toast.error('No se pudo guardar la nota');
    toast.success('Nota guardada');
    setOpen(false);
    setForm({ subject: '', content: '', follow_up_date: '' });
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('seller_notes').delete().eq('id', id);
    if (error) return toast.error('No se pudo eliminar');
    load();
  };

  return (
    <SellerLayout title="Notas" description="Apuntes de seguimiento de tus clientes y prospectos">
      <div className="mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Nueva nota</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nueva nota</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Asunto</Label><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
              <div><Label>Nota</Label><Textarea rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
              <div><Label>Recordatorio</Label><Input type="date" value={form.follow_up_date} onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })} /></div>
              <Button className="w-full" onClick={create}>Guardar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Cargando...</div>
      ) : (
        <div className="space-y-3">
          {notes.length === 0 && (
            <Card><CardContent className="py-10 text-center text-muted-foreground">Aún no tienes notas.</CardContent></Card>
          )}
          {notes.map((n) => (
            <Card key={n.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="text-base truncate">{n.subject || 'Nota'}</CardTitle>
                    <CardDescription>
                      {format(new Date(n.created_at), 'PPp', { locale: es })}
                      {n.follow_up_date ? ` · recordatorio ${n.follow_up_date}` : ''}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => remove(n.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{n.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </SellerLayout>
  );
};

export default SellerNotes;
