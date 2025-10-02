import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Images } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface GalleryImage {
  id: string;
  image_url: string;
  description?: string;
  display_order: number;
}

interface GalleryImageUploadProps {
  businessId: string;
  images: GalleryImage[];
  onUpdate: () => void;
}

export const GalleryImageUpload = ({ businessId, images, onUpdate }: GalleryImageUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const file = e.target.files[0];

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/gallery/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
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
          display_order: images.length,
          image_type: 'gallery',
          description: description.trim() || null
        });

      if (dbError) throw dbError;

      toast({
        title: "¡Imagen agregada!",
        description: "La imagen se ha agregado a tu galería",
      });

      setDescription('');
      onUpdate();
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
      const path = imageUrl.split('/').slice(-3).join('/');
      await supabase.storage
        .from('business-content')
        .remove([path]);

      const { error } = await supabase
        .from('business_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      toast({
        title: "Imagen eliminada",
        description: "La imagen se ha eliminado de tu galería",
      });

      onUpdate();
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la imagen",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Images className="h-5 w-5" />
          Galería de Imágenes
        </CardTitle>
        <CardDescription>
          Fotos generales de tu negocio, instalaciones, ambiente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="gallery-description">Descripción (opcional)</Label>
              <Textarea
                id="gallery-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Vista del interior, terraza, etc."
                disabled={uploading}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="gallery-file">Seleccionar imagen</Label>
              <Input
                id="gallery-file"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="cursor-pointer mt-1"
              />
              {uploading && (
                <p className="text-sm text-muted-foreground mt-2">Subiendo imagen...</p>
              )}
            </div>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No hay imágenes en la galería. Sube la primera.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative group">
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={img.image_url}
                      alt={img.description || "Galería"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {img.description && (
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {img.description}
                    </p>
                  )}
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(img.id, img.image_url)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
