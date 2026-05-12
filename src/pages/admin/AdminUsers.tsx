import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Loader2,
  Menu,
  MoreHorizontal,
  Pencil,
  Search,
  Shield,
  Store,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react';

import AdminSidebar, { AdminSidebarDesktop } from '@/components/admin/AdminSidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type AppRole = 'customer' | 'business_owner' | 'sponsor' | 'admin';

type AdminUser = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  roles: AppRole[];
};

type UserFormState = {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  role: AppRole;
};

const emptyForm: UserFormState = {
  email: '',
  password: '',
  full_name: '',
  phone: '',
  role: 'customer',
};

const roleOptions: { value: AppRole; label: string }[] = [
  { value: 'customer', label: 'Cliente' },
  { value: 'business_owner', label: 'Dueño de negocio' },
  { value: 'sponsor', label: 'Patrocinador' },
  { value: 'admin', label: 'Administrador' },
];

const roleLabels: Record<AppRole, string> = {
  customer: 'Cliente',
  business_owner: 'Negocio',
  sponsor: 'Patrocinador',
  admin: 'Admin',
};

const isAppRole = (value: string): value is AppRole =>
  roleOptions.some((role) => role.value === value);

const buildEditForm = (user: AdminUser): UserFormState => ({
  email: user.email ?? '',
  password: '',
  full_name: user.full_name ?? '',
  phone: user.phone ?? '',
  role: user.roles[0] ?? 'customer',
});

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | AppRole>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [roleDialogUser, setRoleDialogUser] = useState<AdminUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);
  const [createForm, setCreateForm] = useState<UserFormState>(emptyForm);
  const [editForm, setEditForm] = useState<UserFormState>(emptyForm);
  const [newRole, setNewRole] = useState<AppRole>('customer');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('admin-users', {
        body: { action: 'list' },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      return (data?.users ?? []) as AdminUser[];
    },
  });

  const users = usersQuery.data ?? [];

  const invalidateUsers = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
  };

  const createUserMutation = useMutation({
    mutationFn: async (payload: UserFormState) => {
      const { data, error } = await supabase.functions.invoke('admin-users', {
        body: { action: 'create', ...payload },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: async () => {
      toast({ title: 'Usuario creado', description: 'La cuenta fue creada correctamente.' });
      setIsCreateOpen(false);
      setCreateForm(emptyForm);
      await invalidateUsers();
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, payload }: { userId: string; payload: UserFormState }) => {
      const { data, error } = await supabase.functions.invoke('admin-users', {
        body: { action: 'update', userId, ...payload },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: async () => {
      toast({ title: 'Usuario actualizado', description: 'Los datos fueron guardados.' });
      setEditingUser(null);
      setEditForm(emptyForm);
      await invalidateUsers();
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { data, error } = await supabase.functions.invoke('admin-users', {
        body: { action: 'addRole', userId, role },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: async () => {
      toast({ title: 'Rol asignado', description: 'El rol fue agregado al usuario.' });
      setRoleDialogUser(null);
      setNewRole('customer');
      await invalidateUsers();
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { data, error } = await supabase.functions.invoke('admin-users', {
        body: { action: 'removeRole', userId, role },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: async () => {
      toast({ title: 'Rol removido', description: 'El rol fue retirado del usuario.' });
      await invalidateUsers();
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.functions.invoke('admin-users', {
        body: { action: 'delete', userId },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: async () => {
      toast({ title: 'Usuario eliminado', description: 'La cuenta fue eliminada del sistema.' });
      setDeleteUser(null);
      await invalidateUsers();
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        user.full_name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query);

      const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter);
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const stats = useMemo(
    () => ({
      total: users.length,
      customers: users.filter((user) => user.roles.includes('customer')).length,
      businesses: users.filter((user) => user.roles.includes('business_owner')).length,
      admins: users.filter((user) => user.roles.includes('admin')).length,
    }),
    [users]
  );

  const openEditDialog = (user: AdminUser) => {
    setEditingUser(user);
    setEditForm(buildEditForm(user));
  };

  const openRoleDialog = (user: AdminUser) => {
    setRoleDialogUser(user);
    const firstAvailableRole = roleOptions.find((role) => !user.roles.includes(role.value))?.value ?? 'customer';
    setNewRole(firstAvailableRole);
  };

  const submitCreate = () => {
    createUserMutation.mutate(createForm);
  };

  const submitEdit = () => {
    if (!editingUser) return;
    updateUserMutation.mutate({ userId: editingUser.id, payload: editForm });
  };

  const availableRoles = roleDialogUser
    ? roleOptions.filter((role) => !roleDialogUser.roles.includes(role.value))
    : roleOptions;

  const isBusy =
    createUserMutation.isPending ||
    updateUserMutation.isPending ||
    addRoleMutation.isPending ||
    removeRoleMutation.isPending ||
    deleteUserMutation.isPending;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminSidebarDesktop />
      <div className="flex-1 lg:ml-64 w-full">
        <header className="sticky top-0 z-30 bg-card border-b border-border px-3 sm:px-4 py-3">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <AdminSidebar />
              </SheetContent>
            </Sheet>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-3xl font-bold">Usuarios y Permisos</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Visualiza usuarios reales, edita perfiles y administra roles.
              </p>
            </div>
          </div>
        </header>

        <div className="p-3 sm:p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.customers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Negocios</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.businesses}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Admins</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.admins}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <CardTitle>Filtros</CardTitle>
                <CardDescription>Busca por nombre, email o teléfono.</CardDescription>
              </div>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Nuevo usuario
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear usuario</DialogTitle>
                    <DialogDescription>Registra una nueva cuenta y asigna su rol inicial.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                      <Label htmlFor="create-full-name">Nombre</Label>
                      <Input
                        id="create-full-name"
                        value={createForm.full_name}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="create-email">Email</Label>
                      <Input
                        id="create-email"
                        type="email"
                        value={createForm.email}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="correo@ejemplo.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="create-phone">Teléfono</Label>
                      <Input
                        id="create-phone"
                        value={createForm.phone}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="3001234567"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="create-password">Contraseña</Label>
                      <Input
                        id="create-password"
                        type="password"
                        value={createForm.password}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))}
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Rol inicial</Label>
                      <Select
                        value={createForm.role}
                        onValueChange={(value) => isAppRole(value) && setCreateForm((prev) => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={createUserMutation.isPending}>
                      Cancelar
                    </Button>
                    <Button onClick={submitCreate} disabled={createUserMutation.isPending}>
                      {createUserMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Crear usuario'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar usuario..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as 'all' | AppRole)}>
                  <SelectTrigger className="w-full sm:w-[220px]">
                    <SelectValue placeholder="Filtrar por rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los roles</SelectItem>
                    {roleOptions.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Usuarios</CardTitle>
              <CardDescription>{filteredUsers.length} usuarios encontrados</CardDescription>
            </CardHeader>
            <CardContent>
              {usersQuery.isLoading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Cargando usuarios...
                </div>
              ) : usersQuery.isError ? (
                <div className="space-y-3 py-6 text-center">
                  <p className="text-sm text-destructive">
                    {usersQuery.error instanceof Error ? usersQuery.error.message : 'No se pudieron cargar los usuarios.'}
                  </p>
                  <Button variant="outline" onClick={() => usersQuery.refetch()}>
                    Reintentar
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead>Fecha Registro</TableHead>
                        <TableHead className="w-[72px] text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                            No hay usuarios que coincidan con el filtro actual.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.full_name || 'Sin nombre'}</TableCell>
                            <TableCell>{user.email || '-'}</TableCell>
                            <TableCell>{user.phone || '-'}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-2">
                                {user.roles.length === 0 ? (
                                  <Badge variant="outline">Sin roles</Badge>
                                ) : (
                                  user.roles.map((role) => (
                                    <Badge key={role} variant="outline" className="gap-1 pr-1">
                                      <span>{roleLabels[role]}</span>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5"
                                        disabled={removeRoleMutation.isPending}
                                        onClick={() => removeRoleMutation.mutate({ userId: user.id, role })}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </Badge>
                                  ))
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{format(new Date(user.created_at), 'PP', { locale: es })}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                    <Pencil className="mr-2 h-4 w-4" /> Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openRoleDialog(user)}>
                                    <UserPlus className="mr-2 h-4 w-4" /> Agregar rol
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => setDeleteUser(user)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={!!editingUser}
        onOpenChange={(open) => {
          if (!open) {
            setEditingUser(null);
            setEditForm(emptyForm);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogDescription>Actualiza el perfil y el acceso de esta cuenta.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-full-name">Nombre</Label>
              <Input
                id="edit-full-name"
                value={editForm.full_name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, full_name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Teléfono</Label>
              <Input
                id="edit-phone"
                value={editForm.phone}
                onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-password">Nueva contraseña (opcional)</Label>
              <Input
                id="edit-password"
                type="password"
                value={editForm.password}
                onChange={(e) => setEditForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Déjala vacía para conservar la actual"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)} disabled={updateUserMutation.isPending}>
              Cancelar
            </Button>
            <Button onClick={submitEdit} disabled={updateUserMutation.isPending}>
              {updateUserMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!roleDialogUser}
        onOpenChange={(open) => {
          if (!open) {
            setRoleDialogUser(null);
            setNewRole('customer');
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar rol</DialogTitle>
            <DialogDescription>
              {roleDialogUser ? `Asigna un nuevo rol a ${roleDialogUser.full_name || roleDialogUser.email || 'este usuario'}.` : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <Label>Rol disponible</Label>
            <Select value={newRole} onValueChange={(value) => isAppRole(value) && setNewRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableRoles.length === 0 && (
              <p className="text-sm text-muted-foreground">Este usuario ya tiene todos los roles disponibles.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogUser(null)} disabled={addRoleMutation.isPending}>
              Cerrar
            </Button>
            <Button
              onClick={() => roleDialogUser && addRoleMutation.mutate({ userId: roleDialogUser.id, role: newRole })}
              disabled={addRoleMutation.isPending || availableRoles.length === 0}
            >
              {addRoleMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Agregar rol'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteUser
                ? `Esta acción eliminará la cuenta de ${deleteUser.full_name || deleteUser.email || 'este usuario'} y su acceso.`
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteUserMutation.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUser && deleteUserMutation.mutate(deleteUser.id)}
              disabled={deleteUserMutation.isPending || isBusy}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteUserMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUsers;
