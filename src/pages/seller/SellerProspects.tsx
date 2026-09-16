import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import SellerLayout from '@/components/seller/SellerLayout';
import { useSeller } from '@/hooks/useSeller';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Phone } from 'lucide-react';

const STATUSES = ['nuevo', 'contactado', 'interesado', 'negociando', 'cerrado', 'descartado'];

const SellerProspects = () => {
  const { seller, loading } = useSeller();
  const [prospects, setProspects] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '', category: '', contact_person: '', observation: '', next_contact_date: '' });

  const load = useCallback(async () => {
    if (!seller) return;
    const { data } = await supabase
      .from('prospects')
      .select('*')
      .eq('seller_id', seller.id)
      .order('created_at', { ascending: false });
    setProspects(data || []);
  }, [seller]);

  useEffect(() => {
    load();
  }, [load]);

  const create = async () => {
    if (!seller || !form.name.trim()) return toast.error('Escribe el nombre del prospecto');
    const { error } = await supabase.from('prospects').insert({
      seller_id: seller.id,
      name: form.name.trim(),
      phone: form.phone || null,
      address: form.address || null,
      category: form.category || null,
      contact_person: form.contact_person || null,
      observation: form.observation || null,
      next_contact_date: form.next_contact_date || null,
      contacted_by: seller.full_name,
      status: 'nuevo',
    });
    if (error) return toast.error('No se pudo crear el prospecto');
    toast.success('Prospecto creado');
    setOpen(false);
    setForm({ name: '', phone: '', address: '', category: '', contact_person: '', observation: '', next_contact_date: '' });
    load();
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('prospects').update({ status }).eq('id', id);
    if (error) return toast.error('No se pudo actualizar');
    load();
  };

  return (
    <SellerLayout title="Prospectos" description="Negocios en seguimiento">
      <div className="mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Nuevo prospecto</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Nuevo prospecto</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Nombre del negocio</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Persona de contacto</Label><Input value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} /></div>
              <div><Label>Teléfono</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div><Label>Dirección</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
              <div><Label>Categoría</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
              <div><Label>Próximo contacto</Label><Input type="date" value={form.next_contact_date} onChange={(e) => setForm({ ...form, next_contact_date: e.target.value })} /></div>
              <div><Label>Observación</Label><Textarea rows={3} value={form.observation} onChange={(e) => setForm({ ...form, observation: e.target.value })} /></div>
              <Button className="w-full" onClick={create}>Guardar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Cargando...</div>
      ) : (
        <div className="space-y-3">
          {prospects.length === 0 && (
            <Card><CardContent className="py-10 text-center text-muted-foreground">Aún no tienes prospectos.</CardContent></Card>
          )}
          {prospects.map((p) => (
            <Card key={p.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="text-base truncate">{p.name}</CardTitle>
                    <CardDescription className="truncate">
                      {[p.category, p.address].filter(Boolean).join(' · ')}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{p.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {p.phone && (
                  <a href={`tel:${p.phone}`} className="text-sm text-primary flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> {p.phone}
                  </a>
                )}
                {p.observation && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{p.observation}</p>}
                {p.next_contact_date && (
                  <p className="text-xs text-muted-foreground">Próximo contacto: {p.next_contact_date}</p>
                )}
                <Select value={p.status} onValueChange={(v) => updateStatus(p.id, v)}>
                  <SelectTrigger className="w-full sm:w-[220px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </SellerLayout>
  );
};

export default SellerProspects;
