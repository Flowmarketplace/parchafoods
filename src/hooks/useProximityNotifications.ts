import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NearbyBusiness {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance_km: number;
  notification_radius_km: number;
}

export const useProximityNotifications = () => {
  const { toast } = useToast();
  const [isTracking, setIsTracking] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const notifiedBusinessesRef = useRef<Set<string>>(new Set());
  const lastCheckRef = useRef<number>(0);

  const checkNearbyBusinesses = async (latitude: number, longitude: number) => {
    try {
      // Only check every 5 minutes to avoid excessive requests
      const now = Date.now();
      if (now - lastCheckRef.current < 5 * 60 * 1000) {
        return;
      }
      lastCheckRef.current = now;

      // Get user session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Call the database function to get nearby businesses
      const { data: nearbyBusinesses, error } = await supabase
        .rpc('get_nearby_businesses', {
          user_lat: latitude,
          user_lon: longitude,
          max_radius_km: 10
        }) as { data: NearbyBusiness[] | null, error: any };

      if (error) {
        console.error('Error fetching nearby businesses:', error);
        return;
      }

      if (!nearbyBusinesses || nearbyBusinesses.length === 0) {
        return;
      }

      // Check each nearby business
      for (const business of nearbyBusinesses) {
        // Skip if already notified in this session
        if (notifiedBusinessesRef.current.has(business.id)) {
          continue;
        }

        // Check if notification was already sent in the last 24 hours
        const oneDayAgo = new Date();
        oneDayAgo.setHours(oneDayAgo.getHours() - 24);

        const { data: recentNotification } = await supabase
          .from('proximity_notifications_sent')
          .select('id')
          .eq('user_id', user.id)
          .eq('business_id', business.id)
          .gte('sent_at', oneDayAgo.toISOString())
          .limit(1)
          .single();

        // Skip if notification was already sent recently
        if (recentNotification) {
          notifiedBusinessesRef.current.add(business.id);
          continue;
        }

        // Send notification
        toast({
          title: `📍 ${business.name} está cerca`,
          description: `Estás a ${business.distance_km.toFixed(1)} km. ¡Visítanos!`,
          duration: 8000,
        });

        // Request notification permission if supported
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`${business.name} está cerca`, {
            body: `Estás a ${business.distance_km.toFixed(1)} km. ¡Visítanos!`,
            icon: '/icon-192.png',
            tag: `proximity-${business.id}`,
          });
        }

        // Record the notification
        await supabase
          .from('proximity_notifications_sent')
          .insert({
            user_id: user.id,
            business_id: business.id,
            user_latitude: latitude,
            user_longitude: longitude,
            distance_km: business.distance_km
          });

        // Mark as notified
        notifiedBusinessesRef.current.add(business.id);
      }
    } catch (error) {
      console.error('Error in checkNearbyBusinesses:', error);
    }
  };

  const startTracking = () => {
    if (!('geolocation' in navigator)) {
      toast({
        title: "Geolocalización no disponible",
        description: "Tu dispositivo no soporta geolocalización",
        variant: "destructive",
      });
      return;
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Start watching position
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        checkNearbyBusinesses(latitude, longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        if (error.code === error.PERMISSION_DENIED) {
          toast({
            title: "Permiso denegado",
            description: "Por favor permite el acceso a tu ubicación para recibir notificaciones de negocios cercanos",
            variant: "destructive",
          });
          stopTracking();
        }
      },
      {
        enableHighAccuracy: false,
        maximumAge: 5 * 60 * 1000, // 5 minutes
        timeout: 30000
      }
    );

    setIsTracking(true);
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    notifiedBusinessesRef.current.clear();
  };

  useEffect(() => {
    // Auto-start tracking if user is logged in and has granted location permission
    const checkAndStartTracking = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && 'geolocation' in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          if (result.state === 'granted') {
            startTracking();
          }
        });
      }
    };

    checkAndStartTracking();

    // Cleanup on unmount
    return () => {
      stopTracking();
    };
  }, []);

  return {
    isTracking,
    startTracking,
    stopTracking
  };
};
