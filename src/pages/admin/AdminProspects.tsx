import { useState, useEffect, useRef } from 'react';
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
import { Plus, Search, Menu, Phone, MapPin, User, Calendar, Edit, Trash2, Eye, Filter, UserPlus, Globe, Instagram, Facebook, ArrowRightCircle, Upload, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type ProspectStatus = 'nuevo' | 'contactado' | 'interesado' | 'cliente' | 'descartado';

interface Prospect {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  contact_person: string | null;
  next_contact_date: string | null;
  contact_type: string | null;
  status: string;
  observation: string | null;
  notes: string | null;
  category: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  logo_url: string | null;
  first_contact_date: string | null;
  contacted_by: string | null;
  created_at: string;
  updated_at: string;
}

const emptyForm = {
  name: '',
  address: '',
  phone: '',
  contact_person: '',
  next_contact_date: '',
  contact_type: 'llamada',
  status: 'nuevo' as ProspectStatus,
  observation: '',
  notes: '',
  category: '',
  email: '',
  website: '',
  instagram: '',
  facebook: '',
  tiktok: '',
  logo_url: '',
  first_contact_date: '',
  contacted_by: '',
};

const statusColors: Record<string, string> = {
  nuevo: 'bg-blue-100 text-blue-800',
  contactado: 'bg-yellow-100 text-yellow-800',
  interesado: 'bg-purple-100 text-purple-800',
  cliente: 'bg-green-100 text-green-800',
  descartado: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  nuevo: '🆕 Nuevo',
  contactado: '📞 Contactado',
  interesado: '⭐ Interesado',
  cliente: '✅ Cliente',
  descartado: '❌ Descartado',
};

const categories = [
  'Comidas Rápidas', 'Café', 'Food Truck', 'Italiana', 'Parrilla',
  'Tradicional', 'Saludable', 'Mariscos', 'Postres', 'Panadería',
  'Asiática', 'Bar', 'Pizzería', 'Otro'
];

const teamMembers = ['Lino', 'Valentina', 'Nicol', 'Dorian'];

const AdminProspects = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Appointment creation from detail
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    title: '', description: '', appointment_date: '', appointment_time: '', contacted_by: '', notes: '',
  });
  const [savingAppointment, setSavingAppointment] = useState(false);

  useEffect(() => { fetchProspects(); }, []);

  const fetchProspects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast.error('Error al cargar prospectos: ' + error.message);
    else setProspects(data || []);
    setLoading(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Solo se permiten imágenes'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('El archivo no puede superar 5MB'); return; }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('prospect-logos')
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('prospect-logos').getPublicUrl(fileName);
      setForm(f => ({ ...f, logo_url: urlData.publicUrl }));
      toast.success('Logo subido exitosamente');
    } catch (err: any) {
      toast.error('Error al subir: ' + (err.message || ''));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('El nombre es obligatorio'); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        address: form.address || null,
        phone: form.phone || null,
        contact_person: form.contact_person || null,
        next_contact_date: form.next_contact_date || null,
        contact_type: form.contact_type || 'llamada',
        status: form.status,
        observation: form.observation || null,
        notes: form.notes || null,
        category: form.category || null,
        email: form.email || null,
        website: form.website || null,
        instagram: form.instagram || null,
        facebook: form.facebook || null,
        tiktok: form.tiktok || null,
        logo_url: form.logo_url || null,
        first_contact_date: form.first_contact_date || null,
        contacted_by: form.contacted_by || null,
      };

      if (editingId) {
        const { error } = await supabase.from('prospects').update(payload).eq('id', editingId);
        if (error) throw error;
        toast.success('✅ Prospecto actualizado');
      } else {
        const { error } = await supabase.from('prospects').insert(payload);
        if (error) throw error;
        toast.success('🎉 Prospecto creado exitosamente');
      }
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchProspects();
    } catch (err: any) {
      toast.error('Error: ' + (err.message || 'No se pudo guardar'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este prospecto?')) return;
    const { error } = await supabase.from('prospects').delete().eq('id', id);
    if (error) toast.error('Error al eliminar: ' + error.message);
    else { toast.success('Prospecto eliminado'); fetchProspects(); }
  };

  const handleConvertToClient = async (p: Prospect) => {
    if (!confirm(`¿Convertir "${p.name}" en cliente?`)) return;
    try {
      const { error: insertError } = await supabase.from('clients').insert({
        name: p.name, email: p.email || null, phone: p.phone || null,
        address: p.address || null, category: p.category || null,
        contact_person: p.contact_person || null, website: p.website || null,
        instagram: p.instagram || null, facebook: p.facebook || null,
        tiktok: p.tiktok || null, logo_url: p.logo_url || null,
        notes: p.notes || null, converted_from_prospect_id: p.id, status: 'activo',
      });
      if (insertError) throw insertError;
      await supabase.from('prospects').update({ status: 'cliente' }).eq('id', p.id);
      toast.success(`🎉 "${p.name}" convertido a cliente exitosamente`);
      fetchProspects();
      setDetailOpen(false);
    } catch (err: any) {
      toast.error('Error al convertir: ' + (err.message || ''));
    }
  };

  const handleSaveAppointment = async () => {
    if (!selectedProspect || !appointmentForm.title.trim() || !appointmentForm.appointment_date) {
      toast.error('Título y fecha son obligatorios');
      return;
    }
    setSavingAppointment(true);
    try {
      const { error } = await supabase.from('prospect_appointments').insert({
        prospect_id: selectedProspect.id,
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
    } finally {
      setSavingAppointment(false);
    }
  };

  const openEdit = (p: Prospect) => {
    setEditingId(p.id);
    setForm({
      name: p.name, address: p.address || '', phone: p.phone || '',
      contact_person: p.contact_person || '', next_contact_date: p.next_contact_date || '',
      contact_type: p.contact_type || 'llamada', status: p.status as ProspectStatus,
      observation: p.observation || '', notes: p.notes || '', category: p.category || '',
      email: p.email || '', website: p.website || '', instagram: p.instagram || '',
      facebook: p.facebook || '', tiktok: p.tiktok || '', logo_url: p.logo_url || '',
      first_contact_date: p.first_contact_date || '', contacted_by: p.contacted_by || '',
    });
    setDialogOpen(true);
  };

  const openNew = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };

  const filtered = prospects.filter(p => {
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.contact_person || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.phone || '').includes(search);
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    total: prospects.length,
    nuevo: prospects.filter(p => p.status === 'nuevo').length,
    contactado: prospects.filter(p => p.status === 'contactado').length,
    interesado: prospects.filter(p => p.status === 'interesado').length,
    cliente: prospects.filter(p => p.status === 'cliente').length,
    descartado: prospects.filter(p => p.status === 'descartado').length,
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
          <h1 className="text-lg font-bold">CRM Prospectos</h1>
          <Button size="sm" onClick={openNew}><Plus className="h-4 w-4" /></Button>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          <div className="hidden lg:flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">📋 CRM de Prospectos</h1>
              <p className="text-muted-foreground">Gestiona tus prospectos y clientes potenciales</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/admin/appointments')} className="gap-2">
                <Calendar className="h-4 w-4" /> Calendario de Citas
              </Button>
              <Button onClick={openNew} className="gap-2">
                <UserPlus className="h-4 w-4" /> Nuevo Prospecto
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
            {[
              { label: 'Total', value: counts.total, color: 'bg-muted' },
              { label: 'Nuevos', value: counts.nuevo, color: 'bg-blue-100 dark:bg-blue-900/30' },
              { label: 'Contactados', value: counts.contactado, color: 'bg-yellow-100 dark:bg-yellow-900/30' },
              { label: 'Interesados', value: counts.interesado, color: 'bg-purple-100 dark:bg-purple-900/30' },
              { label: 'Clientes', value: counts.cliente, color: 'bg-green-100 dark:bg-green-900/30' },
              { label: 'Descartados', value: counts.descartado, color: 'bg-red-100 dark:bg-red-900/30' },
            ].map(s => (
              <Card key={s.label} className={`${s.color} border-0`}>
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
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
                <SelectItem value="nuevo">🆕 Nuevo</SelectItem>
                <SelectItem value="contactado">📞 Contactado</SelectItem>
                <SelectItem value="interesado">⭐ Interesado</SelectItem>
                <SelectItem value="cliente">✅ Cliente</SelectItem>
                <SelectItem value="descartado">❌ Descartado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">Cargando...</div>
              ) : filtered.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No hay prospectos</p>
                  <p className="text-sm">Crea tu primer prospecto para empezar</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead className="hidden md:table-cell">Contactó</TableHead>
                        <TableHead className="hidden md:table-cell">Teléfono</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="hidden lg:table-cell">Próximo contacto</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map(p => (
                        <TableRow key={p.id} className="cursor-pointer" onClick={() => { setSelectedProspect(p); setDetailOpen(true); }}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {p.logo_url && <img src={p.logo_url} alt="" className="h-8 w-8 rounded-full object-cover" />}
                              <div>
                                <p className="font-medium">{p.name}</p>
                                {p.category && <p className="text-xs text-muted-foreground">{p.category}</p>}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{p.contacted_by || '-'}</TableCell>
                          <TableCell className="hidden md:table-cell">{p.phone || '-'}</TableCell>
                          <TableCell>
                            <Badge className={`${statusColors[p.status] || ''} border-0 text-xs`}>
                              {statusLabels[p.status] || p.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {p.next_contact_date ? format(new Date(p.next_contact_date), 'dd MMM yyyy', { locale: es }) : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end" onClick={e => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" onClick={() => { setSelectedProspect(p); setDetailOpen(true); }}><Eye className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Edit className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
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

          {/* Mobile: Calendar button */}
          <div className="lg:hidden">
            <Button variant="outline" className="w-full gap-2" onClick={() => navigate('/admin/appointments')}>
              <Calendar className="h-4 w-4" /> Ver Calendario de Citas
            </Button>
          </div>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? '✏️ Editar Prospecto' : '➕ Nuevo Prospecto'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label>Nombre del negocio *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ej: Burger King" />
              </div>
              <div>
                <Label>Encargado</Label>
                <Input value={form.contact_person} onChange={e => setForm(f => ({ ...f, contact_person: e.target.value }))} placeholder="Persona de contacto" />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="300 123 4567" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@ejemplo.com" />
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
                <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Dirección completa" />
              </div>

              {/* Quién contactó */}
              <div>
                <Label>¿Quién contactó?</Label>
                <Select value={form.contacted_by} onValueChange={v => setForm(f => ({ ...f, contacted_by: v }))}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent position="popper" className="z-[9999]">
                    {teamMembers.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Fecha primer contacto */}
              <div>
                <Label>Fecha primer contacto</Label>
                <Input type="date" value={form.first_contact_date} onChange={e => setForm(f => ({ ...f, first_contact_date: e.target.value }))} />
              </div>

              <div>
                <Label>Estado</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as ProspectStatus }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent position="popper" className="z-[9999]">
                    <SelectItem value="nuevo">🆕 Nuevo</SelectItem>
                    <SelectItem value="contactado">📞 Contactado</SelectItem>
                    <SelectItem value="interesado">⭐ Interesado</SelectItem>
                    <SelectItem value="cliente">✅ Cliente</SelectItem>
                    <SelectItem value="descartado">❌ Descartado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tipo de contacto</Label>
                <Select value={form.contact_type} onValueChange={v => setForm(f => ({ ...f, contact_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent position="popper" className="z-[9999]">
                    <SelectItem value="llamada">📞 Llamada</SelectItem>
                    <SelectItem value="visita">🚶 Visita</SelectItem>
                    <SelectItem value="whatsapp">💬 WhatsApp</SelectItem>
                    <SelectItem value="email">📧 Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Fecha próximo contacto</Label>
                <Input type="date" value={form.next_contact_date} onChange={e => setForm(f => ({ ...f, next_contact_date: e.target.value }))} />
              </div>
            </div>

            {/* Redes sociales */}
            <div>
              <p className="text-sm font-medium mb-3 flex items-center gap-2"><Globe className="h-4 w-4" /> Web y Redes Sociales</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Sitio Web</Label><Input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://ejemplo.com" /></div>
                <div><Label>Instagram</Label><Input value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} placeholder="@usuario" /></div>
                <div><Label>Facebook</Label><Input value={form.facebook} onChange={e => setForm(f => ({ ...f, facebook: e.target.value }))} placeholder="facebook.com/pagina" /></div>
                <div><Label>TikTok</Label><Input value={form.tiktok} onChange={e => setForm(f => ({ ...f, tiktok: e.target.value }))} placeholder="@usuario" /></div>
              </div>
            </div>

            {/* Logo upload */}
            <div>
              <Label>Logo del negocio</Label>
              <div className="flex items-center gap-3 mt-1">
                {form.logo_url && (
                  <img src={form.logo_url} alt="Logo" className="h-14 w-14 rounded-lg object-cover border" />
                )}
                <div className="flex-1">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? <><Loader2 className="h-4 w-4 animate-spin" /> Subiendo...</> : <><Upload className="h-4 w-4" /> {form.logo_url ? 'Cambiar logo' : 'Subir logo'}</>}
                  </Button>
                </div>
                {form.logo_url && (
                  <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => setForm(f => ({ ...f, logo_url: '' }))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label>Observación</Label>
              <Textarea value={form.observation} onChange={e => setForm(f => ({ ...f, observation: e.target.value }))} placeholder="Notas de la conversación..." rows={3} />
            </div>
            <div>
              <Label>Notas adicionales</Label>
              <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Información adicional..." rows={2} />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear Prospecto'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>📋 Detalle del Prospecto</DialogTitle></DialogHeader>
          {selectedProspect && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {selectedProspect.logo_url && <img src={selectedProspect.logo_url} alt="" className="h-14 w-14 rounded-full object-cover border" />}
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{selectedProspect.name}</h3>
                  {selectedProspect.category && <p className="text-sm text-muted-foreground">{selectedProspect.category}</p>}
                </div>
                <Badge className={`${statusColors[selectedProspect.status]} border-0`}>
                  {statusLabels[selectedProspect.status]}
                </Badge>
              </div>

              <div className="space-y-2">
                {selectedProspect.contacted_by && (
                  <div className="flex items-center gap-2 text-sm"><User className="h-4 w-4 text-muted-foreground" /><span>Contactó: <strong>{selectedProspect.contacted_by}</strong></span></div>
                )}
                {selectedProspect.first_contact_date && (
                  <div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-muted-foreground" /><span>Primer contacto: {format(new Date(selectedProspect.first_contact_date), "dd 'de' MMMM yyyy", { locale: es })}</span></div>
                )}
                {selectedProspect.contact_person && (
                  <div className="flex items-center gap-2 text-sm"><User className="h-4 w-4 text-muted-foreground" /><span>{selectedProspect.contact_person}</span></div>
                )}
                {selectedProspect.phone && (
                  <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /><a href={`tel:${selectedProspect.phone}`} className="text-primary hover:underline">{selectedProspect.phone}</a></div>
                )}
                {selectedProspect.address && (
                  <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{selectedProspect.address}</span></div>
                )}
                {selectedProspect.next_contact_date && (
                  <div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-muted-foreground" /><span>Próximo: {format(new Date(selectedProspect.next_contact_date), "dd 'de' MMMM yyyy", { locale: es })} — {selectedProspect.contact_type}</span></div>
                )}
              </div>

              {(selectedProspect.website || selectedProspect.instagram || selectedProspect.facebook || selectedProspect.tiktok) && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Web y Redes</p>
                  {selectedProspect.website && <div className="flex items-center gap-2 text-sm"><Globe className="h-4 w-4 text-muted-foreground" /><a href={selectedProspect.website} target="_blank" rel="noopener" className="text-primary hover:underline truncate">{selectedProspect.website}</a></div>}
                  {selectedProspect.instagram && <div className="flex items-center gap-2 text-sm"><Instagram className="h-4 w-4 text-muted-foreground" /><span>{selectedProspect.instagram}</span></div>}
                  {selectedProspect.facebook && <div className="flex items-center gap-2 text-sm"><Facebook className="h-4 w-4 text-muted-foreground" /><span>{selectedProspect.facebook}</span></div>}
                  {selectedProspect.tiktok && <div className="flex items-center gap-2 text-sm"><span className="text-xs font-bold text-muted-foreground">TT</span><span>{selectedProspect.tiktok}</span></div>}
                </div>
              )}

              {selectedProspect.observation && (
                <div><p className="text-xs font-medium text-muted-foreground mb-1">Observación</p><p className="text-sm bg-muted p-3 rounded-lg">{selectedProspect.observation}</p></div>
              )}
              {selectedProspect.notes && (
                <div><p className="text-xs font-medium text-muted-foreground mb-1">Notas</p><p className="text-sm bg-muted p-3 rounded-lg">{selectedProspect.notes}</p></div>
              )}

              <div className="flex flex-col gap-2 pt-2">
                {selectedProspect.status !== 'cliente' && (
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => handleConvertToClient(selectedProspect)}>
                    <ArrowRightCircle className="h-4 w-4 mr-2" /> Convertir a Cliente
                  </Button>
                )}
                <Button variant="outline" className="w-full" onClick={() => {
                  setAppointmentForm({ ...appointmentForm, title: `Cita con ${selectedProspect.name}` });
                  setAppointmentDialogOpen(true);
                }}>
                  <Calendar className="h-4 w-4 mr-2" /> Programar Cita
                </Button>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => { setDetailOpen(false); openEdit(selectedProspect); }}>
                    <Edit className="h-4 w-4 mr-2" /> Editar
                  </Button>
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
            <div>
              <Label>Título *</Label>
              <Input value={appointmentForm.title} onChange={e => setAppointmentForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fecha *</Label>
                <Input type="date" value={appointmentForm.appointment_date} onChange={e => setAppointmentForm(f => ({ ...f, appointment_date: e.target.value }))} />
              </div>
              <div>
                <Label>Hora</Label>
                <Input type="time" value={appointmentForm.appointment_time} onChange={e => setAppointmentForm(f => ({ ...f, appointment_time: e.target.value }))} />
              </div>
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
            <div>
              <Label>Descripción</Label>
              <Textarea value={appointmentForm.description} onChange={e => setAppointmentForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            <div>
              <Label>Notas</Label>
              <Textarea value={appointmentForm.notes} onChange={e => setAppointmentForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setAppointmentDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveAppointment} disabled={savingAppointment}>
                {savingAppointment ? 'Guardando...' : 'Programar Cita'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProspects;
