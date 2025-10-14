-- Create table for business AI configuration
CREATE TABLE public.business_ai_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'openai',
  api_key_encrypted TEXT,
  system_prompt TEXT,
  greeting_message TEXT DEFAULT '¡Hola! ¿En qué puedo ayudarte hoy?',
  custom_instructions TEXT,
  temperature NUMERIC DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 500,
  enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(business_id)
);

-- Enable RLS
ALTER TABLE public.business_ai_config ENABLE ROW LEVEL SECURITY;

-- Business owners can manage their AI config
CREATE POLICY "Business owners can manage their AI config"
ON public.business_ai_config
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE businesses.id = business_ai_config.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_business_ai_config_updated_at
BEFORE UPDATE ON public.business_ai_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment
COMMENT ON TABLE public.business_ai_config IS 'Stores AI assistant configuration and API keys for each business';