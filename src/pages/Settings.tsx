import { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 pt-16 md:pt-28">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 min-w-0">
          <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 max-w-2xl">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Configuración</h1>
              <p className="text-muted-foreground">
                Personaliza tu experiencia en Guía Cali
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notificaciones</CardTitle>
                  <CardDescription>
                    Configura cómo quieres recibir notificaciones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications" className="flex flex-col gap-1">
                      <span>Notificaciones push</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        Recibe actualizaciones sobre lugares nuevos
                      </span>
                    </Label>
                    <Switch
                      id="notifications"
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ubicación</CardTitle>
                  <CardDescription>
                    Servicios de ubicación y mapa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="location" className="flex flex-col gap-1">
                      <span>Servicios de ubicación</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        Permite acceso a tu ubicación para mejores recomendaciones
                      </span>
                    </Label>
                    <Switch
                      id="location"
                      checked={locationServices}
                      onCheckedChange={setLocationServices}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Acerca de</CardTitle>
                  <CardDescription>
                    Información de la aplicación
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Versión:</strong> 1.0.0</p>
                    <p><strong>Desarrollado por:</strong> Guía Cali Team</p>
                    <p className="text-muted-foreground">
                      Tu guía completa para descubrir los mejores lugares de Cali, Colombia.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
