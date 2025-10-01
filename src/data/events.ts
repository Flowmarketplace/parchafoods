import { Event, EventType } from '@/types/event';

export const mockEvents: Event[] = [
  {
    id: 'e1',
    name: 'Festival de Salsa Cali 2025',
    type: 'Festival',
    venue: 'Plaza Vallegrande',
    address: 'Carrera 30 #80-50, Barrio Vallegrande',
    neighborhood: 'Vallegrande',
    date: '2025-03-15',
    time: '6:00 PM - 11:00 PM',
    price: 'Gratis',
    description: 'Gran festival de salsa con orquestas en vivo, presentaciones de baile y gastronomía caleña. ¡No te lo pierdas!',
    images: [
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80'
    ],
    latitude: 3.4372,
    longitude: -76.5225,
    organizer: 'Alcaldía de Cali',
    featured: true
  },
  {
    id: 'e2',
    name: 'Concierto de Rock en Vivo',
    type: 'Concierto',
    venue: 'Cine Teatro Vallegrande',
    address: 'Carrera 30 #84-20, Barrio Vallegrande',
    neighborhood: 'Vallegrande',
    date: '2025-03-08',
    time: '8:00 PM',
    price: '$50.000 - $80.000',
    description: 'Noche de rock con bandas locales emergentes. Entrada general y VIP disponible.',
    images: [
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80'
    ],
    latitude: 3.4378,
    longitude: -76.5225,
    organizer: 'Rock Cali Producciones',
    featured: true
  },
  {
    id: 'e3',
    name: 'Obra de Teatro: El Avaro',
    type: 'Teatro',
    venue: 'Teatro Municipal Decepaz',
    address: 'Calle 50 #24-30, Barrio Decepaz',
    neighborhood: 'Decepaz',
    date: '2025-03-12',
    time: '7:30 PM',
    price: '$30.000',
    description: 'Clásica obra de Molière presentada por el grupo de teatro local. Comedia sobre la avaricia y el amor.',
    images: [
      'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=800&q=80',
      'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&q=80',
      'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80'
    ],
    latitude: 3.4105,
    longitude: -76.5175,
    organizer: 'Grupo Teatral Máscaras',
    featured: false
  },
  {
    id: 'e4',
    name: 'Cine al Aire Libre - Encanto',
    type: 'Cine',
    venue: 'Parque Recreativo Vallegrande',
    address: 'Carrera 30 #80-50, Barrio Vallegrande',
    neighborhood: 'Vallegrande',
    date: '2025-03-05',
    time: '7:00 PM',
    price: 'Gratis',
    description: 'Proyección gratuita de la película Encanto en pantalla gigante. Trae tu cobija y disfruta en familia.',
    images: [
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80',
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80'
    ],
    latitude: 3.4372,
    longitude: -76.5225,
    organizer: 'Junta de Acción Comunal',
    featured: true
  },
  {
    id: 'e5',
    name: 'Exposición de Arte Contemporáneo',
    type: 'Arte',
    venue: 'Centro Cultural Compartir',
    address: 'Calle 45 #21-40, Barrio Compartir',
    neighborhood: 'Compartir',
    date: '2025-03-01',
    time: '10:00 AM - 6:00 PM',
    price: '$10.000',
    description: 'Exposición de artistas locales con obras de pintura, escultura y fotografía. Abierta durante todo el mes.',
    images: [
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
      'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800&q=80',
      'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&q=80'
    ],
    latitude: 3.3951,
    longitude: -76.5197,
    organizer: 'Colectivo Arte Vivo',
    featured: false
  },
  {
    id: 'e6',
    name: 'Torneo de Fútbol Barrial',
    type: 'Deportes',
    venue: 'Parque Ecológico Decepaz',
    address: 'Carrera 25 #52-10, Barrio Decepaz',
    neighborhood: 'Decepaz',
    date: '2025-03-09',
    time: '8:00 AM - 5:00 PM',
    price: 'Gratis',
    description: 'Torneo de fútbol amateur entre equipos de los barrios. Inscripciones abiertas. Premios para los ganadores.',
    images: [
      'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&q=80',
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80'
    ],
    latitude: 3.4095,
    longitude: -76.5185,
    organizer: 'Liga Deportiva Decepaz',
    featured: false
  },
  {
    id: 'e7',
    name: 'Noche de Comedia Stand Up',
    type: 'Teatro',
    venue: 'Zona de Juegos GameZone',
    address: 'Calle 48 #23-50, Barrio Decepaz',
    neighborhood: 'Decepaz',
    date: '2025-03-14',
    time: '8:30 PM',
    price: '$25.000',
    description: 'Show de stand up comedy con comediantes locales. Risas garantizadas. Mayores de 18 años.',
    images: [
      'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80',
      'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80'
    ],
    latitude: 3.4102,
    longitude: -76.5177,
    organizer: 'Comedy Club Cali',
    featured: false
  },
  {
    id: 'e8',
    name: 'Concierto de Música Clásica',
    type: 'Concierto',
    venue: 'Centro Médico Compartir - Auditorio',
    address: 'Calle 47 #22-10, Barrio Compartir',
    neighborhood: 'Compartir',
    date: '2025-03-18',
    time: '6:00 PM',
    price: '$40.000',
    description: 'Orquesta Sinfónica de Cali presenta obras de Mozart, Beethoven y compositores colombianos.',
    images: [
      'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80',
      'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&q=80',
      'https://images.unsplash.com/photo-1519683384663-65ba3eb026b7?w=800&q=80'
    ],
    latitude: 3.3958,
    longitude: -76.5192,
    organizer: 'Orquesta Sinfónica de Cali',
    featured: true
  }
];

export const eventTypes: EventType[] = [
  'Todos',
  'Concierto',
  'Teatro',
  'Cine',
  'Festival',
  'Deportes',
  'Arte'
];
