-- Create push notification campaigns table
CREATE TABLE public.push_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  image_url TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sending', 'sent', 'failed', 'cancelled')),
  target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'nearby', 'loyal_customers')),
  sent_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create push notification tokens table for users
CREATE TABLE public.push_notification_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  device_type TEXT CHECK (device_type IN ('ios', 'android', 'web')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, token)
);

-- Enable RLS
ALTER TABLE public.push_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_notification_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for push_campaigns
CREATE POLICY "Business owners can view their own campaigns"
ON public.push_campaigns
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE businesses.id = push_campaigns.business_id
    AND businesses.owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can create campaigns"
ON public.push_campaigns
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE businesses.id = push_campaigns.business_id
    AND businesses.owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can update their own campaigns"
ON public.push_campaigns
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE businesses.id = push_campaigns.business_id
    AND businesses.owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can delete their own campaigns"
ON public.push_campaigns
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE businesses.id = push_campaigns.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- RLS Policies for push_notification_tokens
CREATE POLICY "Users can view their own tokens"
ON public.push_notification_tokens
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tokens"
ON public.push_notification_tokens
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tokens"
ON public.push_notification_tokens
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tokens"
ON public.push_notification_tokens
FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_push_campaigns_business ON public.push_campaigns(business_id);
CREATE INDEX idx_push_campaigns_status ON public.push_campaigns(status);
CREATE INDEX idx_push_campaigns_scheduled ON public.push_campaigns(scheduled_at);
CREATE INDEX idx_push_tokens_user ON public.push_notification_tokens(user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_push_campaigns_updated_at
BEFORE UPDATE ON public.push_campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_push_tokens_updated_at
BEFORE UPDATE ON public.push_notification_tokens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();