import { useState, useEffect } from 'react';
import { Heart, Trash2, MapPin, Star, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BottomNav from '@/components/BottomNav';
import { useToast } from '@/hooks/use-toast';
import { pickBusinessCoverUrl } from '@/utils/businessImages';

const Favorites = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadFavorites(session.user.id);
      } else {
        setLoading(false);
      }
    });
  }, []);

  const loadFavorites = async (userId: string) => {
    setLoading(true);
    const { data } = await supabase
      .from('user_favorites')
      .select(`
        id,
        created_at,
        business_id,
        businesses (
          id, slug, name, category, address, neighborhood, description, featured,
          business_images (image_url, image_type, is_primary, display_order)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    setFavorites(data || []);
    setLoading(false);
  };

  const removeFavorite = async (favoriteId: string) => {
    const { error } = await supabase.from('user_favorites').delete().eq('id', favoriteId);
    if (error) {
      toast({ title: "Error", description: "No se pudo eliminar", variant: "destructive" });
    } else {
      setFavorites(prev => prev.filter(f => f.id !== favoriteId));
      toast({ title: "Eliminado de favoritos" });
    }
  };

  const getBusinessImage = (business: any) => {
    return pickBusinessCoverUrl(business.business_images, business);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-30 bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-bold">Mis Favoritos</h1>
          <p className="text-xs text-muted-foreground">Tus restaurantes guardados</p>
        </div>
      </header>

      {!user ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="bg-muted rounded-full p-6 mb-4">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Inicia sesión</h2>
          <p className="text-muted-foreground text-center max-w-md mb-4">
            Necesitas una cuenta para guardar tus restaurantes favoritos
          </p>
          <Button onClick={() => navigate('/auth')}>Iniciar Sesión</Button>
        </div>
      ) : favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="bg-muted rounded-full p-6 mb-4">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No tienes favoritos aún</h2>
          <p className="text-muted-foreground text-center max-w-md mb-4">
            Explora los restaurantes y toca el ❤️ para guardarlos aquí
          </p>
          <Button onClick={() => navigate('/')}>Explorar restaurantes</Button>
        </div>
      ) : (
        <div className="px-4 space-y-3">
          {favorites.map((fav) => {
            const business = fav.businesses;
            if (!business) return null;
            return (
              <Card key={fav.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div
                      className="w-28 h-28 flex-shrink-0 cursor-pointer"
                      onClick={() => navigate(`/place/${business.slug || business.id}`)}
                    >
                      <img
                        src={getBusinessImage(business)}
                        alt={business.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-3 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => navigate(`/place/${business.slug || business.id}`)}
                        >
                          <h3 className="font-semibold text-sm truncate">{business.name}</h3>
                          <Badge variant="outline" className="text-[10px] mt-1">{business.category}</Badge>
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{business.neighborhood}</span>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive flex-shrink-0"
                          onClick={() => removeFavorite(fav.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Favorites;
