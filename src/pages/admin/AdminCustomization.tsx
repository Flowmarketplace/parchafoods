import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import AdminSidebar, { AdminSidebarDesktop } from '@/components/admin/AdminSidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Palette, Image, Type, Sparkles , Menu } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminCustomization = () => {
  const { toast } = useToast();
  const [primaryColor, setPrimaryColor] = useState('#8B5CF6');
  const [secondaryColor, setSecondaryColor] = useState('#10B981');
  const [appName, setAppName] = useState('Parcha Foods');
  const [appLogo, setAppLogo] = useState('');

  const saveCustomization = useMutation({
    mutationFn: async (settings: any) => {
      // Aquí se guardarían los cambios en la base de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      return settings;
    },
    onSuccess: () => {
      toast({
        title: 'Cambios guardados',
        description: 'La personalización ha sido actualizada exitosamente',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los cambios',
        variant: 'destructive',
      });
    },
  });

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminSidebarDesktop />
      <div className="flex-1 lg:ml-64 w-full">
        <header className="sticky top-0 z-30 bg-card border-b border-border px-3 sm:px-4 py-3">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden"><Menu className="h-5 w-5" /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64"><AdminSidebar /></SheetContent>
            </Sheet>
            <div>
              <h1 className="text-lg sm:text-3xl font-bold">Personalización Visual</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Personaliza la apariencia y marca de la aplicación
              </p>
            </div>
          </div>
        </header>
        <div className="p-3 sm:p-6">

        <Tabs defaultValue="colors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colors">
              <Palette className="h-4 w-4 mr-2" />
              Colores
            </TabsTrigger>
            <TabsTrigger value="branding">
              <Image className="h-4 w-4 mr-2" />
              Marca
            </TabsTrigger>
            <TabsTrigger value="typography">
              <Type className="h-4 w-4 mr-2" />
              Tipografía
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Color Principal</CardTitle>
                  <CardDescription>
                    Define el color principal de la aplicación
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="primary-color">Color Primario</Label>
                    <div className="flex gap-4 mt-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: primaryColor }}>
                    <p className="text-white font-medium">Vista previa</p>
                    <Button variant="secondary" className="mt-2">
                      Botón de ejemplo
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Color Secundario</CardTitle>
                  <CardDescription>
                    Define el color secundario de acentos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="secondary-color">Color Secundario</Label>
                    <div className="flex gap-4 mt-2">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: secondaryColor }}>
                    <p className="text-white font-medium">Vista previa</p>
                    <Button variant="outline" className="mt-2">
                      Botón de ejemplo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="branding">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Nombre de la Aplicación</CardTitle>
                  <CardDescription>
                    Personaliza el nombre mostrado en la app
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="app-name">Nombre</Label>
                  <Input
                    id="app-name"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="Nombre de la aplicación"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Logo de la Aplicación</CardTitle>
                  <CardDescription>
                    Sube el logo principal de la app
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="app-logo">URL del Logo</Label>
                    <Input
                      id="app-logo"
                      value={appLogo}
                      onChange={(e) => setAppLogo(e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  {appLogo && (
                    <div className="border rounded-lg p-4 flex items-center justify-center">
                      <img src={appLogo} alt="Logo preview" className="max-h-24" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="typography">
            <Card>
              <CardHeader>
                <CardTitle>Fuentes y Tipografía</CardTitle>
                <CardDescription>
                  Personaliza las fuentes utilizadas en la aplicación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Fuente Principal</Label>
                    <Input value="Inter" disabled />
                    <p className="text-sm text-muted-foreground mt-1">
                      Fuente utilizada para títulos y encabezados
                    </p>
                  </div>
                  <div>
                    <Label>Fuente Secundaria</Label>
                    <Input value="system-ui" disabled />
                    <p className="text-sm text-muted-foreground mt-1">
                      Fuente utilizada para el cuerpo de texto
                    </p>
                  </div>
                </div>
                <div className="border rounded-lg p-6 space-y-4">
                  <h3 className="text-2xl font-bold">Título de Ejemplo</h3>
                  <p className="text-lg">Subtítulo de ejemplo</p>
                  <p className="text-base">
                    Este es un párrafo de ejemplo mostrando cómo se verá el texto
                    en la aplicación con la tipografía seleccionada.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline">Restablecer</Button>
          <Button
            onClick={() => saveCustomization.mutate({
              primaryColor,
              secondaryColor,
              appName,
              appLogo,
            })}
            disabled={saveCustomization.isPending}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {saveCustomization.isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
        </div>

      </div>
    </div>
  );
};

export default AdminCustomization;
