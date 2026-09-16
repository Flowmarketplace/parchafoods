import { useState, useEffect } from 'react';
import { AdminSidebarDesktop } from '@/components/admin/AdminSidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Search, Menu, Phone, MapPin, User, Edit, Trash2, Eye, Filter, Globe, Instagram, Facebook, UserCheck, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  category: string | null;
  contact_person: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  logo_url: string | null;
  notes: string | null;
  status: string;
  converted_from_prospect_id: string | null;
  created_at: string;
  updated_at: string;
  seller_id?: string | null;
  business_id?: string | null;
}

const isActiveStatus = (status: string) => ['activo', 'active'].includes((status || '').toLowerCase());

const money = (value: number) => `$${Math.round(value).toLocaleString('es-CO')}`;

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  category: '',
  contact_person: '',
  website: '',
  instagram: '',
  facebook: '',
  tiktok: '',
  logo_url: '',
  notes: '',
  status: 'activo',
};

const categories = [
  'Comidas Rápidas', 'Café', 'Food Truck', 'Italiana', 'Parrilla',
  'Tradicional', 'Saludable', 'Mariscos', 'Postres', 'Panadería',
  'Asiática', 'Bar', 'Pizzería', 'Otro'
];

const AdminClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Appointment
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({ title: '', description: '', appointment_date: '', appointment_time: '', contacted_by: '', notes: '' });
  const [savingAppointment, setSavingAppointment] = useState(false);
  const teamMembers = ['Lino', 'Valentina', 'Nicol', 'Dorian'];

  const handleSaveAppointment = async () => {
    if (!selectedClient || !appointmentForm.title.trim() || !appointmentForm.appointment_date) {
      toast.error('Título y fecha son obligatorios'); return;
    }
    setSavingAppointment(true);
    try {
      const { error } = await supabase.from('prospect_appointments').insert({
        client_id: selectedClient.id,
        prospect_id: null,
        title: appointmentForm.title.trim(),
        description: appointmentForm.description || null,
        appointment_date: appointmentForm.appointment_date,
        appointment_time: appointmentForm.appointment_time || null,
        contacted_by: appointmentForm.contacted_by || null,
        notes: appointmentForm.notes || null,
      });
      if (error) throw error;
      toast.success('📅 Cita programada exitosamente');
      setAppointmentDialogOpen(false);
      setAppointmentForm({ title: '', description: '', appointment_date: '', appointment_time: '', contacted_by: '', notes: '' });
    } catch (err: any) {
      toast.error('Error: ' + (err.message || ''));
    } finally { setSavingAppointment(false); }
  };

  useEffect(() => { fetchClients(); }, []);

  const fetchClients = async () => {
    setLoading(true);
    const [{ data, error }, { data: sellersData }, { data: subsData }] = await Promise.all([
      supabase.from('clients').select('*').order('created_at', { ascending: false }),
      supabase.from('sellers').select('id, full_name'),
      supabase
        .from('business_subscriptions')
        .select('*, subscription_plans(name, price)')
        .order('start_date', { ascending: false }),
    ]);
    if (error) {
      toast.error('Error al cargar clientes: ' + error.message);
    } else {
      setClients((data as any) || []);
    }
    setSellers(sellersData || []);
    setSubs(subsData || []);
    setLoading(false);
  };

  const sellerName = (id?: string | null) => sellers.find((s) => s.id === id)?.full_name || null;
  const subFor = (c: Client) => subs.find((s) => s.business_id && s.business_id === c.business_id);

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('El nombre es obligatorio'); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email || null,
        phone: form.phone || null,
        address: form.address || null,
        category: form.category || null,
        contact_person: form.contact_person || null,
        website: form.website || null,
        instagram: form.instagram || null,
        facebook: form.facebook || null,
        tiktok: form.tiktok || null,
        logo_url: form.logo_url || null,
        notes: form.notes || null,
        status: form.status,
      };
      if (editingId) {
        const { error } = await supabase.from('clients').update(payload).eq('id', editingId);
        if (error) throw error;
        toast.success('✅ Cliente actualizado');
      } else {
        const { error } = await supabase.from('clients').insert(payload);
        if (error) throw error;
        toast.success('🎉 Cliente creado exitosamente');
      }
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchClients();
    } catch (err: any) {
      toast.error('Error: ' + (err.message || 'No se pudo guardar'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return;
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) toast.error('Error al eliminar: ' + error.message);
    else { toast.success('Cliente eliminado'); fetchClients(); }
  };

  const openEdit = (c: Client) => {
    setEditingId(c.id);
    setForm({
      name: c.name, email: c.email || '', phone: c.phone || '',
      address: c.address || '', category: c.category || '',
      contact_person: c.contact_person || '', website: c.website || '',
      instagram: c.instagram || '', facebook: c.facebook || '',
      tiktok: c.tiktok || '', logo_url: c.logo_url || '',
      notes: c.notes || '', status: c.status,
    });
    setDialogOpen(true);
  };

  const openNew = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };

  const filtered = clients.filter(c => {
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.contact_person || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.phone || '').includes(search);
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'activo' ? isActiveStatus(c.status) : !isActiveStatus(c.status));
    return matchSearch && matchStatus;
  });

  const counts = {
    total: clients.length,
    activo: clients.filter(c => isActiveStatus(c.status)).length,
    inactivo: clients.filter(c => !isActiveStatus(c.status)).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebarDesktop />
      <div className="lg:ml-64">
        <div className="lg:hidden flex items-center justify-between p-4 border-b">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64"><AdminSidebar /></SheetContent>
          </Sheet>
          <h1 className="text-lg font-bold">Clientes</h1>
          <Button size="sm" onClick={openNew}><Plus className="h-4 w-4" /></Button>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          <div className="hidden lg:flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">👥 Clientes</h1>
              <p className="text-muted-foreground">Gestiona tus clientes activos</p>
            </div>
            <Button onClick={openNew} className="gap-2"><UserCheck className="h-4 w-4" /> Nuevo Cliente</Button>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {[
              { label: 'Total', value: counts.total, color: 'bg-muted' },
              { label: 'Activos', value: counts.activo, color: 'bg-green-100 dark:bg-green-900/30' },
              { label: 'Inactivos', value: counts.inactivo, color: 'bg-red-100 dark:bg-red-900/30' },
            ].map(s => (
              <Card key={s.label} className={`${s.color} border-0`}>
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nombre, encargado o teléfono..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[9999]">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="activo">✅ Activo</SelectItem>
                <SelectItem value="inactivo">❌ Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">Cargando...</div>
              ) : filtered.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <UserCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No hay clientes</p>
                  <p className="text-sm">Convierte prospectos o crea un nuevo cliente</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead className="hidden md:table-cell">Encargado</TableHead>
                        <TableHead className="hidden md:table-cell">Teléfono</TableHead>
                        <TableHead className="hidden lg:table-cell">Categoría</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map(c => (
                        <TableRow key={c.id} className="cursor-pointer" onClick={() => { setSelectedClient(c); setDetailOpen(true); }}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {c.logo_url && <img src={c.logo_url} alt="" className="h-8 w-8 rounded-full object-cover" />}
                              <div>
                                <p className="font-medium">{c.name}</p>
                                {c.email && <p className="text-xs text-muted-foreground">{c.email}</p>}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{c.contact_person || '-'}</TableCell>
                          <TableCell className="hidden md:table-cell">{c.phone || '-'}</TableCell>
                          <TableCell className="hidden lg:table-cell">{c.category || '-'}</TableCell>
                          <TableCell>
                            <Badge className={`border-0 text-xs ${c.status === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {c.status === 'activo' ? '✅ Activo' : '❌ Inactivo'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end" onClick={e => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" onClick={() => { setSelectedClient(c); setDetailOpen(true); }}><Eye className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Edit className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? '✏️ Editar Cliente' : '➕ Nuevo Cliente'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label>Nombre del negocio *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ej: Burger King" />
              </div>
              <div>
                <Label>Encargado</Label>
                <Input value={form.contact_person} onChange={e => setForm(f => ({ ...f, contact_person: e.target.value }))} />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <Label>Categoría</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent position="popper" className="max-h-60 overflow-y-auto z-[9999]">
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label>Dirección</Label>
                <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              </div>
              <div>
                <Label>Estado</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent position="popper" className="z-[9999]">
                    <SelectItem value="activo">✅ Activo</SelectItem>
                    <SelectItem value="inactivo">❌ Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-3 flex items-center gap-2"><Globe className="h-4 w-4" /> Web y Redes Sociales</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Sitio Web</Label><Input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} /></div>
                <div><Label>Instagram</Label><Input value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} /></div>
                <div><Label>Facebook</Label><Input value={form.facebook} onChange={e => setForm(f => ({ ...f, facebook: e.target.value }))} /></div>
                <div><Label>TikTok</Label><Input value={form.tiktok} onChange={e => setForm(f => ({ ...f, tiktok: e.target.value }))} /></div>
              </div>
            </div>
            <div><Label>URL del Logo</Label><Input value={form.logo_url} onChange={e => setForm(f => ({ ...f, logo_url: e.target.value }))} /></div>
            <div><Label>Notas</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} /></div>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear Cliente'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>👤 Detalle del Cliente</DialogTitle></DialogHeader>
          {selectedClient && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {selectedClient.logo_url && <img src={selectedClient.logo_url} alt="" className="h-14 w-14 rounded-full object-cover border" />}
                <div>
                  <h3 className="text-lg font-bold">{selectedClient.name}</h3>
                  {selectedClient.category && <p className="text-sm text-muted-foreground">{selectedClient.category}</p>}
                </div>
                <Badge className={`ml-auto border-0 text-xs ${selectedClient.status === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {selectedClient.status === 'activo' ? '✅ Activo' : '❌ Inactivo'}
                </Badge>
              </div>
              <div className="space-y-2">
                {selectedClient.contact_person && <div className="flex items-center gap-2 text-sm"><User className="h-4 w-4 text-muted-foreground" /><span>{selectedClient.contact_person}</span></div>}
                {selectedClient.phone && <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /><a href={`tel:${selectedClient.phone}`} className="text-primary hover:underline">{selectedClient.phone}</a></div>}
                {selectedClient.email && <div className="flex items-center gap-2 text-sm"><span className="h-4 w-4 text-muted-foreground">✉️</span><span>{selectedClient.email}</span></div>}
                {selectedClient.address && <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{selectedClient.address}</span></div>}
              </div>
              {(selectedClient.website || selectedClient.instagram || selectedClient.facebook || selectedClient.tiktok) && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Web y Redes</p>
                  {selectedClient.website && <div className="flex items-center gap-2 text-sm"><Globe className="h-4 w-4 text-muted-foreground" /><a href={selectedClient.website} target="_blank" rel="noopener" className="text-primary hover:underline truncate">{selectedClient.website}</a></div>}
                  {selectedClient.instagram && <div className="flex items-center gap-2 text-sm"><Instagram className="h-4 w-4 text-muted-foreground" /><span>{selectedClient.instagram}</span></div>}
                  {selectedClient.facebook && <div className="flex items-center gap-2 text-sm"><Facebook className="h-4 w-4 text-muted-foreground" /><span>{selectedClient.facebook}</span></div>}
                  {selectedClient.tiktok && <div className="flex items-center gap-2 text-sm"><span className="h-4 w-4 text-muted-foreground text-xs font-bold">TT</span><span>{selectedClient.tiktok}</span></div>}
                </div>
              )}
              {selectedClient.notes && (
                <div><p className="text-xs font-medium text-muted-foreground mb-1">Notas</p><p className="text-sm bg-muted p-3 rounded-lg">{selectedClient.notes}</p></div>
              )}
              {selectedClient.converted_from_prospect_id && (
                <p className="text-xs text-muted-foreground">🔄 Convertido desde prospecto</p>
              )}
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="outline" className="w-full" onClick={() => {
                  setAppointmentForm({ ...appointmentForm, title: `Cita con ${selectedClient.name}` });
                  setAppointmentDialogOpen(true);
                }}>
                  <Calendar className="h-4 w-4 mr-2" /> Programar Cita
                </Button>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => { setDetailOpen(false); openEdit(selectedClient); }}><Edit className="h-4 w-4 mr-2" /> Editar</Button>
                  <Button variant="outline" onClick={() => setDetailOpen(false)}>Cerrar</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Appointment Dialog */}
      <Dialog open={appointmentDialogOpen} onOpenChange={setAppointmentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>📅 Programar Cita</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Título *</Label><Input value={appointmentForm.title} onChange={e => setAppointmentForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Fecha *</Label><Input type="date" value={appointmentForm.appointment_date} onChange={e => setAppointmentForm(f => ({ ...f, appointment_date: e.target.value }))} /></div>
              <div><Label>Hora</Label><Input type="time" value={appointmentForm.appointment_time} onChange={e => setAppointmentForm(f => ({ ...f, appointment_time: e.target.value }))} /></div>
            </div>
            <div>
              <Label>Responsable</Label>
              <Select value={appointmentForm.contacted_by} onValueChange={v => setAppointmentForm(f => ({ ...f, contacted_by: v }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent position="popper" className="z-[9999]">
                  {teamMembers.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Descripción</Label><Textarea value={appointmentForm.description} onChange={e => setAppointmentForm(f => ({ ...f, description: e.target.value }))} rows={2} /></div>
            <div><Label>Notas</Label><Textarea value={appointmentForm.notes} onChange={e => setAppointmentForm(f => ({ ...f, notes: e.target.value }))} rows={2} /></div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setAppointmentDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveAppointment} disabled={savingAppointment}>{savingAppointment ? 'Guardando...' : 'Programar Cita'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminClients;
