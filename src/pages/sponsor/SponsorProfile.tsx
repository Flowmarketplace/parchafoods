import { useEffect, useState } from 'react';
import SponsorLayout, { useSponsor } from '@/components/sponsor/SponsorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Upload, X, Bell, Building2, Mail, Phone, Globe, Instagram, Facebook,
  Info, Image as ImageIcon, User, Sparkles,
} from 'lucide-react';

const Inner = () => {
  const { sponsor, refresh } = useSponsor() as any;
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (sponsor) {
      supabase.from('sponsors').select('*').eq('id', sponsor.id).single().then(({ data }) => setForm(data));
    }
  }, [sponsor]);

  if (!form) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const update = (k: string, v: any) => setForm({ ...form, [k]: v });

  const uploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('El logo debe pesar menos de 2MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Debe ser una imagen');
      return;
    }
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `logos/${sponsor!.id}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from('sponsor-assets')
      .upload(fileName, file, { cacheControl: '3600', upsert: true });
    if (error) {
      toast.error(error.message);
      setUploading(false);
      e.target.value = '';
      return;
    }
    const { data } = supabase.storage.from('sponsor-assets').getPublicUrl(fileName);
    update('logo_url', data.publicUrl);
    setUploading(false);
    e.target.value = '';
    toast.success('Logo subido. No olvides guardar.');
  };

  const save = async () => {
    if (!form.brand_name?.trim()) {
      toast.error('El nombre de la marca es obligatorio');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('sponsors').update({
      brand_name: form.brand_name?.trim(),
      contact_person: form.contact_person?.trim() || null,
      email: form.email?.trim() || null,
      phone: form.phone?.trim() || null,
      website: form.website?.trim() || null,
      instagram: form.instagram?.trim() || null,
      facebook: form.facebook?.trim() || null,
      tiktok: form.tiktok?.trim() || null,
      logo_url: form.logo_url || null,
      description: form.description?.trim() || null,
      industry: form.industry?.trim() || null,
    }).eq('id', form.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Perfil actualizado correctamente');
    if (typeof refresh === 'function') refresh();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Logo + brand identity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ImageIcon className="h-4 w-4 text-primary" /> Identidad de marca
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Tu logo y nombre aparecerán en cada notificación push que envíes a los usuarios.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="relative">
                {form.logo_url ? (
                  <div className="relative h-24 w-24 rounded-xl border-2 border-dashed bg-muted overflow-hidden">
                    <img src={form.logo_url} alt="Logo" className="h-full w-full object-contain p-1" />
                    <button
                      type="button"
                      onClick={() => update('logo_url', '')}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 hover:bg-destructive/80"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-xl border-2 border-dashed bg-muted flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Label>Logo de la marca</Label>
                <div>
                  <Input id="logo" type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadLogo} className="hidden" />
                  <Button asChild variant="outline" size="sm" disabled={uploading}>
                    <label htmlFor="logo" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? 'Subiendo...' : (form.logo_url ? 'Cambiar logo' : 'Subir logo')}
                    </label>
                  </Button>
                </div>
                <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>Recomendado: <strong>cuadrado 512×512 px</strong>, PNG con fondo transparente, máx 2MB.</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div>
                <Label>Nombre de la marca *</Label>
                <Input
                  value={form.brand_name || ''}
                  onChange={(e) => update('brand_name', e.target.value)}
                  placeholder="Ej: Coca-Cola"
                />
              </div>
              <div>
                <Label>Industria</Label>
                <Input
                  value={form.industry || ''}
                  onChange={(e) => update('industry', e.target.value)}
                  placeholder="Bebidas, telco, banca..."
                />
              </div>
            </div>

            <div>
              <Label>Descripción de la marca</Label>
              <Textarea
                value={form.description || ''}
                onChange={(e) => update('description', e.target.value)}
                rows={3}
                placeholder="Cuéntanos brevemente sobre tu marca y propuesta de valor..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-primary" /> Información de contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Persona de contacto</Label>
              <Input
                value={form.contact_person || ''}
                onChange={(e) => update('contact_person', e.target.value)}
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <Label className="flex items-center gap-1"><Mail className="h-3 w-3" /> Email</Label>
              <Input
                type="email"
                value={form.email || ''}
                onChange={(e) => update('email', e.target.value)}
                placeholder="contacto@marca.com"
              />
            </div>
            <div>
              <Label className="flex items-center gap-1"><Phone className="h-3 w-3" /> Teléfono</Label>
              <Input
                value={form.phone || ''}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="+57 300 000 0000"
              />
            </div>
            <div>
              <Label className="flex items-center gap-1"><Globe className="h-3 w-3" /> Sitio web</Label>
              <Input
                value={form.website || ''}
                onChange={(e) => update('website', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Social */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" /> Redes sociales
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label className="flex items-center gap-1"><Instagram className="h-3 w-3" /> Instagram</Label>
              <Input
                value={form.instagram || ''}
                onChange={(e) => update('instagram', e.target.value)}
                placeholder="@marca"
              />
            </div>
            <div>
              <Label className="flex items-center gap-1"><Facebook className="h-3 w-3" /> Facebook</Label>
              <Input
                value={form.facebook || ''}
                onChange={(e) => update('facebook', e.target.value)}
                placeholder="facebook.com/marca"
              />
            </div>
            <div>
              <Label>TikTok</Label>
              <Input
                value={form.tiktok || ''}
                onChange={(e) => update('tiktok', e.target.value)}
                placeholder="@marca"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 sticky bottom-4 z-10">
          <Button onClick={save} disabled={saving} size="lg" className="shadow-lg">
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </div>

      {/* Live preview - notification */}
      <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" /> Vista previa en notificaciones
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Así te verán los usuarios cuando reciban tus campañas push.
            </p>
          </CardHeader>
          <CardContent>
            {/* Mini phone notification */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-3 shadow-xl">
              <div className="bg-white/95 rounded-xl shadow-lg overflow-hidden">
                <div className="flex items-center gap-2 px-3 pt-2.5 pb-1.5">
                  <div className="h-6 w-6 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {form.logo_url ? (
                      <img src={form.logo_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Bell className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-wide flex-1 truncate">
                    {form.brand_name || 'Tu marca'}
                  </span>
                  <span className="text-[10px] text-slate-500">ahora</span>
                </div>
                <div className="px-3 pb-3 space-y-1">
                  <p className="text-[11px] font-bold text-slate-900">¡Promoción exclusiva!</p>
                  <p className="text-[10px] text-slate-700">
                    Texto de ejemplo de tu próxima notificación push.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-lg bg-muted/50 space-y-2 text-xs">
              <p className="font-semibold text-foreground">Estado de la marca</p>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Cuenta:</span>
                <Badge variant={sponsor?.status === 'aprobado' ? 'default' : 'secondary'}>
                  {sponsor?.status || 'pendiente'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Logo:</span>
                <span className={form.logo_url ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>
                  {form.logo_url ? '✓ Cargado' : 'Sin logo'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Datos completos:</span>
                <span className={form.email && form.phone ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>
                  {form.email && form.phone ? '✓ Listo' : 'Faltan datos'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const SponsorProfile = () => (
  <SponsorLayout title="Mi Perfil" subtitle="Estos datos aparecen en tus campañas y notificaciones push">
    <Inner />
  </SponsorLayout>
);

export default SponsorProfile;
