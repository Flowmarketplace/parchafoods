import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import SellerLayout from '@/components/seller/SellerLayout';
import { useSeller } from '@/hooks/useSeller';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const SellerProfile = () => {
  const { seller, setSeller, loading } = useSeller();
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', document_id: '', notes: '' });

  useEffect(() => {
    if (seller) {
      setForm({
        full_name: seller.full_name || '',
        phone: seller.phone || '',
        email: seller.email || '',
        document_id: (seller as any).document_id || '',
        notes: seller.notes || '',
      });
    }
  }, [seller]);

  const save = async () => {
    if (!seller) return;
    const { error } = await supabase.from('sellers').update(form).eq('id', seller.id);
    if (error) return toast.error('No se pudo guardar');
    setSeller({ ...seller, ...form });
    toast.success('Perfil actualizado');
  };

  return (
    <SellerLayout title="Mi Perfil" description="Datos del vendedor">
      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Cargando...</div>
      ) : (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Información</CardTitle>
            <CardDescription>Tu comisión es del {seller?.commission_percentage ?? 25}% y la define el administrador.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div><Label>Nombre</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
            <div><Label>Correo</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><Label>Teléfono</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div><Label>Documento</Label><Input value={form.document_id} onChange={(e) => setForm({ ...form, document_id: e.target.value })} /></div>
            <div><Label>Notas</Label><Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            <Button className="w-full" onClick={save}>Guardar</Button>
          </CardContent>
        </Card>
      )}
    </SellerLayout>
  );
};

export default SellerProfile;
