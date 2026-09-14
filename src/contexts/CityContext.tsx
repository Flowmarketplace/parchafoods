import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CITIES, DEFAULT_CITY_ID, getCityById, nearestCity, type City } from '@/data/cities';
import { safeGetItem, safeSetItem } from '@/lib/storage';

const CITY_KEY = 'selected_city_id';
const CITY_CHOSEN_KEY = 'city_chosen';

interface CityContextValue {
  city: City;
  cities: City[];
  setCityId: (id: string) => void;
  hasChosen: boolean;
  locating: boolean;
  locationError: string | null;
  detectCity: () => void;
}

const CityContext = createContext<CityContextValue | undefined>(undefined);

export const CityProvider = ({ children }: { children: ReactNode }) => {
  const [cityId, setCityIdState] = useState<string>(
    () => safeGetItem(CITY_KEY) ?? DEFAULT_CITY_ID,
  );
  const [hasChosen, setHasChosen] = useState<boolean>(
    () => safeGetItem(CITY_CHOSEN_KEY) === 'true',
  );
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    safeSetItem(CITY_KEY, cityId);
  }, [cityId]);

  const setCityId = (id: string) => {
    setCityIdState(id);
    setHasChosen(true);
    safeSetItem(CITY_CHOSEN_KEY, 'true');
  };

  const detectCity = () => {
    if (!('geolocation' in navigator)) {
      setLocationError('Tu dispositivo no permite ubicación.');
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const found = nearestCity(pos.coords.latitude, pos.coords.longitude);
        setCityId(found.id);
        setLocating(false);
      },
      () => {
        setLocating(false);
        setLocationError('No pudimos obtener tu ubicación. Escoge tu ciudad.');
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  };

  const value = useMemo<CityContextValue>(
    () => ({
      city: getCityById(cityId),
      cities: CITIES,
      setCityId,
      hasChosen,
      locating,
      locationError,
      detectCity,
    }),
    [cityId, hasChosen, locating, locationError],
  );

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
};

export const useCity = (): CityContextValue => {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error('useCity must be used within a CityProvider');
  return ctx;
};
