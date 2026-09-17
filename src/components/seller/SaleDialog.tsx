import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ReactNode } from 'react';

interface SaleDialogProps {
  sellerId: string;
  trigger: ReactNode;
  businessId?: string | null;
  subscriptionId?: string | null;
  defaultName?: string;
  defaultAmount?: number | null;
  defaultType?: 'venta' | 'abono';
  onSaved?: () => void;
}

const SaleDialog = ({
  sellerId,
  trigger,
  businessId,
  subscriptionId,
  defaultName,
  defaultAmount,
  defaultType = 'venta',
  onSaved,
}: SaleDialogProps) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [type, setType] = useState<string>(defaultType);
  const [clientName, setClientName] = useState(defaultName || '');
  const [amount, setAmount] = useState(defaultAmount ? String(defaultAmount) : '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [available, setAvailable] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<any | null>(null);

  useEffect(() => {
    if (open) {
      setType(defaultType);
      setClientName(defaultName || '');
      setAmount(defaultAmount ? String(defaultAmount) : '');
      setDate(new Date().toISOString().slice(0, 10));
      setNotes('');
      setSearch('');
      setSelectedBusiness(null);
    }
  }, [open, defaultType, defaultName, defaultAmount]);

  useEffect(() => {
    if (!open || businessId) return;
    let cancelled = false;
    const loadAvailable = async () => {
      const [{ data: bizs }, { data: subs }, { data: cls }] = await Promise.all([
        supabase.from('businesses').select('id, name, city, category, business_type').order('name'),
        supabase.from('business_subscriptions').select('business_id'),
        supabase.from('clients').select('business_id, seller_id'),
      ]);
      const taken = new Set<string>();
      (subs || []).forEach((s: any) => s.business_id && taken.add(s.business_id));
      (cls || []).forEach((c: any) => c.business_id && c.seller_id && taken.add(c.business_id));
      if (!cancelled) setAvailable((bizs || []).filter((b: any) => !taken.has(b.id)));
    };
    loadAvailable();
    return () => {
      cancelled = true;
    };
  }, [open, businessId]);

  const filtered = available
    .filter((b) => b.name?.toLowerCase().includes(search.trim().toLowerCase()))
    .slice(0, 30);

  const pickBusiness = (b: any) => {
    setSelectedBusiness(b);
    setClientName(b.name);
    setSearch('');
  };

  const save = async () => {
    if (!clientName.trim()) return toast.error('Escribe el nombre del cliente');
    if (amount === '' || Number(amount) <= 0) return toast.error('Escribe el valor');
    setSaving(true);
    const linkedBusinessId = businessId || selectedBusiness?.id || null;
    const { error } = await supabase.from('seller_sales').insert({
      seller_id: sellerId,
      business_id: linkedBusinessId,
      subscription_id: subscriptionId || null,
      client_name: clientName.trim(),
      sale_type: type,
      amount: Number(amount),
      sale_date: date,
      notes: notes || null,
    });

    if (!error && selectedBusiness) {
      await supabase.from('clients').insert({
        name: selectedBusiness.name,
        business_id: selectedBusiness.id,
        seller_id: sellerId,
        category: selectedBusiness.business_type || selectedBusiness.category || null,
        status: 'activo',
        notes: 'Cliente asignado al registrar la venta',
      });
    }

    setSaving(false);
    if (error) return toast.error('No se pudo registrar');
    toast.success(type === 'venta' ? 'Venta registrada' : 'Abono registrado');
    setOpen(false);
    onSaved?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar {type === 'venta' ? 'venta' : 'abono'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Tipo</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="venta">Venta nueva</SelectItem>
                <SelectItem value="abono">Abono / pago</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {!businessId && (
            <div>
              <Label>Negocios sin vendedor asignado</Label>
              {selectedBusiness ? (
                <div className="flex items-center justify-between gap-2 rounded-lg border p-2 mt-1">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{selectedBusiness.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {selectedBusiness.city || '—'} · {selectedBusiness.business_type || selectedBusiness.category || '—'}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedBusiness(null)}>Cambiar</Button>
                </div>
              ) : (
                <>
                  <Input
                    className="mt-1"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar negocio disponible..."
                  />
                  <div className="mt-1 max-h-44 overflow-y-auto rounded-lg border divide-y">
                    {filtered.length === 0 ? (
                      <p className="p-3 text-xs text-muted-foreground">No hay negocios disponibles con ese nombre.</p>
                    ) : (
                      filtered.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => pickBusiness(b)}
                          className="w-full text-left px-3 py-2 hover:bg-muted/60"
                        >
                          <p className="text-sm truncate">{b.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {b.city || '—'} · {b.business_type || b.category || '—'}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          <div>
            <Label>Cliente</Label>
            <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Nombre del negocio" />
          </div>
          <div>
            <Label>Valor</Label>
            <Input type="number" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div>
            <Label>Fecha</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label>Notas</Label>
            <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <Button className="w-full" onClick={save} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaleDialog;
