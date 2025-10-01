export interface NeighborhoodLocation {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  zoom: number;
}

export const neighborhoodLocations: Record<string, NeighborhoodLocation> = {
  'Todos': {
    name: 'Todos',
    coordinates: [-76.5225, 3.4516], // Centro de Cali
    zoom: 12
  },
  'Compartir': {
    name: 'Compartir',
    coordinates: [-76.5197, 3.3951],
    zoom: 14
  },
  'Vallegrande': {
    name: 'Vallegrande',
    coordinates: [-76.5225, 3.4372],
    zoom: 14
  },
  'Ciudad Jardín': {
    name: 'Ciudad Jardín',
    coordinates: [-76.5355, 3.3762],
    zoom: 14
  },
  'San Fernando': {
    name: 'San Fernando',
    coordinates: [-76.5400, 3.4200],
    zoom: 14
  },
  'Granada': {
    name: 'Granada',
    coordinates: [-76.5340, 3.4580],
    zoom: 14
  },
  'El Peñón': {
    name: 'El Peñón',
    coordinates: [-76.5300, 3.4300],
    zoom: 14
  },
  'Versalles': {
    name: 'Versalles',
    coordinates: [-76.5450, 3.4450],
    zoom: 14
  },
  'Juanambú': {
    name: 'Juanambú',
    coordinates: [-76.5100, 3.4100],
    zoom: 14
  }
};
