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

  useEffect(() => {
    if (open) {
      setType(defaultType);
      setClientName(defaultName || '');
      setAmount(defaultAmount ? String(defaultAmount) : '');
      setDate(new Date().toISOString().slice(0, 10));
      setNotes('');
    }
  }, [open, defaultType, defaultName, defaultAmount]);

  const save = async () => {
    if (!clientName.trim()) return toast.error('Escribe el nombre del cliente');
    if (amount === '' || Number(amount) <= 0) return toast.error('Escribe el valor');
    setSaving(true);
    const { error } = await supabase.from('seller_sales').insert({
      seller_id: sellerId,
      business_id: businessId || null,
      subscription_id: subscriptionId || null,
      client_name: clientName.trim(),
      sale_type: type,
      amount: Number(amount),
      sale_date: date,
      notes: notes || null,
    });
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
