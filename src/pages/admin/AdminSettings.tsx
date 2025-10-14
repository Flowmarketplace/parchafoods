import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Shield, Bell, Database, Key } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminSettings = () => {
  const { toast } = useToast();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [requireEmailVerification, setRequireEmailVerification] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(true);

  const saveSettings = useMutation({
    mutationFn: async (settings: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return settings;
    },
    onSuccess: () => {
      toast({
        title: 'Configuración guardada',
        description: 'Los cambios han sido aplicados exitosamente',
      });
    },
  });

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Configuración del Sistema</h1>
          <p className="text-muted-foreground">
            Administra la configuración general de la plataforma
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">
              <SettingsIcon className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Seguridad
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="api">
              <Key className="h-4 w-4 mr-2" />
              API
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Configuración General</CardTitle>
                <CardDescription>
                  Ajustes básicos de la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo Mantenimiento</Label>
                    <p className="text-sm text-muted-foreground">
                      Desactiva temporalmente el acceso a la aplicación
                    </p>
                  </div>
                  <Switch
                    checked={maintenanceMode}
                    onCheckedChange={setMaintenanceMode}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Permitir Registro</Label>
                    <p className="text-sm text-muted-foreground">
                      Habilita el registro de nuevos usuarios
                    </p>
                  </div>
                  <Switch
                    checked={allowRegistration}
                    onCheckedChange={setAllowRegistration}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Seguridad</CardTitle>
                <CardDescription>
                  Gestiona las políticas de seguridad y acceso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Verificación de Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Requiere que los usuarios verifiquen su email
                    </p>
                  </div>
                  <Switch
                    checked={requireEmailVerification}
                    onCheckedChange={setRequireEmailVerification}
                  />
                </div>
                <div>
                  <Label>Duración de Sesión (minutos)</Label>
                  <Input
                    type="number"
                    defaultValue="60"
                    className="max-w-xs mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Tiempo antes de requerir inicio de sesión nuevamente
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Notificaciones</CardTitle>
                <CardDescription>
                  Gestiona las notificaciones push y por email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones Push</Label>
                    <p className="text-sm text-muted-foreground">
                      Habilita notificaciones push globalmente
                    </p>
                  </div>
                  <Switch
                    checked={enableNotifications}
                    onCheckedChange={setEnableNotifications}
                  />
                </div>
                <div>
                  <Label>Email de Remitente</Label>
                  <Input
                    type="email"
                    defaultValue="noreply@handcity.com"
                    className="max-w-md mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Email utilizado para enviar notificaciones
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de API</CardTitle>
                <CardDescription>
                  Gestiona las claves y límites de la API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Clave API Pública</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="text"
                      value="pk_live_********************"
                      disabled
                      className="flex-1"
                    />
                    <Button variant="outline">Regenerar</Button>
                  </div>
                </div>
                <div>
                  <Label>Límite de Solicitudes por Minuto</Label>
                  <Input
                    type="number"
                    defaultValue="100"
                    className="max-w-xs mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Número máximo de solicitudes permitidas por minuto
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline">Restablecer</Button>
          <Button
            onClick={() => saveSettings.mutate({
              maintenanceMode,
              allowRegistration,
              requireEmailVerification,
              enableNotifications,
            })}
            disabled={saveSettings.isPending}
          >
            {saveSettings.isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
