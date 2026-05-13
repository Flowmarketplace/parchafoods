import { useParams, useNavigate } from 'react-router-dom';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowLeft, MapPin, Phone, Star, UtensilsCrossed, Facebook, Instagram, Twitter, Share2, ShoppingBag, Briefcase, Home as HomeIcon, Tag, QrCode, ExternalLink, Calendar, Users, Clock, Trophy, Store, MessageSquare, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { mockPlaces } from '@/data/places';
import PlaceChat from '@/components/PlaceChat';
import PlaceMap from '@/components/PlaceMap';
import PlaceMenu from '@/components/PlaceMenu';
import QRScanner from '@/components/QRScanner';
import DirectionsPanel from '@/components/DirectionsPanel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { getCategoryFallbackImage } from '@/utils/categoryImages';
import { pickBusinessCoverImages } from '@/utils/businessImages';

const PlaceDetails = () => {
  const { id } = useParams(); // This could be an ID or a slug
  const navigate = useNavigate();
  const [place, setPlace] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [menu, setMenu] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [hours, setHours] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadPlace = async () => {
      if (!id) return;
      
      setLoading(true);
      
      // Try to find by slug first, then by ID
      let { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', id)
        .maybeSingle();
      
      // If not found by slug, try by ID
      if (error || !data) {
        const result = await supabase
          .from('businesses')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        data = result.data;
        error = result.error;
      }
      
      if (data) {
        setPlace(data);
        
        // Load related data
        const [imagesResult, menuResult, promotionsResult, hoursResult, branchesResult, reviewsResult] = await Promise.all([
          supabase
            .from('business_images')
            .select('*')
            .eq('business_id', data.id)
            .order('display_order'),
          supabase
            .from('business_menu')
            .select('*')
            .eq('business_id', data.id)
            .eq('available', true)
            .order('category, name'),
          supabase
            .from('business_promotions')
            .select('*')
            .eq('business_id', data.id)
            .eq('active', true),
          supabase
            .from('business_hours')
            .select('*')
            .eq('business_id', data.id)
            .order('day_of_week'),
          supabase
            .from('business_branches')
            .select('*')
            .eq('business_id', data.id)
            .eq('active', true)
            .order('is_main', { ascending: false }),
          supabase
            .from('business_reviews')
            .select('*')
            .eq('business_id', data.id)
            .eq('approved', true)
            .order('created_at', { ascending: false }),
        ]);
        
        setImages(imagesResult.data || []);
        setMenu(menuResult.data || []);
        setPromotions(promotionsResult.data || []);
        setHours(hoursResult.data || []);
        setBranches(branchesResult.data || []);
        setReviews(reviewsResult.data || []);
      } else {
        // Fallback to mock data
        const mockPlace = mockPlaces.find((p) => p.id === id);
        if (mockPlace) {
          setPlace(mockPlace);
          setImages(mockPlace.images?.map((url, index) => ({ image_url: url, display_order: index })) || []);
        }
      }
      
      setLoading(false);
    };
    
    loadPlace();
  }, [id]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user && place?.id) {
        setTimeout(() => {
          loadLoyaltyPoints(session.user.id, place.id);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [place?.id]);

  const loadLoyaltyPoints = async (userId: string, placeId: string) => {
    try {
      const { data } = await supabase
        .from('loyalty_points')
        .select('points')
        .eq('user_id', userId)
        .eq('business_id', placeId)
        .maybeSingle();

      if (data) {
        setLoyaltyPoints(data.points);
      }
    } catch (error) {
      // No points yet, that's ok
    }
  };

  const handleQRScanSuccess = () => {
    if (user && id) {
      loadLoyaltyPoints(user.id, id);
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !place) return;
    if (!reviewComment.trim()) {
      toast({ title: "Error", description: "Escribe un comentario", variant: "destructive" });
      return;
    }
    setSubmittingReview(true);
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle();

      const { error } = await supabase.from('business_reviews').insert({
        business_id: place.id,
        user_id: user.id,
        author_name: profile?.full_name || user.email?.split('@')[0] || 'Anónimo',
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      if (error) throw error;

      toast({ title: "¡Reseña enviada!", description: "Gracias por tu opinión" });
      setReviewComment('');
      setReviewRating(5);

      // Reload reviews
      const { data: newReviews } = await supabase
        .from('business_reviews')
        .select('*')
        .eq('business_id', place.id)
        .eq('approved', true)
        .order('created_at', { ascending: false });
      setReviews(newReviews || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "No se pudo enviar la reseña", variant: "destructive" });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Lugar no encontrado</h2>
          <Button onClick={() => navigate('/')}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* AI Chat Widget */}
      <PlaceChat
        placeName={place.name}
        placeCategory={place.category}
        placeDescription={place.description}
      />
      
      <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-4xl">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Button>

        <Card>
          <CardContent className="p-0">
            {/* Image Carousel - full width hero */}
            <div className="relative">
              {(() => {
                const ordered = pickBusinessCoverImages(images);
                const displayImages = ordered.length > 0
                  ? ordered
                  : [{ image_url: getCategoryFallbackImage(place.category, place.id || place.name), description: place.name }];
                return (
                  <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}>
                    <CarouselContent>
                      {displayImages.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="relative w-full h-[260px] sm:h-[380px] md:h-[480px] lg:h-[560px] bg-muted overflow-hidden">
                            <img
                              src={image.image_url}
                              alt={image.description || `${place.name} - Imagen ${index + 1}`}
                              loading={index === 0 ? 'eager' : 'lazy'}
                              decoding="async"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {displayImages.length > 1 && (
                      <>
                        <CarouselPrevious className="left-4" />
                        <CarouselNext className="right-4" />
                      </>
                    )}
                  </Carousel>
                );
              })()}

              {place.featured && (
                <Badge className="absolute top-4 right-4 bg-secondary">
                  Destacado
                </Badge>
              )}
            </div>

            {/* Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{place.name}</h1>
                  <Badge variant="outline" className="mb-2">
                    {place.category}
                  </Badge>
                </div>
                {place.rating && (
                  <div className="flex items-center gap-2 text-lg">
                    <Star className="h-6 w-6 fill-secondary text-secondary" />
                    <span className="font-bold">{place.rating}</span>
                  </div>
                )}
              </div>

              {/* Redes Sociales */}
              <div className="flex gap-3 mb-6">
                {place.facebook_url && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors"
                    onClick={() => window.open(place.facebook_url, '_blank')}
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </Button>
                )}
                {place.instagram_url && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition-colors"
                    onClick={() => window.open(place.instagram_url, '_blank')}
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </Button>
                )}
                {place.tiktok_url && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full hover:bg-[#010101] hover:text-white hover:border-[#010101] transition-colors"
                    onClick={() => window.open(place.tiktok_url, '_blank')}
                    aria-label="TikTok"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.16z"/></svg>
                  </Button>
                )}
                {place.whatsapp && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors"
                    onClick={() => {
                      const phone = place.whatsapp?.replace(/\D/g, '') || '';
                      window.open(`https://wa.me/${phone}`, '_blank');
                    }}
                    aria-label="WhatsApp"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {place.description && (
                <p className="text-muted-foreground mb-6">{place.description}</p>
              )}

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Dirección</p>
                    <a
                      href={place.latitude && place.longitude 
                        ? `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}` 
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address + ', Cali, Colombia')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary hover:underline transition-colors"
                    >
                      {place.address}
                    </a>
                  </div>
                </div>

                {place.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Teléfono</p>
                      <a
                        href={`tel:${place.phone}`}
                        className="text-primary hover:underline"
                      >
                        {place.phone}
                      </a>
                    </div>
                  </div>
                )}

                {place.priceRange && (
                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 flex items-center justify-center font-bold text-primary">
                      $
                    </div>
                    <div>
                      <p className="font-medium">Rango de precio</p>
                      <p className="text-muted-foreground">{place.priceRange}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tabs Section */}
              <Tabs defaultValue="mundialista" className="w-full">
                <TabsList className="w-full overflow-x-auto flex justify-start gap-1 h-auto flex-wrap">
                  <TabsTrigger value="mundialista" className="text-xs gap-1 px-2.5 py-1.5">
                    <Trophy className="h-3.5 w-3.5" />
                    Mundialista
                  </TabsTrigger>
                  <TabsTrigger value="menu" className="text-xs gap-1 px-2.5 py-1.5">
                    <UtensilsCrossed className="h-3.5 w-3.5" />
                    Menú
                  </TabsTrigger>
                  <TabsTrigger value="horarios" className="text-xs gap-1 px-2.5 py-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Horarios
                  </TabsTrigger>
                  <TabsTrigger value="ubicacion" className="text-xs gap-1 px-2.5 py-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    Ubicación
                  </TabsTrigger>
                  {promotions && promotions.length > 0 && (
                    <TabsTrigger value="promociones" className="text-xs gap-1 px-2.5 py-1.5">
                      <Tag className="h-3.5 w-3.5" />
                      Promo
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="resenas" className="text-xs gap-1 px-2.5 py-1.5">Reseñas</TabsTrigger>
                </TabsList>

                {/* Platos Mundialistas */}
                <TabsContent value="mundialista" className="mt-4">
                  <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">⚽</span>
                        <h3 className="text-lg sm:text-xl font-bold">Platos Mundialistas</h3>
                      </div>
                      {(() => {
                        const mundialItems = menu.filter(m => m.category === 'Plato Mundialista');
                        if (mundialItems.length > 0) {
                          return (
                            <div className="space-y-4">
                              {mundialItems.map((mundialItem) => (
                                <div key={mundialItem.id} className="bg-background/80 rounded-lg p-4 border border-primary/10">
                                  {mundialItem.image_url && (
                                    <div className="rounded-lg overflow-hidden aspect-[4/3] mb-3 bg-muted">
                                      <img src={mundialItem.image_url} alt={mundialItem.name} className="w-full h-full object-cover" />
                                    </div>
                                  )}
                                  <p className="font-bold text-primary text-lg mb-1">
                                    🍽️ {mundialItem.name}
                                  </p>
                                  {mundialItem.description && (
                                    <p className="text-sm text-muted-foreground mb-2">{mundialItem.description}</p>
                                  )}
                                  <p className="text-xl font-bold text-secondary">
                                    ${Number(mundialItem.price).toLocaleString('es-CO')}
                                  </p>
                                </div>
                              ))}
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Trophy className="h-3.5 w-3.5 text-secondary" />
                                <span>Pide estos platos y gana goles para tu pasaporte mundialista</span>
                              </div>
                            </div>
                          );
                        }
                        if (place.worldCupSpecial || place.loyalty_reward_description) {
                          return (
                            <>
                              <div className="bg-background/80 rounded-lg p-4 mb-3 border border-primary/10">
                                <p className="font-semibold text-primary mb-1">
                                  🍽️ {place.worldCupSpecial || 'Plato especial del Mundial'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {place.loyalty_reward_description || 'Pregunta por nuestro plato mundialista y acumula goles en tu pasaporte.'}
                                </p>
                              </div>
                              {place.loyalty_reward_image && (
                                <div className="rounded-lg overflow-hidden h-48 mb-3">
                                  <img src={place.loyalty_reward_image} alt="Plato mundialista" className="w-full h-full object-cover" />
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Trophy className="h-3.5 w-3.5 text-secondary" />
                                <span>Pide este plato y gana goles para tu pasaporte mundialista</span>
                              </div>
                            </>
                          );
                        }
                        return (
                          <div className="text-center py-6">
                            <span className="text-3xl mb-2 block">🏟️</span>
                            <p className="text-muted-foreground text-sm">
                              Próximamente el plato mundialista de {place.name}
                            </p>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Horarios */}
                <TabsContent value="horarios" className="mt-4">
                  <Card>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-bold">Horarios de Atención</h3>
                      </div>
                      {hours.length > 0 ? (
                        <div className="space-y-2">
                          {hours.map((h) => {
                            const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                            const today = new Date().getDay();
                            const isToday = h.day_of_week === today;
                            return (
                              <div
                                key={h.id}
                                className={`flex justify-between items-center p-2.5 rounded-lg text-sm ${
                                  isToday ? 'bg-primary/10 border border-primary/20 font-semibold' : 'bg-muted/30'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  {isToday && <span className="h-2 w-2 rounded-full bg-green-500" />}
                                  {dayNames[h.day_of_week]}
                                </span>
                                <span className={h.is_closed ? 'text-destructive' : 'text-muted-foreground'}>
                                  {h.is_closed ? 'Cerrado' : `${h.open_time?.slice(0,5)} - ${h.close_time?.slice(0,5)}`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground text-sm">
                          <Clock className="h-8 w-8 mx-auto mb-2 opacity-40" />
                          <p>Horarios no disponibles</p>
                          <p className="text-xs mt-1">Contacta directamente al restaurante</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="ubicacion" className="mt-6">
                  <div className="space-y-6">
                    {/* Main location */}
                    {place.latitude && place.longitude && (
                      <div>
                        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          {branches.length > 0 ? 'Ubicación Principal' : 'Ubicación'}
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="rounded-lg overflow-hidden border border-border h-[300px]">
                            <PlaceMap
                              latitude={place.latitude}
                              longitude={place.longitude}
                              placeName={place.name}
                              category={place.category}
                            />
                          </div>
                          <DirectionsPanel 
                            destinationLat={place.latitude}
                            destinationLng={place.longitude}
                            destinationName={place.name}
                          />
                        </div>
                      </div>
                    )}

                    {/* Branches */}
                    {branches.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <Store className="h-4 w-4 text-primary" />
                          Sedes ({branches.length})
                        </h3>
                        <div className="space-y-4">
                          {branches.map((branch: any) => (
                            <Card key={branch.id} className="overflow-hidden">
                              <CardContent className="p-0">
                                <div className="p-3 border-b border-border">
                                  <div className="flex items-center gap-2">
                                    <p className="font-semibold text-sm">{branch.name}</p>
                                    {branch.is_main && (
                                      <Badge variant="secondary" className="text-[10px]">Principal</Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5">{branch.address} — {branch.neighborhood}</p>
                                  {branch.phone && (
                                    <a href={`tel:${branch.phone}`} className="text-xs text-primary mt-1 inline-block">{branch.phone}</a>
                                  )}
                                </div>
                                {branch.latitude && branch.longitude && (
                                  <div className="h-[200px]">
                                    <PlaceMap
                                      latitude={branch.latitude}
                                      longitude={branch.longitude}
                                      placeName={`${place.name} - ${branch.name}`}
                                      category={place.category}
                                    />
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {place.featuredProducts && place.featuredProducts.length > 0 && (
                  <TabsContent value="catalogo" className="mt-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">Productos Destacados</h3>
                        {place.catalogUrl && (
                          <Button
                            onClick={() => window.open(place.catalogUrl, '_blank')}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span className="hidden sm:inline">Ver todo</span>
                            <span className="sm:hidden">Todo</span>
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {place.featuredProducts.map((product) => (
                          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <CardContent className="p-0">
                              {product.image && (
                                <div className="relative h-48 w-full overflow-hidden">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                              )}
                              <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-semibold text-lg">{product.name}</h4>
                                  <span className="font-bold text-primary whitespace-nowrap ml-2">{product.price}</span>
                                </div>
                                {product.description && (
                                  <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                                )}
                                {product.category && (
                                  <Badge variant="outline" className="text-xs">{product.category}</Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      {place.catalogUrl && (
                        <div className="text-center pt-4">
                          <Button
                            onClick={() => window.open(place.catalogUrl, '_blank')}
                            size="lg"
                            className="gap-2 w-full sm:w-auto"
                          >
                            <ExternalLink className="h-5 w-5" />
                            <span className="hidden sm:inline">Ver todo el catálogo</span>
                            <span className="sm:hidden">Ver todo</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )}

                <TabsContent value="menu" className="mt-4">
                  {menu && menu.length > 0 ? (
                    <div className="space-y-6">
                      {Object.entries(
                        menu.reduce((acc: Record<string, any[]>, item: any) => {
                          const category = item.category || 'Otros';
                          if (!acc[category]) acc[category] = [];
                          acc[category].push(item);
                          return acc;
                        }, {} as Record<string, any[]>)
                      ).map(([category, items]: [string, any[]]) => (
                        <div key={category}>
                          <h3 className="text-lg font-semibold mb-3">{category}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {items.map((item) => (
                              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardContent className="p-0">
                                  {item.image_url && (
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                                      <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                      />
                                    </div>
                                  )}
                                  <div className="p-3">
                                    <div className="flex justify-between items-start mb-1">
                                      <h4 className="font-semibold">{item.name}</h4>
                                      <span className="font-bold text-primary whitespace-nowrap ml-2 text-sm">
                                        ${item.price.toLocaleString('es-CO')}
                                      </span>
                                    </div>
                                    {item.description && (
                                      <p className="text-xs text-muted-foreground">{item.description}</p>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <UtensilsCrossed className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                      <p className="text-muted-foreground text-sm">Menú no disponible aún</p>
                      <p className="text-xs text-muted-foreground mt-1">Contacta al restaurante para más info</p>
                    </div>
                  )}
                </TabsContent>

                {place.hasProducts && place.products && (
                  <TabsContent value="productos" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {place.products.map((product) => (
                        <Card key={product.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-lg">{product.name}</h3>
                              <span className="font-bold text-primary">{product.price}</span>
                            </div>
                            {product.description && (
                              <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                            )}
                            {product.category && (
                              <Badge variant="outline">{product.category}</Badge>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                )}

                {place.hasServices && place.services && (
                  <TabsContent value="servicios" className="mt-6">
                    <div className="space-y-4">
                      {place.services.map((service) => (
                        <Card key={service.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
                                <p className="text-sm text-muted-foreground">{service.description}</p>
                              </div>
                              <div className="text-right ml-4">
                                <span className="font-bold text-primary block">{service.price}</span>
                                {service.duration && (
                                  <span className="text-xs text-muted-foreground">{service.duration}</span>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                )}

                {place.hasGymClasses && place.gymClasses && (
                  <TabsContent value="clases" className="mt-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-semibold">Nuestras Clases</h3>
                          <p className="text-muted-foreground">Mantente activo con nuestra variedad de clases grupales</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {place.gymClasses.map((gymClass) => (
                          <Card key={gymClass.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <CardContent className="p-0">
                              {gymClass.image && (
                                <div className="relative h-48 w-full overflow-hidden">
                                  <img
                                    src={gymClass.image}
                                    alt={gymClass.name}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  />
                                  {gymClass.level && (
                                    <Badge className="absolute top-3 right-3 bg-primary">
                                      {gymClass.level}
                                    </Badge>
                                  )}
                                </div>
                              )}
                              <div className="p-5">
                                <h4 className="font-bold text-xl mb-2 text-primary">{gymClass.name}</h4>
                                <p className="text-sm text-muted-foreground mb-4">{gymClass.description}</p>
                                
                                <div className="space-y-2 mb-4">
                                  {gymClass.instructor && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Users className="h-4 w-4 text-primary" />
                                      <span className="font-medium">Instructor:</span>
                                      <span className="text-muted-foreground">{gymClass.instructor}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span className="font-medium">Horario:</span>
                                    <span className="text-muted-foreground">{gymClass.schedule}</span>
                                  </div>
                                  {gymClass.duration && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Tag className="h-4 w-4 text-primary" />
                                      <span className="font-medium">Duración:</span>
                                      <span className="text-muted-foreground">{gymClass.duration}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                )}

                {promotions && promotions.length > 0 && (
                  <TabsContent value="promociones" className="mt-6">
                    <div className="space-y-6">
                      {/* Loyalty Progress */}
                      {user && (
                        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold">Tus Puntos de Fidelidad</h3>
                              <Button
                                onClick={() => setShowQRScanner(true)}
                                className="gap-2"
                              >
                                <QrCode className="h-4 w-4" />
                                Escanear QR
                              </Button>
                            </div>
                            <div className="relative w-full h-12 bg-muted rounded-full overflow-hidden">
                              <div
                                className="absolute inset-y-0 left-0 transition-all duration-500 ease-out rounded-full bg-gradient-to-r from-primary to-secondary"
                                style={{ width: `${Math.min((loyaltyPoints / 5) * 100, 100)}%` }}
                              />
                              <div className="absolute inset-0 flex items-center justify-between px-3">
                                {Array.from({ length: 5 }).map((_, index) => (
                                  <div
                                    key={index}
                                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                                      index < loyaltyPoints
                                        ? 'bg-background border-primary scale-110'
                                        : 'bg-muted border-muted-foreground/30'
                                    }`}
                                  >
                                    <Star
                                      className={`h-4 w-4 ${
                                        index < loyaltyPoints
                                          ? 'fill-primary text-primary'
                                          : 'text-muted-foreground/30'
                                      }`}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <p className="text-center mt-3 font-semibold text-primary">
                              {loyaltyPoints >= 5 
                                ? '¡Recompensa disponible! 🎉' 
                                : `${loyaltyPoints}/5 puntos acumulados`}
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      {!user && (
                        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
                          <CardContent className="p-6 text-center">
                            <Star className="h-12 w-12 text-primary mx-auto mb-3" />
                            <p className="text-muted-foreground mb-4">
                              Inicia sesión para acumular puntos de fidelidad
                            </p>
                            <Button onClick={() => navigate('/auth')}>
                              Iniciar Sesión
                            </Button>
                          </CardContent>
                        </Card>
                      )}

                      {promotions.map((promotion) => (
                        <Card key={promotion.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            {promotion.image_url && (
                              <div className="relative h-64">
                                <img
                                  src={promotion.image_url}
                                  alt={promotion.title}
                                  className="w-full h-full object-cover"
                                />
                                {promotion.valid_until && (
                                  <Badge className="absolute top-4 right-4 bg-secondary">
                                    Válido hasta {new Date(promotion.valid_until).toLocaleDateString('es-CO')}
                                  </Badge>
                                )}
                              </div>
                            )}
                            <div className="p-6">
                              <h3 className="text-2xl font-bold mb-2">{promotion.title}</h3>
                              <p className="text-muted-foreground mb-4">{promotion.description}</p>
                              {promotion.conditions && (
                                <div className="bg-muted p-4 rounded-lg mb-4">
                                  <p className="text-sm font-medium mb-1">Términos y condiciones:</p>
                                  <p className="text-sm text-muted-foreground">{promotion.conditions}</p>
                                </div>
                              )}
                              <div className="flex items-center gap-2 flex-wrap">
                                {promotion.first_time_only && (
                                  <Badge variant="outline">
                                    Solo primera visita
                                  </Badge>
                                )}
                                {user ? (
                                  <Button
                                    onClick={() => setShowQRScanner(true)}
                                    className="gap-2 flex-1 sm:flex-initial"
                                  >
                                    <QrCode className="h-4 w-4" />
                                    Reclamar Promoción
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={() => navigate('/auth')}
                                    className="gap-2 flex-1 sm:flex-initial"
                                  >
                                    Registrarse para Reclamar
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                )}

                <TabsContent value="resenas" className="mt-6">
                  <div className="space-y-6">
                    {/* Review Form */}
                    {user ? (
                      <Card>
                        <CardContent className="p-4 space-y-4">
                          <h3 className="font-semibold flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-primary" />
                            Deja tu reseña
                          </h3>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button key={star} type="button" onClick={() => setReviewRating(star)}>
                                <Star className={`h-6 w-6 cursor-pointer transition-colors ${star <= reviewRating ? 'fill-secondary text-secondary' : 'text-muted-foreground/30'}`} />
                              </button>
                            ))}
                            <span className="ml-2 text-sm text-muted-foreground">{reviewRating}/5</span>
                          </div>
                          <Textarea
                            placeholder="Comparte tu experiencia..."
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows={3}
                          />
                          <Button onClick={handleSubmitReview} disabled={submittingReview} className="gap-2">
                            <Send className="h-4 w-4" />
                            {submittingReview ? 'Enviando...' : 'Enviar Reseña'}
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
                        <CardContent className="p-6 text-center">
                          <MessageSquare className="h-10 w-10 text-primary mx-auto mb-3" />
                          <p className="text-muted-foreground mb-4">Inicia sesión para dejar una reseña</p>
                          <Button onClick={() => navigate('/auth')}>Iniciar Sesión</Button>
                        </CardContent>
                      </Card>
                    )}

                    {/* Reviews List */}
                    {reviews.length > 0 ? (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Reseñas ({reviews.length})</h3>
                        {reviews.map((review) => (
                          <Card key={review.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="font-semibold">{review.author_name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(review.created_at).toLocaleDateString('es-CO')}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? 'fill-secondary text-secondary' : 'text-muted-foreground/20'}`} />
                                  ))}
                                </div>
                              </div>
                              {review.comment && <p className="text-muted-foreground text-sm">{review.comment}</p>}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        Aún no hay reseñas. ¡Sé el primero en opinar!
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && place && (
        <QRScanner
          placeId={place.id}
          placeName={place.name}
          onClose={() => setShowQRScanner(false)}
          onSuccess={handleQRScanSuccess}
        />
      )}
    </div>
  );
};

export default PlaceDetails;
