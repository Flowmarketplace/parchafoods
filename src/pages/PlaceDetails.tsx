import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Star, UtensilsCrossed, Facebook, Instagram, Twitter, Share2, ShoppingBag, Briefcase, Home as HomeIcon, Tag, QrCode, ExternalLink, Calendar, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const PlaceDetails = () => {
  const { id } = useParams(); // This could be an ID or a slug
  const navigate = useNavigate();
  const [place, setPlace] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [menu, setMenu] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);

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
        const [imagesResult, menuResult, promotionsResult] = await Promise.all([
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
            .eq('active', true)
        ]);
        
        setImages(imagesResult.data || []);
        setMenu(menuResult.data || []);
        setPromotions(promotionsResult.data || []);
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
            {/* Image Carousel */}
            <div className="relative">
              {images && images.length > 0 ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative h-[400px]">
                          <img
                            src={image.image_url}
                            alt={image.description || `${place.name} - Imagen ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </Carousel>
              ) : (
                <div className="relative h-[400px] bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">No hay imágenes disponibles</p>
                </div>
              )}
              
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
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors"
                  onClick={() => window.open('https://facebook.com', '_blank')}
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition-colors"
                  onClick={() => window.open('https://instagram.com', '_blank')}
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors"
                  onClick={() => window.open('https://twitter.com', '_blank')}
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors"
                  onClick={() => {
                    const phone = place.phone?.replace(/\D/g, '') || '';
                    window.open(`https://wa.me/${phone}`, '_blank');
                  }}
                  aria-label="WhatsApp"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                {place.airbnbUrl && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full hover:bg-[#FF5A5F] hover:text-white hover:border-[#FF5A5F] transition-colors"
                    onClick={() => window.open(place.airbnbUrl, '_blank')}
                    aria-label="Airbnb"
                  >
                    <HomeIcon className="h-5 w-5" />
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
                    <p className="text-muted-foreground">{place.address}</p>
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
              <Tabs defaultValue="ubicacion" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
                  {menu && menu.length > 0 && (
                    <TabsTrigger value="menu">
                      <UtensilsCrossed className="h-4 w-4 mr-2" />
                      Menú
                    </TabsTrigger>
                  )}
                  {promotions && promotions.length > 0 && (
                    <TabsTrigger value="promociones">
                      <Tag className="h-4 w-4 mr-2" />
                      Promo
                    </TabsTrigger>
                  )}
                  {place.featuredProducts && place.featuredProducts.length > 0 && (
                    <TabsTrigger value="catalogo">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Catálogo
                    </TabsTrigger>
                  )}
                  {place.hasProducts && (
                    <TabsTrigger value="productos">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Productos
                    </TabsTrigger>
                  )}
                  {place.hasServices && (
                    <TabsTrigger value="servicios">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Servicios
                    </TabsTrigger>
                  )}
                  {place.hasGymClasses && (
                    <TabsTrigger value="clases">
                      <Calendar className="h-4 w-4 mr-2" />
                      Clases
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="resenas">Reseñas</TabsTrigger>
                </TabsList>

                <TabsContent value="ubicacion" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <div className="rounded-lg overflow-hidden border border-border h-[400px]">
                        <PlaceMap
                          latitude={place.latitude}
                          longitude={place.longitude}
                          placeName={place.name}
                          category={place.category}
                        />
                      </div>
                    </div>
                    <div>
                      <DirectionsPanel 
                        destinationLat={place.latitude}
                        destinationLng={place.longitude}
                        destinationName={place.name}
                      />
                    </div>
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

                {menu && menu.length > 0 && (
                  <TabsContent value="menu" className="mt-6">
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
                          <h3 className="text-xl font-semibold mb-4">{category}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {items.map((item) => (
                              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardContent className="p-0">
                                  {item.image_url && (
                                    <div className="relative h-48 w-full overflow-hidden">
                                      <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                      />
                                    </div>
                                  )}
                                  <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-semibold text-lg">{item.name}</h4>
                                      <span className="font-bold text-primary whitespace-nowrap ml-2">
                                        ${item.price.toLocaleString('es-CO')}
                                      </span>
                                    </div>
                                    {item.description && (
                                      <p className="text-sm text-muted-foreground">{item.description}</p>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                )}

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
                  {place.reviews && place.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {place.reviews.map((review) => (
                        <Card key={review.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-semibold">{review.author}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(review.date).toLocaleDateString('es-CO')}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-secondary text-secondary" />
                                <span className="font-medium">{review.rating}</span>
                              </div>
                            </div>
                            <p className="text-muted-foreground">{review.comment}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Aún no hay reseñas para este lugar
                    </p>
                  )}
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
