import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ArrowLeft, Menu, Bell, MapPin, Users, Shield } from 'lucide-react';
import BusinessSidebar from '@/components/business/BusinessSidebar';
import BusinessBottomNav from '@/components/business/BusinessBottomNav';

const BusinessSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [businessId, setBusinessId] = useState<string>('');
  const [settings, setSettings] = useState({
    notifications_enabled: true,
    proximity_enabled: true,
    auto_approve_reviews: false,
    require_customer_verification: true,
  });

  useEffect(() => {
    checkAuthAndLoadSettings();
  }, []);

  const checkAuthAndLoadSettings = async () => {
    setLoading(false);
  };

  const handleSaveSettings = async () => {
    try {
      toast.success('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error al guardar configuración');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-card border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/business-dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Configuración</h1>
              <p className="text-sm text-muted-foreground">
                Gestiona las preferencias de tu negocio
              </p>
            </div>
          </div>
        </header>

        <main className="p-6 pb-24 lg:pb-6 max-w-4xl">
          <div className="space-y-6">
            {/* Notifications Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <CardTitle>Notificaciones</CardTitle>
                </div>
                <CardDescription>
                  Configura cómo y cuándo recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Habilitar notificaciones</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe alertas sobre nuevos clientes y actividad
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notifications_enabled}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, notifications_enabled: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Proximity Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <CardTitle>Proximidad GPS</CardTitle>
                </div>
                <CardDescription>
                  Controla las funciones basadas en ubicación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="proximity">Habilitar notificaciones de proximidad</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar notificaciones cuando clientes estén cerca
                    </p>
                  </div>
                  <Switch
                    id="proximity"
                    checked={settings.proximity_enabled}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, proximity_enabled: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Customer Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>Gestión de Clientes</CardTitle>
                </div>
                <CardDescription>
                  Configura cómo interactúas con tus clientes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="verification">Verificación de clientes</Label>
                    <p className="text-sm text-muted-foreground">
                      Requerir verificación para programas de lealtad
                    </p>
                  </div>
                  <Switch
                    id="verification"
                    checked={settings.require_customer_verification}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, require_customer_verification: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-approve">Auto-aprobar reseñas</Label>
                    <p className="text-sm text-muted-foreground">
                      Las reseñas se publican automáticamente sin revisión
                    </p>
                  </div>
                  <Switch
                    id="auto-approve"
                    checked={settings.auto_approve_reviews}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, auto_approve_reviews: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Seguridad</CardTitle>
                </div>
                <CardDescription>
                  Gestiona la seguridad de tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Contraseña actual</Label>
                  <Input id="current-password" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva contraseña</Label>
                  <Input id="new-password" type="password" placeholder="••••••••" />
                </div>
                <Button variant="outline" className="w-full">
                  Cambiar contraseña
                </Button>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={handleSaveSettings} className="flex-1">
                Guardar configuración
              </Button>
              <Button variant="outline" onClick={() => navigate('/business-dashboard')}>
                Cancelar
              </Button>
            </div>
          </div>
        </main>
      </div>

      <BusinessBottomNav onMenuClick={() => setSidebarOpen(true)} />
    </div>
  );
};

export default BusinessSettings;
