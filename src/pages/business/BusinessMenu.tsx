import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { safeGetItem, safeSetItem, safeRemoveItem } from '@/lib/storage';

const DRAFT_KEY = 'lcm_menu_draft';

interface Variant {
  name: string;
  price: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  available: boolean;
  variants?: any;
}

const parseVariants = (raw: any): Variant[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((v: any) => v && v.name)
    .map((v: any) => ({ name: String(v.name), price: String(v.price ?? '') }));
};

const BusinessMenu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [businessId, setBusinessId] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);

  const emptyForm = {
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    available: true,
    variants: [] as Variant[]
  };

  const [formData, setFormData] = useState(emptyForm);

  const cleanVariants = (list: Variant[]) =>
    list
      .filter((v) => v.name.trim() !== '')
      .map((v) => ({ name: v.name.trim(), price: parseFloat(v.price) || 0 }));

  useEffect(() => {
    loadBusiness();
  }, []);

  // Recupera el borrador guardado si el dueño se salió sin guardar
  useEffect(() => {
    const raw = safeGetItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      if (draft && (draft.name || draft.price || draft.image_url || draft.description)) {
        setFormData({ ...emptyForm, ...draft });
        setDraftRestored(true);
      }
    } catch {
      safeRemoveItem(DRAFT_KEY);
    }
  }, []);

  // Guarda el borrador mientras escribe (solo para productos nuevos)
  useEffect(() => {
    if (editingItem) return;
    const hasContent =
      formData.name || formData.price || formData.image_url || formData.description || formData.variants.length;
    if (hasContent) safeSetItem(DRAFT_KEY, JSON.stringify(formData));
  }, [formData, editingItem]);

  const discardDraft = () => {
    safeRemoveItem(DRAFT_KEY);
    setDraftRestored(false);
    setFormData(emptyForm);
  };

  const loadBusiness = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (!business) {
        navigate('/business-setup');
        return;
      }

      setBusinessId(business.id);
      await loadMenu(business.id);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMenu = async (busId: string) => {
    const { data, error } = await supabase
      .from('business_menu')
      .select('*')
      .eq('business_id', busId)
      .order('category, name');

    if (error) {
      console.error('Error loading menu:', error);
    } else {
      setItems(data || []);
    }
  };

  // Convierte cualquier foto (incluida la de iPhone) a JPG y la reduce de tamaño
  const toJpeg = (file: File): Promise<Blob> =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        try {
          const maxSize = 1600;
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('no canvas');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(url);
              blob ? resolve(blob) : reject(new Error('no blob'));
            },
            'image/jpeg',
            0.85
          );
        } catch (err) {
          URL.revokeObjectURL(url);
          reject(err);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('no image'));
      };
      img.src = url;
    });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const file = e.target.files[0];

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) throw new Error('Tu sesión expiró. Vuelve a iniciar sesión e intenta de nuevo.');

      let body: Blob = file;
      let ext = 'jpg';
      let contentType = 'image/jpeg';

      try {
        body = await toJpeg(file);
      } catch {
        // Si el navegador no puede leer la foto, subimos el archivo original
        body = file;
        const rawExt = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '');
        ext = rawExt && rawExt.length <= 5 ? rawExt : 'jpg';
        contentType = file.type || 'application/octet-stream';
      }

      const fileName = `${user.id}/menu/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('business-content')
        .upload(fileName, body, { contentType, upsert: true, cacheControl: '3600' });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('business-content')
        .getPublicUrl(fileName);

      setFormData((prev) => ({ ...prev, image_url: publicUrl }));

      toast({
        title: "¡Imagen subida!",
        description: "La imagen del producto se ha subido correctamente",
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "No se pudo subir la imagen",
        description: error.message || "Intenta con otra foto o revisa tu conexión",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const variants = cleanVariants(formData.variants);
    const variantPrices = variants.map((v) => v.price).filter((p) => p > 0);
    const basePrice = variantPrices.length
      ? Math.min(...variantPrices)
      : parseFloat(formData.price) || 0;

    if (!variants.length && !formData.price) {
      toast({
        title: 'Falta el precio',
        description: 'Escribe un precio o agrega presentaciones con precio',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('business_menu')
          .update({
            name: formData.name,
            description: formData.description || null,
            price: basePrice,
            category: formData.category || null,
            image_url: formData.image_url || null,
            available: formData.available,
            variants
          })
          .eq('id', editingItem.id);

        if (error) throw error;

        toast({
          title: "¡Producto actualizado!",
          description: "El producto ha sido actualizado correctamente",
        });
      } else {
        // Create new item
        const { error } = await supabase
          .from('business_menu')
          .insert({
            business_id: businessId,
            name: formData.name,
            description: formData.description || null,
            price: basePrice,
            category: formData.category || null,
            image_url: formData.image_url || null,
            available: formData.available,
            variants
          });

        if (error) throw error;

        toast({
          title: "¡Producto creado!",
          description: "El producto ha sido agregado correctamente",
        });
      }

      safeRemoveItem(DRAFT_KEY);
      setDraftRestored(false);
      setDialogOpen(false);
      resetForm();
      await loadMenu(businessId);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar el producto",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category || '',
      image_url: item.image_url || '',
      available: item.available,
      variants: parseVariants(item.variants)
    });
    setDialogOpen(true);
  };

  const handleDelete = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('business_menu')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado correctamente",
      });

      await loadMenu(businessId);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el producto",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingItem(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  const groupedItems = items.reduce((acc, item) => {
    const cat = item.category || 'Sin Categoría';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/business-dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Menú & Productos</h1>
            <p className="text-muted-foreground">Gestiona tu carta o catálogo de productos</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            // Al cerrar un producto nuevo conservamos lo escrito como borrador
            if (!open && editingItem) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg w-[95vw] max-h-[90dvh] p-0 flex flex-col overflow-hidden">
              <DialogHeader className="px-5 pt-5 pb-3 border-b">
                <DialogTitle>{editingItem ? 'Editar' : 'Nuevo'} Producto</DialogTitle>
                <DialogDescription>
                  Completa la información del producto
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {!editingItem && draftRestored && (
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
                    <p className="text-xs text-muted-foreground">
                      Recuperamos el producto que habías empezado a llenar.
                    </p>
                    <Button type="button" size="sm" variant="ghost" onClick={discardDraft}>
                      Empezar de nuevo
                    </Button>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Precio {formData.variants.length === 0 && '*'}</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    disabled={formData.variants.length > 0}
                    placeholder={formData.variants.length > 0 ? 'Se calcula con las presentaciones' : ''}
                  />
                </div>

                <div className="space-y-2 rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <Label>Presentaciones con precio distinto</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setFormData({ ...formData, variants: [...formData.variants, { name: '', price: '' }] })
                      }
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Agregar
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ej: Personal, Mediana, Familiar — cada una con su precio.
                  </p>
                  {formData.variants.map((variant, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        placeholder="Tamaño / opción"
                        value={variant.name}
                        onChange={(e) => {
                          const next = [...formData.variants];
                          next[index] = { ...next[index], name: e.target.value };
                          setFormData({ ...formData, variants: next });
                        }}
                      />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Precio"
                        className="w-32"
                        value={variant.price}
                        onChange={(e) => {
                          const next = [...formData.variants];
                          next[index] = { ...next[index], price: e.target.value };
                          setFormData({ ...formData, variants: next });
                        }}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          setFormData({ ...formData, variants: formData.variants.filter((_, i) => i !== index) })
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ej: Entradas, Platos Fuertes, Bebidas"
                  />
                  <div className="flex flex-wrap gap-1">
                    {['Especial de la casa', 'Entradas', 'Platos Fuertes', 'Bebidas', 'Postres'].map(cat => (
                      <Button key={cat} type="button" variant={formData.category === cat ? 'default' : 'outline'} size="sm" className="text-[10px] h-6 px-2"
                        onClick={() => setFormData({ ...formData, category: cat })}>
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Imagen del producto</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="cursor-pointer"
                  />
                  {uploading && <p className="text-sm text-muted-foreground">Subiendo...</p>}
                  {formData.image_url && (
                    <div className="mt-2">
                      <img src={formData.image_url} alt="Preview" className="h-32 rounded-lg object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Ingredientes, preparación, etc."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={formData.available}
                    onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                  />
                  <Label htmlFor="available">Disponible</Label>
                </div>
                </div>

                <div className="flex gap-2 border-t bg-background px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1" disabled={uploading}>
                    {uploading ? 'Subiendo foto...' : editingItem ? 'Actualizar' : 'Guardar producto'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Plus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No tienes productos en tu menú. Agrega el primero para empezar.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                  <CardDescription>{categoryItems.length} productos</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="space-y-4">
                    {categoryItems.map((item) => (
                        <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg">
                         {item.image_url && (
                          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{item.name}</h3>
                            {!item.available && (
                              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                                No disponible
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          )}
                          <p className="text-lg font-bold text-primary mt-2">
                            {parseVariants(item.variants).length > 0 ? 'Desde ' : ''}
                            ${item.price.toLocaleString('es-CO')}
                          </p>
                          {parseVariants(item.variants).length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {parseVariants(item.variants).map((v, i) => (
                                <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                  {v.name}: ${(parseFloat(v.price) || 0).toLocaleString('es-CO')}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button size="icon" variant="outline" onClick={() => handleEdit(item)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="destructive" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessMenu;
