import { useEffect, useState } from 'react';
import { AdminSidebarDesktop } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Check, X, ShieldCheck, Megaphone, Store, UserPlus, Clock } from 'lucide-react';

type AppRole = 'admin' | 'business_owner' | 'sponsor' | 'customer';

interface RoleRow {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
  profile?: { full_name: string | null; phone: string | null } | null;
}

const AdminApprovals = () => {
  const [pendingSponsors, setPendingSponsors] = useState<any[]>([]);
  const [pendingPlanRequests, setPendingPlanRequests] = useState<any[]>([]);
  const [pendingBusinessOwners, setPendingBusinessOwners] = useState<RoleRow[]>([]);
  const [allRoles, setAllRoles] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignDialog, setAssignDialog] = useState<{ user: RoleRow; newRole: AppRole } | null>(null);
  const [rejectDialog, setRejectDialog] = useState<{ id: string; reason: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const [sponsorsRes, requestsRes, rolesRes, profilesRes, businessesRes] = await Promise.all([
      supabase.from('sponsors').select('*').eq('status', 'pendiente').order('created_at', { ascending: false }),
      supabase
        .from('sponsor_plan_requests')
        .select('*, sponsors(brand_name, email), sponsor_plans(name, price, currency)')
        .eq('status', 'pendiente')
        .order('created_at', { ascending: false }),
      supabase.from('user_roles').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, full_name, phone'),
      supabase.from('businesses').select('owner_id'),
    ]);

    const profilesMap = new Map((profilesRes.data || []).map((p: any) => [p.id, p]));
    const ownersWithBusiness = new Set((businessesRes.data || []).map((b: any) => b.owner_id));

    const enriched: RoleRow[] = (rolesRes.data || []).map((r: any) => ({
      ...r,
      profile: profilesMap.get(r.user_id) || null,
    }));

    setAllRoles(enriched);
    setPendingSponsors(sponsorsRes.data || []);
    setPendingPlanRequests(requestsRes.data || []);
    // business_owner roles whose user has NOT created a business yet → tratar como pendientes de revisión
    setPendingBusinessOwners(
      enriched.filter((r) => r.role === 'business_owner' && !ownersWithBusiness.has(r.user_id))
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const approveSponsor = async (id: string) => {
    const { error } = await supabase.from('sponsors').update({ status: 'aprobado' }).eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('Patrocinador aprobado');
    load();
  };

  const rejectSponsor = async (id: string, reason: string) => {
    const { error } = await supabase.from('sponsors').update({ status: 'rechazado', notes: reason }).eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('Patrocinador rechazado');
    setRejectDialog(null);
    load();
  };

  const handlePlanRequest = async (req: any, status: 'aprobada' | 'rechazada') => {
    const { error } = await supabase.from('sponsor_plan_requests').update({ status }).eq('id', req.id);
    if (error) return toast.error(error.message);
    if (status === 'aprobada') {
      const start = new Date();
      const end = new Date();
      end.setMonth(end.getMonth() + 1);
      await supabase
        .from('sponsors')
        .update({
          current_plan_id: req.plan_id,
          plan_start_date: start.toISOString().slice(0, 10),
          plan_end_date: end.toISOString().slice(0, 10),
        })
        .eq('id', req.sponsor_id);
    }
    toast.success(`Plan ${status}`);
    load();
  };

  const removeRole = async (roleRow: RoleRow) => {
    const { error } = await supabase.from('user_roles').delete().eq('id', roleRow.id);
    if (error) return toast.error(error.message);
    toast.success('Rol revocado');
    load();
  };

  const assignRole = async (userId: string, role: AppRole) => {
    const { error } = await supabase.from('user_roles').insert({ user_id: userId, role });
    if (error) return toast.error(error.message);
    toast.success(`Rol ${role} asignado`);
    setAssignDialog(null);
    load();
  };

  const totalPending =
    pendingSponsors.length + pendingPlanRequests.length + pendingBusinessOwners.length;

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebarDesktop />
      <div className="lg:ml-64 p-4 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Aprobaciones y Roles</h1>
            <p className="text-sm text-muted-foreground">
              Centraliza la aprobación de patrocinadores, dueños de negocio y solicitudes de plan.
            </p>
          </div>
          {totalPending > 0 && (
            <Badge variant="destructive" className="ml-auto">
              <Clock className="h-3 w-3 mr-1" /> {totalPending} pendientes
            </Badge>
          )}
        </div>

        <Tabs defaultValue="sponsors" className="w-full">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="sponsors">
              <Megaphone className="h-4 w-4 mr-1" />
              Patrocinadores ({pendingSponsors.length})
            </TabsTrigger>
            <TabsTrigger value="plans">
              Solicitudes de plan ({pendingPlanRequests.length})
            </TabsTrigger>
            <TabsTrigger value="businesses">
              <Store className="h-4 w-4 mr-1" />
              Dueños de negocio ({pendingBusinessOwners.length})
            </TabsTrigger>
            <TabsTrigger value="all-roles">Gestionar roles</TabsTrigger>
          </TabsList>

          {/* PATROCINADORES PENDIENTES */}
          <TabsContent value="sponsors" className="space-y-3 mt-4">
            {loading && <p className="text-muted-foreground">Cargando...</p>}
            {!loading && pendingSponsors.length === 0 && (
              <Card><CardContent className="p-6 text-center text-muted-foreground">Sin patrocinadores pendientes</CardContent></Card>
            )}
            {pendingSponsors.map((s) => (
              <Card key={s.id}>
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 md:items-center">
                  {s.logo_url && <img src={s.logo_url} alt={s.brand_name} className="w-16 h-16 rounded object-cover" />}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold">{s.brand_name}</h3>
                    <p className="text-sm text-muted-foreground">{s.contact_person} · {s.email} · {s.phone}</p>
                    {s.industry && <Badge variant="outline" className="mt-1">{s.industry}</Badge>}
                    {s.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => approveSponsor(s.id)}>
                      <Check className="h-4 w-4 mr-1" /> Aprobar
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setRejectDialog({ id: s.id, reason: '' })}>
                      <X className="h-4 w-4 mr-1" /> Rechazar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* PLAN REQUESTS */}
          <TabsContent value="plans" className="space-y-3 mt-4">
            {!loading && pendingPlanRequests.length === 0 && (
              <Card><CardContent className="p-6 text-center text-muted-foreground">Sin solicitudes de plan</CardContent></Card>
            )}
            {pendingPlanRequests.map((r: any) => (
              <Card key={r.id}>
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 md:items-center">
                  <div className="flex-1">
                    <h3 className="font-bold">{r.sponsors?.brand_name}</h3>
                    <p className="text-sm">
                      Plan: <strong>{r.sponsor_plans?.name}</strong> · {Number(r.sponsor_plans?.price).toLocaleString()} {r.sponsor_plans?.currency}
                    </p>
                    {r.message && <p className="text-xs text-muted-foreground mt-1">"{r.message}"</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handlePlanRequest(r, 'aprobada')}>
                      <Check className="h-4 w-4 mr-1" /> Activar plan
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handlePlanRequest(r, 'rechazada')}>
                      <X className="h-4 w-4 mr-1" /> Rechazar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* BUSINESS OWNERS PENDIENTES (sin negocio creado) */}
          <TabsContent value="businesses" className="space-y-3 mt-4">
            <p className="text-sm text-muted-foreground">
              Usuarios con rol de dueño de negocio que aún no han creado su restaurante.
              Puedes confirmar el rol o revocarlo si fue solicitud incorrecta.
            </p>
            {!loading && pendingBusinessOwners.length === 0 && (
              <Card><CardContent className="p-6 text-center text-muted-foreground">Sin dueños de negocio pendientes</CardContent></Card>
            )}
            {pendingBusinessOwners.map((r) => (
              <Card key={r.id}>
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 md:items-center">
                  <div className="flex-1">
                    <h3 className="font-bold">{r.profile?.full_name || 'Sin nombre'}</h3>
                    <p className="text-xs text-muted-foreground">{r.profile?.phone || 'Sin teléfono'}</p>
                    <p className="text-xs text-muted-foreground">Solicitado: {new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="secondary">Rol: {r.role}</Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => toast.success('Rol confirmado')}>
                      <Check className="h-4 w-4 mr-1" /> Mantener
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => removeRole(r)}>
                      <X className="h-4 w-4 mr-1" /> Revocar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* ALL ROLES MANAGEMENT */}
          <TabsContent value="all-roles" className="space-y-2 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Todos los roles asignados ({allRoles.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {allRoles.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.profile?.full_name || r.user_id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">{r.profile?.phone}</p>
                    </div>
                    <Badge>{r.role}</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAssignDialog({ user: r, newRole: 'customer' })}
                    >
                      <UserPlus className="h-4 w-4 mr-1" /> Añadir rol
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => removeRole(r)}>
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Reject sponsor dialog */}
        <Dialog open={!!rejectDialog} onOpenChange={(o) => !o && setRejectDialog(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Motivo del rechazo</DialogTitle></DialogHeader>
            <Textarea
              value={rejectDialog?.reason || ''}
              onChange={(e) => setRejectDialog((d) => d ? { ...d, reason: e.target.value } : null)}
              placeholder="Explica brevemente al patrocinador por qué fue rechazado"
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectDialog(null)}>Cancelar</Button>
              <Button variant="destructive" onClick={() => rejectDialog && rejectSponsor(rejectDialog.id, rejectDialog.reason)}>
                Rechazar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assign role dialog */}
        <Dialog open={!!assignDialog} onOpenChange={(o) => !o && setAssignDialog(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Asignar nuevo rol</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <p className="text-sm">Usuario: <strong>{assignDialog?.user.profile?.full_name || assignDialog?.user.user_id.slice(0, 8)}</strong></p>
              <Label>Rol</Label>
              <Select
                value={assignDialog?.newRole}
                onValueChange={(v) => setAssignDialog((d) => d ? { ...d, newRole: v as AppRole } : null)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Cliente</SelectItem>
                  <SelectItem value="business_owner">Dueño de negocio</SelectItem>
                  <SelectItem value="sponsor">Patrocinador</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAssignDialog(null)}>Cancelar</Button>
              <Button onClick={() => assignDialog && assignRole(assignDialog.user.user_id, assignDialog.newRole)}>
                Asignar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminApprovals;
