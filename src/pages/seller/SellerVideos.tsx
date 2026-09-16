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
import { Plus, Trash2, Video } from 'lucide-react';

const SellerVideos = () => {
  const { seller, loading } = useSeller();
  const [videos, setVideos] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ business_name: '', title: '', video_url: '', delivered_at: '', notes: '' });

  const load = useCallback(async () => {
    if (!seller) return;
    const { data } = await supabase
      .from('seller_video_deliveries')
      .select('*')
      .eq('seller_id', seller.id)
      .order('delivered_at', { ascending: false });
    setVideos(data || []);
  }, [seller]);

  useEffect(() => {
    load();
  }, [load]);

  const create = async () => {
    if (!seller || !form.title.trim()) return toast.error('Escribe el título del video');
    const { error } = await supabase.from('seller_video_deliveries').insert({
      seller_id: seller.id,
      business_name: form.business_name || null,
      title: form.title.trim(),
      video_url: form.video_url || null,
      delivered_at: form.delivered_at || new Date().toISOString().slice(0, 10),
      notes: form.notes || null,
    });
    if (error) return toast.error('No se pudo registrar el video');
    toast.success('Video registrado');
    setOpen(false);
    setForm({ business_name: '', title: '', video_url: '', delivered_at: '', notes: '' });
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('seller_video_deliveries').delete().eq('id', id);
    if (error) return toast.error('No se pudo eliminar');
    load();
  };

  return (
    <SellerLayout title="Videos Entregados" description="Registro de contenido entregado a cada cliente">
      <div className="mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Registrar video</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Video entregado</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Negocio</Label><Input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} /></div>
              <div><Label>Título</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Enlace del video</Label><Input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://" /></div>
              <div><Label>Fecha de entrega</Label><Input type="date" value={form.delivered_at} onChange={(e) => setForm({ ...form, delivered_at: e.target.value })} /></div>
              <div><Label>Notas</Label><Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
              <Button className="w-full" onClick={create}>Guardar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Cargando...</div>
      ) : (
        <div className="space-y-3">
          {videos.length === 0 && (
            <Card><CardContent className="py-10 text-center text-muted-foreground">Aún no has registrado videos.</CardContent></Card>
          )}
          {videos.map((v) => (
            <Card key={v.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="text-base flex items-center gap-2 truncate">
                      <Video className="h-4 w-4 text-primary shrink-0" /> {v.title}
                    </CardTitle>
                    <CardDescription>{[v.business_name, v.delivered_at].filter(Boolean).join(' · ')}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => remove(v.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {v.video_url && (
                  <a href={v.video_url} target="_blank" rel="noreferrer" className="text-sm text-primary break-all">
                    {v.video_url}
                  </a>
                )}
                {v.notes && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{v.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </SellerLayout>
  );
};

export default SellerVideos;
