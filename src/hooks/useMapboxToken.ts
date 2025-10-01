import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMapboxToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) {
          console.error('Error fetching Mapbox token:', error);
          setError('No se pudo cargar el token del mapa');
          setIsLoading(false);
          return;
        }

        if (data?.token) {
          setToken(data.token);
          setError(null);
        } else {
          setError('Token no configurado');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar el mapa');
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, []);

  return { token, isLoading, error };
};
