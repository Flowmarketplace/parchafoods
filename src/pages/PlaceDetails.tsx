import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockPlaces } from '@/data/places';
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
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

              {/* Map Preview */}
              <div className="rounded-lg overflow-hidden border border-border mb-6">
                <div className="bg-muted h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Ubicación: {place.neighborhood}
                  </p>
                </div>
              </div>

              {/* Reviews */}
              {place.reviews && place.reviews.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Reseñas</h2>
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
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlaceDetails;
