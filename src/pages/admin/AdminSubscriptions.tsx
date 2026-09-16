import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminSidebar, { AdminSidebarDesktop } from '@/components/admin/AdminSidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, DollarSign, TrendingUp, AlertCircle, Menu, UserCog } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { formatMoney, subscriptionCommission, subscriptionValue } from '@/lib/sellerMath';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const AdminSubscriptions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sellers, setSellers] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ seller_id: 'none', custom_price: '', commission_percentage: '25', collected: false, collected_amount: '', seller_notes: '' });

  useEffect(() => {
    supabase.from('sellers').select('id, full_name, commission_percentage').eq('active', true).then(({ data }) => setSellers(data || []));
  }, []);

  // Fetch subscriptions with business and plan details
  const { data: subscriptions, isLoading, refetch } = useQuery({
    queryKey: ['admin-subscriptions', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('business_subscriptions')
        .select(`
          *,
          businesses (
            id,
            name,
            email,
            owner_id
          ),
          subscription_plans (
            name,
            price,
            currency,
            duration_days
          ),
          sellers (
            id,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Calculate stats
  const stats = {
    total: subscriptions?.length || 0,
    active: subscriptions?.filter(s => s.status === 'active').length || 0,
    expired: subscriptions?.filter(s => s.status === 'expired').length || 0,
    revenue: subscriptions?.reduce((sum, s) => {
      if (s.status === 'active' && s.subscription_plans) {
        return sum + Number(s.subscription_plans.price);
      }
      return sum;
    }, 0) || 0,
  };

  const filteredSubscriptions = subscriptions?.filter(sub => {
    if (!sub.businesses || typeof sub.businesses === 'string') return false;
    const matchesSearch = (sub.businesses as any).name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const openAssign = (sub: any) => {
    setEditing(sub);
    setForm({
      seller_id: sub.seller_id || 'none',
      custom_price: String(sub.custom_price ?? sub.subscription_plans?.price ?? ''),
      commission_percentage: String(sub.commission_percentage ?? 25),
      collected: !!sub.collected,
      collected_amount: String(sub.collected_amount ?? ''),
      seller_notes: sub.seller_notes || '',
    });
  };

  const saveAssign = async () => {
    if (!editing) return;
    const { error } = await supabase
      .from('business_subscriptions')
      .update({
        seller_id: form.seller_id === 'none' ? null : form.seller_id,
        custom_price: form.custom_price === '' ? null : Number(form.custom_price),
        commission_percentage: Number(form.commission_percentage || 25),
        collected: form.collected,
        collected_at: form.collected ? new Date().toISOString() : null,
        collected_amount: form.collected_amount === '' ? null : Number(form.collected_amount),
        seller_notes: form.seller_notes || null,
      })
      .eq('id', editing.id);
    if (error) {
      toast.error('No se pudo guardar');
      return;
    }
    toast.success('Suscripción actualizada');
    setEditing(null);
    refetch();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      active: 'default',
      expired: 'destructive',
      cancelled: 'secondary',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
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
              <h1 className="text-lg sm:text-3xl font-bold">Suscripciones</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Gestiona todas las suscripciones activas y su facturación
              </p>
            </div>
          </div>
        </header>
        <div className="p-3 sm:p-6">

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Activas</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Expiradas</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.expired}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.revenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por negocio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activas</SelectItem>
                  <SelectItem value="expired">Expiradas</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Suscripciones</CardTitle>
            <CardDescription>
              {filteredSubscriptions?.length || 0} suscripciones encontradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Cargando...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Negocio</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Comisión</TableHead>
                    <TableHead>Recaudo</TableHead>
                    <TableHead>Inicio</TableHead>
                    <TableHead>Fin</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions?.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">
                        {(subscription.businesses as any)?.name || 'N/A'}
                      </TableCell>
                      <TableCell>{subscription.subscription_plans?.name}</TableCell>
                      <TableCell>{formatMoney(subscriptionValue(subscription as any))}</TableCell>
                      <TableCell>
                        {(subscription as any).sellers?.full_name || (
                          <span className="text-muted-foreground text-xs">Sin asignar</span>
                        )}
                      </TableCell>
                      <TableCell className="text-primary font-medium">
                        {formatMoney(subscriptionCommission(subscription as any))}
                      </TableCell>
                      <TableCell>
                        <Badge variant={(subscription as any).collected ? 'default' : 'secondary'}>
                          {(subscription as any).collected ? 'Recaudado' : 'Pendiente'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(subscription.start_date), 'PP', { locale: es })}
                      </TableCell>
                      <TableCell>
                        {format(new Date(subscription.end_date), 'PP', { locale: es })}
                      </TableCell>
                      <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => openAssign(subscription)}>
                          <UserCog className="h-4 w-4 mr-1" />
                          Asignar vendedor
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        </div>

        <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{(editing?.businesses as any)?.name || 'Suscripción'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Vendedor asignado</Label>
                <Select value={form.seller_id} onValueChange={(v) => setForm({ ...form, seller_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecciona un vendedor" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin asignar</SelectItem>
                    {sellers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Valor de la suscripción (personalizado)</Label>
                <Input type="number" value={form.custom_price} onChange={(e) => setForm({ ...form, custom_price: e.target.value })} />
              </div>
              <div>
                <Label>Porcentaje de comisión (%)</Label>
                <Input type="number" value={form.commission_percentage} onChange={(e) => setForm({ ...form, commission_percentage: e.target.value })} />
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.collected} onCheckedChange={(v) => setForm({ ...form, collected: v })} />
                <span className="text-sm">Recaudado</span>
              </div>
              <div>
                <Label>Valor recaudado</Label>
                <Input type="number" value={form.collected_amount} onChange={(e) => setForm({ ...form, collected_amount: e.target.value })} />
              </div>
              <div>
                <Label>Notas</Label>
                <Textarea rows={3} value={form.seller_notes} onChange={(e) => setForm({ ...form, seller_notes: e.target.value })} />
              </div>
              <Button className="w-full" onClick={saveAssign}>Guardar</Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default AdminSubscriptions;
