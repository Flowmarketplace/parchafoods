import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Store, 
  QrCode, 
  Users, 
  TrendingUp, 
  Settings,
  LogOut,
  BarChart3,
  Gift,
  Image,
  Menu,
  Film
} from 'lucide-react';

interface Business {
  id: string;
  name: string;
  category: string;
  address: string;
}

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBusinessOwner, setIsBusinessOwner] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate('/auth');
        return;
      }

      setUser(session.user);

      // Check if user has business_owner role
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error fetching roles:', error);
        toast({
          title: "Error",
          description: "No se pudo verificar tu rol",
          variant: "destructive",
        });
        return;
      }

      const hasBusinessRole = roles?.some(r => r.role === 'business_owner');
      
      if (!hasBusinessRole) {
        toast({
          title: "Acceso Denegado",
          description: "No tienes permisos para acceder a esta página",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setIsBusinessOwner(true);

      // Check if user has a business
      const { data: businessData } = await supabase
        .from('businesses')
        .select('id, name, category, address')
        .eq('owner_id', session.user.id)
        .single();

      if (businessData) {
        setBusiness(businessData);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRelevantSections = () => {
    if (!business) {
      return {
        manage: false,
        images: false,
        menu: false,
        promotions: false,
        shorts: false,
        hours: false,
      };
    }

    const category = business.category.toLowerCase();
    
    // Secciones por tipo de establecimiento
    return {
      manage: true, // Todos
      images: true, // Todos
      menu: ['restaurante', 'café', 'hotel', 'gym'].some(cat => category.includes(cat)),
      promotions: ['restaurante', 'café', 'gym', 'centro comercial', 'entretenimiento', 'hotel'].some(cat => category.includes(cat)),
      shorts: ['restaurante', 'café', 'entretenimiento', 'gym', 'hotel'].some(cat => category.includes(cat)),
      hours: true, // Todos necesitan horarios
    };
  };

  const sections = getRelevantSections();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
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

  if (!isBusinessOwner) {
    return null;
  }

  // If no business, show create business prompt
  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Panel de Negocio</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-muted/50 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <Store className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Bienvenido al Panel de Negocios</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Para comenzar, registra tu establecimiento y empieza a gestionar tu presencia digital
            </p>
            <Button size="lg" onClick={() => navigate('/business-setup')}>
              Registrar Mi Negocio
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Panel de Negocio</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">{business.name}</h2>
          <p className="text-muted-foreground">
            {business.category} • {business.address}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clientes
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Clientes únicos este mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Escaneos QR
              </CardTitle>
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Escaneos este mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recompensas Canjeadas
              </CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Recompensas este mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tasa de Retorno
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">
                Clientes que regresan
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.manage && (
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate('/business-manage')}
            >
              <CardHeader>
                <Store className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Mi Establecimiento</CardTitle>
                <CardDescription>
                  Gestiona información, fotos, horarios y descripción
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Gestionar
                </Button>
              </CardContent>
            </Card>
          )}

          {sections.images && (
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate('/business-images')}
            >
              <CardHeader>
                <Image className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Galería de Imágenes</CardTitle>
                <CardDescription>
                  Sube y gestiona las fotos de tu negocio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Ver Galería
                </Button>
              </CardContent>
            </Card>
          )}

          {sections.menu && (
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate('/business-menu')}
            >
              <CardHeader>
                <Menu className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>
                  {business.category === 'Restaurante' || business.category === 'Café' 
                    ? 'Menú & Precios' 
                    : business.category === 'Gym' 
                    ? 'Planes & Precios'
                    : business.category === 'Hotel'
                    ? 'Habitaciones & Tarifas'
                    : 'Servicios & Precios'}
                </CardTitle>
                <CardDescription>
                  Administra tu catálogo de productos y servicios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Gestionar
                </Button>
              </CardContent>
            </Card>
          )}

          {sections.promotions && (
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate('/business-promotions')}
            >
              <CardHeader>
                <Gift className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Promociones</CardTitle>
                <CardDescription>
                  Crea y gestiona promociones especiales para tus clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Gestionar
                </Button>
              </CardContent>
            </Card>
          )}

          {sections.shorts && (
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate('/business-shorts')}
            >
              <CardHeader>
                <Film className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Shorts/Reels</CardTitle>
                <CardDescription>
                  Sube videos cortos para promocionar tu negocio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Gestionar Videos
                </Button>
              </CardContent>
            </Card>
          )}

          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate('/business-loyalty')}
          >
            <CardHeader>
              <Gift className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Programa de Lealtad</CardTitle>
              <CardDescription>
                Configura sistema de puntos para premiar a tus clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Configurar Lealtad
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <BarChart3 className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Analíticas</CardTitle>
              <CardDescription>
                Ve estadísticas detalladas de visitas, escaneos y engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled>
                Próximamente
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Clientes</CardTitle>
              <CardDescription>
                Ve la lista de clientes que han visitado tu establecimiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled>
                Próximamente
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Settings className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Configuración</CardTitle>
              <CardDescription>
                Ajusta preferencias de notificaciones y perfil de negocio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled>
                Próximamente
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BusinessDashboard;
