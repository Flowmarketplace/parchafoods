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
  },
  // Restaurantes
  {
    id: '3',
    name: 'Asadero La Brasa Vallecaucana',
    category: 'Restaurante',
    address: 'Calle 50 #22-30, Barrio Decepaz',
    neighborhood: 'Decepaz',
    phone: '+57 2 555 2345',
    description: 'Especialistas en carnes a la parrilla y platos típicos del Valle del Cauca. Ambiente familiar y acogedor.',
    images: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
      'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80',
      'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&q=80'
    ],
    latitude: 3.4105,
    longitude: -76.5175,
    rating: 4.6,
    priceRange: '$$',
    featured: false,
    hasMenu: true,
    menu: [
      {
        id: 'm6',
        name: 'Parrillada Valluna',
        description: 'Carne, chorizo, morcilla, papa criolla y plátano',
        price: '$32.000',
        category: 'Especialidades'
      },
      {
        id: 'm7',
        name: 'Churrasco',
        description: 'Corte de carne premium con chimichurri',
        price: '$28.000',
        category: 'Especialidades'
      }
    ],
    reviews: [
      {
        id: '5',
        author: 'Pedro Sánchez',
        rating: 5,
        comment: 'La mejor carne que he probado en Cali. Muy recomendado.',
        date: '2024-01-22'
      }
    ]
  },
  // Cafés
  {
    id: '4',
    name: 'Café Aroma del Valle',
    category: 'Café',
    address: 'Carrera 28 #45-12, Barrio Compartir',
    neighborhood: 'Compartir',
    phone: '+57 2 555 3456',
    description: 'Café de especialidad con granos 100% colombianos. Ofrecemos desayunos, repostería artesanal y Wi-Fi gratis.',
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80'
    ],
    latitude: 3.3960,
    longitude: -76.5190,
    rating: 4.7,
    priceRange: '$',
    featured: true,
    hasMenu: true,
    menu: [
      {
        id: 'm8',
        name: 'Café Americano',
        description: 'Café colombiano de origen único',
        price: '$4.000',
        category: 'Bebidas Calientes'
      },
      {
        id: 'm9',
        name: 'Capuchino',
        description: 'Espresso con leche espumada y canela',
        price: '$5.500',
        category: 'Bebidas Calientes'
      },
      {
        id: 'm10',
        name: 'Croissant de Almendras',
        description: 'Recién horneado con almendras tostadas',
        price: '$6.000',
        category: 'Repostería'
      }
    ],
    reviews: [
      {
        id: '6',
        author: 'Laura Jiménez',
        rating: 5,
        comment: 'Excelente café y un ambiente muy agradable para trabajar.',
        date: '2024-01-25'
      }
    ]
  },
  {
    id: '5',
    name: 'Cafetería Dulce Momento',
    category: 'Café',
    address: 'Calle 85 #32-20, Barrio Vallegrande',
    neighborhood: 'Vallegrande',
    phone: '+57 2 555 3567',
    description: 'Cafetería boutique con repostería francesa y bebidas especiales. Terraza con vista panorámica.',
    images: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
      'https://images.unsplash.com/photo-1559305616-3005c2fc2d7f?w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80'
    ],
    latitude: 3.4380,
    longitude: -76.5230,
    rating: 4.5,
    priceRange: '$$',
    featured: false,
    hasMenu: true,
    menu: [
      {
        id: 'm11',
        name: 'Latte Macchiato',
        description: 'Espresso con leche vaporizada',
        price: '$6.500',
        category: 'Bebidas Calientes'
      },
      {
        id: 'm12',
        name: 'Tarta de Chocolate',
        description: 'Tarta belga con chocolate 70% cacao',
        price: '$8.000',
        category: 'Postres'
      }
    ],
    reviews: []
  },
  // Parques
  {
    id: '6',
    name: 'Parque Ecológico Decepaz',
    category: 'Parque',
    address: 'Carrera 25 #52-10, Barrio Decepaz',
    neighborhood: 'Decepaz',
    phone: '+57 2 555 4678',
    description: 'Espacio verde con senderos ecológicos, zona de picnic y área de ejercicios al aire libre.',
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
      'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&q=80',
      'https://images.unsplash.com/photo-1535332371349-a5d229f49cb5?w=800&q=80'
    ],
    latitude: 3.4095,
    longitude: -76.5185,
    rating: 4.3,
    priceRange: 'Gratis',
    featured: false,
    reviews: [
      {
        id: '7',
        author: 'Diana Torres',
        rating: 4,
        comment: 'Hermoso lugar para caminar y respirar aire puro.',
        date: '2024-01-28'
      }
    ]
  },
  // Farmacias
  {
    id: '7',
    name: 'Droguería San Rafael',
    category: 'Farmacia',
    address: 'Calle 46 #21-45, Barrio Compartir',
    neighborhood: 'Compartir',
    phone: '+57 2 555 5789',
    description: 'Farmacia con servicio 24 horas. Medicamentos genéricos y de marca, productos de cuidado personal y atención personalizada.',
    images: [
      'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&q=80',
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80',
      'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80'
    ],
    latitude: 3.3955,
    longitude: -76.5200,
    rating: 4.4,
    priceRange: '$$',
    featured: false,
    reviews: [
      {
        id: '8',
        author: 'Roberto Mendoza',
        rating: 5,
        comment: 'Excelente atención y siempre tienen los medicamentos que necesito.',
        date: '2024-01-30'
      }
    ]
  },
  {
    id: '8',
    name: 'Farmacia Salud Total',
    category: 'Farmacia',
    address: 'Carrera 29 #82-35, Barrio Vallegrande',
    neighborhood: 'Vallegrande',
    phone: '+57 2 555 5890',
    description: 'Cadena de farmacias con precios competitivos. Servicio de domicilios sin costo adicional.',
    images: [
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80',
      'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&q=80',
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80'
    ],
    latitude: 3.4368,
    longitude: -76.5220,
    rating: 4.1,
    priceRange: '$',
    featured: false,
    reviews: []
  },
  // Bancos
  {
    id: '9',
    name: 'Banco Popular Decepaz',
    category: 'Banco',
    address: 'Calle 51 #24-18, Barrio Decepaz',
    neighborhood: 'Decepaz',
    phone: '+57 2 555 6901',
    description: 'Sucursal bancaria con cajeros automáticos, corresponsal bancario y atención personalizada. Horario: Lunes a Viernes 8:00 AM - 4:30 PM.',
    images: [
      'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&q=80',
      'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&q=80',
      'https://images.unsplash.com/photo-1554224311-beee2f986c00?w=800&q=80'
    ],
    latitude: 3.4110,
    longitude: -76.5180,
    rating: 3.9,
    priceRange: 'N/A',
    featured: false,
    reviews: [
      {
        id: '9',
        author: 'Sandra Gómez',
        rating: 4,
        comment: 'Buen servicio aunque a veces hay que esperar un poco.',
        date: '2024-02-01'
      }
    ]
  },
  {
    id: '10',
    name: 'Bancolombia Compartir',
    category: 'Banco',
    address: 'Carrera 26 #44-25, Barrio Compartir',
    neighborhood: 'Compartir',
    phone: '+57 2 555 7012',
    description: 'Oficina bancaria completa con zona de cajeros 24/7, asesoría financiera y seguros.',
    images: [
      'https://images.unsplash.com/photo-1565372195458-9de0b320ef04?w=800&q=80',
      'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=800&q=80',
      'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&q=80'
    ],
    latitude: 3.3945,
    longitude: -76.5195,
    rating: 4.0,
    priceRange: 'N/A',
    featured: false,
    reviews: []
  },
  // Centros Comerciales
  {
    id: '11',
    name: 'Centro Comercial Plaza Vallegrande',
    category: 'Centro Comercial',
    address: 'Carrera 31 #83-50, Barrio Vallegrande',
    neighborhood: 'Vallegrande',
    phone: '+57 2 555 8123',
    description: 'Moderno centro comercial con tiendas de ropa, tecnología, supermercado, cines y patio de comidas. Parqueadero gratis las primeras 2 horas.',
    images: [
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
      'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800&q=80',
      'https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=800&q=80'
    ],
    latitude: 3.4375,
    longitude: -76.5228,
    rating: 4.4,
    priceRange: '$$',
    featured: true,
    reviews: [
      {
        id: '10',
        author: 'Camilo Vargas',
        rating: 5,
        comment: 'Muy completo y con buenas opciones de entretenimiento.',
        date: '2024-02-03'
      }
    ]
  },
  {
    id: '12',
    name: 'Mercado Local Decepaz',
    category: 'Centro Comercial',
    address: 'Calle 49 #23-40, Barrio Decepaz',
    neighborhood: 'Decepaz',
    phone: '+57 2 555 8234',
    description: 'Centro comercial de barrio con supermercado, ferreterías, almacenes de ropa y servicios varios.',
    images: [
      'https://images.unsplash.com/photo-1582655299221-2d3e3c0c3d3c?w=800&q=80',
      'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&q=80',
      'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=800&q=80'
    ],
    latitude: 3.4100,
    longitude: -76.5178,
    rating: 3.8,
    priceRange: '$',
    featured: false,
    reviews: []
  },
  // Hospitales
  {
    id: '13',
    name: 'Centro Médico Compartir',
    category: 'Hospital',
    address: 'Calle 47 #22-10, Barrio Compartir',
    neighborhood: 'Compartir',
    phone: '+57 2 555 9345',
    description: 'Centro de salud con medicina general, odontología, laboratorio clínico y farmacia. Atiende EPS y particulares.',
    images: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80',
      'https://images.unsplash.com/photo-1516841273335-e39b37888115?w=800&q=80'
    ],
    latitude: 3.3958,
    longitude: -76.5192,
    rating: 4.2,
    priceRange: '$$',
    featured: false,
    reviews: [
      {
        id: '11',
        author: 'Patricia Ruiz',
        rating: 4,
        comment: 'Buena atención médica y los tiempos de espera son razonables.',
        date: '2024-02-05'
      }
    ]
  },
  {
    id: '14',
    name: 'Clínica Vallegrande',
    category: 'Hospital',
    address: 'Carrera 32 #81-25, Barrio Vallegrande',
    neighborhood: 'Vallegrande',
    phone: '+57 2 555 9456',
    description: 'Clínica de mediana complejidad con urgencias 24 horas, hospitalización, cirugía y especialistas.',
    images: [
      'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
      'https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?w=800&q=80'
    ],
    latitude: 3.4370,
    longitude: -76.5232,
    rating: 4.5,
    priceRange: '$$$',
    featured: false,
    reviews: []
  },
  // Hoteles
  {
    id: '15',
    name: 'Hotel Colonial Decepaz',
    category: 'Hotel',
    address: 'Calle 52 #25-15, Barrio Decepaz',
    neighborhood: 'Decepaz',
    phone: '+57 2 555 0567',
    description: 'Hotel familiar con habitaciones cómodas, Wi-Fi gratis, desayuno incluido y parqueadero privado.',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80'
    ],
    latitude: 3.4108,
    longitude: -76.5182,
    rating: 4.1,
    priceRange: '$$',
    featured: false,
    reviews: [
      {
        id: '12',
        author: 'Miguel Ángel Castro',
        rating: 4,
        comment: 'Buen hotel, limpio y con buena ubicación.',
        date: '2024-02-07'
      }
    ]
  },
  {
    id: '16',
    name: 'Hotel Ejecutivo Compartir',
    category: 'Hotel',
    address: 'Carrera 27 #46-30, Barrio Compartir',
    neighborhood: 'Compartir',
    phone: '+57 2 555 0678',
    description: 'Hotel boutique con habitaciones ejecutivas, sala de reuniones, restaurante y servicio de lavandería.',
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80'
    ],
    latitude: 3.3950,
    longitude: -76.5198,
    rating: 4.6,
    priceRange: '$$$',
    featured: true,
    reviews: []
  },
  // Entretenimiento
  {
    id: '17',
    name: 'Cine Teatro Vallegrande',
    category: 'Entretenimiento',
    address: 'Carrera 30 #84-20, Barrio Vallegrande',
    neighborhood: 'Vallegrande',
    phone: '+57 2 555 1789',
    description: 'Complejo de cine con 5 salas, sonido Dolby Atmos, confitería y estrenos cada semana.',
    images: [
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
      'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&q=80',
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80'
    ],
    latitude: 3.4378,
    longitude: -76.5225,
    rating: 4.7,
    priceRange: '$$',
    featured: true,
    reviews: [
      {
        id: '13',
        author: 'Juliana Pérez',
        rating: 5,
        comment: 'Excelentes instalaciones y muy cómodo. Las palomitas son deliciosas.',
        date: '2024-02-09'
      }
    ]
  },
  {
    id: '18',
    name: 'Zona de Juegos GameZone',
    category: 'Entretenimiento',
    address: 'Calle 48 #23-50, Barrio Decepaz',
    neighborhood: 'Decepaz',
    phone: '+57 2 555 1890',
    description: 'Centro de entretenimiento con videojuegos, billar, futbolín y simuladores de realidad virtual.',
    images: [
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&q=80',
      'https://images.unsplash.com/photo-1556369376-92e5d19e95c6?w=800&q=80',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80'
    ],
    latitude: 3.4102,
    longitude: -76.5177,
    rating: 4.3,
    priceRange: '$',
    featured: false,
    reviews: []
  },
  // Servicios
  {
    id: '19',
    name: 'Taller Mecánico El Experto',
    category: 'Servicios',
    address: 'Carrera 28 #47-10, Barrio Compartir',
    neighborhood: 'Compartir',
    phone: '+57 2 555 2901',
    description: 'Taller mecánico especializado en mantenimiento preventivo y correctivo. Diagnóstico computarizado, cambio de aceite y frenos.',
    images: [
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80',
      'https://images.unsplash.com/photo-1632823469850-1b70e43d5d4f?w=800&q=80'
    ],
    latitude: 3.3953,
    longitude: -76.5193,
    rating: 4.4,
    priceRange: '$$',
    featured: false,
    reviews: [
      {
        id: '14',
        author: 'Fernando López',
        rating: 5,
        comment: 'Muy profesionales y honestos con sus diagnósticos.',
        date: '2024-02-11'
      }
    ]
  },
  {
    id: '20',
    name: 'Peluquería & Spa Bella Vista',
    category: 'Servicios',
    address: 'Calle 82 #31-40, Barrio Vallegrande',
    neighborhood: 'Vallegrande',
    phone: '+57 2 555 3012',
    description: 'Salón de belleza con servicios de peluquería, manicure, pedicure, tratamientos faciales y masajes relajantes.',
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80',
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80'
    ],
    latitude: 3.4365,
    longitude: -76.5227,
    rating: 4.8,
    priceRange: '$$',
    featured: false,
    reviews: [
      {
        id: '15',
        author: 'Carolina Morales',
        rating: 5,
        comment: 'Increíble servicio y las estilistas son muy profesionales.',
        date: '2024-02-13'
      }
    ]
  },
  // Inmobiliarias - Propiedades en Arriendo/Venta
  {
    id: '21',
    name: 'Casa en Venta - Compartir',
    category: 'Inmobiliaria',
    address: 'Calle 46 #23-45, Barrio Compartir',
    neighborhood: 'Compartir',
    phone: '+57 320 555 1234',
    description: 'Hermosa casa de 3 pisos, 4 habitaciones, 3 baños, garaje para 2 vehículos, patio amplio. 180m² construidos, 200m² terreno. Lista para habitar. Valor: $450.000.000',
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'
    ],
    latitude: 3.3963,
    longitude: -76.5188,
    rating: 4.8,
    priceRange: '$450M',
    featured: true,
    reviews: [
      {
        id: '16',
        author: 'Agencia Inmobiliaria ProCasa',
        rating: 5,
        comment: 'Excelente propiedad, muy bien ubicada y en perfecto estado.',
        date: '2024-02-15'
      }
    ]
  },
  {
    id: '22',
    name: 'Apartamento en Arriendo - Vallegrande',
    category: 'Inmobiliaria',
    address: 'Carrera 33 #84-12, Barrio Vallegrande',
    neighborhood: 'Vallegrande',
    phone: '+57 315 555 2345',
    description: 'Apartamento moderno, 3 habitaciones, 2 baños, sala-comedor, cocina integral, balcón. 85m². Conjunto cerrado con piscina, gimnasio y zona infantil. Arriendo: $1.800.000/mes + administración.',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'
    ],
    latitude: 3.4383,
    longitude: -76.5218,
    rating: 4.6,
    priceRange: '$1.8M/mes',
    featured: true,
    reviews: []
  },
  {
    id: '23',
    name: 'Casa en Arriendo - Decepaz',
    category: 'Inmobiliaria',
    address: 'Calle 53 #26-18, Barrio Decepaz',
    neighborhood: 'Decepaz',
    phone: '+57 318 555 3456',
    description: 'Casa familiar de 2 pisos, 3 habitaciones, 2 baños, sala-comedor, patio trasero. 120m² construidos. Cerca a colegios y transporte público. Arriendo: $1.300.000/mes.',
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
      'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'
    ],
    latitude: 3.4112,
    longitude: -76.5172,
    rating: 4.3,
    priceRange: '$1.3M/mes',
    featured: false,
    reviews: [
      {
        id: '17',
        author: 'María Torres',
        rating: 4,
        comment: 'Buena casa, espaciosa y bien ubicada.',
        date: '2024-02-18'
      }
    ]
  },
  {
    id: '24',
    name: 'Apartaestudio en Arriendo - Compartir',
    category: 'Inmobiliaria',
    address: 'Carrera 29 #48-22, Barrio Compartir',
    neighborhood: 'Compartir',
    phone: '+57 312 555 4567',
    description: 'Apartaestudio amoblado, 1 habitación, baño, cocineta. 35m². Ideal para persona sola o pareja. Servicios incluidos. Arriendo: $900.000/mes.',
    images: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80'
    ],
    latitude: 3.3948,
    longitude: -76.5202,
    rating: 4.2,
    priceRange: '$900K/mes',
    featured: false,
    reviews: []
  },
  {
    id: '25',
    name: 'Local Comercial en Venta - Vallegrande',
    category: 'Inmobiliaria',
    address: 'Calle 86 #30-15, Barrio Vallegrande',
    neighborhood: 'Vallegrande',
    phone: '+57 316 555 5678',
    description: 'Local comercial sobre vía principal, 60m². Perfecto para negocio, oficina o consultorio. Baño, vitrina amplia. Valor: $180.000.000',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
      'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80'
    ],
    latitude: 3.4388,
    longitude: -76.5222,
    rating: 4.5,
    priceRange: '$180M',
    featured: false,
    reviews: []
  },
  {
    id: '26',
    name: 'Casa Campestre en Venta - Decepaz',
    category: 'Inmobiliaria',
    address: 'Vereda Rural, Sector Decepaz',
    neighborhood: 'Decepaz',
    phone: '+57 313 555 6789',
    description: 'Casa campestre en lote de 1.000m². Casa de 150m² con 4 habitaciones, 3 baños, sala, comedor, cocina, kiosko, piscina, zona BBQ. Perfecta para descanso. Valor: $550.000.000',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
      'https://images.unsplash.com/photo-1566908829550-e6551b00979b?w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'
    ],
    latitude: 3.4098,
    longitude: -76.5165,
    rating: 4.9,
    priceRange: '$550M',
    featured: true,
    reviews: [
      {
        id: '18',
        author: 'Inversiones del Valle',
        rating: 5,
        comment: 'Propiedad excepcional, ideal para familias que buscan tranquilidad.',
        date: '2024-02-20'
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
  'Servicios',
  'Inmobiliaria'
];

export const neighborhoods: string[] = [
  'Todos',
  'Compartir',
  'Vallegrande',
  'Decepaz',
  'Ciudad Jardín',
  'San Fernando',
  'Granada',
  'El Peñón',
  'Versalles',
  'Juanambú'
];
