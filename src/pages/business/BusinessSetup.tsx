import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  'Restaurante',
  'Café',
  'Parque',
  'Farmacia',
  'Banco',
  'Centro Comercial',
  'Hospital',
  'Hotel',
  'Entretenimiento',
  'Servicios',
  'Gym',
  'Gasolinera',
  'Otro'
];

// Importar barrios desde la fuente centralizada (sin 'Todos')
import { neighborhoods as allNeighborhoods } from '@/data/places';
const neighborhoods = allNeighborhoods.filter(n => n !== 'Todos');

const BusinessSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openNeighborhood, setOpenNeighborhood] = useState(false);
  
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
    price_range: '$'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('businesses')
        .insert({
          owner_id: user.id,
          ...formData
        });

      if (error) throw error;

      toast({
        title: "¡Negocio creado!",
        description: "Tu negocio ha sido registrado exitosamente",
      });

      navigate('/business-dashboard');
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el negocio",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
            <CardTitle>Registra tu Negocio</CardTitle>
            <CardDescription>
              Completa la información básica de tu establecimiento
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
                    placeholder="(604) 123-4567"
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
                <Label htmlFor="price_range">Rango de Precio</Label>
                <Select
                  value={formData.price_range}
                  onValueChange={(value) => setFormData({ ...formData, price_range: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={5}>
                    <SelectItem value="$">$ - Económico</SelectItem>
                    <SelectItem value="$$">$$ - Moderado</SelectItem>
                    <SelectItem value="$$$">$$$ - Caro</SelectItem>
                    <SelectItem value="$$$$">$$$$ - Muy Caro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/business-dashboard')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creando...' : 'Crear Negocio'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessSetup;
