import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Image as ImageIcon, Menu, Tag, Video } from 'lucide-react';
import { ProfileImageUpload } from '@/components/business/ProfileImageUpload';
import { GalleryImageUpload } from '@/components/business/GalleryImageUpload';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BusinessImage {
  id: string;
  image_url: string;
  description?: string;
  display_order: number;
  image_type: string;
}

const BusinessImages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string>('');
  const [profileImage, setProfileImage] = useState<BusinessImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<BusinessImage[]>([]);

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
      return;
    }

    const images = (data || []) as BusinessImage[];
    setProfileImage(images.find(img => img.image_type === 'profile') || null);
    setGalleryImages(images.filter(img => img.image_type === 'gallery'));
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
      <div className="max-w-6xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/business-dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>

        <Alert>
          <ImageIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>Gestiona las imágenes de tu negocio:</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <Menu className="h-3 w-3" />
                <span>Para fotos de productos/menú, ve a la sección <strong>Menú & Precios</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Tag className="h-3 w-3" />
                <span>Para fotos de promociones, ve a la sección <strong>Promociones</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Video className="h-3 w-3" />
                <span>Para videos cortos, ve a la sección <strong>Shorts</strong></span>
              </li>
            </ul>
          </AlertDescription>
        </Alert>

        <ProfileImageUpload
          businessId={businessId}
          currentImage={profileImage}
          onUpdate={() => loadImages(businessId)}
        />

        <GalleryImageUpload
          businessId={businessId}
          images={galleryImages}
          onUpdate={() => loadImages(businessId)}
        />
      </div>
    </div>
  );
};

export default BusinessImages;
