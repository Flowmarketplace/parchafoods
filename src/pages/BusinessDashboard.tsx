import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import BusinessSidebar from '@/components/business/BusinessSidebar';
import BusinessBottomNav from '@/components/business/BusinessBottomNav';
import { 
  Store, 
  QrCode, 
  Users, 
  TrendingUp, 
  LogOut,
  BarChart3,
  Gift,
  Image,
  Menu as MenuIcon,
  Film,
  Bell,
  MapPin,
  CreditCard
} from 'lucide-react';

interface Business {
  id: string;
  name: string;
  category: string;
  address: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  neighborhood: string | null;
}

interface BusinessImage {
  id: string;
  image_url: string;
  image_type: string;
  is_primary: boolean;
}

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBusinessOwner, setIsBusinessOwner] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        .select('id, name, category, address, description, phone, email, website, neighborhood')
        .eq('owner_id', session.user.id)
        .single();

      if (businessData) {
        setBusiness(businessData);
        
        // Fetch cover image
        const { data: images } = await supabase
          .from('business_images')
          .select('image_url, is_primary, image_type')
          .eq('business_id', businessData.id)
          .order('is_primary', { ascending: false })
          .limit(1);
        
        if (images && images.length > 0) {
          setCoverImage(images[0].image_url);
        }
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-16 lg:pb-0">
      {/* Sidebar */}
      <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:ml-64">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <MenuIcon className="h-6 w-6" />
            </Button>
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

      <main className="container mx-auto px-4 py-8 lg:ml-64">
        {/* Hero Section con Foto de Portada */}
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
          {/* Cover Image */}
          <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary/20 via-secondary/20 to-purple-500/20">
            {coverImage ? (
              <img 
                src={coverImage} 
                alt={business.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Store className="h-24 w-24 text-primary/40" />
              </div>
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
          </div>

          {/* Business Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-end gap-4 md:gap-6">
              {/* Logo/Avatar placeholder */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary p-1 shadow-xl flex-shrink-0 animate-scale-in">
                <div className="w-full h-full bg-background rounded-xl flex items-center justify-center">
                  <Store className="h-10 w-10 md:h-12 md:w-12 text-primary" />
                </div>
              </div>

              {/* Business Details */}
              <div className="flex-1 pb-2">
                <h2 className="text-2xl md:text-4xl font-bold mb-2 text-foreground drop-shadow-lg">
                  {business.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm md:text-base">
                  <span className="px-3 py-1 rounded-full bg-primary/90 text-primary-foreground font-medium shadow-lg">
                    {business.category}
                  </span>
                  {business.neighborhood && (
                    <span className="px-3 py-1 rounded-full bg-secondary/90 text-secondary-foreground font-medium shadow-lg">
                      {business.neighborhood}
                    </span>
                  )}
                </div>
                {business.description && (
                  <p className="mt-2 text-sm md:text-base text-foreground/90 line-clamp-2 max-w-3xl drop-shadow">
                    {business.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid con Animaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="hover-scale hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clientes
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">0</div>
              <p className="text-xs text-muted-foreground mt-1">
                Clientes únicos este mes
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Escaneos QR
              </CardTitle>
              <div className="p-2 rounded-lg bg-purple-500/10">
                <QrCode className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">0</div>
              <p className="text-xs text-muted-foreground mt-1">
                Escaneos este mes
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recompensas Canjeadas
              </CardTitle>
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Gift className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">0</div>
              <p className="text-xs text-muted-foreground mt-1">
                Recompensas este mes
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tasa de Retorno
              </CardTitle>
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">0%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Clientes que regresan
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards con Efectos Mejorados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mi Suscripción */}
            <Card className="group hover-scale hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-500/20 hover:border-green-500/50 overflow-hidden relative" onClick={() => navigate('/business-subscription')}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-300" />
              <CardHeader className="relative">
                <div className="p-3 rounded-xl bg-green-500/10 w-fit mb-2 group-hover:scale-110 transition-transform duration-300">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Mi Suscripción</CardTitle>
                <CardDescription className="text-base">
                  Gestiona tu plan y métodos de pago
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Button className="w-full gap-2 bg-green-600 hover:bg-green-700 shadow-lg group-hover:shadow-xl transition-shadow">
                  <CreditCard className="h-4 w-4" />
                  Ver Plan
                </Button>
              </CardContent>
            </Card>

            {/* Notificaciones Push */}
            <Card className="group hover-scale hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-2 border-orange-500/20 hover:border-orange-500/50 overflow-hidden relative" onClick={() => navigate('/business-notifications')}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-red-500/0 group-hover:from-orange-500/10 group-hover:to-red-500/10 transition-all duration-300" />
              <CardHeader className="relative">
                <div className="p-3 rounded-xl bg-orange-500/10 w-fit mb-2 group-hover:scale-110 transition-transform duration-300">
                  <Bell className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Notificaciones Push</CardTitle>
                <CardDescription className="text-base">
                  Crea campañas publicitarias mediante notificaciones push
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Button className="w-full gap-2 bg-orange-600 hover:bg-orange-700 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Bell className="h-4 w-4" />
                  Gestionar Campañas
                </Button>
              </CardContent>
            </Card>

            {/* Notificaciones por Proximidad */}
            <Card className="group hover-scale hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-primary/20 hover:border-primary/50 overflow-hidden relative" onClick={() => navigate('/business-proximity')}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
              <CardHeader className="relative">
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-2 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Notificaciones de Proximidad</CardTitle>
                <CardDescription className="text-base">
                  Envía alertas automáticas a usuarios cercanos a tu negocio
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Button className="w-full gap-2 shadow-lg group-hover:shadow-xl transition-shadow">
                  <MapPin className="h-4 w-4" />
                  Configurar
                </Button>
              </CardContent>
            </Card>
          {sections.manage && (
            <Card 
              className="group hover-scale hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 overflow-hidden relative"
              onClick={() => navigate('/business-manage')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/5 group-hover:to-secondary/5 transition-all duration-300" />
              <CardHeader className="relative">
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-2 group-hover:scale-110 transition-transform duration-300">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Mi Establecimiento</CardTitle>
                <CardDescription className="text-base">
                  Gestiona información, fotos, horarios y descripción
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Button className="w-full shadow-lg group-hover:shadow-xl transition-shadow">
                  Gestionar
                </Button>
              </CardContent>
            </Card>
          )}

          {sections.images && (
            <Card 
              className="group hover-scale hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border-2 border-pink-500/20 hover:border-pink-500/50 overflow-hidden relative"
              onClick={() => navigate('/business-images')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-rose-500/0 group-hover:from-pink-500/10 group-hover:to-rose-500/10 transition-all duration-300" />
              <CardHeader className="relative">
                <div className="p-3 rounded-xl bg-pink-500/10 w-fit mb-2 group-hover:scale-110 transition-transform duration-300">
                  <Image className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle className="text-xl">Galería de Imágenes</CardTitle>
                <CardDescription className="text-base">
                  Sube y gestiona las fotos de tu negocio
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Button className="w-full bg-pink-600 hover:bg-pink-700 shadow-lg group-hover:shadow-xl transition-shadow">
                  Ver Galería
                </Button>
              </CardContent>
            </Card>
          )}

          {sections.menu && (
            <Card 
              className="group hover-scale hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border-2 border-indigo-500/20 hover:border-indigo-500/50 overflow-hidden relative"
              onClick={() => navigate('/business-menu')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-blue-500/0 group-hover:from-indigo-500/10 group-hover:to-blue-500/10 transition-all duration-300" />
              <CardHeader className="relative">
                <div className="p-3 rounded-xl bg-indigo-500/10 w-fit mb-2 group-hover:scale-110 transition-transform duration-300">
                  <MenuIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">
                  {business.category === 'Restaurante' || business.category === 'Café' 
                    ? 'Menú & Precios' 
                    : business.category === 'Gym' 
                    ? 'Planes & Precios'
                    : business.category === 'Hotel'
                    ? 'Habitaciones & Tarifas'
                    : 'Servicios & Precios'}
                </CardTitle>
                <CardDescription className="text-base">
                  Administra tu catálogo de productos y servicios
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg group-hover:shadow-xl transition-shadow">
                  Gestionar
                </Button>
              </CardContent>
            </Card>
          )}

          {sections.promotions && (
            <Card 
              className="group hover-scale hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-2 border-yellow-500/20 hover:border-yellow-500/50 overflow-hidden relative"
              onClick={() => navigate('/business-promotions')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-amber-500/0 group-hover:from-yellow-500/10 group-hover:to-amber-500/10 transition-all duration-300" />
              <CardHeader className="relative">
                <div className="p-3 rounded-xl bg-yellow-500/10 w-fit mb-2 group-hover:scale-110 transition-transform duration-300">
                  <Gift className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle className="text-xl">Promociones</CardTitle>
                <CardDescription className="text-base">
                  Crea y gestiona promociones especiales para tus clientes
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700 shadow-lg group-hover:shadow-xl transition-shadow">
                  Gestionar
                </Button>
              </CardContent>
            </Card>
          )}

          {sections.shorts && (
            <Card 
              className="group hover-scale hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-2 border-violet-500/20 hover:border-violet-500/50 overflow-hidden relative"
              onClick={() => navigate('/business-shorts')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-purple-500/0 group-hover:from-violet-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
              <CardHeader className="relative">
                <div className="p-3 rounded-xl bg-violet-500/10 w-fit mb-2 group-hover:scale-110 transition-transform duration-300">
                  <Film className="h-6 w-6 text-violet-600" />
                </div>
                <CardTitle className="text-xl">Shorts/Reels</CardTitle>
                <CardDescription className="text-base">
                  Sube videos cortos para promocionar tu negocio
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Button className="w-full bg-violet-600 hover:bg-violet-700 shadow-lg group-hover:shadow-xl transition-shadow">
                  Gestionar Videos
                </Button>
              </CardContent>
            </Card>
          )}

          <Card 
            className="group hover-scale hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border-2 border-teal-500/20 hover:border-teal-500/50 overflow-hidden relative"
            onClick={() => navigate('/business-loyalty')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-cyan-500/0 group-hover:from-teal-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />
            <CardHeader className="relative">
              <div className="p-3 rounded-xl bg-teal-500/10 w-fit mb-2 group-hover:scale-110 transition-transform duration-300">
                <Gift className="h-6 w-6 text-teal-600" />
              </div>
              <CardTitle className="text-xl">Programa de Lealtad</CardTitle>
              <CardDescription className="text-base">
                Configura sistema de puntos para premiar a tus clientes
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <Button className="w-full bg-teal-600 hover:bg-teal-700 shadow-lg group-hover:shadow-xl transition-shadow">
                Configurar Lealtad
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 border-2 border-slate-500/20 overflow-hidden relative opacity-75">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/0 to-gray-500/0 transition-all duration-300" />
            <CardHeader className="relative">
              <div className="p-3 rounded-xl bg-slate-500/10 w-fit mb-2">
                <BarChart3 className="h-6 w-6 text-slate-600" />
              </div>
              <CardTitle className="text-xl">Analíticas</CardTitle>
              <CardDescription className="text-base">
                Ve estadísticas detalladas de visitas, escaneos y engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <Button className="w-full" disabled>
                Próximamente
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-slate-50 to-zinc-50 dark:from-slate-950/30 dark:to-zinc-950/30 border-2 border-slate-500/20 overflow-hidden relative opacity-75">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/0 to-zinc-500/0 transition-all duration-300" />
            <CardHeader className="relative">
              <div className="p-3 rounded-xl bg-slate-500/10 w-fit mb-2">
                <Users className="h-6 w-6 text-slate-600" />
              </div>
              <CardTitle className="text-xl">Clientes</CardTitle>
              <CardDescription className="text-base">
                Ve la lista de clientes que han visitado tu establecimiento
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <Button className="w-full" disabled>
                Próximamente
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Bottom Navigation for mobile */}
      <BusinessBottomNav onMenuClick={() => setSidebarOpen(true)} />
    </div>
  );
};

export default BusinessDashboard;
