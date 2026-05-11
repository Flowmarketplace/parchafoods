import { useState, useEffect, useRef } from 'react';

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface GeolocationState {
  position: GeolocationPosition | null;
  error: string | null;
  loading: boolean;
  permissionDenied: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    loading: false,
    permissionDenied: false,
  });
  const watchIdRef = useRef<number | null>(null);

  const handleError = (error: GeolocationPositionError) => {
    let errorMessage = 'No se pudo obtener tu ubicación';
    let permissionDenied = false;

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Permiso de ubicación denegado. Por favor, habilita el acceso a tu ubicación en la configuración del navegador.';
        permissionDenied = true;
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Información de ubicación no disponible';
        break;
      case error.TIMEOUT:
        errorMessage = 'Tiempo de espera agotado al obtener tu ubicación';
        break;
    }

    setState((prev) => ({
      position: prev.position, // keep last known position
      error: errorMessage,
      loading: false,
      permissionDenied,
    }));
  };

  const handleSuccess = (position: GeolocationPosition_) => {
    setState({
      position: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      },
      error: null,
      loading: false,
      permissionDenied: false,
    });
  };

  // Alias to avoid clashing with our exported interface name
  type GeolocationPosition_ = globalThis.GeolocationPosition;

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'La geolocalización no está soportada en tu navegador',
        loading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    // First, get a fast initial fix
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

    // Then start watching for live updates so the route auto-recalculates
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    watchIdRef.current = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 20000,
    });
  };

  const stopWatching = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  // Cleanup watcher on unmount
  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, []);

  return {
    ...state,
    requestLocation,
    stopWatching,
  };
};
