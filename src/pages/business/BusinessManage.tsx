import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Check, ChevronsUpDown, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import BusinessHoursEditor from '@/components/business/BusinessHoursEditor';

const categories = [
  'Restaurante', 'Café', 'Parque', 'Farmacia', 'Banco', 'Centro Comercial',
  'Hospital', 'Hotel', 'Entretenimiento', 'Servicios', 'Gym', 'Gasolinera', 'Otro'
];

const neighborhoods = [
  'Aguablanca', 'Alameda', 'Alfonso López', 'Alférez Real', 'Arboleda', 
  'Bellavista', 'Bosques de Limonar', 'Caldas', 'Caney', 'Centenario',
  'Ciudad Córdoba', 'Ciudad Jardín', 'El Ingenio', 'El Limonar', 'Flora Industrial',
  'Granada', 'Juanchito', 'La Base', 'La Flora', 'Limonar',
  'Los Andes', 'Meléndez', 'Normandía', 'Pance', 'Parque Residencial del Sur',
  'Prados del Limonar', 'San Antonio', 'San Fernando', 'San Nicolás', 'Santa Mónica',
  'Santa Rita', 'Tequendama', 'Valle del Lili', 'Versalles'
];

const priceRanges = [
  { value: '$', label: '$ - Económico' },
  { value: '$$', label: '$$ - Moderado' },
  { value: '$$$', label: '$$$ - Caro' },
  { value: '$$$$', label: '$$$$ - Muy Caro' },
];

const BusinessManage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openNeighborhood, setOpenNeighborhood] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    address: '',
    neighborhood: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    price_range: '$',
    latitude: null as number | null,
    longitude: null as number | null,
    geo_notifications_enabled: false,
    notification_radius_km: 1.0,
    instagram_url: '',
    facebook_url: '',
    tiktok_url: '',
  });

  useEffect(() => {
    loadBusinessData();
  }, []);

  const loadBusinessData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: business, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!business) {
        navigate('/business-setup');
        return;
      }

      setBusinessId(business.id);
      setFormData({
        name: business.name || '',
        category: business.category || '',
        description: business.description || '',
        address: business.address || '',
        neighborhood: business.neighborhood || '',
        phone: business.phone || '',
        whatsapp: business.whatsapp || '',
        email: business.email || '',
        website: business.website || '',
        price_range: business.price_range || '$',
        latitude: business.latitude,
        longitude: business.longitude,
        geo_notifications_enabled: business.geo_notifications_enabled || false,
        notification_radius_km: business.notification_radius_km || 1.0,
        instagram_url: business.instagram_url || '',
        facebook_url: business.facebook_url || '',
        tiktok_url: business.tiktok_url || '',
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información del negocio",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('businesses')
        .update(formData)
        .eq('id', businessId);

      if (error) throw error;

      toast({
        title: "¡Actualizado!",
        description: "La información de tu negocio ha sido actualizada",
      });

      navigate('/business-dashboard');
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el negocio",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/business-dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Gestionar Mi Establecimiento</CardTitle>
            <CardDescription>
              Actualiza la información de tu negocio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Negocio *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Restaurante El Sabor"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoría *</Label>
                  <Popover open={openCategory} onOpenChange={setOpenCategory}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCategory}
                        className="w-full justify-between"
                      >
                        {formData.category || "Selecciona una categoría"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar categoría..." />
                        <CommandList>
                          <CommandEmpty>No se encontró categoría.</CommandEmpty>
                          <CommandGroup>
                            {categories.map((cat) => (
                              <CommandItem
                                key={cat}
                                value={cat}
                                onSelect={() => {
                                  setFormData({ ...formData, category: cat });
                                  setOpenCategory(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.category === cat ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {cat}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Barrio *</Label>
                  <Popover open={openNeighborhood} onOpenChange={setOpenNeighborhood}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openNeighborhood}
                        className="w-full justify-between"
                      >
                        {formData.neighborhood || "Selecciona un barrio"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar barrio..." />
                        <CommandList>
                          <CommandEmpty>No se encontró barrio.</CommandEmpty>
                          <CommandGroup>
                            {neighborhoods.map((nbh) => (
                              <CommandItem
                                key={nbh}
                                value={nbh}
                                onSelect={() => {
                                  setFormData({ ...formData, neighborhood: nbh });
                                  setOpenNeighborhood(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.neighborhood === nbh ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {nbh}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe tu negocio..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Calle 10 # 45-67"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(602) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="3001234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contacto@negocio.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Sitio Web</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://minegocio.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Rango de Precio</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {priceRanges.map((range) => (
                    <Button
                      key={range.value}
                      type="button"
                      variant={formData.price_range === range.value ? "default" : "outline"}
                      onClick={() => setFormData({ ...formData, price_range: range.value })}
                      className="w-full"
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Redes Sociales */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">📱 Redes Sociales</CardTitle>
                  <CardDescription>Agrega las URLs de tus redes sociales para que los clientes te encuentren</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input value={formData.instagram_url} onChange={e => setFormData({ ...formData, instagram_url: e.target.value })} placeholder="https://instagram.com/turestaurante" />
                  </div>
                  <div className="space-y-2">
                    <Label>Facebook</Label>
                    <Input value={formData.facebook_url} onChange={e => setFormData({ ...formData, facebook_url: e.target.value })} placeholder="https://facebook.com/turestaurante" />
                  </div>
                  <div className="space-y-2">
                    <Label>TikTok</Label>
                    <Input value={formData.tiktok_url} onChange={e => setFormData({ ...formData, tiktok_url: e.target.value })} placeholder="https://tiktok.com/@turestaurante" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Notificaciones por Proximidad
                  </CardTitle>
                  <CardDescription>
                    Envía notificaciones automáticas a usuarios cercanos a tu negocio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="geo_enabled"
                      checked={formData.geo_notifications_enabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, geo_notifications_enabled: checked })}
                    />
                    <Label htmlFor="geo_enabled" className="font-semibold">
                      Activar notificaciones por proximidad
                    </Label>
                  </div>

                  {formData.geo_notifications_enabled && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="latitude">Latitud *</Label>
                          <Input
                            id="latitude"
                            type="number"
                            step="0.000001"
                            value={formData.latitude || ''}
                            onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || null })}
                            placeholder="Ej: 3.451647"
                            required={formData.geo_notifications_enabled}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="longitude">Longitud *</Label>
                          <Input
                            id="longitude"
                            type="number"
                            step="0.000001"
                            value={formData.longitude || ''}
                            onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || null })}
                            placeholder="Ej: -76.531835"
                            required={formData.geo_notifications_enabled}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="radius">Radio de notificación (km) *</Label>
                        <Input
                          id="radius"
                          type="number"
                          step="0.1"
                          min="0.1"
                          max="50"
                          value={formData.notification_radius_km}
                          onChange={(e) => setFormData({ ...formData, notification_radius_km: parseFloat(e.target.value) || 1.0 })}
                          required={formData.geo_notifications_enabled}
                        />
                        <p className="text-xs text-muted-foreground">
                          Los usuarios recibirán notificaciones cuando estén a {formData.notification_radius_km} km de tu negocio
                        </p>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          <strong>💡 Consejo:</strong> Puedes obtener las coordenadas de tu negocio en Google Maps haciendo clic derecho en la ubicación y seleccionando las coordenadas que aparecen.
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/business-dashboard')}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessManage;
