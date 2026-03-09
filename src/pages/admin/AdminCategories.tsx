import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar, { AdminSidebarDesktop } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Menu, Plus, Edit, Trash2, ArrowLeft, Tag } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const AdminCategories = () => {
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [description, setDescription] = useState('');

  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Comidas Rápidas', icon: 'Sandwich', description: 'Hamburguesas, hot dogs, empanadas y más' },
    { id: '2', name: 'Cafés', icon: 'Coffee', description: 'Cafeterías y café de especialidad' },
    { id: '3', name: 'Food Truck', icon: 'Truck', description: 'Comida callejera sobre ruedas' },
    { id: '4', name: 'Italiana', icon: 'Pizza', description: 'Pizzas, pastas y cocina italiana' },
    { id: '5', name: 'Parrilla', icon: 'Flame', description: 'Carnes a la brasa y asados' },
    { id: '6', name: 'Tradicional', icon: 'Soup', description: 'Comida típica colombiana y casera' },
    { id: '7', name: 'Saludable', icon: 'Salad', description: 'Comida vegetariana, vegana y healthy' },
    { id: '8', name: 'Mariscos', icon: 'Fish', description: 'Pescados y mariscos frescos' },
    { id: '9', name: 'Postres', icon: 'IceCream', description: 'Repostería, helados y dulces' },
    { id: '10', name: 'Panadería', icon: 'Cookie', description: 'Pan artesanal y pastelería' },
    { id: '11', name: 'Asiática', icon: 'Utensils', description: 'Sushi, ramen, thai y más' },
  ]);

  const resetForm = () => {
    setName('');
    setIcon('');
    setDescription('');
    setEditingCategory(null);
  };

  const loadCategoryForEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setIcon(category.icon);
    setDescription(category.description);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      setCategories(categories.map(cat =>
        cat.id === editingCategory.id
          ? { ...cat, name, icon, description }
          : cat
      ));
      toast.success('Categoría actualizada');
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        name,
        icon,
        description,
      };
      setCategories([...categories, newCategory]);
      toast.success('Categoría creada');
    }

    resetForm();
    setIsCreateOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      setCategories(categories.filter(cat => cat.id !== id));
      toast.success('Categoría eliminada');
    }
  };

  const CategoryForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre *</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Comidas Rápidas" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="icon">Ícono (Lucide React) *</Label>
        <Input id="icon" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Ej: Sandwich" required />
        <p className="text-xs text-muted-foreground">
          Nombre del ícono de Lucide React (ver{' '}
          <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">lucide.dev</a>)
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve descripción" />
      </div>
      <DialogFooter>
        <Button type="submit">{editingCategory ? 'Actualizar' : 'Crear'} Categoría</Button>
      </DialogFooter>
    </form>
  );

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
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}><ArrowLeft className="h-5 w-5" /></Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Gestión de Categorías</h1>
              <p className="text-sm text-muted-foreground">{categories.length} categorías de comida</p>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}><Plus className="h-4 w-4 mr-2" />Nueva Categoría</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nueva Categoría</DialogTitle>
                  <DialogDescription>Define una nueva categoría de comida</DialogDescription>
                </DialogHeader>
                <CategoryForm />
              </DialogContent>
            </Dialog>
          </div>
        </header>
        <main className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg"><Tag className="h-5 w-5 text-primary" /></div>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <CardDescription className="text-xs">Ícono: {category.icon}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => loadCategoryForEdit(category)}><Edit className="h-4 w-4" /></Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Editar Categoría</DialogTitle></DialogHeader>
                          <CategoryForm />
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(category.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{category.description || 'Sin descripción'}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminCategories;
