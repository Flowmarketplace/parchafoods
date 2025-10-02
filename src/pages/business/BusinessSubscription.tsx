import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Check, CreditCard, Calendar, Zap, Crown } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration_days: number;
  max_promotions: number | null;
  max_shorts: number | null;
  max_images: number | null;
  push_notifications: boolean;
  proximity_notifications: boolean;
  analytics: boolean;
  priority_support: boolean;
  featured_listing: boolean;
  description: string;
}

interface Subscription {
  id: string;
  plan_id: string;
  status: string;
  start_date: string;
  end_date: string;
  payment_method: string | null;
  auto_renew: boolean;
  plan: Plan;
}

const BusinessSubscription = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('nequi');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      // Get business
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (businessError) throw businessError;
      if (!business) {
        navigate('/business-setup');
        return;
      }

      setBusinessId(business.id);

      // Get current subscription
      const { data: subscription, error: subError } = await supabase
        .from('business_subscriptions')
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .eq('business_id', business.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (subError) throw subError;
      setCurrentSubscription(subscription as any);

      // Get all available plans
      const { data: plans, error: plansError } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price', { ascending: true });

      if (plansError) throw plansError;
      setAvailablePlans(plans || []);

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información de suscripción",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowUpgradeDialog(true);
  };

  const confirmUpgrade = async () => {
    if (!selectedPlan || !businessId) return;

    try {
      // Calculate end date (30 days from now)
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + selectedPlan.duration_days);

      // Create new subscription
      const { error } = await supabase
        .from('business_subscriptions')
        .insert({
          business_id: businessId,
          plan_id: selectedPlan.id,
          status: 'pending',
          end_date: endDate.toISOString(),
          payment_method: paymentMethod
        });

      if (error) throw error;

      toast({
        title: "¡Solicitud enviada!",
        description: `Tu solicitud de ${selectedPlan.name} ha sido registrada. Recibirás instrucciones de pago por correo.`,
      });

      setShowUpgradeDialog(false);
      loadData();
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "No se pudo procesar la solicitud",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

        <h1 className="text-3xl font-bold mb-2">Mi Suscripción</h1>
        <p className="text-muted-foreground mb-8">Gestiona tu plan y actualiza cuando necesites más funcionalidades</p>

        {/* Current Subscription */}
        {currentSubscription && (
          <Card className="mb-8 border-2 border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {currentSubscription.plan.name === 'Premium' && <Crown className="h-5 w-5 text-yellow-500" />}
                    {currentSubscription.plan.name === 'Profesional' && <Zap className="h-5 w-5 text-blue-500" />}
                    Plan {currentSubscription.plan.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {currentSubscription.plan.description}
                  </CardDescription>
                </div>
                <Badge variant={currentSubscription.status === 'active' ? 'default' : 'secondary'}>
                  {currentSubscription.status === 'active' ? 'Activo' : 'Pendiente'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Costo Mensual</p>
                  <p className="text-2xl font-bold">{formatPrice(currentSubscription.plan.price)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Fecha de Inicio</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(currentSubscription.start_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Vence el</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(currentSubscription.end_date)}
                  </p>
                </div>
              </div>

              {currentSubscription.payment_method && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Método de Pago</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-medium capitalize">{currentSubscription.payment_method}</span>
                  </div>
                </div>
              )}

              {/* Plan Features */}
              <div className="mt-6 pt-6 border-t">
                <p className="font-semibold mb-3">Características incluidas:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      {currentSubscription.plan.max_promotions ? `${currentSubscription.plan.max_promotions} Promociones` : 'Promociones ilimitadas'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      {currentSubscription.plan.max_shorts ? `${currentSubscription.plan.max_shorts} Shorts/Reels` : 'Shorts ilimitados'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      {currentSubscription.plan.max_images ? `${currentSubscription.plan.max_images} Imágenes` : 'Imágenes ilimitadas'}
                    </span>
                  </div>
                  {currentSubscription.plan.push_notifications && (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Notificaciones Push</span>
                    </div>
                  )}
                  {currentSubscription.plan.proximity_notifications && (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Notificaciones de Proximidad</span>
                    </div>
                  )}
                  {currentSubscription.plan.analytics && (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Analíticas Avanzadas</span>
                    </div>
                  )}
                  {currentSubscription.plan.priority_support && (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Soporte Prioritario</span>
                    </div>
                  )}
                  {currentSubscription.plan.featured_listing && (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Listado Destacado</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Plans */}
        <h2 className="text-2xl font-bold mb-4">Planes Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availablePlans.map((plan) => {
            const isCurrent = currentSubscription?.plan_id === plan.id;
            const isPremium = plan.name === 'Premium';
            
            return (
              <Card key={plan.id} className={`relative ${isPremium ? 'border-2 border-yellow-500' : ''}`}>
                {isPremium && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-yellow-500 text-black">Más Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {plan.name === 'Premium' && <Crown className="h-5 w-5 text-yellow-500" />}
                    {plan.name === 'Profesional' && <Zap className="h-5 w-5 text-blue-500" />}
                    {plan.name}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        {plan.max_promotions ? `${plan.max_promotions} Promociones` : 'Promociones ilimitadas'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        {plan.max_shorts ? `${plan.max_shorts} Shorts` : 'Shorts ilimitados'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        {plan.max_images ? `${plan.max_images} Imágenes` : 'Imágenes ilimitadas'}
                      </span>
                    </div>
                    {plan.push_notifications && (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Notificaciones Push</span>
                      </div>
                    )}
                    {plan.proximity_notifications && (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Proximidad GPS</span>
                      </div>
                    )}
                    {plan.analytics && (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Analíticas</span>
                      </div>
                    )}
                    {plan.priority_support && (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Soporte 24/7</span>
                      </div>
                    )}
                    {plan.featured_listing && (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Listado destacado</span>
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handleUpgrade(plan)}
                    disabled={isCurrent}
                    variant={isPremium ? 'default' : 'outline'}
                  >
                    {isCurrent ? 'Plan Actual' : 'Seleccionar Plan'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Plan</DialogTitle>
            <DialogDescription>
              Selecciona tu método de pago para continuar con el plan {selectedPlan?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Total a pagar</p>
              <p className="text-2xl font-bold">{selectedPlan && formatPrice(selectedPlan.price)}</p>
            </div>

            <div className="space-y-3">
              <Label>Método de Pago</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 border rounded-lg p-3">
                  <RadioGroupItem value="nequi" id="nequi" />
                  <Label htmlFor="nequi" className="flex-1 cursor-pointer">Nequi</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3">
                  <RadioGroupItem value="bancolombia" id="bancolombia" />
                  <Label htmlFor="bancolombia" className="flex-1 cursor-pointer">Bancolombia</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3">
                  <RadioGroupItem value="pse" id="pse" />
                  <Label htmlFor="pse" className="flex-1 cursor-pointer">PSE</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3">
                  <RadioGroupItem value="daviplata" id="daviplata" />
                  <Label htmlFor="daviplata" className="flex-1 cursor-pointer">Daviplata</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>📱 Nota:</strong> Recibirás las instrucciones de pago por correo electrónico y WhatsApp.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowUpgradeDialog(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={confirmUpgrade}>
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessSubscription;
