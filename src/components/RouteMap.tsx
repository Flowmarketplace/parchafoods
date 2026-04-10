import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getCategoryColor } from '@/utils/categoryIcons';
import { MapPin, ChevronDown, ChevronUp, Trophy, Camera, QrCode, Lock, Check, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiaGFuZGNpdHkiLCJhIjoiY2syNmp3ZjUxMzJkMzNtcGl6dXR6ZTV0diJ9.0xE-C5rlwWBM80gUY1POzw';

interface RoutePlace {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  slug?: string;
  neighborhood?: string;
}

interface RouteMapProps {
  places: RoutePlace[];
  category: string;
  routeName: string;
  routeEmoji?: string;
}

// Sort places geographically to create a logical route (nearest-neighbor)
function sortByRoute(places: RoutePlace[]): RoutePlace[] {
  if (places.length <= 2) return places;

  // Find the northernmost point as start
  const sorted = [...places];
  sorted.sort((a, b) => b.latitude - a.latitude);
  
  const result: RoutePlace[] = [sorted[0]];
  const remaining = sorted.slice(1);

  while (remaining.length > 0) {
    const last = result[result.length - 1];
    let nearestIdx = 0;
    let nearestDist = Infinity;
    
    remaining.forEach((p, i) => {
      const dist = Math.sqrt(
        Math.pow(p.latitude - last.latitude, 2) + 
        Math.pow(p.longitude - last.longitude, 2)
      );
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    });
    
    result.push(remaining[nearestIdx]);
    remaining.splice(nearestIdx, 1);
  }

  return result;
}

const RouteMap = ({ places, category, routeName, routeEmoji = '🗺️' }: RouteMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [expanded, setExpanded] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [visits, setVisits] = useState<any[]>([]);
  const [checkInDialog, setCheckInDialog] = useState(false);
  const [selectedStop, setSelectedStop] = useState<{ place: RoutePlace; index: number } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState('');
  const navigate = useNavigate();

  const validPlaces = places.filter(p => p.latitude && p.longitude && p.latitude !== 0 && p.longitude !== 0);
  const orderedPlaces = sortByRoute(validPlaces);
  const color = getCategoryColor(category);

  // Load user & visits
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from('route_visits')
          .select('*')
          .eq('user_id', user.id)
          .eq('route_category', category);
        setVisits(data || []);
      }
    };
    loadUser();
  }, [category]);

  const totalGoals = visits.reduce((sum, v) => sum + (v.goals_earned || 0), 0);
  const visitedIds = new Set(visits.map(v => v.business_id));
  const routeComplete = orderedPlaces.length > 0 && orderedPlaces.every(p => visitedIds.has(p.id));

  // Map setup
  useEffect(() => {
    if (!mapContainer.current || orderedPlaces.length === 0 || !expanded) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const bounds = new mapboxgl.LngLatBounds();
    orderedPlaces.forEach(p => bounds.extend([p.longitude, p.latitude]));

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      bounds,
      fitBoundsOptions: { padding: 50, maxZoom: 14 },
    });

    map.current = m;
    m.addControl(new mapboxgl.NavigationControl(), 'top-right');

    m.on('load', () => {
      // Add numbered markers
      orderedPlaces.forEach((place, index) => {
        const visited = visitedIds.has(place.id);
        const el = document.createElement('div');
        el.style.cssText = 'width: 36px; height: 46px; cursor: pointer;';
        el.innerHTML = `
          <div style="
            width: 36px; height: 36px;
            background: ${visited ? '#22c55e' : color};
            border: 3px solid white;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: white; font-weight: 800; font-size: 15px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
          ">${visited ? '✓' : index + 1}</div>
          <div style="
            width: 0; height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 10px solid ${visited ? '#22c55e' : color};
            margin: 0 auto;
          "></div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          navigate(`/place/${place.slug || place.id}`);
        });

        new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([place.longitude, place.latitude])
          .addTo(m);
      });

      // Draw smooth route line
      if (orderedPlaces.length >= 2) {
        const coordinates = orderedPlaces.map(p => [p.longitude, p.latitude]);

        m.addSource('route-line', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: { type: 'LineString', coordinates },
          },
        });

        // Route background (glow effect)
        m.addLayer({
          id: 'route-glow',
          type: 'line',
          source: 'route-line',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': color,
            'line-width': 8,
            'line-opacity': 0.15,
          },
        });

        // Main route
        m.addLayer({
          id: 'route-main',
          type: 'line',
          source: 'route-line',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': color,
            'line-width': 3.5,
            'line-opacity': 0.8,
          },
        });

        // Direction dots
        m.addLayer({
          id: 'route-dots',
          type: 'line',
          source: 'route-line',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': 'white',
            'line-width': 2,
            'line-dasharray': [0.5, 3],
            'line-opacity': 0.8,
          },
        });
      }
    });

    return () => {
      m.remove();
      map.current = null;
    };
  }, [orderedPlaces.length, category, expanded, visits.length]);

  // Check-in handler
  const handleCheckIn = async (place: RoutePlace, index: number) => {
    if (!user) {
      setSelectedStop({ place, index });
      setCheckInDialog(true);
      return;
    }
    if (visitedIds.has(place.id)) {
      toast.info('¡Ya visitaste este lugar! ⚽');
      return;
    }
    setSelectedStop({ place, index });
    setReceiptUrl('');
    setCheckInDialog(true);
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !user || !selectedStop) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop();
      const path = `${user.id}/${category}/${selectedStop.place.id}_${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('business-content').upload(path, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('business-content').getPublicUrl(path);
      setReceiptUrl(publicUrl);
      toast.success('Factura subida ✓');
    } catch (err: any) {
      toast.error(err.message || 'Error al subir');
    } finally {
      setUploading(false);
    }
  };

  const confirmCheckIn = async () => {
    if (!user || !selectedStop) return;
    try {
      const { error } = await supabase.from('route_visits').insert({
        user_id: user.id,
        business_id: selectedStop.place.id,
        route_category: category,
        receipt_image_url: receiptUrl || null,
        qr_scanned: false,
        goals_earned: 1,
      });
      if (error) throw error;
      
      toast.success(`⚽ ¡GOOOL! Visitaste ${selectedStop.place.name}`);
      setCheckInDialog(false);
      
      // Reload visits
      const { data } = await supabase
        .from('route_visits')
        .select('*')
        .eq('user_id', user.id)
        .eq('route_category', category);
      setVisits(data || []);
    } catch (err: any) {
      toast.error(err.message || 'Error al registrar visita');
    }
  };

  if (orderedPlaces.length === 0) return null;

  return (
    <div className="mb-4 sm:mb-6 rounded-xl overflow-hidden border border-border bg-card shadow-sm">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted/70 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{routeEmoji}</span>
          <div className="text-left">
            <h3 className="text-sm font-bold">{routeName}</h3>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {orderedPlaces.length} paradas · Ruta recomendada
              {user && <span className="ml-1">· ⚽ {totalGoals} goles</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user && routeComplete && (
            <Badge className="bg-green-500 text-white text-[10px] gap-1">
              <Trophy className="h-3 w-3" /> Ruta Completa
            </Badge>
          )}
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {expanded && (
        <>
          {/* Map */}
          <div ref={mapContainer} className="w-full h-[250px] sm:h-[300px]" />

          {/* Route stops list */}
          <div className="p-3 sm:p-4 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold flex items-center gap-1.5">
                📋 Orden del recorrido
              </h4>
              {user && (
                <div className="flex items-center gap-1 text-xs font-semibold">
                  <span>⚽ {visits.length}/{orderedPlaces.length}</span>
                  <span className="text-muted-foreground">goles</span>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${orderedPlaces.length > 0 ? (visits.length / orderedPlaces.length) * 100 : 0}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}dd)`,
                }}
              />
            </div>

            {orderedPlaces.map((place, index) => {
              const visited = visitedIds.has(place.id);
              const isLast = index === orderedPlaces.length - 1;

              return (
                <div key={place.id} className="relative">
                  {/* Connector line */}
                  {!isLast && (
                    <div
                      className="absolute left-[17px] top-[40px] w-0.5 h-[calc(100%_-_20px)]"
                      style={{ background: visited ? '#22c55e' : `${color}40` }}
                    />
                  )}

                  <div className={`flex items-start gap-3 p-2.5 rounded-lg transition-colors ${visited ? 'bg-green-500/5' : 'hover:bg-muted/50'}`}>
                    {/* Number circle */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
                      style={{ background: visited ? '#22c55e' : color }}
                    >
                      {visited ? <Check className="h-4 w-4" /> : index + 1}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className={`font-semibold text-sm ${visited ? 'line-through text-muted-foreground' : ''}`}>
                        {place.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {place.neighborhood && `${place.neighborhood} · `}{place.address}
                      </p>
                      {visited && (
                        <p className="text-[11px] text-green-600 font-medium mt-0.5">⚽ Gol anotado</p>
                      )}
                    </div>

                    {/* Check-in button */}
                    <Button
                      size="sm"
                      variant={visited ? 'outline' : 'default'}
                      className={`shrink-0 text-xs h-8 gap-1 ${visited ? 'border-green-500 text-green-600' : ''}`}
                      style={!visited ? { background: color } : {}}
                      onClick={() => handleCheckIn(place, index)}
                      disabled={visited}
                    >
                      {visited ? (
                        <><Check className="h-3 w-3" /> Visitado</>
                      ) : user ? (
                        <><QrCode className="h-3 w-3" /> Check-in</>
                      ) : (
                        <><Lock className="h-3 w-3" /> Check-in</>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}

            {/* Route complete bonus */}
            {orderedPlaces.length > 0 && (
              <Card className={`p-3 mt-3 border-dashed ${routeComplete ? 'border-green-500 bg-green-500/5' : 'border-muted-foreground/30'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${routeComplete ? 'bg-green-500' : 'bg-muted'}`}>
                    <Trophy className={`h-5 w-5 ${routeComplete ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">
                      {routeComplete ? '🎉 ¡Ruta Completada!' : '🏆 Completa la ruta'}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {routeComplete
                        ? `¡Ganaste ${orderedPlaces.length} goles! Eres un hincha gastronómico.`
                        : `Visita los ${orderedPlaces.length} lugares y gana ⚽ ${orderedPlaces.length} goles + bonus de ruta completa`
                      }
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Login prompt for non-authenticated users */}
            {!user && (
              <Card className="p-3 mt-2 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">¡Regístrate y acumula goles! ⚽</p>
                    <p className="text-[11px] text-muted-foreground">
                      Haz check-in en cada restaurante, escanea el QR y sube tu factura para ganar goles mundialistas.
                    </p>
                  </div>
                  <Button size="sm" className="shrink-0 text-xs" onClick={() => navigate('/auth')}>
                    Registro
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </>
      )}

      {/* Check-in Dialog */}
      <Dialog open={checkInDialog} onOpenChange={setCheckInDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              ⚽ Check-in
              {selectedStop && (
                <Badge variant="outline" className="text-xs">Parada {selectedStop.index + 1}</Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {user
                ? `Registra tu visita a ${selectedStop?.place.name}`
                : 'Necesitas iniciar sesión para hacer check-in'}
            </DialogDescription>
          </DialogHeader>

          {!user ? (
            <div className="space-y-4 py-2">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-1">¡Únete al reto mundialista!</h3>
                <p className="text-sm text-muted-foreground">
                  Regístrate para hacer check-in, acumular goles ⚽ y completar rutas gastronómicas.
                </p>
              </div>
              <div className="space-y-2 bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm">
                  <QrCode className="h-4 w-4 text-primary" />
                  <span>Escanea el QR del restaurante</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Camera className="h-4 w-4 text-primary" />
                  <span>Sube la foto de tu factura</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span>Gana goles y completa rutas</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setCheckInDialog(false)}>
                  Después
                </Button>
                <Button className="flex-1" onClick={() => { setCheckInDialog(false); navigate('/auth'); }}>
                  Registrarme ⚽
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: color }}
                >
                  {(selectedStop?.index ?? 0) + 1}
                </div>
                <div>
                  <p className="font-semibold text-sm">{selectedStop?.place.name}</p>
                  <p className="text-[11px] text-muted-foreground">{selectedStop?.place.address}</p>
                </div>
              </div>

              {/* Receipt upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <Camera className="h-4 w-4" /> Foto de la factura (opcional)
                </label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  {receiptUrl ? (
                    <div className="space-y-2">
                      <img src={receiptUrl} alt="Factura" className="max-h-40 mx-auto rounded-lg object-cover" />
                      <p className="text-xs text-green-600 font-medium">✓ Factura subida</p>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Toca para subir tu factura</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleReceiptUpload}
                        disabled={uploading}
                      />
                    </label>
                  )}
                  {uploading && <p className="text-xs text-muted-foreground mt-2">Subiendo...</p>}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setCheckInDialog(false)}>
                  Cancelar
                </Button>
                <Button
                  className="flex-1 gap-1"
                  style={{ background: color }}
                  onClick={confirmCheckIn}
                  disabled={uploading}
                >
                  ⚽ ¡Anotar Gol!
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RouteMap;
