import { useEffect, useState } from 'react';
import SponsorLayout, { useSponsor } from '@/components/sponsor/SponsorLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Send, Trash2, Bell, ExternalLink, MessageCircle, Phone, MapPin, MessageSquare, AlertCircle } from 'lucide-react';
import { z } from 'zod';

// CTA validators per action type
const ctaValueSchema = (type: string) => {
  switch (type) {
    case 'url':
      return z.string().trim().url({ message: 'Debe ser una URL válida (https://...)' }).max(500);
    case 'whatsapp':
      // E.164-ish: optional +, 8-15 digits
      return z.string().trim().regex(/^\+?\d{8,15}$/, { message: 'Número WhatsApp inválido (8-15 dígitos, opcional +)' });
    case 'call':
      return z.string().trim().regex(/^\+?[\d\s\-()]{7,20}$/, { message: 'Teléfono inválido' });
    case 'message':
      return z.string().trim().min(2, { message: 'Escribe el mensaje a enviar' }).max(300, { message: 'Máximo 300 caracteres' });
    case 'place':
      return z.string().trim().uuid({ message: 'Debe ser un ID de lugar válido (UUID)' });
    default:
      return z.string().trim().min(1);
  }
};

const ctaPlaceholders: Record<string, string> = {
  url: 'https://miempresa.com/promo',
  whatsapp: '+573001234567',
  call: '+57 300 123 4567',
  message: 'Hola, me interesa tu promoción',
  place: 'uuid del restaurante en la app',
};

const ctaHints: Record<string, string> = {
  url: 'Abre el enlace en el navegador del usuario.',
  whatsapp: 'Abre WhatsApp con el número precargado.',
  call: 'Inicia una llamada al número.',
  message: 'Envía un mensaje directo dentro de la app.',
  place: 'Lleva al usuario a la ficha del restaurante.',
};

const ctaIcons: Record<string, any> = { url: ExternalLink, whatsapp: MessageCircle, call: Phone, message: MessageSquare, place: MapPin };

const campaignSchema = z.object({
  title: z.string().trim().min(3, { message: 'El título debe tener al menos 3 caracteres' }).max(60),
  message: z.string().trim().min(10, { message: 'El mensaje debe tener al menos 10 caracteres' }).max(180),
  image_url: z.string().trim().url({ message: 'URL de imagen inválida' }).max(500).optional().or(z.literal('')),
});

const audienceLabel: Record<string, string> = {
  businesses: 'Restaurantes',
  customers: 'Comensales',
  both: 'Ambos',
};

const statusColor: Record<string, string> = {
  borrador: 'bg-muted text-muted-foreground',
  pendiente: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  aprobada: 'bg-green-500/20 text-green-700 dark:text-green-400',
  rechazada: 'bg-destructive/20 text-destructive',
  enviada: 'bg-primary/20 text-primary',
};

