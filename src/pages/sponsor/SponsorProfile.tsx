import { useEffect, useState } from 'react';
import SponsorLayout, { useSponsor } from '@/components/sponsor/SponsorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

const Inner = () => {
  const { sponsor } = useSponsor();
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (sponsor) {
      supabase.from('sponsors').select('*').eq('id', sponsor.id).single().then(({ data }) => setForm(data));
    }
  }, [sponsor]);

  if (!form) return null;

  const update = (k: string, v: any) => setForm({ ...form, [k]: v });

  const uploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileName = `logos/${sponsor!.id}-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('sponsor-assets').upload(fileName, file);
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from('sponsor-assets').getPublicUrl(fileName);
    update('logo_url', data.publicUrl);
    setUploading(false);
    toast.success('Logo subido');
  };

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from('sponsors').update({
      brand_name: form.brand_name,
      contact_person: form.contact_person,
      email: form.email,
      phone: form.phone,
      website: form.website,
      instagram: form.instagram,
      facebook: form.facebook,
      tiktok: form.tiktok,
      logo_url: form.logo_url,
      description: form.description,
      industry: form.industry,
    }).eq('id', form.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Perfil actualizado');
  };

  return (
    <Card>
      <CardHeader><CardTitle>Información de la marca</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {form.logo_url && <img src={form.logo_url} alt="Logo" className="h-20 w-20 object-contain rounded border bg-muted" />}
          <div>
            <Label>Logo</Label>
            <div className="mt-1">
              <Input id="logo" type="file" accept="image/*" onChange={uploadLogo} className="hidden" />
              <Button asChild variant="outline" size="sm" disabled={uploading}>
                <label htmlFor="logo" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Subiendo...' : 'Subir logo'}
                </label>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><Label>Nombre de la marca *</Label><Input value={form.brand_name || ''} onChange={(e) => update('brand_name', e.target.value)} /></div>
          <div><Label>Industria</Label><Input value={form.industry || ''} onChange={(e) => update('industry', e.target.value)} placeholder="Bebidas, telco, banca..." /></div>
          <div><Label>Persona de contacto</Label><Input value={form.contact_person || ''} onChange={(e) => update('contact_person', e.target.value)} /></div>
          <div><Label>Email</Label><Input value={form.email || ''} onChange={(e) => update('email', e.target.value)} /></div>
          <div><Label>Teléfono</Label><Input value={form.phone || ''} onChange={(e) => update('phone', e.target.value)} /></div>
          <div><Label>Sitio web</Label><Input value={form.website || ''} onChange={(e) => update('website', e.target.value)} /></div>
          <div><Label>Instagram</Label><Input value={form.instagram || ''} onChange={(e) => update('instagram', e.target.value)} placeholder="@marca" /></div>
          <div><Label>Facebook</Label><Input value={form.facebook || ''} onChange={(e) => update('facebook', e.target.value)} /></div>
          <div><Label>TikTok</Label><Input value={form.tiktok || ''} onChange={(e) => update('tiktok', e.target.value)} placeholder="@marca" /></div>
        </div>

        <div>
          <Label>Descripción</Label>
          <Textarea value={form.description || ''} onChange={(e) => update('description', e.target.value)} rows={3} />
        </div>

        <Button onClick={save} disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</Button>
      </CardContent>
    </Card>
  );
};

const SponsorProfile = () => (
  <SponsorLayout title="Mi Perfil" subtitle="Configura los datos de tu marca">
    <Inner />
  </SponsorLayout>
);

export default SponsorProfile;
