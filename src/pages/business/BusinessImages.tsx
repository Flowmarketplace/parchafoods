import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, Trash2, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface BusinessImage {
  id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

const BusinessImages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<BusinessImage[]>([]);
  const [businessId, setBusinessId] = useState<string>('');

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
      await loadImages(business.id);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadImages = async (busId: string) => {
    const { data, error } = await supabase
      .from('business_images')
      .select('*')
      .eq('business_id', busId)
      .order('display_order');

    if (error) {
      console.error('Error loading images:', error);
    } else {
      setImages(data || []);
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
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('business-content')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('business-content')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('business_images')
        .insert({
          business_id: businessId,
          image_url: publicUrl,
          display_order: images.length
        });

      if (dbError) throw dbError;

      toast({
        title: "¡Imagen subida!",
        description: "La imagen se ha agregado correctamente",
      });

      await loadImages(businessId);
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

  const handleDelete = async (imageId: string, imageUrl: string) => {
    try {
      // Delete from storage
      const path = imageUrl.split('/').slice(-2).join('/');
      await supabase.storage
        .from('business-content')
        .remove([path]);

      // Delete from database
      const { error } = await supabase
        .from('business_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      toast({
        title: "Imagen eliminada",
        description: "La imagen se ha eliminado correctamente",
      });

      await loadImages(businessId);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la imagen",
        variant: "destructive",
      });
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      // Remove primary from all images
      await supabase
        .from('business_images')
        .update({ is_primary: false })
        .eq('business_id', businessId);

      // Set this image as primary
      const { error } = await supabase
        .from('business_images')
        .update({ is_primary: true })
        .eq('id', imageId);

      if (error) throw error;

      toast({
        title: "Imagen principal actualizada",
        description: "Esta imagen ahora es la principal",
      });

      await loadImages(businessId);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar",
        variant: "destructive",
      });
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
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/business-dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Galería de Imágenes</CardTitle>
            <CardDescription>
              Sube fotos de tu negocio. La imagen principal aparecerá primero en tu perfil.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="cursor-pointer"
              />
              {uploading && (
                <p className="text-sm text-muted-foreground mt-2">Subiendo imagen...</p>
              )}
            </div>

            {images.length === 0 ? (
              <div className="text-center py-12">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No tienes imágenes aún. Sube la primera imagen de tu negocio.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="relative group">
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={img.image_url}
                        alt="Business"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant={img.is_primary ? "default" : "secondary"}
                        onClick={() => handleSetPrimary(img.id)}
                        title="Marcar como principal"
                      >
                        <Star className={`h-4 w-4 ${img.is_primary ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(img.id, img.image_url)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {img.is_primary && (
                      <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                        Principal
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessImages;
