import { useState, useEffect } from 'react';
import { AdminSidebarDesktop } from '@/components/admin/AdminSidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Menu, Calendar, ChevronLeft, ChevronRight, Clock, User, Plus, Edit, Trash2, Check, X, UserCheck, Users } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

interface Appointment {
  id: string;
  prospect_id: string | null;
  client_id: string | null;
  title: string;
  description: string | null;
  appointment_date: string;
  appointment_time: string | null;
  contacted_by: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  contact_name?: string;
  contact_type?: 'prospect' | 'client';
}

interface ContactOption {
  id: string;
  name: string;
  type: 'prospect' | 'client';
}

const teamMembers = ['Lino', 'Valentina', 'Nicol', 'Dorian'];

const statusConfig: Record<string, { label: string; color: string }> = {
  programada: { label: '📅 Programada', color: 'bg-blue-100 text-blue-800' },
  completada: { label: '✅ Completada', color: 'bg-green-100 text-green-800' },
  cancelada: { label: '❌ Cancelada', color: 'bg-red-100 text-red-800' },
};

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [contacts, setContacts] = useState<ContactOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [filterResponsible, setFilterResponsible] = useState<string>('all');
  const [form, setForm] = useState({
    contact_key: '', title: '', description: '', appointment_date: '',
    appointment_time: '', contacted_by: '', notes: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [apptRes, prospRes, clientRes] = await Promise.all([
      supabase.from('prospect_appointments').select('*').order('appointment_date', { ascending: true }),
      supabase.from('prospects').select('id, name').order('name'),
      supabase.from('clients').select('id, name').order('name'),
    ]);

    if (apptRes.error) toast.error('Error citas: ' + apptRes.error.message);

    const prospectsData = prospRes.data || [];
    const clientsData = clientRes.data || [];

    const prospectMap = Object.fromEntries(prospectsData.map(p => [p.id, p.name]));
    const clientMap = Object.fromEntries(clientsData.map(c => [c.id, c.name]));

    // Build unified contact list
    const allContacts: ContactOption[] = [
      ...prospectsData.map(p => ({ id: p.id, name: p.name, type: 'prospect' as const })),
      ...clientsData.map(c => ({ id: c.id, name: c.name, type: 'client' as const })),
    ];
    setContacts(allContacts);

    setAppointments((apptRes.data || []).map(a => {
      let contact_name = 'Sin asignar';
      let contact_type: 'prospect' | 'client' = 'prospect';
      if (a.client_id && clientMap[a.client_id]) {
        contact_name = clientMap[a.client_id];
        contact_type = 'client';
      } else if (a.prospect_id && prospectMap[a.prospect_id]) {
        contact_name = prospectMap[a.prospect_id];
        contact_type = 'prospect';
      }
      return { ...a, contact_name, contact_type };
    }));
    setLoading(false);
  };

  const parseContactKey = (key: string) => {
    const [type, id] = key.split('::');
    return { type, id };
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.appointment_date || !form.contact_key) {
      toast.error('Título, contacto y fecha son obligatorios');
      return;
    }
    setSaving(true);
    try {
      const { type, id } = parseContactKey(form.contact_key);
      const payload: any = {
        title: form.title.trim(),
        description: form.description || null,
        appointment_date: form.appointment_date,
        appointment_time: form.appointment_time || null,
        contacted_by: form.contacted_by || null,
        notes: form.notes || null,
        prospect_id: type === 'prospect' ? id : null,
        client_id: type === 'client' ? id : null,
      };
      if (editingId) {
        const { error } = await supabase.from('prospect_appointments').update(payload).eq('id', editingId);
        if (error) throw error;
        toast.success('✅ Cita actualizada');
      } else {
        const { error } = await supabase.from('prospect_appointments').insert(payload);
        if (error) throw error;
        toast.success('📅 Cita creada');
      }
      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      toast.error('Error: ' + (err.message || ''));
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    const { error } = await supabase.from('prospect_appointments').update({ status }).eq('id', id);
    if (error) toast.error('Error: ' + error.message);
    else { toast.success('Estado actualizado'); fetchData(); setDetailDialogOpen(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta cita?')) return;
    const { error } = await supabase.from('prospect_appointments').delete().eq('id', id);
    if (error) toast.error('Error: ' + error.message);
    else { toast.success('Cita eliminada'); fetchData(); setDetailDialogOpen(false); }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ contact_key: '', title: '', description: '', appointment_date: '', appointment_time: '', contacted_by: '', notes: '' });
  };

  const openNew = (date?: Date) => {
    resetForm();
    if (date) setForm(f => ({ ...f, appointment_date: format(date, 'yyyy-MM-dd') }));
    setDialogOpen(true);
  };

  const openEdit = (a: Appointment) => {
    setEditingId(a.id);
    const contactKey = a.client_id ? `client::${a.client_id}` : a.prospect_id ? `prospect::${a.prospect_id}` : '';
    setForm({
      contact_key: contactKey, title: a.title, description: a.description || '',
      appointment_date: a.appointment_date, appointment_time: a.appointment_time || '',
      contacted_by: a.contacted_by || '', notes: a.notes || '',
    });
    setDialogOpen(true);
  };

  // Calendar
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calStart, end: calEnd });

  const filteredAppointments = appointments.filter(a =>
    filterResponsible === 'all' || a.contacted_by === filterResponsible
  );

  const getAppointmentsForDay = (day: Date) =>
    filteredAppointments.filter(a => isSameDay(new Date(a.appointment_date), day));

  const selectedDayAppointments = selectedDate ? getAppointmentsForDay(selectedDate) : [];

  const today = new Date();
  const upcoming = filteredAppointments
    .filter(a => new Date(a.appointment_date) >= today && a.status === 'programada')
    .slice(0, 10);

  const counts = {
    total: filteredAppointments.length,
    programada: filteredAppointments.filter(a => a.status === 'programada').length,
    completada: filteredAppointments.filter(a => a.status === 'completada').length,
    cancelada: filteredAppointments.filter(a => a.status === 'cancelada').length,
  };

  const ContactTypeBadge = ({ type }: { type?: 'prospect' | 'client' }) => (
    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${type === 'client' ? 'border-green-300 text-green-700' : 'border-blue-300 text-blue-700'}`}>
      {type === 'client' ? '👤 Cliente' : '📋 Prospecto'}
    </Badge>
  );

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
          <h1 className="text-lg font-bold">Calendario de Citas</h1>
          <Button size="sm" onClick={() => openNew()}><Plus className="h-4 w-4" /></Button>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          <div className="hidden lg:flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">📅 Calendario de Citas</h1>
              <p className="text-muted-foreground">Seguimiento de citas con prospectos y clientes</p>
            </div>
            <Button onClick={() => openNew()} className="gap-2"><Plus className="h-4 w-4" /> Nueva Cita</Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {[
              { label: 'Total', value: counts.total, color: 'bg-muted' },
              { label: 'Programadas', value: counts.programada, color: 'bg-blue-100 dark:bg-blue-900/30' },
              { label: 'Completadas', value: counts.completada, color: 'bg-green-100 dark:bg-green-900/30' },
              { label: 'Canceladas', value: counts.cancelada, color: 'bg-red-100 dark:bg-red-900/30' },
            ].map(s => (
              <Card key={s.label} className={`${s.color} border-0`}>
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filter */}
          <div className="flex gap-3">
            <Select value={filterResponsible} onValueChange={setFilterResponsible}>
              <SelectTrigger className="w-48">
                <User className="h-4 w-4 mr-2" /><SelectValue placeholder="Responsable" />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[9999]">
                <SelectItem value="all">Todos</SelectItem>
                {teamMembers.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <CardTitle className="text-lg capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: es })}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                    <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map(day => {
                    const dayAppts = getAppointmentsForDay(day);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const inMonth = isSameMonth(day, currentMonth);
                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        className={`
                          relative p-1 min-h-[48px] md:min-h-[64px] rounded-lg text-sm transition-colors text-left
                          ${!inMonth ? 'text-muted-foreground/40' : ''}
                          ${isToday(day) ? 'ring-2 ring-primary' : ''}
                          ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'}
                        `}
                      >
                        <span className={`text-xs font-medium ${isToday(day) ? 'text-primary font-bold' : ''}`}>
                          {format(day, 'd')}
                        </span>
                        {dayAppts.length > 0 && (
                          <div className="mt-0.5 space-y-0.5">
                            {dayAppts.slice(0, 2).map(a => (
                              <div
                                key={a.id}
                                className={`text-[10px] leading-tight truncate rounded px-1 py-0.5 ${
                                  a.status === 'completada' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                  a.status === 'cancelada' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                }`}
                              >
                                {a.contact_type === 'client' ? '👤' : '📋'} {a.title}
                              </div>
                            ))}
                            {dayAppts.length > 2 && (
                              <p className="text-[10px] text-muted-foreground">+{dayAppts.length - 2} más</p>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Sidebar */}
            <div className="space-y-4">
              {selectedDate ? (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base capitalize">
                        {format(selectedDate, "EEEE dd 'de' MMMM", { locale: es })}
                      </CardTitle>
                      <Button size="sm" variant="outline" onClick={() => openNew(selectedDate)}>
                        <Plus className="h-3 w-3 mr-1" /> Cita
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedDayAppointments.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-sm text-muted-foreground mb-3">No hay citas este día</p>
                        <Button size="sm" onClick={() => openNew(selectedDate)} className="gap-1">
                          <Plus className="h-3 w-3" /> Crear cita
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedDayAppointments.map(a => (
                          <div
                            key={a.id}
                            className="p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => { setSelectedAppointment(a); setDetailDialogOpen(true); }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{a.title}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <p className="text-xs text-muted-foreground">{a.contact_name}</p>
                                  <ContactTypeBadge type={a.contact_type} />
                                </div>
                              </div>
                              <Badge className={`${statusConfig[a.status]?.color || ''} border-0 text-[10px] shrink-0`}>
                                {statusConfig[a.status]?.label || a.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              {a.appointment_time && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{a.appointment_time.slice(0, 5)}</span>}
                              {a.contacted_by && <span className="flex items-center gap-1"><User className="h-3 w-3" />{a.contacted_by}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">📋 Próximas citas</CardTitle>
                      <Button size="sm" onClick={() => openNew()} className="gap-1"><Plus className="h-3 w-3" /> Nueva</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {upcoming.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-sm text-muted-foreground mb-3">No hay citas programadas</p>
                        <Button size="sm" onClick={() => openNew()} className="gap-1"><Plus className="h-3 w-3" /> Crear primera cita</Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {upcoming.map(a => (
                          <div
                            key={a.id}
                            className="p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => { setSelectedAppointment(a); setDetailDialogOpen(true); }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{a.title}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <p className="text-xs text-muted-foreground">{a.contact_name}</p>
                                  <ContactTypeBadge type={a.contact_type} />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{format(new Date(a.appointment_date), 'dd MMM', { locale: es })}</span>
                              {a.appointment_time && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{a.appointment_time.slice(0, 5)}</span>}
                              {a.contacted_by && <span className="flex items-center gap-1"><User className="h-3 w-3" />{a.contacted_by}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? '✏️ Editar Cita' : '📅 Nueva Cita'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Prospecto o Cliente *</Label>
              <Select value={form.contact_key} onValueChange={v => {
                setForm(f => ({ ...f, contact_key: v }));
                const contact = contacts.find(c => `${c.type}::${c.id}` === v);
                if (contact && !form.title) {
                  setForm(f => ({ ...f, title: `Cita con ${contact.name}` }));
                }
              }}>
                <SelectTrigger><SelectValue placeholder="Seleccionar contacto" /></SelectTrigger>
                <SelectContent position="popper" className="max-h-60 overflow-y-auto z-[9999]">
                  {contacts.filter(c => c.type === 'prospect').length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" /> Prospectos
                      </div>
                      {contacts.filter(c => c.type === 'prospect').map(c => (
                        <SelectItem key={`prospect::${c.id}`} value={`prospect::${c.id}`}>
                          📋 {c.name}
                        </SelectItem>
                      ))}
                    </>
                  )}
                  {contacts.filter(c => c.type === 'client').length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground flex items-center gap-1 mt-1">
                        <UserCheck className="h-3 w-3" /> Clientes
                      </div>
                      {contacts.filter(c => c.type === 'client').map(c => (
                        <SelectItem key={`client::${c.id}`} value={`client::${c.id}`}>
                          👤 {c.name}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Título *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Ej: Reunión de presentación" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Fecha *</Label><Input type="date" value={form.appointment_date} onChange={e => setForm(f => ({ ...f, appointment_date: e.target.value }))} /></div>
              <div><Label>Hora</Label><Input type="time" value={form.appointment_time} onChange={e => setForm(f => ({ ...f, appointment_time: e.target.value }))} /></div>
            </div>
            <div>
              <Label>Responsable</Label>
              <Select value={form.contacted_by} onValueChange={v => setForm(f => ({ ...f, contacted_by: v }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent position="popper" className="z-[9999]">
                  {teamMembers.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Descripción</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} /></div>
            <div><Label>Notas</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} /></div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear Cita'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>📋 Detalle de la Cita</DialogTitle></DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold">{selectedAppointment.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground">{selectedAppointment.contact_name}</p>
                    <ContactTypeBadge type={selectedAppointment.contact_type} />
                  </div>
                </div>
                <Badge className={`${statusConfig[selectedAppointment.status]?.color || ''} border-0`}>
                  {statusConfig[selectedAppointment.status]?.label || selectedAppointment.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(selectedAppointment.appointment_date), "EEEE dd 'de' MMMM yyyy", { locale: es })}</span>
                </div>
                {selectedAppointment.appointment_time && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedAppointment.appointment_time.slice(0, 5)}</span>
                  </div>
                )}
                {selectedAppointment.contacted_by && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedAppointment.contacted_by}</span>
                  </div>
                )}
              </div>
              {selectedAppointment.description && (
                <div><p className="text-xs font-medium text-muted-foreground mb-1">Descripción</p><p className="text-sm bg-muted p-3 rounded-lg">{selectedAppointment.description}</p></div>
              )}
              {selectedAppointment.notes && (
                <div><p className="text-xs font-medium text-muted-foreground mb-1">Notas</p><p className="text-sm bg-muted p-3 rounded-lg">{selectedAppointment.notes}</p></div>
              )}

              {selectedAppointment.status === 'programada' && (
                <div className="flex gap-2">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => handleStatusChange(selectedAppointment.id, 'completada')}>
                    <Check className="h-4 w-4 mr-1" /> Completar
                  </Button>
                  <Button variant="outline" className="flex-1 text-destructive" onClick={() => handleStatusChange(selectedAppointment.id, 'cancelada')}>
                    <X className="h-4 w-4 mr-1" /> Cancelar
                  </Button>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <Button variant="outline" className="flex-1" onClick={() => { setDetailDialogOpen(false); openEdit(selectedAppointment); }}>
                  <Edit className="h-4 w-4 mr-1" /> Editar
                </Button>
                <Button variant="ghost" className="text-destructive" onClick={() => handleDelete(selectedAppointment.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAppointments;
