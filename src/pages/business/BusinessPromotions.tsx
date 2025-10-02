import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Pencil, Trash2, QrCode as QrCodeIcon, Download } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import QRCode from 'qrcode';

interface Promotion {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  conditions: string | null;
  valid_until: string | null;
  qr_code: string | null;
  first_time_only: boolean;
  max_redemptions_per_user: number;
  active: boolean;
}

const BusinessPromotions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [businessId, setBusinessId] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    conditions: '',
    valid_until: '',
    image_url: '',
    first_time_only: false,
    max_redemptions_per_user: 1,
    active: true
  });

  useEffect(() => {
    loadBusiness();
  }, []);

  const loadBusiness = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (!business) {
        navigate('/business-setup');
        return;
      }

      setBusinessId(business.id);
      await loadPromotions(business.id);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPromotions = async (busId: string) => {
    const { data, error } = await supabase
      .from('business_promotions')
      .select('*')
      .eq('business_id', busId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading promotions:', error);
    } else {
      setPromotions(data || []);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const file = e.target.files[0];

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/promo-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('business-content')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('business-content')
        .getPublicUrl(fileName);

      setFormData({ ...formData, image_url: publicUrl });

      toast({
        title: "¡Imagen subida!",
        description: "La imagen se ha agregado a la promoción",
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo subir la imagen",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const generateQRCode = () => {
    // Generate a unique QR code identifier with timestamp and random component
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `PROMO-${businessId.slice(0, 8)}-${timestamp}-${random}`;
  };

  const downloadQRCode = async (qrCode: string, title: string) => {
    try {
      const canvas = document.createElement('canvas');
      await QRCode.toCanvas(canvas, qrCode, {
        width: 512,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `QR-${title.replace(/\s+/g, '-')}.png`;
      link.href = url;
      link.click();
      
      toast({
        title: "¡QR descargado!",
        description: "El código QR se ha descargado correctamente",
      });
    } catch (error) {
      console.error('Error downloading QR:', error);
      toast({
        title: "Error",
        description: "No se pudo descargar el código QR",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPromo) {
        const { error } = await supabase
          .from('business_promotions')
          .update({
            title: formData.title,
            description: formData.description,
            conditions: formData.conditions || null,
            valid_until: formData.valid_until || null,
            image_url: formData.image_url || null,
            first_time_only: formData.first_time_only,
            max_redemptions_per_user: formData.max_redemptions_per_user,
            active: formData.active
          })
          .eq('id', editingPromo.id);

        if (error) throw error;

        toast({
          title: "¡Promoción actualizada!",
          description: "La promoción ha sido actualizada correctamente",
        });
      } else {
        const qrCode = generateQRCode();
        
        const { error } = await supabase
          .from('business_promotions')
          .insert({
            business_id: businessId,
            title: formData.title,
            description: formData.description,
            conditions: formData.conditions || null,
            valid_until: formData.valid_until || null,
            image_url: formData.image_url || null,
            qr_code: qrCode,
            first_time_only: formData.first_time_only,
            max_redemptions_per_user: formData.max_redemptions_per_user,
            active: formData.active
          });

        if (error) throw error;

        toast({
          title: "¡Promoción creada!",
          description: "La promoción ha sido creada con código QR único",
        });
      }

      setDialogOpen(false);
      resetForm();
      await loadPromotions(businessId);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar la promoción",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (promo: Promotion) => {
    setEditingPromo(promo);
    setFormData({
      title: promo.title,
      description: promo.description,
      conditions: promo.conditions || '',
      valid_until: promo.valid_until || '',
      image_url: promo.image_url || '',
      first_time_only: promo.first_time_only,
      max_redemptions_per_user: promo.max_redemptions_per_user,
      active: promo.active
    });
    setDialogOpen(true);
  };

  const handleDelete = async (promoId: string) => {
    try {
      const { error } = await supabase
        .from('business_promotions')
        .delete()
        .eq('id', promoId);

      if (error) throw error;

      toast({
        title: "Promoción eliminada",
        description: "La promoción ha sido eliminada correctamente",
      });

      await loadPromotions(businessId);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la promoción",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      conditions: '',
      valid_until: '',
      image_url: '',
      first_time_only: false,
      max_redemptions_per_user: 1,
      active: true
    });
    setEditingPromo(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/business-dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Promociones</h1>
            <p className="text-muted-foreground">Crea ofertas especiales con códigos QR únicos</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Promoción
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPromo ? 'Editar' : 'Nueva'} Promoción</DialogTitle>
                <DialogDescription>
                  Completa los detalles de la promoción
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej: 2x1 en platos fuertes"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conditions">Condiciones</Label>
                  <Textarea
                    id="conditions"
                    value={formData.conditions}
                    onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                    placeholder="Ej: Válido de lunes a viernes, no acumulable con otras ofertas"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valid_until">Válido hasta</Label>
                  <Input
                    id="valid_until"
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Imagen de la promoción *</Label>
                  <p className="text-xs text-muted-foreground">
                    Sube una imagen llamativa que muestre tu oferta
                  </p>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="cursor-pointer"
                  />
                  {uploading && <p className="text-sm text-muted-foreground">Subiendo...</p>}
                  {formData.image_url && (
                    <div className="mt-2 space-y-2">
                      <img src={formData.image_url} alt="Preview" className="w-full h-48 rounded-lg object-cover" />
                      <p className="text-xs text-green-600">✓ Imagen lista</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_redemptions">Canjes por usuario *</Label>
                  <Input
                    id="max_redemptions"
                    type="number"
                    min="1"
                    max="999"
                    value={formData.max_redemptions_per_user}
                    onChange={(e) => setFormData({ ...formData, max_redemptions_per_user: parseInt(e.target.value) || 1 })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Número máximo de veces que cada usuario puede canjear esta promoción
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="first_time_only"
                    checked={formData.first_time_only}
                    onCheckedChange={(checked) => setFormData({ ...formData, first_time_only: checked as boolean })}
                  />
                  <Label htmlFor="first_time_only">Solo para clientes nuevos</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <Label htmlFor="active">Promoción activa</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingPromo ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {promotions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <QrCodeIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No tienes promociones activas. Crea la primera para atraer clientes.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {promotions.map((promo) => (
              <Card key={promo.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle>{promo.title}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        {promo.active ? (
                          <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">
                            Activa
                          </span>
                        ) : (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                            Inactiva
                          </span>
                        )}
                        {promo.first_time_only && (
                          <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded">
                            Solo nuevos
                          </span>
                        )}
                        <span className="text-xs bg-purple-500/10 text-purple-500 px-2 py-1 rounded">
                          {promo.max_redemptions_per_user}x por usuario
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" onClick={() => handleEdit(promo)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => handleDelete(promo.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {promo.image_url && (
                    <img src={promo.image_url} alt={promo.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                  )}
                  <p className="text-sm mb-3">{promo.description}</p>
                  {promo.conditions && (
                    <p className="text-xs text-muted-foreground mb-3">
                      <strong>Condiciones:</strong> {promo.conditions}
                    </p>
                  )}
                  {promo.valid_until && (
                    <p className="text-xs text-muted-foreground mb-3">
                      <strong>Válido hasta:</strong> {new Date(promo.valid_until).toLocaleDateString('es-CO')}
                    </p>
                  )}
                  {promo.qr_code && (
                    <div className="bg-muted p-4 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <QrCodeIcon className="h-4 w-4" />
                          <span className="text-sm font-semibold">Código QR</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadQRCode(promo.qr_code!, promo.title)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </Button>
                      </div>
                      <div className="flex items-center justify-center bg-white p-4 rounded">
                        <canvas
                          ref={(canvas) => {
                            if (canvas && promo.qr_code) {
                              QRCode.toCanvas(canvas, promo.qr_code, {
                                width: 200,
                                margin: 1
                              }).catch(console.error);
                            }
                          }}
                        />
                      </div>
                      <p className="text-xs text-center text-muted-foreground">
                        Los clientes escanean este código para canjear la promoción
                      </p>
                      <p className="text-xs text-center font-mono bg-background px-2 py-1 rounded">
                        {promo.qr_code}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessPromotions;
