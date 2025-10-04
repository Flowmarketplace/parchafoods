export interface NeighborhoodLocation {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  zoom: number;
}

export const neighborhoodLocations: Record<string, NeighborhoodLocation> = {
  'Todos': {
    name: 'Todos',
    coordinates: [-76.5225, 3.4516],
    zoom: 12
  },
  'Aguablanca': {
    name: 'Aguablanca',
    coordinates: [-76.4900, 3.4200],
    zoom: 14
  },
  'Alameda': {
    name: 'Alameda',
    coordinates: [-76.5350, 3.4450],
    zoom: 14
  },
  'Alfonso López': {
    name: 'Alfonso López',
    coordinates: [-76.5000, 3.4300],
    zoom: 14
  },
  'Alférez Real': {
    name: 'Alférez Real',
    coordinates: [-76.5100, 3.4000],
    zoom: 14
  },
  'Arboledas': {
    name: 'Arboledas',
    coordinates: [-76.5200, 3.4100],
    zoom: 14
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
  'Decepaz': {
    name: 'Decepaz',
    coordinates: [-76.5180, 3.4100],
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
  },
  'El Limonar': {
    name: 'El Limonar',
    coordinates: [-76.5280, 3.3950],
    zoom: 14
  },
  'San Antonio': {
    name: 'San Antonio',
    coordinates: [-76.5350, 3.4500],
    zoom: 14
  },
  'Meléndez': {
    name: 'Meléndez',
    coordinates: [-76.5450, 3.3650],
    zoom: 14
  },
  'Pance': {
    name: 'Pance',
    coordinates: [-76.5700, 3.3000],
    zoom: 14
  },
  'Normandía': {
    name: 'Normandía',
    coordinates: [-76.5150, 3.4600],
    zoom: 14
  }
};
