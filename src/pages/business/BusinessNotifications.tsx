import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Bell, Send, Upload, Calendar, Trash2, Image as ImageIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

interface PushCampaign {
  id: string;
  title: string;
  message: string;
  image_url: string | null;
  scheduled_at: string;
  sent_at: string | null;
  status: 'scheduled' | 'sending' | 'sent' | 'failed' | 'cancelled';
  target_audience: 'all' | 'nearby' | 'loyal_customers';
  sent_count: number;
}

const BusinessNotifications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [businessId, setBusinessId] = useState<string>('');
  const [campaigns, setCampaigns] = useState<PushCampaign[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    image_url: null as string | null,
    scheduled_at: '',
    target_audience: 'all' as 'all' | 'nearby' | 'loyal_customers'
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
        .single();

      if (!business) {
        navigate('/business-setup');
        return;
      }

      setBusinessId(business.id);
      loadCampaigns(business.id);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCampaigns = async (businessId: string) => {
    try {
      const { data, error } = await supabase
        .from('push_campaigns')
        .select('*')
        .eq('business_id', businessId)
        .order('scheduled_at', { ascending: false });

      if (error) throw error;
      setCampaigns((data || []) as PushCampaign[]);
    } catch (error: any) {
      console.error('Error loading campaigns:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las campañas",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const file = e.target.files[0];

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/push-notifications/${Date.now()}.${fileExt}`;

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
        description: "La imagen se ha subido correctamente",
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
    
    if (!formData.title || !formData.message || !formData.scheduled_at) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from('push_campaigns')
        .insert({
          business_id: businessId,
          title: formData.title,
          message: formData.message,
          image_url: formData.image_url,
          scheduled_at: formData.scheduled_at,
          target_audience: formData.target_audience,
          status: 'scheduled'
        });

      if (error) throw error;

      toast({
        title: "¡Campaña creada!",
        description: "Tu notificación push ha sido programada",
      });

      // Reset form
      setFormData({
        title: '',
        message: '',
        image_url: null,
        scheduled_at: '',
        target_audience: 'all'
      });

      // Reload campaigns
      loadCampaigns(businessId);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la campaña",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCampaign = async () => {
    if (!campaignToDelete) return;

    try {
      const { error } = await supabase
        .from('push_campaigns')
        .delete()
        .eq('id', campaignToDelete);

      if (error) throw error;

      toast({
        title: "Campaña eliminada",
        description: "La campaña ha sido eliminada correctamente",
      });

      loadCampaigns(businessId);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la campaña",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setCampaignToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      scheduled: { variant: "outline", label: "Programada" },
      sending: { variant: "secondary", label: "Enviando" },
      sent: { variant: "default", label: "Enviada" },
      failed: { variant: "destructive", label: "Fallida" },
      cancelled: { variant: "outline", label: "Cancelada" }
    };
    
    const config = variants[status] || variants.scheduled;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getAudienceBadge = (audience: string) => {
    const labels: Record<string, string> = {
      all: "Todos los usuarios",
      nearby: "Usuarios cercanos",
      loyal_customers: "Clientes frecuentes"
    };
    return labels[audience] || audience;
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Nueva Campaña de Notificaciones
              </CardTitle>
              <CardDescription>
                Crea una campaña publicitaria mediante notificaciones push
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título de la notificación *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej: ¡Oferta especial del día!"
                    maxLength={50}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.title.length}/50 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Ej: Obtén 20% de descuento en todos nuestros productos hoy"
                    rows={3}
                    maxLength={200}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.message.length}/200 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Imagen (opcional)</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="cursor-pointer"
                  />
                  {uploading && <p className="text-sm text-muted-foreground">Subiendo...</p>}
                  {formData.image_url && (
                    <div className="mt-2">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scheduled_at">Fecha y hora de envío *</Label>
                  <Input
                    id="scheduled_at"
                    type="datetime-local"
                    value={formData.scheduled_at}
                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience">Audiencia objetivo</Label>
                  <Select
                    value={formData.target_audience}
                    onValueChange={(value: any) => setFormData({ ...formData, target_audience: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los usuarios</SelectItem>
                      <SelectItem value="nearby">Usuarios cercanos</SelectItem>
                      <SelectItem value="loyal_customers">Clientes frecuentes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={saving || uploading} className="w-full gap-2">
                  <Send className="h-4 w-4" />
                  {saving ? 'Programando...' : 'Programar Envío'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Campaigns List */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Campañas Programadas
                </CardTitle>
                <CardDescription>
                  Gestiona tus campañas de notificaciones push
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {campaigns.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No tienes campañas creadas aún
                    </p>
                  </div>
                ) : (
                  campaigns.map((campaign) => (
                    <Card key={campaign.id} className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{campaign.title}</h4>
                              {getStatusBadge(campaign.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {campaign.message}
                            </p>
                            {campaign.image_url && (
                              <img 
                                src={campaign.image_url} 
                                alt="Campaign" 
                                className="w-full h-24 object-cover rounded-md"
                              />
                            )}
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(campaign.scheduled_at).toLocaleString('es-ES')}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {getAudienceBadge(campaign.target_audience)}
                              </Badge>
                              {campaign.sent_count > 0 && (
                                <span>Enviada a {campaign.sent_count} usuarios</span>
                              )}
                            </div>
                          </div>
                          {campaign.status === 'scheduled' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setCampaignToDelete(campaign.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                      ℹ️ Sobre las notificaciones push
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Las notificaciones solo se enviarán a usuarios que tengan la app instalada y hayan dado permiso para recibir notificaciones.
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Las campañas se procesarán automáticamente a la hora programada.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar campaña?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La campaña programada será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCampaign}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BusinessNotifications;
