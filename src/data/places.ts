import { Place } from '@/types/place';

export const mockPlaces: Place[] = [
  {
    id: '1',
    name: 'Restaurante El Sabor del Barrio',
    category: 'Restaurante',
    address: 'Calle 45 #20-15, Barrio Compartir',
    neighborhood: 'Compartir',
    phone: '+57 2 555 1234',
    description: 'Deliciosa comida típica caleña con el sazón de casa. Especialidad en sancocho de gallina y bandeja paisa. Horario: Lunes a Sábado 11:00 AM - 9:00 PM, Domingos 11:00 AM - 5:00 PM. Aceptamos efectivo y tarjetas.',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'
    ],
    latitude: 3.3951,
    longitude: -76.5197,
    rating: 4.5,
    priceRange: '$$',
    featured: true,
    hasMenu: true,
    menu: [
      {
        id: 'm1',
        name: 'Sancocho de Gallina',
        description: 'Tradicional sopa caleña con gallina criolla y plátano',
        price: '$18.000',
        category: 'Platos Principales'
      },
      {
        id: 'm2',
        name: 'Bandeja Paisa',
        description: 'Carne molida, chicharrón, chorizo, arroz, frijoles, huevo, plátano y aguacate',
        price: '$25.000',
        category: 'Platos Principales'
      },
      {
        id: 'm3',
        name: 'Sudado de Pollo',
        description: 'Pollo en salsa criolla con papa y yuca',
        price: '$16.000',
        category: 'Platos Principales'
      },
      {
        id: 'm4',
        name: 'Arroz con Pollo',
        description: 'Arroz amarillo con pollo desmechado y ensalada',
        price: '$14.000',
        category: 'Platos Principales'
      },
      {
        id: 'm5',
        name: 'Jugo Natural',
        description: 'Lulo, mora, maracuyá o guanábana',
        price: '$5.000',
        category: 'Bebidas'
      }
    ],
    reviews: [
      {
        id: '1',
        author: 'María González',
        rating: 5,
        comment: '¡Excelente comida y muy buen servicio! El sancocho es el mejor de Cali.',
        date: '2024-01-15'
      },
      {
        id: '2',
        author: 'Carlos Rodríguez',
        rating: 4,
        comment: 'Buena relación calidad-precio. El ambiente es muy acogedor.',
        date: '2024-01-10'
      }
    ]
  },
  {
    id: '2',
    name: 'Parque Recreativo Vallegrande',
    category: 'Parque',
    address: 'Carrera 30 #80-50, Barrio Vallegrande',
    neighborhood: 'Vallegrande',
    phone: '+57 2 555 5678',
    description: 'Amplio parque con zonas verdes, juegos infantiles y canchas deportivas. Ideal para pasar el día en familia.',
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      'https://images.unsplash.com/photo-1585223700402-dcfee7eedb12?w=800&q=80',
      'https://images.unsplash.com/photo-1587502536575-6dfba0a6e017?w=800&q=80'
    ],
    latitude: 3.4372,
    longitude: -76.5225,
    rating: 4.2,
    priceRange: 'Gratis',
    featured: true,
    reviews: [
      {
        id: '3',
        author: 'Ana Martínez',
        rating: 5,
        comment: 'Perfecto para ir con los niños. Muy limpio y seguro.',
        date: '2024-01-20'
      },
      {
        id: '4',
        author: 'Luis Hernández',
        rating: 4,
        comment: 'Buen lugar para hacer ejercicio por las mañanas.',
        date: '2024-01-18'
      }
    ]
  }
];

export const categories: string[] = [
  'Todos',
  'Restaurante',
  'Café',
  'Parque',
  'Farmacia',
  'Banco',
  'Centro Comercial',
  'Hospital',
  'Hotel',
  'Entretenimiento',
  'Servicios'
];

export const neighborhoods: string[] = [
  'Todos',
  'Compartir',
  'Vallegrande',
  'Ciudad Jardín',
  'San Fernando',
  'Granada',
  'El Peñón',
  'Versalles',
  'Juanambú'
];
