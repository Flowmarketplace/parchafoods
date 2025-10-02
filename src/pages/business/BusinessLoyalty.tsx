import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Gift, Upload, Award, Download, QrCode } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import QRCode from 'qrcode';

interface LoyaltyConfig {
  loyalty_enabled: boolean;
  loyalty_points_per_scan: number;
  loyalty_points_to_redeem: number;
  loyalty_reward_image: string | null;
  loyalty_reward_description: string | null;
}

const BusinessLoyalty = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [businessId, setBusinessId] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [formData, setFormData] = useState<LoyaltyConfig>({
    loyalty_enabled: false,
    loyalty_points_per_scan: 1,
    loyalty_points_to_redeem: 10,
    loyalty_reward_image: null,
    loyalty_reward_description: null
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
        .select(`
          id,
          loyalty_enabled,
          loyalty_points_per_scan,
          loyalty_points_to_redeem,
          loyalty_reward_image,
          loyalty_reward_description
        `)
        .eq('owner_id', user.id)
        .single();

      if (!business) {
        navigate('/business-setup');
        return;
      }

      setBusinessId(business.id);
      setFormData({
        loyalty_enabled: business.loyalty_enabled || false,
        loyalty_points_per_scan: business.loyalty_points_per_scan || 1,
        loyalty_points_to_redeem: business.loyalty_points_to_redeem || 10,
        loyalty_reward_image: business.loyalty_reward_image,
        loyalty_reward_description: business.loyalty_reward_description
      });

      // Generate QR code for loyalty
      await generateQRCode(business.id);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (businessId: string) => {
    try {
      const qrData = `loyalty:${businessId}:${Date.now()}`;
      const url = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `loyalty-qr-${businessId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Descargado",
      description: "Imprime este código para que tus clientes acumulen puntos",
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const file = e.target.files[0];

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/loyalty-reward/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('business-content')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('business-content')
        .getPublicUrl(fileName);

      setFormData({ ...formData, loyalty_reward_image: publicUrl });

      toast({
        title: "¡Imagen subida!",
        description: "La imagen del premio se ha subido correctamente",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          loyalty_enabled: formData.loyalty_enabled,
          loyalty_points_per_scan: formData.loyalty_points_per_scan,
          loyalty_points_to_redeem: formData.loyalty_points_to_redeem,
          loyalty_reward_image: formData.loyalty_reward_image,
          loyalty_reward_description: formData.loyalty_reward_description
        })
        .eq('id', businessId);

      if (error) throw error;

      toast({
        title: "¡Configuración guardada!",
        description: "Tu programa de lealtad ha sido actualizado",
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar la configuración",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/business-dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Programa de Lealtad
              </CardTitle>
              <CardDescription>
                Configura un sistema de puntos para recompensar a tus clientes frecuentes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled"
                  checked={formData.loyalty_enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, loyalty_enabled: checked })}
                />
                <Label htmlFor="enabled" className="font-semibold">
                  Activar programa de lealtad
                </Label>
              </div>

              {formData.loyalty_enabled && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="points_per_scan">Puntos por escaneo/compra *</Label>
                      <Input
                        id="points_per_scan"
                        type="number"
                        min="1"
                        max="100"
                        value={formData.loyalty_points_per_scan}
                        onChange={(e) => setFormData({ ...formData, loyalty_points_per_scan: parseInt(e.target.value) || 1 })}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Cuántos puntos gana el cliente por cada compra o escaneo de QR
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="points_to_redeem">Puntos para canjear premio *</Label>
                      <Input
                        id="points_to_redeem"
                        type="number"
                        min="1"
                        max="1000"
                        value={formData.loyalty_points_to_redeem}
                        onChange={(e) => setFormData({ ...formData, loyalty_points_to_redeem: parseInt(e.target.value) || 10 })}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Puntos necesarios para que el cliente pueda canjear el premio
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reward_description">Descripción del premio *</Label>
                    <Textarea
                      id="reward_description"
                      value={formData.loyalty_reward_description || ''}
                      onChange={(e) => setFormData({ ...formData, loyalty_reward_description: e.target.value })}
                      placeholder="Ej: Bebida gratis, 10% descuento, postre cortesía, etc."
                      rows={3}
                      required={formData.loyalty_enabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reward_image">Imagen del premio</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Sube una imagen atractiva del premio que recibirán al completar los puntos
                    </p>
                    <Input
                      id="reward_image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="cursor-pointer"
                    />
                    {uploading && <p className="text-sm text-muted-foreground mt-2">Subiendo...</p>}
                    {formData.loyalty_reward_image && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Vista previa:</p>
                        <div className="relative max-w-md">
                          <img
                            src={formData.loyalty_reward_image}
                            alt="Premio"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Gift className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                          Ejemplo de configuración:
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          Si configuras <strong>1 punto por compra</strong> y <strong>10 puntos para canjear</strong>, 
                          el cliente deberá realizar 10 compras para obtener su premio.
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          Con tu configuración actual: <strong>{formData.loyalty_points_to_redeem / formData.loyalty_points_per_scan} compras</strong> necesarias para el premio.
                        </p>
                      </div>
                    </div>
                  </div>

                  {qrCodeUrl && (
                    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <QrCode className="h-5 w-5" />
                          Código QR de Lealtad
                        </CardTitle>
                        <CardDescription>
                          Imprime o muestra este código para que tus clientes acumulen puntos
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-col items-center gap-4">
                          <div className="bg-white p-4 rounded-lg shadow-md">
                            <img 
                              src={qrCodeUrl} 
                              alt="QR Code de Lealtad" 
                              className="w-64 h-64"
                            />
                          </div>
                          <Button 
                            type="button"
                            onClick={downloadQRCode}
                            className="gap-2"
                            variant="outline"
                          >
                            <Download className="h-4 w-4" />
                            Descargar QR
                          </Button>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>Cómo funciona:</strong> Los clientes escanean este código con la app para acumular {formData.loyalty_points_per_scan} punto(s) por visita. Al llegar a {formData.loyalty_points_to_redeem} puntos, pueden canjear su premio.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving || uploading} size="lg">
              {saving ? 'Guardando...' : 'Guardar Configuración'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessLoyalty;
