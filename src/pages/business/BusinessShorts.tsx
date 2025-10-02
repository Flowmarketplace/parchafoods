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
import { ArrowLeft, Plus, Pencil, Trash2, Film, Eye, Heart } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface Short {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  views: number;
  likes: number;
  active: boolean;
}

const BusinessShorts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [shorts, setShorts] = useState<Short[]>([]);
  const [businessId, setBusinessId] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingShort, setEditingShort] = useState<Short | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
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
      await loadShorts(business.id);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadShorts = async (busId: string) => {
    const { data, error } = await supabase
      .from('business_shorts')
      .select('*')
      .eq('business_id', busId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading shorts:', error);
    } else {
      setShorts(data || []);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploadingVideo(true);
    const file = e.target.files[0];

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "El video no puede superar 50MB",
        variant: "destructive",
      });
      setUploadingVideo(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/video-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('business-content')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('business-content')
        .getPublicUrl(fileName);

      setFormData({ ...formData, video_url: publicUrl });

      toast({
        title: "¡Video subido!",
        description: "El video se ha subido correctamente",
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo subir el video",
        variant: "destructive",
      });
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploadingThumb(true);
    const file = e.target.files[0];

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/thumb-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('business-content')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('business-content')
        .getPublicUrl(fileName);

      setFormData({ ...formData, thumbnail_url: publicUrl });

      toast({
        title: "¡Miniatura subida!",
        description: "La miniatura se ha subido correctamente",
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo subir la miniatura",
        variant: "destructive",
      });
    } finally {
      setUploadingThumb(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.video_url) {
      toast({
        title: "Error",
        description: "Debes subir un video",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingShort) {
        const { error } = await supabase
          .from('business_shorts')
          .update({
            title: formData.title,
            description: formData.description || null,
            video_url: formData.video_url,
            thumbnail_url: formData.thumbnail_url || null,
            active: formData.active
          })
          .eq('id', editingShort.id);

        if (error) throw error;

        toast({
          title: "¡Short actualizado!",
          description: "El video ha sido actualizado correctamente",
        });
      } else {
        const { error } = await supabase
          .from('business_shorts')
          .insert({
            business_id: businessId,
            title: formData.title,
            description: formData.description || null,
            video_url: formData.video_url,
            thumbnail_url: formData.thumbnail_url || null,
            active: formData.active
          });

        if (error) throw error;

        toast({
          title: "¡Short creado!",
          description: "El video ha sido publicado correctamente",
        });
      }

      setDialogOpen(false);
      resetForm();
      await loadShorts(businessId);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar el short",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (short: Short) => {
    setEditingShort(short);
    setFormData({
      title: short.title,
      description: short.description || '',
      video_url: short.video_url,
      thumbnail_url: short.thumbnail_url || '',
      active: short.active
    });
    setDialogOpen(true);
  };

  const handleDelete = async (shortId: string) => {
    try {
      const { error } = await supabase
        .from('business_shorts')
        .delete()
        .eq('id', shortId);

      if (error) throw error;

      toast({
        title: "Short eliminado",
        description: "El video ha sido eliminado correctamente",
      });

      await loadShorts(businessId);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el short",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      video_url: '',
      thumbnail_url: '',
      active: true
    });
    setEditingShort(null);
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
            <h1 className="text-3xl font-bold">Shorts / Reels</h1>
            <p className="text-muted-foreground">Videos cortos para promocionar tu negocio</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Subir Video
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingShort ? 'Editar' : 'Nuevo'} Short</DialogTitle>
                <DialogDescription>
                  Sube un video corto (máx 50MB)
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej: Conoce nuestro menú especial"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video">Video * (MP4, MOV, AVI - máx 50MB)</Label>
                  <Input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    disabled={uploadingVideo}
                    className="cursor-pointer"
                  />
                  {uploadingVideo && <p className="text-sm text-muted-foreground">Subiendo video...</p>}
                  {formData.video_url && !uploadingVideo && (
                    <p className="text-sm text-green-600">✓ Video listo</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Miniatura (opcional)</Label>
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    disabled={uploadingThumb}
                    className="cursor-pointer"
                  />
                  {uploadingThumb && <p className="text-sm text-muted-foreground">Subiendo miniatura...</p>}
                  {formData.thumbnail_url && (
                    <div className="mt-2">
                      <img src={formData.thumbnail_url} alt="Miniatura" className="h-32 rounded-lg object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <Label htmlFor="active">Video activo</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={uploadingVideo || uploadingThumb}>
                    {editingShort ? 'Actualizar' : 'Publicar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {shorts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Film className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No tienes videos aún. Sube tu primer short para empezar a promocionar tu negocio.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shorts.map((short) => (
              <Card key={short.id}>
                <CardHeader className="p-0">
                  <div className="relative aspect-[9/16] bg-muted rounded-t-lg overflow-hidden">
                    {short.thumbnail_url ? (
                      <img src={short.thumbnail_url} alt={short.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    {!short.active && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-semibold">Inactivo</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{short.title}</h3>
                  {short.description && (
                    <p className="text-sm text-muted-foreground mb-3">{short.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{short.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{short.likes.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(short)} className="flex-1">
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(short.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessShorts;