const Inner = () => {
  const { sponsor } = useSponsor();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    message: '',
    image_url: '',
    target_audience: 'both',
    geo_enabled: false,
    geo_latitude: '',
    geo_longitude: '',
    geo_radius_km: '5',
    scheduled_at: '',
    cta_label: '',
    cta_action_type: 'url',
    cta_action_value: '',
  });

  const load = async () => {
    if (!sponsor) return;
    const { data } = await supabase
      .from('sponsor_campaigns')
      .select('*')
      .eq('sponsor_id', sponsor.id)
      .order('created_at', { ascending: false });
    setCampaigns(data || []);
  };

  useEffect(() => { load(); }, [sponsor]);

  const submit = async (status: 'borrador' | 'pendiente') => {
    if (!sponsor) return;
    if (!form.title || !form.message) {
      toast.error('Título y mensaje son obligatorios');
      return;
    }
    const payload: any = {
      sponsor_id: sponsor.id,
      title: form.title,
      message: form.message,
      image_url: form.image_url || null,
      target_audience: form.target_audience,
      geo_enabled: form.geo_enabled,
      geo_latitude: form.geo_enabled && form.geo_latitude ? Number(form.geo_latitude) : null,
      geo_longitude: form.geo_enabled && form.geo_longitude ? Number(form.geo_longitude) : null,
      geo_radius_km: form.geo_enabled ? Number(form.geo_radius_km || 5) : null,
      scheduled_at: form.scheduled_at || null,
      cta_label: form.cta_label || null,
      cta_action_type: form.cta_action_type || null,
      cta_action_value: form.cta_action_value || null,
      status,
    };
    const { error } = await supabase.from('sponsor_campaigns').insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success(status === 'borrador' ? 'Borrador guardado' : 'Campaña enviada para aprobación');
    setOpen(false);
    setForm({
      title: '', message: '', image_url: '', target_audience: 'both',
      geo_enabled: false, geo_latitude: '', geo_longitude: '', geo_radius_km: '5',
      scheduled_at: '', cta_label: '', cta_action_type: 'url', cta_action_value: '',
    });
    load();
  };

  const submitForApproval = async (id: string) => {
    const { error } = await supabase.from('sponsor_campaigns').update({ status: 'pendiente' }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Enviada para aprobación');
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar campaña?')) return;
    await supabase.from('sponsor_campaigns').delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{campaigns.length} campañas</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Nueva campaña</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Nueva campaña push</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Título *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={60} />
              </div>
              <div>
                <Label>Mensaje *</Label>
                <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} maxLength={180} />
              </div>
              <div>
                <Label>Imagen (URL opcional)</Label>
                <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
              </div>
              <div>
                <Label>Público objetivo</Label>
                <Select value={form.target_audience} onValueChange={(v) => setForm({ ...form, target_audience: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="businesses">Restaurantes inscritos</SelectItem>
                    <SelectItem value="customers">Comensales / Clientes</SelectItem>
                    <SelectItem value="both">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 rounded border">
                <div>
                  <Label className="cursor-pointer">Segmentación geográfica</Label>
                  <p className="text-xs text-muted-foreground">Enviar solo a usuarios en una zona específica</p>
                </div>
                <Switch checked={form.geo_enabled} onCheckedChange={(v) => setForm({ ...form, geo_enabled: v })} />
              </div>

              {form.geo_enabled && (
                <div className="grid grid-cols-3 gap-2">
                  <div><Label className="text-xs">Latitud</Label><Input value={form.geo_latitude} onChange={(e) => setForm({ ...form, geo_latitude: e.target.value })} placeholder="4.6097" /></div>
                  <div><Label className="text-xs">Longitud</Label><Input value={form.geo_longitude} onChange={(e) => setForm({ ...form, geo_longitude: e.target.value })} placeholder="-74.0817" /></div>
                  <div><Label className="text-xs">Radio (km)</Label><Input type="number" value={form.geo_radius_km} onChange={(e) => setForm({ ...form, geo_radius_km: e.target.value })} /></div>
                </div>
              )}

              <div>
                <Label>Programar envío (opcional)</Label>
                <Input type="datetime-local" value={form.scheduled_at} onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })} />
              </div>

              <div className="border-t pt-4 space-y-3">
                <Label className="text-base">Botón de acción (CTA)</Label>
                <Input placeholder="Texto del botón (ej: Ver oferta)" value={form.cta_label} onChange={(e) => setForm({ ...form, cta_label: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <Select value={form.cta_action_type} onValueChange={(v) => setForm({ ...form, cta_action_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="url">Abrir URL</SelectItem>
                      <SelectItem value="message">Mensaje directo</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="call">Llamada</SelectItem>
                      <SelectItem value="place">Ver lugar en app</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Valor (URL, número, ID...)" value={form.cta_action_value} onChange={(e) => setForm({ ...form, cta_action_value: e.target.value })} />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => submit('borrador')} className="flex-1">Guardar borrador</Button>
                <Button onClick={() => submit('pendiente')} className="flex-1"><Send className="h-4 w-4 mr-2" />Enviar para aprobación</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {campaigns.length === 0 && (
          <Card><CardContent className="p-8 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            Aún no tienes campañas. Crea la primera.
          </CardContent></Card>
        )}
        {campaigns.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold">{c.title}</h3>
                    <Badge className={statusColor[c.status]}>{c.status}</Badge>
                    <Badge variant="outline">{audienceLabel[c.target_audience]}</Badge>
                    {c.geo_enabled && <Badge variant="outline">📍 Geo</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{c.message}</p>
                  {c.cta_label && <p className="text-xs mt-2">CTA: <strong>{c.cta_label}</strong> ({c.cta_action_type})</p>}
                  {c.scheduled_at && <p className="text-xs text-muted-foreground mt-1">Programada: {new Date(c.scheduled_at).toLocaleString('es-CO')}</p>}
                  {c.rejection_reason && <p className="text-xs text-destructive mt-1">Motivo rechazo: {c.rejection_reason}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  {c.status === 'borrador' && (
                    <Button size="sm" variant="outline" onClick={() => submitForApproval(c.id)}>
                      <Send className="h-3 w-3 mr-1" /> Enviar
                    </Button>
                  )}
                  {(c.status === 'borrador' || c.status === 'rechazada') && (
                    <Button size="sm" variant="ghost" onClick={() => remove(c.id)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const SponsorCampaigns = () => (
  <SponsorLayout title="Campañas Push" subtitle="Crea y gestiona tus notificaciones">
    <Inner />
  </SponsorLayout>
);

export default SponsorCampaigns;
