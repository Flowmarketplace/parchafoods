import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Star, UtensilsCrossed, Facebook, Instagram, Twitter, Share2, ShoppingBag, Briefcase, Home as HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockPlaces } from '@/data/places';
import PlaceChat from '@/components/PlaceChat';
import PlaceMap from '@/components/PlaceMap';
import PlaceMenu from '@/components/PlaceMenu';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const PlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const place = mockPlaces.find((p) => p.id === id);

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
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
              <Carousel className="w-full">
                <CarouselContent>
                  {place.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative h-[400px]">
                        <img
                          src={image}
                          alt={`${place.name} - Imagen ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
              
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
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
                  {place.hasMenu && (
                    <TabsTrigger value="menu">
                      <UtensilsCrossed className="h-4 w-4 mr-2" />
                      Menú
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
                  <TabsTrigger value="resenas">Reseñas</TabsTrigger>
                </TabsList>

                <TabsContent value="ubicacion" className="mt-6">
                  <div className="rounded-lg overflow-hidden border border-border h-[400px]">
                    <PlaceMap
                      latitude={place.latitude}
                      longitude={place.longitude}
                      placeName={place.name}
                      category={place.category}
                    />
                  </div>
                </TabsContent>

                {place.hasMenu && place.menu && (
                  <TabsContent value="menu" className="mt-6">
                    <PlaceMenu menu={place.menu} />
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
    </div>
  );
};

export default PlaceDetails;
