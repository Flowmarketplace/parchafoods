import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, MapPin, Navigation } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const BusinessProximity = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    latitude: null as number | null,
    longitude: null as number | null,
    geo_notifications_enabled: false,
    notification_radius_km: 1.0
  });

  useEffect(() => {
    loadBusinessData();
  }, []);

  const loadBusinessData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: business, error } = await supabase
        .from('businesses')
        .select('id, latitude, longitude, geo_notifications_enabled, notification_radius_km')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!business) {
        navigate('/business-setup');
        return;
      }

      setBusinessId(business.id);
      setFormData({
        latitude: business.latitude,
        longitude: business.longitude,
        geo_notifications_enabled: business.geo_notifications_enabled || false,
        notification_radius_km: business.notification_radius_km || 1.0
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información del negocio",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validar que si está activado, tenga coordenadas
      if (formData.geo_notifications_enabled && (!formData.latitude || !formData.longitude)) {
        toast({
          title: "Error",
          description: "Debes ingresar las coordenadas GPS para activar las notificaciones",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      // Validar rango de coordenadas
      if (formData.latitude !== null && (formData.latitude < -90 || formData.latitude > 90)) {
        toast({
          title: "Error",
          description: "La latitud debe estar entre -90 y 90",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      if (formData.longitude !== null && (formData.longitude < -180 || formData.longitude > 180)) {
        toast({
          title: "Error",
          description: "La longitud debe estar entre -180 y 180. Para Cali, usa un valor como -76.53",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      // Truncar a 6 decimales para evitar numeric overflow
      const lat = formData.latitude !== null ? Math.round(formData.latitude * 1000000) / 1000000 : null;
      const lng = formData.longitude !== null ? Math.round(formData.longitude * 1000000) / 1000000 : null;

      const { error } = await supabase
        .from('businesses')
        .update({
          latitude: lat,
          longitude: lng,
          geo_notifications_enabled: formData.geo_notifications_enabled,
          notification_radius_km: Math.round(formData.notification_radius_km * 10) / 10
        })
        .eq('id', businessId);

      if (error) throw error;

      toast({
        title: "¡Actualizado!",
        description: "La configuración de notificaciones ha sido actualizada",
      });

      navigate('/business-dashboard');
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la configuración",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      toast({
        title: "Obteniendo ubicación...",
        description: "Por favor permite el acceso a tu ubicación",
      });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          toast({
            title: "¡Ubicación obtenida!",
            description: "Se han llenado las coordenadas GPS automáticamente",
          });
        },
        (error) => {
          toast({
            title: "Error",
            description: "No se pudo obtener tu ubicación. Ingresa las coordenadas manualmente.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "No disponible",
        description: "Tu navegador no soporta geolocalización",
        variant: "destructive",
      });
    }
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
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/business-dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>

        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <MapPin className="h-6 w-6" />
              Notificaciones por Proximidad
            </CardTitle>
            <CardDescription className="text-base">
              Envía notificaciones automáticas a usuarios cuando estén cerca de tu negocio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Estado del servicio */}
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                <div className="space-y-1">
                  <Label htmlFor="geo_enabled" className="text-base font-semibold">
                    Activar notificaciones por proximidad
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Los usuarios recibirán alertas cuando pasen cerca de tu negocio
                  </p>
                </div>
                <Switch
                  id="geo_enabled"
                  checked={formData.geo_notifications_enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, geo_notifications_enabled: checked })}
                />
              </div>

              {formData.geo_notifications_enabled && (
                <div className="space-y-6">
                  {/* Coordenadas GPS */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Ubicación del Negocio</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={getCurrentLocation}
                        className="gap-2"
                      >
                        <Navigation className="h-4 w-4" />
                        Usar mi ubicación actual
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitud *</Label>
                        <Input
                          id="latitude"
                          type="text"
                          inputMode="decimal"
                          value={formData.latitude !== null ? String(formData.latitude) : ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || val === '-') {
                              setFormData({ ...formData, latitude: val === '-' ? -0.000001 : null });
                              return;
                            }
                            const num = parseFloat(val);
                            if (!isNaN(num)) {
                              setFormData({ ...formData, latitude: num });
                            }
                          }}
                          placeholder="Ej: 3.451647"
                          required={formData.geo_notifications_enabled}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitud * (para Cali usa signo negativo: -76.xx)</Label>
                        <Input
                          id="longitude"
                          type="text"
                          inputMode="decimal"
                          value={formData.longitude !== null ? String(formData.longitude) : ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || val === '-') {
                              setFormData({ ...formData, longitude: val === '-' ? -0.000001 : null });
                              return;
                            }
                            const num = parseFloat(val);
                            if (!isNaN(num)) {
                              setFormData({ ...formData, longitude: num });
                            }
                          }}
                          placeholder="Ej: -76.531835"
                          required={formData.geo_notifications_enabled}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Radio de notificación */}
                  <div className="space-y-2">
                    <Label htmlFor="radius" className="text-base font-semibold">
                      Radio de notificación (km) *
                    </Label>
                    <Input
                      id="radius"
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="50"
                      value={formData.notification_radius_km}
                      onChange={(e) => setFormData({ ...formData, notification_radius_km: parseFloat(e.target.value) || 1.0 })}
                      required={formData.geo_notifications_enabled}
                    />
                    <p className="text-sm text-muted-foreground">
                      Los usuarios recibirán notificaciones cuando estén a <strong>{formData.notification_radius_km} km</strong> de tu negocio
                    </p>
                  </div>

                  {/* Consejos */}
                  <div className="space-y-3">
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>💡 Consejo:</strong> Puedes obtener las coordenadas de tu negocio:
                      </p>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 ml-4 space-y-1">
                        <li>• Abre Google Maps y busca tu negocio</li>
                        <li>• Haz clic derecho en la ubicación exacta</li>
                        <li>• Copia las coordenadas que aparecen en el menú</li>
                        <li>• O usa el botón "Usar mi ubicación actual" si estás en tu negocio</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        <strong>✨ Beneficio:</strong> Los usuarios verán una notificación como:
                      </p>
                      <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded border border-green-300 dark:border-green-700">
                        <p className="text-sm font-medium">📍 [Nombre de tu Negocio] está cerca</p>
                        <p className="text-xs text-muted-foreground">Estás a 0.5 km. ¡Visítanos!</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/business-dashboard')}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar Configuración'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessProximity;
