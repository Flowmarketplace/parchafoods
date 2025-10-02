import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User, Session } from '@supabase/supabase-js';
import LoyaltyProgressBar from '@/components/LoyaltyProgressBar';
import { mockPlaces } from '@/data/places';

interface LoyaltyPoint {
  id: string;
  place_id: string;
  points: number;
  reward_claimed: boolean;
  last_scan_at: string;
}

const MyLoyalty = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoint[]>([]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate('/auth');
      } else {
        setTimeout(() => {
          loadLoyaltyPoints(session.user.id);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadLoyaltyPoints = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', userId)
        .order('points', { ascending: false });

      if (error) throw error;

      setLoyaltyPoints(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los puntos de fidelización",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = async (placeId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('loyalty_points')
        .update({
          points: 0,
          reward_claimed: true,
        })
        .eq('user_id', user.id)
        .eq('place_id', placeId);

      if (error) throw error;

      toast({
        title: "¡Recompensa reclamada!",
        description: "Muestra esta confirmación en el establecimiento",
      });

      loadLoyaltyPoints(user.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo reclamar la recompensa",
        variant: "destructive",
      });
    }
  };

  const getTotalPoints = () => {
    return loyaltyPoints.reduce((sum, item) => sum + item.points, 0);
  };

  const getPlaceName = (placeId: string) => {
    const place = mockPlaces.find(p => p.id === placeId);
    return place?.name || placeId;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto py-8">
        <Button
          variant="outline"
          onClick={() => navigate('/profile')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al perfil
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-full">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Mis Puntos de Fidelización</CardTitle>
                <CardDescription>Acumula puntos y obtén recompensas</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total de puntos</p>
              <p className="text-4xl font-bold text-primary">{getTotalPoints()}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Progreso por establecimiento</h3>
          
          {loyaltyPoints.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Aún no tienes puntos acumulados.
                  <br />
                  Visita las promociones de los establecimientos y escanea códigos QR para comenzar.
                </p>
              </CardContent>
            </Card>
          ) : (
            loyaltyPoints.map((loyalty) => (
              <div key={loyalty.id}>
                <LoyaltyProgressBar
                  points={loyalty.points}
                  placeName={getPlaceName(loyalty.place_id)}
                />
                {loyalty.points >= 5 && !loyalty.reward_claimed && (
                  <Button
                    className="w-full mt-2"
                    onClick={() => handleClaimReward(loyalty.place_id)}
                  >
                    Reclamar Recompensa
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyLoyalty;
