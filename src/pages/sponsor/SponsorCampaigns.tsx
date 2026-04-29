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
import { Plus, Send, Trash2, Bell, ExternalLink, MessageCircle, Phone, MapPin, MessageSquare, AlertCircle, Upload, X, Info } from 'lucide-react';
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
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sponsor) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe pesar menos de 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen');
      return;
    }
    setUploadingImage(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${sponsor.id}/campaigns/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('sponsor-assets')
        .upload(path, file, { cacheControl: '3600', upsert: false });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from('sponsor-assets').getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: pub.publicUrl }));
      toast.success('Imagen subida');
    } catch (err: any) {
      toast.error(err.message || 'Error al subir imagen');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

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

  // Live validation for CTA value
  const ctaValueError = (() => {
    if (!form.cta_label && !form.cta_action_value) return null; // CTA is optional
    if (form.cta_label && !form.cta_action_value) return 'Falta el valor del CTA';
    if (form.cta_action_value && !form.cta_label) return 'Falta el texto del botón';
    if (!form.cta_action_value) return null;
    const result = ctaValueSchema(form.cta_action_type).safeParse(form.cta_action_value);
    return result.success ? null : result.error.errors[0].message;
  })();

  const ctaLabelError = form.cta_label && form.cta_label.length > 30 ? 'Máximo 30 caracteres' : null;

  const submit = async (status: 'borrador' | 'pendiente') => {
    if (!sponsor) return;

    // Base validation (skip for borrador? we still validate, but allow empty CTA)
    const baseResult = campaignSchema.safeParse({
      title: form.title,
      message: form.message,
      image_url: form.image_url,
    });
    if (!baseResult.success) {
      toast.error(baseResult.error.errors[0].message);
      return;
    }

    // Geo validation
    if (form.geo_enabled) {
      const lat = Number(form.geo_latitude);
      const lng = Number(form.geo_longitude);
      const rad = Number(form.geo_radius_km);
      if (!form.geo_latitude || !form.geo_longitude || isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        toast.error('Coordenadas geográficas inválidas');
        return;
      }
      if (isNaN(rad) || rad <= 0 || rad > 100) {
        toast.error('El radio debe estar entre 0.1 y 100 km');
        return;
      }
    }

    // Scheduled date must be in the future (only when sending for approval)
    if (status === 'pendiente' && form.scheduled_at) {
      const scheduled = new Date(form.scheduled_at);
      if (scheduled.getTime() < Date.now()) {
        toast.error('La fecha programada debe ser futura');
        return;
      }
    }

    // CTA validation (only if user started filling it)
    if (form.cta_label || form.cta_action_value) {
      if (ctaLabelError) { toast.error(ctaLabelError); return; }
      if (ctaValueError) { toast.error(ctaValueError); return; }
    }

    const payload: any = {
      sponsor_id: sponsor.id,
      title: form.title.trim(),
      message: form.message.trim(),
      image_url: form.image_url?.trim() || null,
      target_audience: form.target_audience,
      geo_enabled: form.geo_enabled,
      geo_latitude: form.geo_enabled && form.geo_latitude ? Number(form.geo_latitude) : null,
      geo_longitude: form.geo_enabled && form.geo_longitude ? Number(form.geo_longitude) : null,
      geo_radius_km: form.geo_enabled ? Number(form.geo_radius_km || 5) : null,
      scheduled_at: form.scheduled_at || null,
      cta_label: form.cta_label?.trim() || null,
      cta_action_type: form.cta_label ? form.cta_action_type : null,
      cta_action_value: form.cta_action_value?.trim() || null,
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
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Nueva campaña push</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">
              {/* FORM */}
              <div className="space-y-4">
              <div>
                <Label>Título *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={60} />
                <p className="text-xs text-muted-foreground mt-1">{form.title.length}/60</p>
              </div>
              <div>
                <Label>Mensaje *</Label>
                <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} maxLength={180} />
                <p className="text-xs text-muted-foreground mt-1">{form.message.length}/180</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Imagen de la campaña</Label>
                  {form.image_url && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-destructive hover:text-destructive"
                      onClick={() => setForm({ ...form, image_url: '' })}
                    >
                      <X className="h-3 w-3 mr-1" /> Quitar
                    </Button>
                  )}
                </div>

                {form.image_url ? (
                  <div className="relative rounded-lg border overflow-hidden bg-muted">
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="w-full h-32 object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                ) : (
                  <label
                    htmlFor="campaign-image-upload"
                    className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {uploadingImage ? 'Subiendo...' : 'Adjuntar imagen'}
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG o WEBP · Máx 5MB</p>
                  </label>
                )}
                <input
                  id="campaign-image-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />

                <div className="text-xs text-muted-foreground space-y-1">
                  <Input
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    placeholder="O pega una URL: https://..."
                    className="h-8 text-xs"
                  />
                </div>

                <div className="flex items-start gap-2 p-3 rounded-md bg-primary/5 border border-primary/10">
                  <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-foreground">Medidas recomendadas</p>
                    <ul className="text-muted-foreground space-y-0.5">
                      <li>• <strong>Tamaño:</strong> 1200 × 600 px (relación 2:1)</li>
                      <li>• <strong>Formato:</strong> PNG o JPG</li>
                      <li>• <strong>Peso:</strong> menos de 1MB para carga rápida</li>
                      <li>• <strong>Zona segura:</strong> centra el contenido importante (algunos dispositivos recortan los bordes)</li>
                    </ul>
                  </div>
                </div>
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
                <div>
                  <Input placeholder="Texto del botón (ej: Ver oferta)" value={form.cta_label} onChange={(e) => setForm({ ...form, cta_label: e.target.value })} maxLength={30} />
                  {ctaLabelError && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{ctaLabelError}</p>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={form.cta_action_type} onValueChange={(v) => setForm({ ...form, cta_action_type: v, cta_action_value: '' })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="url">Abrir URL</SelectItem>
                      <SelectItem value="message">Mensaje directo</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="call">Llamada</SelectItem>
                      <SelectItem value="place">Ver lugar en app</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder={ctaPlaceholders[form.cta_action_type]}
                    value={form.cta_action_value}
                    onChange={(e) => setForm({ ...form, cta_action_value: e.target.value })}
                    className={ctaValueError ? 'border-destructive' : ''}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{ctaHints[form.cta_action_type]}</p>
                {ctaValueError && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{ctaValueError}</p>}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => submit('borrador')} className="flex-1">Guardar borrador</Button>
                <Button
                  onClick={() => submit('pendiente')}
                  className="flex-1"
                  disabled={!!ctaValueError || !!ctaLabelError}
                >
                  <Send className="h-4 w-4 mr-2" />Enviar para aprobación
                </Button>
              </div>
              </div>

              {/* LIVE PREVIEW */}
              <div className="space-y-3 md:sticky md:top-0 md:self-start">
                <Label className="text-xs uppercase text-muted-foreground">Vista previa en móvil</Label>

                {/* Realistic phone mock */}
                <div className="mx-auto w-full max-w-[280px] bg-slate-900 rounded-[2.5rem] p-2 shadow-2xl ring-1 ring-slate-800">
                  {/* Notch */}
                  <div className="relative bg-black rounded-[2rem] overflow-hidden" style={{ aspectRatio: '9/17' }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-b-2xl z-20" />

                    {/* Lock screen background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-amber-600" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
                    <div className="absolute inset-0 bg-black/30" />

                    {/* Status bar */}
                    <div className="relative z-10 flex items-center justify-between px-5 pt-3 pb-1 text-white text-[10px] font-semibold">
                      <span>{new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                      <div className="flex items-center gap-1">
                        <span>•••</span>
                        <span>📶</span>
                        <span>🔋</span>
                      </div>
                    </div>

                    {/* Time/date */}
                    <div className="relative z-10 text-center text-white pt-4 pb-3">
                      <p className="text-[10px] font-medium opacity-90 uppercase tracking-wide">
                        {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </p>
                      <p className="text-4xl font-light tracking-tight mt-0.5">
                        {new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </p>
                    </div>

                    {/* Notification card */}
                    <div className="relative z-10 px-3 pt-2">
                      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center gap-2 px-3 pt-2.5 pb-1.5">
                          <div className="h-5 w-5 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                            <Bell className="h-2.5 w-2.5 text-white" />
                          </div>
                          <span className="text-[9px] font-semibold text-slate-700 uppercase tracking-wide flex-1 truncate">
                            Sabor 360
                          </span>
                          <span className="text-[9px] text-slate-500">ahora</span>
                        </div>

                        {/* Content */}
                        <div className="px-3 pb-2.5 space-y-1">
                          <p className="text-[11px] font-bold text-slate-900 leading-tight line-clamp-2">
                            {form.title || 'Título de la notificación'}
                          </p>
                          <p className="text-[10px] text-slate-700 leading-snug line-clamp-3">
                            {form.message || 'Aquí aparecerá el mensaje de tu notificación push.'}
                          </p>
                        </div>

                        {/* Big picture (expanded notification style) */}
                        {form.image_url && (
                          <div className="bg-slate-100">
                            <img
                              src={form.image_url}
                              alt=""
                              className="w-full object-cover"
                              style={{ aspectRatio: '2/1' }}
                              onError={(e) => {
                                const el = e.target as HTMLImageElement;
                                el.parentElement!.style.display = 'none';
                              }}
                            />
                          </div>
                        )}

                        {/* CTA */}
                        {form.cta_label && form.cta_action_value && !ctaValueError && !ctaLabelError && (
                          <div className="px-3 pb-3 pt-2">
                            <div className="w-full inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-primary to-secondary text-white text-[10px] font-semibold rounded-lg px-3 py-2 shadow-sm">
                              {(() => {
                                const I = ctaIcons[form.cta_action_type] || ExternalLink;
                                return <I className="h-3 w-3" />;
                              })()}
                              {form.cta_label}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Stacked older notification hint */}
                      <div className="bg-white/40 backdrop-blur-sm h-2 mx-3 -mt-1 rounded-b-xl" />
                      <div className="bg-white/25 backdrop-blur-sm h-1.5 mx-5 -mt-0.5 rounded-b-xl" />
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="text-xs space-y-1 p-3 rounded-lg border bg-muted/30">
                  <p><strong>Audiencia:</strong> {audienceLabel[form.target_audience]}</p>
                  {form.geo_enabled && form.geo_latitude && form.geo_longitude && (
                    <p><strong>Geo:</strong> {form.geo_radius_km}km en torno a ({Number(form.geo_latitude).toFixed(3)}, {Number(form.geo_longitude).toFixed(3)})</p>
                  )}
                  {form.scheduled_at && <p><strong>Envío:</strong> {new Date(form.scheduled_at).toLocaleString('es-CO')}</p>}
                  {form.cta_label && form.cta_action_value && !ctaValueError && (
                    <p><strong>Acción:</strong> {form.cta_action_type} → <span className="break-all">{form.cta_action_value}</span></p>
                  )}
                </div>
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
