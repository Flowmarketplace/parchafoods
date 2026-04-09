import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Menu, Search, Eye, Edit, Trash2, ArrowLeft, Plus, Store, Image as ImageIcon,
  UtensilsCrossed, MapPin, Star, ChevronRight, X
} from 'lucide-react';
import AdminSidebar, { AdminSidebarDesktop } from '@/components/admin/AdminSidebar';
import { toast } from 'sonner';
import { categories } from '@/data/places';

const APP_CATEGORIES = categories.filter(c => c !== 'Todos');

const PRICE_RANGES = [
  '$20.000 - $35.000',
  '$25.000 - $50.000',
  '$40.000 - $80.000',
  '$70.000 - $150.000',
];

const AdminBusinesses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [userId, setUserId] = useState('');

  // Menu state
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<any>(null);
  const [menuForm, setMenuForm] = useState({ name: '', description: '', price: '', category: '', image_url: '', available: true });

  // Images state
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    name: '', category: '', description: '', address: '', neighborhood: '',
    phone: '', whatsapp: '', email: '', website: '', price_range: '$25.000 - $50.000',
    latitude: '', longitude: '', featured: false, zone: '',
  });

  useEffect(() => { checkAdminAndFetch(); }, []);

  useEffect(() => {
    if (editId && businesses.length > 0) {
      const biz = businesses.find(b => b.id === editId);
      if (biz) handleEdit(biz);
    }
  }, [editId, businesses]);

  const checkAdminAndFetch = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/auth'); return; }
      setUserId(user.id);

      const { data: roleData } = await supabase
        .from('user_roles').select('role')
        .eq('user_id', user.id).eq('role', 'admin').single();

      if (!roleData) { toast.error('No tienes permisos de administrador'); navigate('/'); return; }

      await fetchBusinesses();
      setLoading(false);
    } catch { navigate('/'); }
  };

  const fetchBusinesses = async () => {
    const { data } = await supabase
      .from('businesses')
      .select(`*, business_images(id, image_url, image_type, is_primary, display_order)`)
      .order('name');
    setBusinesses(data || []);
  };

  const handleEdit = async (business: any) => {
    setEditingBusiness(business);
    setFormData({
      name: business.name || '', category: business.category || '',
      description: business.description || '', address: business.address || '',
      neighborhood: business.neighborhood || '', phone: business.phone || '',
      whatsapp: business.whatsapp || '', email: business.email || '',
      website: business.website || '', price_range: business.price_range || '$25.000 - $50.000',
      latitude: business.latitude?.toString() || '', longitude: business.longitude?.toString() || '',
      featured: business.featured || false, zone: business.zone || '',
    });
    setShowForm(true);
    setActiveTab('info');
    await loadBusinessDetails(business.id);
  };

  const loadBusinessDetails = async (businessId: string) => {
    const [menuRes, imgRes] = await Promise.all([
      supabase.from('business_menu').select('*').eq('business_id', businessId).order('category, name'),
      supabase.from('business_images').select('*').eq('business_id', businessId).order('display_order'),
    ]);
    setMenuItems(menuRes.data || []);
    setImages(imgRes.data || []);
  };

  const handleNew = () => {
    setEditingBusiness(null);
    setFormData({
      name: '', category: '', description: '', address: '', neighborhood: '',
      phone: '', whatsapp: '', email: '', website: '', price_range: '$25.000 - $50.000',
      latitude: '', longitude: '', featured: false, zone: '',
    });
    setMenuItems([]);
    setImages([]);
    setShowForm(true);
    setActiveTab('info');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.address || !formData.neighborhood) {
      toast.error('Completa los campos obligatorios');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        slug: formData.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
      };

      if (editingBusiness) {
        const { error } = await supabase.from('businesses').update(payload).eq('id', editingBusiness.id);
        if (error) throw error;
        toast.success('Restaurante actualizado');
      } else {
        const { data, error } = await supabase.from('businesses').insert({ ...payload, owner_id: userId }).select().single();
        if (error) throw error;
        setEditingBusiness(data);
        toast.success('Restaurante creado');
      }
      await fetchBusinesses();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este restaurante y todos sus datos?')) return;
    try {
      await supabase.from('business_menu').delete().eq('business_id', id);
      await supabase.from('business_images').delete().eq('business_id', id);
      await supabase.from('business_shorts').delete().eq('business_id', id);
      const { error } = await supabase.from('businesses').delete().eq('id', id);
      if (error) throw error;
      toast.success('Restaurante eliminado');
      setShowForm(false);
      await fetchBusinesses();
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar');
    }
  };

  // IMAGE HANDLERS
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'gallery') => {
    if (!e.target.files?.length || !editingBusiness) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop();
      const path = `${userId}/${editingBusiness.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('business-content').upload(path, file);
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from('business-content').getPublicUrl(path);

      if (type === 'profile') {
        // Remove old profile image
        const existing = images.find(i => i.image_type === 'profile');
        if (existing) {
          await supabase.from('business_images').delete().eq('id', existing.id);
        }
      }

      await supabase.from('business_images').insert({
        business_id: editingBusiness.id,
        image_url: publicUrl,
        image_type: type,
        is_primary: type === 'profile',
        display_order: type === 'profile' ? 0 : images.length,
      });
      toast.success('Imagen subida');
      await loadBusinessDetails(editingBusiness.id);
    } catch (error: any) {
      toast.error(error.message || 'Error al subir imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    await supabase.from('business_images').delete().eq('id', imageId);
    toast.success('Imagen eliminada');
    if (editingBusiness) await loadBusinessDetails(editingBusiness.id);
  };

  // MENU HANDLERS
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBusiness) { toast.error('Guarda el restaurante primero'); return; }
    try {
      const payload = {
        business_id: editingBusiness.id,
        name: menuForm.name,
        description: menuForm.description || null,
        price: parseFloat(menuForm.price),
        category: menuForm.category || null,
        image_url: menuForm.image_url || null,
        available: menuForm.available,
      };
      if (editingMenuItem) {
        await supabase.from('business_menu').update(payload).eq('id', editingMenuItem.id);
        toast.success('Producto actualizado');
      } else {
        await supabase.from('business_menu').insert(payload);
        toast.success('Producto agregado');
      }
      setMenuDialogOpen(false);
      setEditingMenuItem(null);
      setMenuForm({ name: '', description: '', price: '', category: '', image_url: '', available: true });
      await loadBusinessDetails(editingBusiness.id);
    } catch (error: any) {
      toast.error(error.message || 'Error');
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    await supabase.from('business_menu').delete().eq('id', id);
    toast.success('Producto eliminado');
    if (editingBusiness) await loadBusinessDetails(editingBusiness.id);
  };

  const handleMenuImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !editingBusiness) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop();
      const path = `${userId}/${editingBusiness.id}/menu/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('business-content').upload(path, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('business-content').getPublicUrl(path);
      setMenuForm(prev => ({ ...prev, image_url: publicUrl }));
      toast.success('Imagen subida');
    } catch (error: any) {
      toast.error(error.message || 'Error');
    } finally {
      setUploading(false);
    }
  };

  const filteredBusinesses = businesses.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const profileImg = images.find(i => i.image_type === 'profile');
  const galleryImgs = images.filter(i => i.image_type !== 'profile');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminSidebarDesktop />

      <div className="flex-1 lg:ml-64 w-full">
        <header className="sticky top-0 z-30 bg-card border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden"><Menu className="h-5 w-5" /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64"><AdminSidebar /></SheetContent>
            </Sheet>
            {showForm ? (
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="flex-1">
              <h1 className="text-xl font-bold">{showForm ? (editingBusiness ? 'Editar Restaurante' : 'Nuevo Restaurante') : 'Gestión de Restaurantes'}</h1>
              <p className="text-sm text-muted-foreground">
                {showForm ? 'Completa todos los detalles' : `${businesses.length} restaurantes registrados`}
              </p>
            </div>
            {!showForm && (
              <Button onClick={handleNew} className="gap-1.5">
                <Plus className="h-4 w-4" /> Nuevo
              </Button>
            )}
          </div>
        </header>

        <main className="p-4 md:p-6 pb-20">
          {!showForm ? (
            <>
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar restaurantes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>

              <div className="grid gap-3">
                {filteredBusinesses.map((b) => {
                  const img = b.business_images?.find((i: any) => i.image_type === 'profile') || b.business_images?.[0];
                  return (
                    <Card key={b.id} className="overflow-hidden">
                      <div className="flex">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-muted">
                          {img ? (
                            <img src={img.image_url} alt={b.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Store className="h-8 w-8 text-muted-foreground" /></div>
                          )}
                        </div>
                        <div className="flex-1 p-3 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-sm truncate">{b.name}</h3>
                              <div className="flex flex-wrap gap-1 mt-1">
                                <Badge variant="secondary" className="text-[10px]">{b.category}</Badge>
                                {b.featured && <Badge className="text-[10px] bg-secondary">⭐ Destacado</Badge>}
                                {b.price_range && <Badge variant="outline" className="text-[10px]">{b.price_range}</Badge>}
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-1 truncate">{b.address}</p>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate(`/place/${b.slug || b.id}`)}>
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(b)}>
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(b.id)}>
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
              {filteredBusinesses.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">No se encontraron restaurantes</div>
              )}
            </>
          ) : (
            /* ======= EDIT/CREATE FORM ======= */
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-3 mb-4">
                <TabsTrigger value="info" className="text-xs sm:text-sm gap-1"><Store className="h-3.5 w-3.5" /> Info</TabsTrigger>
                <TabsTrigger value="images" className="text-xs sm:text-sm gap-1" disabled={!editingBusiness}><ImageIcon className="h-3.5 w-3.5" /> Fotos</TabsTrigger>
                <TabsTrigger value="menu" className="text-xs sm:text-sm gap-1" disabled={!editingBusiness}><UtensilsCrossed className="h-3.5 w-3.5" /> Menú</TabsTrigger>
              </TabsList>

              {/* INFO TAB */}
              <TabsContent value="info">
                <form onSubmit={handleSave} className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Información Básica</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Nombre *</Label>
                        <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Nombre del restaurante" required />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Categoría *</Label>
                          <Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v })}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                            <SelectContent>
                              {APP_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Rango de Precio</Label>
                          <Select value={formData.price_range} onValueChange={v => setFormData({ ...formData, price_range: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {PRICE_RANGES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="Describe el restaurante..." />
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch checked={formData.featured} onCheckedChange={v => setFormData({ ...formData, featured: v })} />
                        <Label>⭐ Restaurante Destacado</Label>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4" /> Ubicación</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Dirección *</Label>
                        <Input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required placeholder="Calle 10 # 45-67" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Barrio *</Label>
                          <Input value={formData.neighborhood} onChange={e => setFormData({ ...formData, neighborhood: e.target.value })} required placeholder="Granada" />
                        </div>
                        <div className="space-y-2">
                          <Label>Zona</Label>
                          <Input value={formData.zone} onChange={e => setFormData({ ...formData, zone: e.target.value })} placeholder="Sur, Norte, Oeste" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Latitud</Label>
                          <Input type="number" step="0.000001" value={formData.latitude} onChange={e => setFormData({ ...formData, latitude: e.target.value })} placeholder="3.451647" />
                        </div>
                        <div className="space-y-2">
                          <Label>Longitud</Label>
                          <Input type="number" step="0.000001" value={formData.longitude} onChange={e => setFormData({ ...formData, longitude: e.target.value })} placeholder="-76.531835" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Contacto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Teléfono</Label>
                          <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="(602) 123-4567" />
                        </div>
                        <div className="space-y-2">
                          <Label>WhatsApp</Label>
                          <Input value={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} placeholder="3001234567" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Sitio Web</Label>
                          <Input type="url" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={saving} className="flex-1">
                      {saving ? 'Guardando...' : (editingBusiness ? 'Actualizar Restaurante' : 'Crear Restaurante')}
                    </Button>
                    {editingBusiness && (
                      <Button type="button" variant="destructive" onClick={() => handleDelete(editingBusiness.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </form>
              </TabsContent>

              {/* IMAGES TAB */}
              <TabsContent value="images">
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Foto de Perfil</CardTitle>
                      <CardDescription>Imagen principal del restaurante</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {profileImg ? (
                        <div className="relative w-40 h-40 rounded-lg overflow-hidden">
                          <img src={profileImg.image_url} alt="Perfil" className="w-full h-full object-cover" />
                          <button className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1" onClick={() => handleDeleteImage(profileImg.id)}>
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                          <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                          <span className="text-xs text-muted-foreground">Subir foto</span>
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'profile')} disabled={uploading} />
                        </label>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Galería</CardTitle>
                      <CardDescription>Fotos adicionales del restaurante</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {galleryImgs.map(img => (
                          <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden">
                            <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                            <button className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1" onClick={() => handleDeleteImage(img.id)}>
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                          <Plus className="h-6 w-6 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground mt-1">Agregar</span>
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'gallery')} disabled={uploading} />
                        </label>
                      </div>
                      {uploading && <p className="text-sm text-muted-foreground mt-2">Subiendo imagen...</p>}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* MENU TAB */}
              <TabsContent value="menu">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">Menú / Productos</CardTitle>
                        <CardDescription>{menuItems.length} productos</CardDescription>
                      </div>
                      <Button size="sm" onClick={() => {
                        setEditingMenuItem(null);
                        setMenuForm({ name: '', description: '', price: '', category: '', image_url: '', available: true });
                        setMenuDialogOpen(true);
                      }}>
                        <Plus className="h-3.5 w-3.5 mr-1" /> Agregar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {menuItems.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <UtensilsCrossed className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Sin productos en el menú</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {menuItems.map(item => (
                          <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            {item.image_url && <img src={item.image_url} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.category || 'Sin categoría'} · ${item.price?.toLocaleString('es-CO')}</p>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {
                                setEditingMenuItem(item);
                                setMenuForm({
                                  name: item.name, description: item.description || '', price: item.price?.toString() || '',
                                  category: item.category || '', image_url: item.image_url || '', available: item.available,
                                });
                                setMenuDialogOpen(true);
                              }}>
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteMenuItem(item.id)}>
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Menu Item Dialog */}
                <Dialog open={menuDialogOpen} onOpenChange={setMenuDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingMenuItem ? 'Editar' : 'Nuevo'} Producto</DialogTitle>
                      <DialogDescription>Completa los datos del producto</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveMenuItem} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Nombre *</Label>
                        <Input value={menuForm.name} onChange={e => setMenuForm({ ...menuForm, name: e.target.value })} required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Precio *</Label>
                          <Input type="number" value={menuForm.price} onChange={e => setMenuForm({ ...menuForm, price: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Categoría</Label>
                          <Input value={menuForm.category} onChange={e => setMenuForm({ ...menuForm, category: e.target.value })} placeholder="Entradas, Platos Fuertes..." />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Textarea value={menuForm.description} onChange={e => setMenuForm({ ...menuForm, description: e.target.value })} rows={2} />
                      </div>
                      <div className="space-y-2">
                        <Label>Imagen</Label>
                        <Input type="file" accept="image/*" onChange={handleMenuImageUpload} disabled={uploading} />
                        {menuForm.image_url && <img src={menuForm.image_url} alt="" className="h-20 rounded-lg object-cover mt-1" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={menuForm.available} onCheckedChange={v => setMenuForm({ ...menuForm, available: v })} />
                        <Label>Disponible</Label>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setMenuDialogOpen(false)}>Cancelar</Button>
                        <Button type="submit">{editingMenuItem ? 'Actualizar' : 'Crear'}</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminBusinesses;
