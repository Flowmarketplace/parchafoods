import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminSidebar, { AdminSidebarDesktop } from '@/components/admin/AdminSidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Bell, Send, Users, Store , Menu } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const AdminNotifications = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState<'all' | 'customers' | 'businesses'>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch notification history
  const { data: notificationHistory } = useQuery({
    queryKey: ['admin-notification-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  // Send notification mutation
  const sendNotificationMutation = useMutation({
    mutationFn: async ({ title, message, audience }: { title: string; message: string; audience: string }) => {
      // Get target users based on audience
      let targetUserIds: string[] = [];

      if (audience === 'all') {
        const { data } = await supabase.from('profiles').select('id');
        targetUserIds = data?.map(u => u.id) || [];
      } else if (audience === 'customers') {
        const { data } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'customer');
        targetUserIds = data?.map(r => r.user_id) || [];
      } else if (audience === 'businesses') {
        const { data } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'business_owner');
        targetUserIds = data?.map(r => r.user_id) || [];
      }

      // Insert notifications for all target users
      const notifications = targetUserIds.map(userId => ({
        user_id: userId,
        title,
        message,
        type: 'admin',
      }));

      const { error } = await supabase.from('notifications').insert(notifications);
      if (error) throw error;

      return { count: notifications.length };
    },
    onSuccess: (data) => {
      toast({
        title: 'Notificaciones enviadas',
        description: `Se enviaron ${data.count} notificaciones exitosamente`,
      });
      setTitle('');
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['admin-notification-history'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudieron enviar las notificaciones',
        variant: 'destructive',
      });
    },
  });

  const handleSendNotification = () => {
    if (!title || !message) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos',
        variant: 'destructive',
      });
      return;
    }

    sendNotificationMutation.mutate({
      title,
      message,
      audience: targetAudience,
    });
  };

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
              <h1 className="text-lg sm:text-3xl font-bold">Notificaciones Masivas</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Envía notificaciones a usuarios y negocios
              </p>
            </div>
          </div>
        </header>
        <div className="p-3 sm:p-6">

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          {/* Send Notification Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Enviar Notificación
              </CardTitle>
              <CardDescription>
                Crea y envía notificaciones push a tus usuarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Título de la notificación"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="message">Mensaje</Label>
                <Textarea
                  id="message"
                  placeholder="Escribe tu mensaje aquí..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="audience">Audiencia</Label>
                <Select value={targetAudience} onValueChange={(value: any) => setTargetAudience(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Todos los usuarios
                      </div>
                    </SelectItem>
                    <SelectItem value="customers">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Solo clientes
                      </div>
                    </SelectItem>
                    <SelectItem value="businesses">
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4" />
                        Solo negocios
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleSendNotification} 
                className="w-full"
                disabled={sendNotificationMutation.isPending}
              >
                {sendNotificationMutation.isPending ? 'Enviando...' : 'Enviar Notificación'}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de Envío</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Total enviadas hoy</span>
                  </div>
                  <span className="font-bold">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Usuarios alcanzados</span>
                  </div>
                  <span className="font-bold">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Negocios alcanzados</span>
                  </div>
                  <span className="font-bold">156</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plantillas Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setTitle('Bienvenido al Mundial del Sabor');
                    setMessage('Descubre los mejores negocios cerca de ti');
                  }}
                >
                  Bienvenida
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setTitle('Nuevas ofertas disponibles');
                    setMessage('Revisa las últimas promociones de tus negocios favoritos');
                  }}
                >
                  Promociones
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setTitle('Actualización de la app');
                    setMessage('Nuevas funcionalidades disponibles. ¡Actualiza ahora!');
                  }}
                >
                  Actualizaciones
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Notification History */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Notificaciones</CardTitle>
            <CardDescription>Últimas notificaciones enviadas</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Mensaje</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notificationHistory?.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell className="font-medium">{notification.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{notification.message}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{notification.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(notification.created_at), 'PPp', { locale: es })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        </div>

      </div>
    </div>
  );
};

export default AdminNotifications;
