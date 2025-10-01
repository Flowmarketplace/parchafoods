import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Ticket, Users, Share2, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockEvents } from '@/data/events';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const event = mockEvents.find((e) => e.id === id);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Evento no encontrado</h2>
          <Button onClick={() => navigate('/')}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTotalPrice = () => {
    if (event.price === 'Gratis') return 'Gratis';
    
    // Handle price ranges (e.g., "$50.000 - $80.000")
    const priceMatch = event.price.match(/\$?([\d.,]+)/);
    if (!priceMatch) return event.price;
    
    const priceNumber = parseInt(priceMatch[1].replace(/[.,]/g, ''));
    const total = priceNumber * ticketQuantity;
    
    return `$${total.toLocaleString('es-CO')}`;
  };

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!buyerName || !buyerEmail || !buyerPhone) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    // Aquí iría la lógica de compra real
    toast({
      title: "¡Compra exitosa!",
      description: `Has adquirido ${ticketQuantity} boleta(s) para ${event.name}. Te enviaremos los detalles a ${buyerEmail}`,
    });

    // Reset form
    setBuyerName('');
    setBuyerEmail('');
    setBuyerPhone('');
    setTicketQuantity(1);
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Concierto': 'bg-purple-500',
      'Teatro': 'bg-red-500',
      'Cine': 'bg-blue-500',
      'Festival': 'bg-green-500',
      'Deportes': 'bg-orange-500',
      'Arte': 'bg-pink-500',
      'Otro': 'bg-gray-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-4xl">
        <Button
          variant="outline"
          onClick={() => navigate('/events')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a eventos
        </Button>

        <Card>
          <CardContent className="p-0">
            {/* Image Carousel */}
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {event.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative h-[400px]">
                        <img
                          src={image}
                          alt={`${event.name} - Imagen ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
              
              <Badge className={`absolute top-4 right-4 ${getEventTypeColor(event.type)}`}>
                {event.type}
              </Badge>
            </div>

            {/* Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
                  <p className="text-lg text-muted-foreground mb-2">{event.venue}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {event.price}
                  </div>
                  {event.price !== 'Gratis' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="mt-2 gap-2">
                          <Ticket className="h-4 w-4" />
                          Comprar Boletas
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Comprar Boletas</DialogTitle>
                          <DialogDescription>
                            {event.name}
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handlePurchase} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="quantity">Cantidad de boletas</Label>
                            <Input
                              id="quantity"
                              type="number"
                              min="1"
                              max="10"
                              value={ticketQuantity}
                              onChange={(e) => setTicketQuantity(parseInt(e.target.value) || 1)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="name">Nombre completo</Label>
                            <Input
                              id="name"
                              placeholder="Juan Pérez"
                              value={buyerName}
                              onChange={(e) => setBuyerName(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="juan@ejemplo.com"
                              value={buyerEmail}
                              onChange={(e) => setBuyerEmail(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+57 300 123 4567"
                              value={buyerPhone}
                              onChange={(e) => setBuyerPhone(e.target.value)}
                              required
                            />
                          </div>
                          <div className="pt-4 border-t">
                            <div className="flex justify-between items-center mb-4">
                              <span className="font-semibold">Total:</span>
                              <span className="text-2xl font-bold text-primary">{getTotalPrice()}</span>
                            </div>
                            <Button type="submit" className="w-full">
                              Confirmar Compra
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
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
                  className="rounded-full"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: event.name,
                        text: event.description,
                        url: window.location.href,
                      });
                    }
                  }}
                  aria-label="Compartir"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {event.description && (
                <p className="text-muted-foreground mb-6">{event.description}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Fecha</p>
                    <p className="text-muted-foreground capitalize">{formatDate(event.date)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Hora</p>
                    <p className="text-muted-foreground">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Lugar</p>
                    <p className="text-muted-foreground">{event.venue}</p>
                    <p className="text-sm text-muted-foreground">{event.address}</p>
                  </div>
                </div>

                {event.organizer && (
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                    <Users className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Organizador</p>
                      <p className="text-muted-foreground">{event.organizer}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tabs Section */}
              <Tabs defaultValue="ubicacion" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
                  <TabsTrigger value="detalles">Más Detalles</TabsTrigger>
                </TabsList>

                <TabsContent value="ubicacion" className="mt-6">
                  <div className="rounded-lg overflow-hidden border border-border h-[400px]">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      src={`https://www.google.com/maps?q=${event.latitude},${event.longitude}&output=embed`}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    {event.address}, {event.neighborhood}
                  </p>
                </TabsContent>

                <TabsContent value="detalles" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-4">Información del Evento</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium mb-1">Tipo de evento</p>
                          <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Barrio</p>
                          <p className="text-muted-foreground">{event.neighborhood}</p>
                        </div>
                        {event.organizer && (
                          <div>
                            <p className="font-medium mb-1">Contacto del organizador</p>
                            <p className="text-muted-foreground">{event.organizer}</p>
                          </div>
                        )}
                        <div>
                          <p className="font-medium mb-1">Precio</p>
                          <p className="text-primary text-xl font-bold">{event.price}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventDetails;
