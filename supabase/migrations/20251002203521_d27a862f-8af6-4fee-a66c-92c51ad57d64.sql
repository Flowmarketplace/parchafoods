-- Create subscription_plans table
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'COP',
  duration_days INTEGER NOT NULL,
  max_promotions INTEGER,
  max_shorts INTEGER,
  max_images INTEGER,
  push_notifications BOOLEAN NOT NULL DEFAULT false,
  proximity_notifications BOOLEAN NOT NULL DEFAULT false,
  analytics BOOLEAN NOT NULL DEFAULT false,
  priority_support BOOLEAN NOT NULL DEFAULT false,
  featured_listing BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create business_subscriptions table
CREATE TABLE public.business_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  payment_method TEXT,
  payment_reference TEXT,
  auto_renew BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for subscription_plans (everyone can view)
CREATE POLICY "Everyone can view subscription plans"
  ON public.subscription_plans
  FOR SELECT
  USING (true);

-- Policies for business_subscriptions
CREATE POLICY "Business owners can view their own subscriptions"
  ON public.business_subscriptions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = business_subscriptions.business_id
      AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can insert their own subscriptions"
  ON public.business_subscriptions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = business_subscriptions.business_id
      AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can update their own subscriptions"
  ON public.business_subscriptions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = business_subscriptions.business_id
      AND businesses.owner_id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_subscriptions_updated_at
  BEFORE UPDATE ON public.business_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default plans
INSERT INTO public.subscription_plans (name, price, duration_days, max_promotions, max_shorts, max_images, push_notifications, proximity_notifications, analytics, priority_support, featured_listing, description) VALUES
('Básico', 49900, 30, 3, 5, 10, false, false, false, false, false, 'Plan ideal para empezar tu presencia digital'),
('Profesional', 99900, 30, 10, 20, 50, true, true, true, false, false, 'Para negocios en crecimiento que necesitan más visibilidad'),
('Premium', 199900, 30, NULL, NULL, NULL, true, true, true, true, true, 'Plan completo con todas las funcionalidades y soporte prioritario');