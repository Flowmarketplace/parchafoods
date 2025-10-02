import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, User } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ProfileImageUploadProps {
  businessId: string;
  currentImage?: {
    id: string;
    image_url: string;
  } | null;
  onUpdate: () => void;
}

export const ProfileImageUpload = ({ businessId, currentImage, onUpdate }: ProfileImageUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const file = e.target.files[0];

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      // Delete old image if exists
      if (currentImage) {
        await handleDelete();
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile/${Date.now()}.${fileExt}`;

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
          display_order: 0,
          image_type: 'profile',
          is_primary: true
        });

      if (dbError) throw dbError;

      toast({
        title: "¡Foto de perfil actualizada!",
        description: "Tu imagen de perfil se ha actualizado correctamente",
      });

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

  const handleDelete = async () => {
    if (!currentImage) return;

    try {
      const path = currentImage.image_url.split('/').slice(-3).join('/');
      await supabase.storage
        .from('business-content')
        .remove([path]);

      const { error } = await supabase
        .from('business_images')
        .delete()
        .eq('id', currentImage.id);

      if (error) throw error;

      toast({
        title: "Foto eliminada",
        description: "La foto de perfil se ha eliminado",
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
          <User className="h-5 w-5" />
          Foto de Perfil
        </CardTitle>
        <CardDescription>
          Esta imagen aparecerá como foto principal de tu negocio
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentImage ? (
          <div className="space-y-4">
            <div className="aspect-video max-w-md rounded-lg overflow-hidden bg-muted">
              <img
                src={currentImage.image_url}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => document.getElementById('profile-upload')?.click()}
                disabled={uploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                Cambiar Foto
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            </div>
            <Input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="aspect-video max-w-md rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              <User className="h-16 w-16 text-muted-foreground" />
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="cursor-pointer"
            />
            {uploading && (
              <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
