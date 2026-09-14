export interface City {
  /** Value stored in the `city` column of businesses/events */
  id: string;
  name: string;
  state: string;
  label: string;
  latitude: number;
  longitude: number;
  zoom: number;
}

export const CITIES: City[] = [
  {
    id: 'Barbosa',
    name: 'Barbosa',
    state: 'Santander',
    label: 'Barbosa, Santander',
    latitude: 5.9319,
    longitude: -73.6167,
    zoom: 14,
  },
  {
    id: 'Santana',
    name: 'Santana',
    state: 'Boyacá',
    label: 'Santana, Boyacá',
    latitude: 6.0567,
    longitude: -73.4833,
    zoom: 14,
  },
  {
    id: 'Cali',
    name: 'Cali',
    state: 'Valle del Cauca',
    label: 'Cali, Valle del Cauca',
    latitude: 3.4516,
    longitude: -76.532,
    zoom: 12,
  },
];

export const DEFAULT_CITY_ID = 'Barbosa';

export const getCityById = (id?: string | null): City =>
  CITIES.find((c) => c.id === id) ?? CITIES[0];

/** Haversine distance in km */
export function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function nearestCity(lat: number, lon: number): City {
  return CITIES.reduce((best, city) =>
    distanceKm(lat, lon, city.latitude, city.longitude) <
    distanceKm(lat, lon, best.latitude, best.longitude)
      ? city
      : best,
  );
}
