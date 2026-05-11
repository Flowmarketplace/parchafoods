import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Brain, Save, Key, Sparkles, MessageSquare, Settings2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BusinessSidebar from '@/components/business/BusinessSidebar';
import BusinessBottomNav from '@/components/business/BusinessBottomNav';

interface AIConfig {
  id?: string;
  provider: string;
  api_key_encrypted: string;
  system_prompt: string;
  greeting_message: string;
  custom_instructions: string;
  temperature: number;
  max_tokens: number;
  enabled: boolean;
}

const BusinessAIConfig = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [config, setConfig] = useState<AIConfig>({
    provider: 'openai',
    api_key_encrypted: '',
    system_prompt: 'Eres un asistente virtual experto para nuestro negocio. Responde de manera amigable y profesional.',
    greeting_message: '¡Hola! ¿En qué puedo ayudarte hoy?',
    custom_instructions: '',
    temperature: 0.7,
    max_tokens: 500,
    enabled: false
  });

  useEffect(() => {
    loadBusinessAndConfig();
  }, []);

  const loadBusinessAndConfig = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Get business owned by user
      const { data: business, error: bizError } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (bizError || !business) {
        toast({
          title: "Error",
          description: "No se encontró tu negocio",
          variant: "destructive"
        });
        navigate('/business-dashboard');
        return;
      }

      setBusinessId(business.id);

      // Load AI config
      const { data: aiConfig } = await supabase
        .from('business_ai_config')
        .select('*')
        .eq('business_id', business.id)
        .maybeSingle();

      if (aiConfig) {
        setConfig({
          id: aiConfig.id,
          provider: aiConfig.provider || 'openai',
          api_key_encrypted: aiConfig.api_key_encrypted || '',
          system_prompt: aiConfig.system_prompt || config.system_prompt,
          greeting_message: aiConfig.greeting_message || config.greeting_message,
          custom_instructions: aiConfig.custom_instructions || '',
          temperature: aiConfig.temperature || 0.7,
          max_tokens: aiConfig.max_tokens || 500,
          enabled: aiConfig.enabled || false
        });
      }
    } catch (error) {
      console.error('Error loading config:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la configuración",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!businessId) return;

    setSaving(true);
    try {
      const configData = {
        business_id: businessId,
        provider: config.provider,
        api_key_encrypted: config.api_key_encrypted,
        system_prompt: config.system_prompt,
        greeting_message: config.greeting_message,
        custom_instructions: config.custom_instructions,
        temperature: config.temperature,
        max_tokens: config.max_tokens,
        enabled: config.enabled
      };

      if (config.id) {
        // Update existing
        const { error } = await supabase
          .from('business_ai_config')
          .update(configData)
          .eq('id', config.id);

        if (error) throw error;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('business_ai_config')
          .insert(configData)
          .select()
          .single();

        if (error) throw error;
        setConfig({ ...config, id: data.id });
      }

      toast({
        title: "Guardado",
        description: "Configuración de IA guardada exitosamente"
      });
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 min-w-0 p-4 md:p-6 pb-20 md:pb-6 lg:ml-64">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Configuración de IA</h1>
                <p className="text-muted-foreground">
                  Entrena tu asistente virtual personalizado
                </p>
              </div>
            </div>

            {/* Status Alert */}
            <Alert className={config.enabled ? "border-green-500 bg-green-50 dark:bg-green-950" : ""}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {config.enabled ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Tu asistente de IA está activo y listo para responder
                  </span>
                ) : (
                  "Configura y activa tu asistente de IA para empezar a usarlo"
                )}
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="credentials" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="credentials" className="gap-2">
                  <Key className="h-4 w-4" />
                  Credenciales
                </TabsTrigger>
                <TabsTrigger value="training" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Entrenamiento
                </TabsTrigger>
                <TabsTrigger value="advanced" className="gap-2">
                  <Settings2 className="h-4 w-4" />
                  Avanzado
                </TabsTrigger>
              </TabsList>

              {/* Credentials Tab */}
              <TabsContent value="credentials" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      API Keys
                    </CardTitle>
                    <CardDescription>
                      Conecta tu cuenta de proveedor de IA
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="provider">Proveedor de IA</Label>
                      <Select
                        value={config.provider}
                        onValueChange={(value) => setConfig({ ...config, provider: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI (GPT-4, GPT-3.5)</SelectItem>
                          <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                          <SelectItem value="google">Google (Gemini)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="api_key">API Key</Label>
                      <Input
                        id="api_key"
                        type="password"
                        placeholder="sk-..."
                        value={config.api_key_encrypted}
                        onChange={(e) => setConfig({ ...config, api_key_encrypted: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Tu API key se almacena de forma segura y encriptada
                      </p>
                    </div>

                    {config.provider === 'openai' && (
                      <Alert>
                        <AlertDescription className="text-xs">
                          Obtén tu API key en{' '}
                          <a
                            href="https://platform.openai.com/api-keys"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            platform.openai.com/api-keys
                          </a>
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Training Tab */}
              <TabsContent value="training" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Mensajes y Prompts
                    </CardTitle>
                    <CardDescription>
                      Personaliza cómo se comunica tu asistente
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="greeting">Mensaje de Bienvenida</Label>
                      <Input
                        id="greeting"
                        placeholder="¡Hola! ¿En qué puedo ayudarte?"
                        value={config.greeting_message}
                        onChange={(e) => setConfig({ ...config, greeting_message: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="system_prompt">Prompt del Sistema</Label>
                      <Textarea
                        id="system_prompt"
                        rows={4}
                        placeholder="Eres un asistente virtual para..."
                        value={config.system_prompt}
                        onChange={(e) => setConfig({ ...config, system_prompt: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Define la personalidad y comportamiento base de tu asistente
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="custom_instructions">Instrucciones Personalizadas</Label>
                      <Textarea
                        id="custom_instructions"
                        rows={6}
                        placeholder="Información sobre tu negocio, productos, servicios, horarios..."
                        value={config.custom_instructions}
                        onChange={(e) => setConfig({ ...config, custom_instructions: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Incluye detalles específicos de tu negocio: menú, precios, horarios, políticas, etc.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings2 className="h-5 w-5" />
                      Configuración Avanzada
                    </CardTitle>
                    <CardDescription>
                      Ajusta el comportamiento del modelo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="temperature">Creatividad (Temperature)</Label>
                        <span className="text-sm text-muted-foreground">{config.temperature}</span>
                      </div>
                      <Slider
                        id="temperature"
                        min={0}
                        max={1}
                        step={0.1}
                        value={[config.temperature]}
                        onValueChange={([value]) => setConfig({ ...config, temperature: value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        0 = Respuestas más precisas y consistentes | 1 = Más creativo y variado
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max_tokens">Longitud Máxima de Respuesta</Label>
                      <Input
                        id="max_tokens"
                        type="number"
                        min={100}
                        max={2000}
                        value={config.max_tokens}
                        onChange={(e) => setConfig({ ...config, max_tokens: parseInt(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Número máximo de tokens (palabras aproximadas) por respuesta
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enabled">Activar Asistente</Label>
                        <p className="text-xs text-muted-foreground">
                          El asistente estará disponible para tus clientes
                        </p>
                      </div>
                      <Switch
                        id="enabled"
                        checked={config.enabled}
                        onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={saveConfig}
                disabled={saving || !config.api_key_encrypted}
                className="gap-2"
                size="lg"
              >
                <Save className="h-4 w-4" />
                {saving ? "Guardando..." : "Guardar Configuración"}
              </Button>
            </div>
          </div>
        </main>
      </div>
      
      <BusinessBottomNav onMenuClick={() => setSidebarOpen(true)} />
    </div>
  );
};

export default BusinessAIConfig;