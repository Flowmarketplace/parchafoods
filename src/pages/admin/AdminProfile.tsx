import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminSidebar, { AdminSidebarDesktop } from '@/components/admin/AdminSidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Menu, User, Mail, KeyRound, Loader2 } from 'lucide-react';

const AdminProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ['admin-profile-session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) throw new Error('Sin sesión');
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', data.user.id)
        .maybeSingle();
      return { user: data.user, profile };
    },
  });

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (session) {
      setFullName(session.profile?.full_name ?? '');
      setPhone(session.profile?.phone ?? '');
      setEmail(session.user.email ?? '');
    }
  }, [session]);

  const updateProfile = useMutation({
    mutationFn: async () => {
      if (!session) throw new Error('Sin sesión');
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() || null, phone: phone.trim() || null })
        .eq('id', session.user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Perfil actualizado', description: 'Tus datos han sido guardados.' });
      queryClient.invalidateQueries({ queryKey: ['admin-profile-session'] });
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const updateEmail = useMutation({
    mutationFn: async () => {
      const trimmed = email.trim().toLowerCase();
      if (!trimmed) throw new Error('Debes indicar un correo válido');
      const { error } = await supabase.auth.updateUser({ email: trimmed });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Correo en proceso',
        description: 'Revisa tu correo actual y el nuevo para confirmar el cambio.',
      });
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const updatePassword = useMutation({
    mutationFn: async () => {
      if (!session?.user.email) throw new Error('Sin sesión');
      if (newPassword.length < 8) throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
      if (newPassword !== confirmPassword) throw new Error('Las contraseñas no coinciden');
      // Reverify current password before updating
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: session.user.email,
        password: currentPassword,
      });
      if (signInError) throw new Error('La contraseña actual es incorrecta');
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Contraseña actualizada', description: 'Tu contraseña ha sido cambiada.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
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
              <h1 className="text-lg sm:text-3xl font-bold">Mi Perfil de Administrador</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Gestiona tu información, correo y contraseña
              </p>
            </div>
          </div>
        </header>

        <div className="p-3 sm:p-6 max-w-3xl">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" />Perfil</TabsTrigger>
              <TabsTrigger value="email"><Mail className="h-4 w-4 mr-2" />Correo</TabsTrigger>
              <TabsTrigger value="password"><KeyRound className="h-4 w-4 mr-2" />Contraseña</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>Actualiza tu nombre y datos de contacto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Nombre completo</Label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-2" />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2" />
                  </div>
                  <Button onClick={() => updateProfile.mutate()} disabled={updateProfile.isPending}>
                    {updateProfile.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Guardar cambios
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle>Correo Electrónico</CardTitle>
                  <CardDescription>
                    Cambiar tu correo enviará un enlace de confirmación a la nueva dirección
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Correo actual</Label>
                    <Input value={session?.user.email ?? ''} disabled className="mt-2" />
                  </div>
                  <div>
                    <Label>Nuevo correo</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <Button
                    onClick={() => updateEmail.mutate()}
                    disabled={updateEmail.isPending || email.trim().toLowerCase() === (session?.user.email ?? '')}
                  >
                    {updateEmail.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Actualizar correo
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Cambiar Contraseña</CardTitle>
                  <CardDescription>Por seguridad, debes confirmar tu contraseña actual</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Contraseña actual</Label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Nueva contraseña</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Mínimo 8 caracteres</p>
                  </div>
                  <div>
                    <Label>Confirmar nueva contraseña</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <Button
                    onClick={() => updatePassword.mutate()}
                    disabled={updatePassword.isPending || !currentPassword || !newPassword}
                  >
                    {updatePassword.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Cambiar contraseña
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
