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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Menu, Search, Eye, Edit, Trash2, ArrowLeft, Plus, Store, Image as ImageIcon,
  UtensilsCrossed, MapPin, Star, ChevronRight, X, Video, Tag, Megaphone, Clock, MessageSquare
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

const ATTRIBUTE_OPTIONS = [
  { type: 'ambiente', values: ['Pet Friendly', 'Familiar', 'Romántico', 'Terraza', 'Rooftop', 'Live Music', 'WiFi Gratis', 'Parqueadero'] },
  { type: 'tipo_comida', values: ['Comida Rápida', 'Gourmet', 'Fusión', 'Tradicional', 'Internacional', 'Vegano', 'Vegetariano'] },
  { type: 'ruta', values: ['Ruta del Café', 'Ruta de la Parrilla', 'Ruta Italiana', 'Ruta Mexicana', 'Ruta del Sushi', 'Ruta Food Truck', 'Ruta Cervecera', 'Ruta Tradicional', 'Ruta del Remate'] },
  { type: 'mundial', values: ['Plato Mundialista', 'Fan Zone', 'Pantalla Gigante', 'Menú Copa del Mundo'] },
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

  // Shorts/Videos state
  const [shorts, setShorts] = useState<any[]>([]);
  const [shortDialogOpen, setShortDialogOpen] = useState(false);
  const [editingShort, setEditingShort] = useState<any>(null);
  const [shortForm, setShortForm] = useState({ title: '', description: '', video_url: '', thumbnail_url: '', active: true });
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Promotions state
  const [promotions, setPromotions] = useState<any[]>([]);
  const [promoDialogOpen, setPromoDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any>(null);
  const [promoForm, setPromoForm] = useState({ title: '', description: '', conditions: '', image_url: '', valid_until: '', first_time_only: false, active: true });

  // Attributes state
  const [attributes, setAttributes] = useState<any[]>([]);

  // Hours state
  const [businessHours, setBusinessHours] = useState<any[]>([]);
  const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // Branches state
  const [branches, setBranches] = useState<any[]>([]);
  const [branchDialogOpen, setBranchDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [branchForm, setBranchForm] = useState({ name: '', address: '', neighborhood: '', latitude: '', longitude: '', phone: '', whatsapp: '', is_main: false, active: true });

  // Reviews state
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ author_name: '', rating: '5', comment: '', approved: true });

  // Form
  const [formData, setFormData] = useState({
    name: '', category: '', description: '', address: '', neighborhood: '',
    phone: '', whatsapp: '', email: '', website: '', price_range: '$25.000 - $50.000',
    latitude: '', longitude: '', featured: false, zone: '',
    instagram_url: '', facebook_url: '', tiktok_url: '',
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
      instagram_url: business.instagram_url || '', facebook_url: business.facebook_url || '', tiktok_url: business.tiktok_url || '',
    });
    setShowForm(true);
    setActiveTab('info');
    await loadBusinessDetails(business.id);
  };

  const loadBusinessDetails = async (businessId: string) => {
    const [menuRes, imgRes, shortsRes, promoRes, attrRes, hoursRes, branchRes, reviewsRes] = await Promise.all([
      supabase.from('business_menu').select('*').eq('business_id', businessId).order('category, name'),
      supabase.from('business_images').select('*').eq('business_id', businessId).order('display_order'),
      supabase.from('business_shorts').select('*').eq('business_id', businessId).order('created_at', { ascending: false }),
      supabase.from('business_promotions').select('*').eq('business_id', businessId).order('created_at', { ascending: false }),
      supabase.from('business_attributes').select('*').eq('business_id', businessId),
      supabase.from('business_hours').select('*').eq('business_id', businessId).order('day_of_week'),
      supabase.from('business_branches').select('*').eq('business_id', businessId).order('is_main', { ascending: false }),
      supabase.from('business_reviews').select('*').eq('business_id', businessId).order('created_at', { ascending: false }),
    ]);
    setMenuItems(menuRes.data || []);
    setImages(imgRes.data || []);
    setShorts(shortsRes.data || []);
    setPromotions(promoRes.data || []);
    setAttributes(attrRes.data || []);
    setBusinessHours(hoursRes.data || []);
    setBranches(branchRes.data || []);
    setReviewsList(reviewsRes.data || []);
  };

  const handleNew = () => {
    setEditingBusiness(null);
    setFormData({
      name: '', category: '', description: '', address: '', neighborhood: '',
      phone: '', whatsapp: '', email: '', website: '', price_range: '$25.000 - $50.000',
      latitude: '', longitude: '', featured: false, zone: '',
      instagram_url: '', facebook_url: '', tiktok_url: '',
    });
    setMenuItems([]);
    setImages([]);
    setShorts([]);
    setPromotions([]);
    setAttributes([]);
    setBusinessHours([]);
    setBranches([]);
    setReviewsList([]);
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
        toast.success('Restaurante actualizado exitosamente ✅');
      } else {
        const { data, error } = await supabase.from('businesses').insert({ ...payload, owner_id: userId }).select().single();
        if (error) throw error;
        setEditingBusiness(data);
        toast.success('🎉 ¡Restaurante creado exitosamente! Ya es visible para los clientes.', { duration: 5000 });
      }
      await fetchBusinesses();
    } catch (error: any) {
      console.error('Error saving business:', error);
      toast.error(`Error al guardar: ${error.message || 'Intenta de nuevo'}`);
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
      await supabase.from('business_promotions').delete().eq('business_id', id);
      await supabase.from('business_attributes').delete().eq('business_id', id);
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

  // SHORTS/VIDEO HANDLERS
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !editingBusiness) return;
    setUploadingVideo(true);
    try {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop();
      const path = `${editingBusiness.id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('shorts-videos').upload(path, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('shorts-videos').getPublicUrl(path);
      setShortForm(prev => ({ ...prev, video_url: publicUrl }));
      toast.success('Video subido');
    } catch (error: any) {
      toast.error(error.message || 'Error al subir video');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !editingBusiness) return;
    setUploadingVideo(true);
    try {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop();
      const path = `${editingBusiness.id}/thumb_${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('shorts-videos').upload(path, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('shorts-videos').getPublicUrl(path);
      setShortForm(prev => ({ ...prev, thumbnail_url: publicUrl }));
      toast.success('Miniatura subida');
    } catch (error: any) {
      toast.error(error.message || 'Error');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSaveShort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBusiness) { toast.error('Guarda el restaurante primero'); return; }
    if (!shortForm.video_url) { toast.error('Sube un video primero'); return; }
    try {
      const payload = {
        business_id: editingBusiness.id,
        title: shortForm.title,
        description: shortForm.description || null,
        video_url: shortForm.video_url,
        thumbnail_url: shortForm.thumbnail_url || null,
        active: shortForm.active,
      };
      if (editingShort) {
        await supabase.from('business_shorts').update(payload).eq('id', editingShort.id);
        toast.success('Video actualizado');
      } else {
        await supabase.from('business_shorts').insert(payload);
        toast.success('Video agregado');
      }
      setShortDialogOpen(false);
      setEditingShort(null);
      setShortForm({ title: '', description: '', video_url: '', thumbnail_url: '', active: true });
      await loadBusinessDetails(editingBusiness.id);
    } catch (error: any) {
      toast.error(error.message || 'Error');
    }
  };

  const handleDeleteShort = async (id: string) => {
    await supabase.from('business_shorts').delete().eq('id', id);
    toast.success('Video eliminado');
    if (editingBusiness) await loadBusinessDetails(editingBusiness.id);
  };

  // PROMOTION HANDLERS
  const handlePromoImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !editingBusiness) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop();
      const path = `${userId}/${editingBusiness.id}/promos/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('business-content').upload(path, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('business-content').getPublicUrl(path);
      setPromoForm(prev => ({ ...prev, image_url: publicUrl }));
      toast.success('Imagen subida');
    } catch (error: any) {
      toast.error(error.message || 'Error');
    } finally {
      setUploading(false);
    }
  };

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBusiness) { toast.error('Guarda el restaurante primero'); return; }
    try {
      const payload = {
        business_id: editingBusiness.id,
        title: promoForm.title,
        description: promoForm.description,
        conditions: promoForm.conditions || null,
        image_url: promoForm.image_url || null,
        valid_until: promoForm.valid_until || null,
        first_time_only: promoForm.first_time_only,
        active: promoForm.active,
      };
      if (editingPromo) {
        await supabase.from('business_promotions').update(payload).eq('id', editingPromo.id);
        toast.success('Promoción actualizada');
      } else {
        await supabase.from('business_promotions').insert(payload);
        toast.success('Promoción creada');
      }
      setPromoDialogOpen(false);
      setEditingPromo(null);
      setPromoForm({ title: '', description: '', conditions: '', image_url: '', valid_until: '', first_time_only: false, active: true });
      await loadBusinessDetails(editingBusiness.id);
    } catch (error: any) {
      toast.error(error.message || 'Error');
    }
  };

  const handleDeletePromo = async (id: string) => {
    await supabase.from('business_promotions').delete().eq('id', id);
    toast.success('Promoción eliminada');
    if (editingBusiness) await loadBusinessDetails(editingBusiness.id);
  };


  // HOURS HANDLERS
  const initializeHours = async () => {
    if (!editingBusiness) { toast.error('Guarda el restaurante primero'); return; }
    try {
      const entries = DAY_NAMES.map((_, i) => ({
        business_id: editingBusiness.id,
        day_of_week: i,
        open_time: '08:00',
        close_time: '22:00',
        is_closed: false,
      }));
      await supabase.from('business_hours').insert(entries);
      toast.success('Horarios inicializados');
      await loadBusinessDetails(editingBusiness.id);
    } catch (error: any) {
      toast.error(error.message || 'Error');
    }
  };

  const updateHour = async (hourId: string, field: string, value: any) => {
    try {
      await supabase.from('business_hours').update({ [field]: value }).eq('id', hourId);
      if (editingBusiness) await loadBusinessDetails(editingBusiness.id);
    } catch (error: any) {
      toast.error(error.message || 'Error');
    }
  };

  // BRANCH HANDLERS
  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBusiness) { toast.error('Guarda el restaurante primero'); return; }
    try {
      const payload = {
        business_id: editingBusiness.id,
        name: branchForm.name,
        address: branchForm.address,
        neighborhood: branchForm.neighborhood,
        latitude: branchForm.latitude ? parseFloat(branchForm.latitude) : null,
        longitude: branchForm.longitude ? parseFloat(branchForm.longitude) : null,
        phone: branchForm.phone || null,
        whatsapp: branchForm.whatsapp || null,
        is_main: branchForm.is_main,
        active: branchForm.active,
      };
      if (editingBranch) {
        await supabase.from('business_branches').update(payload).eq('id', editingBranch.id);
        toast.success('Sede actualizada');
      } else {
        await supabase.from('business_branches').insert(payload);
        toast.success('Sede creada');
      }
      setBranchDialogOpen(false);
      setEditingBranch(null);
      setBranchForm({ name: '', address: '', neighborhood: '', latitude: '', longitude: '', phone: '', whatsapp: '', is_main: false, active: true });
      await loadBusinessDetails(editingBusiness.id);
    } catch (error: any) {
      toast.error(error.message || 'Error');
    }
  };

  const handleDeleteBranch = async (id: string) => {
    if (!confirm('¿Eliminar esta sede?')) return;
    await supabase.from('business_branches').delete().eq('id', id);
    toast.success('Sede eliminada');
    if (editingBusiness) await loadBusinessDetails(editingBusiness.id);
  };

  // ATTRIBUTE HANDLERS
  const toggleAttribute = async (type: string, value: string) => {
    if (!editingBusiness) { toast.error('Guarda el restaurante primero'); return; }
    const existing = attributes.find(a => a.attribute_type === type && a.attribute_value === value);
    try {
      if (existing) {
        await supabase.from('business_attributes').delete().eq('id', existing.id);
        toast.success(`${value} removido`);
      } else {
        await supabase.from('business_attributes').insert({
          business_id: editingBusiness.id,
          attribute_type: type,
          attribute_value: value,
        });
        toast.success(`${value} agregado`);
      }
      await loadBusinessDetails(editingBusiness.id);
    } catch (error: any) {
      toast.error(error.message || 'Error');
    }
  };

  const hasAttribute = (type: string, value: string) => {
    return attributes.some(a => a.attribute_type === type && a.attribute_value === value);
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
              <TabsList className="w-full flex overflow-x-auto mb-4">
                <TabsTrigger value="info" className="text-xs gap-1 flex-1"><Store className="h-3.5 w-3.5 hidden sm:block" /> Info</TabsTrigger>
                <TabsTrigger value="images" className="text-xs gap-1 flex-1" disabled={!editingBusiness}><ImageIcon className="h-3.5 w-3.5 hidden sm:block" /> Fotos</TabsTrigger>
                <TabsTrigger value="menu" className="text-xs gap-1 flex-1" disabled={!editingBusiness}><UtensilsCrossed className="h-3.5 w-3.5 hidden sm:block" /> Menú</TabsTrigger>
                <TabsTrigger value="hours" className="text-xs gap-1 flex-1" disabled={!editingBusiness}><Clock className="h-3.5 w-3.5 hidden sm:block" /> Horarios</TabsTrigger>
                <TabsTrigger value="videos" className="text-xs gap-1 flex-1" disabled={!editingBusiness}><Video className="h-3.5 w-3.5 hidden sm:block" /> Videos</TabsTrigger>
                <TabsTrigger value="promos" className="text-xs gap-1 flex-1" disabled={!editingBusiness}><Megaphone className="h-3.5 w-3.5 hidden sm:block" /> Promos</TabsTrigger>
                <TabsTrigger value="branches" className="text-xs gap-1 flex-1" disabled={!editingBusiness}><MapPin className="h-3.5 w-3.5 hidden sm:block" /> Sedes</TabsTrigger>
                <TabsTrigger value="attrs" className="text-xs gap-1 flex-1" disabled={!editingBusiness}><Tag className="h-3.5 w-3.5 hidden sm:block" /> Filtros</TabsTrigger>
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
                      {formData.latitude && formData.longitude && (
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground mb-2">📍 Vista previa del mapa (verifica que el pin esté correcto)</p>
                          <iframe
                            src={`https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&t=&z=17&ie=UTF8&iwloc=&output=embed`}
                            className="w-full h-48 rounded-lg border"
                            style={{ border: 0 }}
                            loading="lazy"
                            title="Vista previa ubicación"
                          />
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${formData.latitude},${formData.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary underline mt-1 inline-block"
                          >
                            Abrir en Google Maps para verificar
                          </a>
                        </div>
                      )}
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

                      {/* Redes Sociales */}
                      <p className="text-sm font-medium text-muted-foreground pt-2">Redes Sociales</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Instagram URL</Label>
                          <Input value={formData.instagram_url} onChange={e => setFormData({ ...formData, instagram_url: e.target.value })} placeholder="https://instagram.com/restaurante" />
                        </div>
                        <div className="space-y-2">
                          <Label>Facebook URL</Label>
                          <Input value={formData.facebook_url} onChange={e => setFormData({ ...formData, facebook_url: e.target.value })} placeholder="https://facebook.com/restaurante" />
                        </div>
                        <div className="space-y-2">
                          <Label>TikTok URL</Label>
                          <Input value={formData.tiktok_url} onChange={e => setFormData({ ...formData, tiktok_url: e.target.value })} placeholder="https://tiktok.com/@restaurante" />
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
                          <Input value={menuForm.price} onChange={e => setMenuForm({ ...menuForm, price: e.target.value })} required placeholder="25000" />
                        </div>
                        <div className="space-y-2">
                          <Label>Categoría</Label>
                          <Input value={menuForm.category} onChange={e => setMenuForm({ ...menuForm, category: e.target.value })} placeholder="Entradas, Platos Fuertes..." />
                          <div className="flex flex-wrap gap-1">
                            {['Plato Mundialista', 'Entradas', 'Platos Fuertes', 'Bebidas', 'Postres'].map(cat => (
                              <Button key={cat} type="button" variant={menuForm.category === cat ? 'default' : 'outline'} size="sm" className="text-[10px] h-6 px-2"
                                onClick={() => setMenuForm({ ...menuForm, category: cat })}>
                                {cat === 'Plato Mundialista' ? '⚽ ' : ''}{cat}
                              </Button>
                            ))}
                          </div>
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

              {/* HOURS TAB */}
              <TabsContent value="hours">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">🕐 Horarios de Atención</CardTitle>
                        <CardDescription>Configura los horarios de apertura y cierre</CardDescription>
                      </div>
                      {businessHours.length === 0 && (
                        <Button size="sm" onClick={initializeHours}>
                          <Plus className="h-3.5 w-3.5 mr-1" /> Inicializar
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {businessHours.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Clock className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">No hay horarios configurados</p>
                        <p className="text-xs mt-1">Haz clic en "Inicializar" para crear los 7 días</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {businessHours.sort((a: any, b: any) => a.day_of_week - b.day_of_week).map((h: any) => (
                          <div key={h.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            <div className="w-24 shrink-0">
                              <p className="font-medium text-sm">{DAY_NAMES[h.day_of_week]}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-1">
                              <Switch
                                checked={!h.is_closed}
                                onCheckedChange={(v) => updateHour(h.id, 'is_closed', !v)}
                              />
                              <span className="text-xs text-muted-foreground w-14">
                                {h.is_closed ? 'Cerrado' : 'Abierto'}
                              </span>
                            </div>
                            {!h.is_closed && (
                              <div className="flex items-center gap-2">
                                <Input
                                  type="time"
                                  value={h.open_time || '08:00'}
                                  onChange={e => updateHour(h.id, 'open_time', e.target.value)}
                                  className="w-28 h-8 text-xs"
                                />
                                <span className="text-muted-foreground text-xs">a</span>
                                <Input
                                  type="time"
                                  value={h.close_time || '22:00'}
                                  onChange={e => updateHour(h.id, 'close_time', e.target.value)}
                                  className="w-28 h-8 text-xs"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* VIDEOS TAB */}
              <TabsContent value="videos">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">Videos / Shorts</CardTitle>
                        <CardDescription>{shorts.length} videos</CardDescription>
                      </div>
                      <Button size="sm" onClick={() => {
                        setEditingShort(null);
                        setShortForm({ title: '', description: '', video_url: '', thumbnail_url: '', active: true });
                        setShortDialogOpen(true);
                      }}>
                        <Plus className="h-3.5 w-3.5 mr-1" /> Agregar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {shorts.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Video className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Sin videos</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {shorts.map(s => (
                          <div key={s.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            {s.thumbnail_url ? (
                              <img src={s.thumbnail_url} alt="" className="w-16 h-12 rounded-lg object-cover shrink-0" />
                            ) : (
                              <div className="w-16 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                <Video className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{s.title}</p>
                              <div className="flex gap-2 text-xs text-muted-foreground">
                                <span>{s.views || 0} vistas</span>
                                <span>{s.likes || 0} likes</span>
                                {!s.active && <Badge variant="outline" className="text-[10px]">Inactivo</Badge>}
                              </div>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {
                                setEditingShort(s);
                                setShortForm({
                                  title: s.title, description: s.description || '',
                                  video_url: s.video_url, thumbnail_url: s.thumbnail_url || '', active: s.active,
                                });
                                setShortDialogOpen(true);
                              }}>
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteShort(s.id)}>
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Short Dialog */}
                <Dialog open={shortDialogOpen} onOpenChange={setShortDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingShort ? 'Editar' : 'Nuevo'} Video</DialogTitle>
                      <DialogDescription>Sube un video corto del restaurante</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveShort} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Título *</Label>
                        <Input value={shortForm.title} onChange={e => setShortForm({ ...shortForm, title: e.target.value })} required placeholder="Título del video" />
                      </div>
                      <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Textarea value={shortForm.description} onChange={e => setShortForm({ ...shortForm, description: e.target.value })} rows={2} />
                      </div>
                      <div className="space-y-2">
                        <Label>Video *</Label>
                        {shortForm.video_url ? (
                          <div className="space-y-2">
                            <video src={shortForm.video_url} className="w-full h-40 rounded-lg object-cover" controls />
                            <Button type="button" variant="outline" size="sm" onClick={() => setShortForm(prev => ({ ...prev, video_url: '' }))}>
                              Cambiar video
                            </Button>
                          </div>
                        ) : (
                          <Input type="file" accept="video/*" onChange={handleVideoUpload} disabled={uploadingVideo} />
                        )}
                        {uploadingVideo && <p className="text-sm text-muted-foreground">Subiendo video...</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Miniatura (opcional)</Label>
                        <Input type="file" accept="image/*" onChange={handleThumbnailUpload} disabled={uploadingVideo} />
                        {shortForm.thumbnail_url && <img src={shortForm.thumbnail_url} alt="" className="h-20 rounded-lg object-cover mt-1" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={shortForm.active} onCheckedChange={v => setShortForm({ ...shortForm, active: v })} />
                        <Label>Activo</Label>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setShortDialogOpen(false)}>Cancelar</Button>
                        <Button type="submit" disabled={uploadingVideo}>{editingShort ? 'Actualizar' : 'Crear'}</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </TabsContent>

              {/* PROMOTIONS TAB */}
              <TabsContent value="promos">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">Promociones</CardTitle>
                        <CardDescription>{promotions.length} promociones</CardDescription>
                      </div>
                      <Button size="sm" onClick={() => {
                        setEditingPromo(null);
                        setPromoForm({ title: '', description: '', conditions: '', image_url: '', valid_until: '', first_time_only: false, active: true });
                        setPromoDialogOpen(true);
                      }}>
                        <Plus className="h-3.5 w-3.5 mr-1" /> Agregar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {promotions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Megaphone className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Sin promociones</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {promotions.map(p => (
                          <div key={p.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            {p.image_url && <img src={p.image_url} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{p.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{p.description}</p>
                              <div className="flex gap-1 mt-1">
                                {!p.active && <Badge variant="outline" className="text-[10px]">Inactiva</Badge>}
                                {p.first_time_only && <Badge variant="secondary" className="text-[10px]">Primera vez</Badge>}
                                {p.valid_until && <Badge variant="outline" className="text-[10px]">Hasta {new Date(p.valid_until).toLocaleDateString('es-CO')}</Badge>}
                              </div>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {
                                setEditingPromo(p);
                                setPromoForm({
                                  title: p.title, description: p.description, conditions: p.conditions || '',
                                  image_url: p.image_url || '', valid_until: p.valid_until || '',
                                  first_time_only: p.first_time_only || false, active: p.active,
                                });
                                setPromoDialogOpen(true);
                              }}>
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeletePromo(p.id)}>
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Promo Dialog */}
                <Dialog open={promoDialogOpen} onOpenChange={setPromoDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingPromo ? 'Editar' : 'Nueva'} Promoción</DialogTitle>
                      <DialogDescription>Configura la promoción del restaurante</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSavePromo} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Título *</Label>
                        <Input value={promoForm.title} onChange={e => setPromoForm({ ...promoForm, title: e.target.value })} required placeholder="2x1 en hamburguesas" />
                      </div>
                      <div className="space-y-2">
                        <Label>Descripción *</Label>
                        <Textarea value={promoForm.description} onChange={e => setPromoForm({ ...promoForm, description: e.target.value })} required rows={2} />
                      </div>
                      <div className="space-y-2">
                        <Label>Condiciones</Label>
                        <Input value={promoForm.conditions} onChange={e => setPromoForm({ ...promoForm, conditions: e.target.value })} placeholder="Válido de lunes a jueves" />
                      </div>
                      <div className="space-y-2">
                        <Label>Válida hasta</Label>
                        <Input type="date" value={promoForm.valid_until} onChange={e => setPromoForm({ ...promoForm, valid_until: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Imagen</Label>
                        <Input type="file" accept="image/*" onChange={handlePromoImageUpload} disabled={uploading} />
                        {promoForm.image_url && <img src={promoForm.image_url} alt="" className="h-20 rounded-lg object-cover mt-1" />}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch checked={promoForm.first_time_only} onCheckedChange={v => setPromoForm({ ...promoForm, first_time_only: v })} />
                          <Label className="text-sm">Solo primera vez</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={promoForm.active} onCheckedChange={v => setPromoForm({ ...promoForm, active: v })} />
                          <Label className="text-sm">Activa</Label>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setPromoDialogOpen(false)}>Cancelar</Button>
                        <Button type="submit">{editingPromo ? 'Actualizar' : 'Crear'}</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </TabsContent>

              {/* BRANCHES/SEDES TAB */}
              <TabsContent value="branches">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">📍 Sedes / Sucursales</CardTitle>
                        <CardDescription>{branches.length} sedes registradas</CardDescription>
                      </div>
                      <Button size="sm" onClick={() => {
                        setEditingBranch(null);
                        setBranchForm({ name: '', address: '', neighborhood: '', latitude: '', longitude: '', phone: '', whatsapp: '', is_main: false, active: true });
                        setBranchDialogOpen(true);
                      }}>
                        <Plus className="h-3.5 w-3.5 mr-1" /> Agregar Sede
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {branches.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MapPin className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">No hay sedes registradas</p>
                        <p className="text-xs mt-1">La ubicación principal del restaurante se usa como sede por defecto</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {branches.map((b: any) => (
                          <div key={b.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm truncate">{b.name}</p>
                                {b.is_main && <Badge className="text-[10px]">Principal</Badge>}
                                {!b.active && <Badge variant="outline" className="text-[10px]">Inactiva</Badge>}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{b.address} — {b.neighborhood}</p>
                              {b.latitude && b.longitude && (
                                <p className="text-[10px] text-muted-foreground">📍 {b.latitude}, {b.longitude}</p>
                              )}
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {
                                setEditingBranch(b);
                                setBranchForm({
                                  name: b.name, address: b.address, neighborhood: b.neighborhood,
                                  latitude: b.latitude?.toString() || '', longitude: b.longitude?.toString() || '',
                                  phone: b.phone || '', whatsapp: b.whatsapp || '',
                                  is_main: b.is_main || false, active: b.active !== false,
                                });
                                setBranchDialogOpen(true);
                              }}>
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteBranch(b.id)}>
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Branch Dialog */}
                <Dialog open={branchDialogOpen} onOpenChange={setBranchDialogOpen}>
                  <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingBranch ? 'Editar' : 'Nueva'} Sede</DialogTitle>
                      <DialogDescription>Configura la ubicación de esta sede</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveBranch} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Nombre de la Sede *</Label>
                        <Input value={branchForm.name} onChange={e => setBranchForm({ ...branchForm, name: e.target.value })} required placeholder="Ej: Sede Norte, Sede Centro" />
                      </div>
                      <div className="space-y-2">
                        <Label>Dirección *</Label>
                        <Input value={branchForm.address} onChange={e => setBranchForm({ ...branchForm, address: e.target.value })} required placeholder="Calle 10 # 45-67" />
                      </div>
                      <div className="space-y-2">
                        <Label>Barrio *</Label>
                        <Input value={branchForm.neighborhood} onChange={e => setBranchForm({ ...branchForm, neighborhood: e.target.value })} required placeholder="Granada" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Latitud</Label>
                          <Input type="number" step="0.000001" value={branchForm.latitude} onChange={e => setBranchForm({ ...branchForm, latitude: e.target.value })} placeholder="3.451647" />
                        </div>
                        <div className="space-y-2">
                          <Label>Longitud</Label>
                          <Input type="number" step="0.000001" value={branchForm.longitude} onChange={e => setBranchForm({ ...branchForm, longitude: e.target.value })} placeholder="-76.531835" />
                        </div>
                      </div>
                      {branchForm.latitude && branchForm.longitude && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">📍 Vista previa</p>
                          <iframe
                            src={`https://maps.google.com/maps?q=${branchForm.latitude},${branchForm.longitude}&t=&z=17&ie=UTF8&iwloc=&output=embed`}
                            className="w-full h-36 rounded-lg border"
                            style={{ border: 0 }}
                            loading="lazy"
                            title="Vista previa sede"
                          />
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Teléfono</Label>
                          <Input value={branchForm.phone} onChange={e => setBranchForm({ ...branchForm, phone: e.target.value })} placeholder="(602) 123-4567" />
                        </div>
                        <div className="space-y-2">
                          <Label>WhatsApp</Label>
                          <Input value={branchForm.whatsapp} onChange={e => setBranchForm({ ...branchForm, whatsapp: e.target.value })} placeholder="3001234567" />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch checked={branchForm.is_main} onCheckedChange={v => setBranchForm({ ...branchForm, is_main: v })} />
                          <Label className="text-sm">Sede Principal</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={branchForm.active} onCheckedChange={v => setBranchForm({ ...branchForm, active: v })} />
                          <Label className="text-sm">Activa</Label>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setBranchDialogOpen(false)}>Cancelar</Button>
                        <Button type="submit">{editingBranch ? 'Actualizar' : 'Crear'}</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </TabsContent>

              {/* ATTRIBUTES/FILTERS TAB */}
              <TabsContent value="attrs">
                <div className="space-y-4">
                  {ATTRIBUTE_OPTIONS.map(group => (
                    <Card key={group.type}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base capitalize">
                          {group.type === 'ambiente' && '🏠 Ambiente'}
                          {group.type === 'tipo_comida' && '🍽️ Tipo de Comida'}
                          {group.type === 'ruta' && '🗺️ Rutas Gastronómicas'}
                          {group.type === 'mundial' && '⚽ Mundial 2026'}
                        </CardTitle>
                        <CardDescription>
                          Selecciona las etiquetas que aplican a este restaurante
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {group.values.map(val => {
                            const active = hasAttribute(group.type, val);
                            return (
                              <Badge
                                key={val}
                                variant={active ? 'default' : 'outline'}
                                className={`cursor-pointer transition-all text-xs py-1.5 px-3 ${active ? '' : 'hover:bg-muted'}`}
                                onClick={() => toggleAttribute(group.type, val)}
                              >
                                {active && '✓ '}{val}
                              </Badge>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminBusinesses;
