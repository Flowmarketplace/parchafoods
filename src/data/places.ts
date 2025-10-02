import { Place } from '@/types/place';

export const mockPlaces: Place[] = [
  {
    id: '1',
    name: 'Restaurante El Sabor del Barrio',
    category: 'Restaurante',
    address: 'Calle 45 #20-15, Barrio Compartir',
    neighborhood: 'Compartir',
    zone: 'Oriente',
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
    foodType: ['Colombiana'],
    familyFriendly: true,
    petFriendly: false,
    goodForCouples: true,
    goodForKids: true,
    attributes: ['WiFi', 'Estacionamiento', 'Terraza'],
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
    hasPromotions: true,
    promotions: [
      {
        id: 'p0-1',
        title: '🎉 ¡Bienvenida! Primera visita con la app',
        description: '¡Recibe un postre GRATIS por ser tu primera vez usando nuestra app!',
        image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80',
        conditions: 'Válido solo en tu primera visita\nEscanea el código QR en el restaurante\nNo aplica con otras promociones',
        validUntil: '2025-12-31',
        qrRequired: true,
        firstTimeOnly: true
      },
      {
        id: 'p1',
        title: '2x1 en Bandeja Paisa los Miércoles',
        description: 'Disfruta de nuestra deliciosa Bandeja Paisa y lleva la segunda a mitad de precio',
        image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=800&q=80',
        conditions: 'Válido solo los miércoles de 12:00 PM a 3:00 PM\nNo aplica con otras promociones\nEscanea el código QR en el restaurante para reclamar',
        validUntil: '2025-12-31',
        qrRequired: true
      },
      {
        id: 'p2',
        title: 'Menú Ejecutivo - Almuerzo Completo',
        description: 'Sopa + Plato Principal + Jugo + Postre por un precio especial',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
        conditions: 'Disponible de lunes a viernes de 12:00 PM a 2:00 PM\nPrecio especial: $22.000\nEscanea el código QR en el restaurante para reclamar',
        validUntil: '2025-12-31',
        qrRequired: true
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
    zone: 'Norte',
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
    familyFriendly: true,
    petFriendly: true,
    goodForKids: true,
    goodForCouples: false,
    attributes: ['Juegos Infantiles', 'Canchas Deportivas', 'Zona Verde'],
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
    zone: 'Sur',
    phone: '+57 2 555 2345',
    description: 'Especialistas en carnes a la parrilla y platos típicos del Valle del Cauca. Ambiente familiar y acogedor.',
    images: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
      'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80',
      'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80'
    ],
    latitude: 3.4105,
    longitude: -76.5175,
    rating: 4.6,
    priceRange: '$$',
    featured: false,
    hasMenu: true,
    foodType: ['Colombiana', 'Parrilla'],
    familyFriendly: true,
    petFriendly: false,
    goodForCouples: true,
    goodForKids: true,
    attributes: ['Estacionamiento', 'Terraza', 'Aire Acondicionado'],
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
    hasPromotions: true,
    promotions: [
      {
        id: 'p0-3',
        title: '🎉 ¡Bienvenida! Primera visita con la app',
        description: '¡Recibe una entrada GRATIS por ser tu primera vez usando nuestra app!',
        image: 'https://images.unsplash.com/photo-1633436375094-77d8e5f0d2b2?w=800&q=80',
        conditions: 'Válido solo en tu primera visita\nEscanea el código QR en el restaurante\nNo aplica con otras promociones',
        validUntil: '2025-12-31',
        qrRequired: true,
        firstTimeOnly: true
      },
      {
        id: 'p3-1',
        title: 'Happy Hour - 2x1 en Bebidas',
        description: 'Lleva dos bebidas al precio de una en nuestro happy hour',
        image: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=800&q=80',
        conditions: 'Válido de lunes a viernes de 5:00 PM a 7:00 PM\nEscanea el código QR para reclamar',
        validUntil: '2025-12-31',
        qrRequired: true
      },
      {
        id: 'p3-2',
        title: 'Parrillada Familiar Especial',
        description: 'Parrillada para 4 personas con descuento del 20%',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
        conditions: 'Válido fines de semana\nReserva con anticipación\nEscanea el código QR para reclamar',
        validUntil: '2025-12-31',
        qrRequired: true
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
    zone: 'Oriente',
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
    foodType: ['Café', 'Repostería'],
    familyFriendly: true,
    petFriendly: true,
    goodForCouples: true,
    goodForKids: false,
    attributes: ['WiFi', 'Aire Acondicionado', 'Música en Vivo'],
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
    hasPromotions: true,
    promotions: [
      {
        id: 'p0-4',
        title: '🎉 ¡Bienvenida! Primera visita con la app',
        description: '¡Recibe un pastelito GRATIS por ser tu primera vez usando nuestra app!',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784422?w=800&q=80',
        conditions: 'Válido solo en tu primera visita\nEscanea el código QR en la cafetería\nNo aplica con otras promociones',
        validUntil: '2025-12-31',
        qrRequired: true,
        firstTimeOnly: true
      },
      {
        id: 'p4-1',
        title: 'Desayuno Completo + Café',
        description: 'Croissant + Café americano por precio especial',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
        conditions: 'Disponible hasta las 11:00 AM\nPrecio especial: $8.000\nEscanea el código QR para reclamar',
        validUntil: '2025-12-31',
        qrRequired: true
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
    hasProducts: true,
    products: [
      {
        id: 'p4',
        name: 'Acetaminofén 500mg',
        description: 'Caja x 10 tabletas - Analgésico y antipirético',
        price: '$3.500',
        category: 'Medicamentos'
      },
      {
        id: 'p5',
        name: 'Alcohol Antiséptico',
        description: 'Frasco de 250ml al 70%',
        price: '$8.000',
        category: 'Cuidado Personal'
      },
      {
        id: 'p6',
        name: 'Vitamina C 1000mg',
        description: 'Frasco x 30 cápsulas',
        price: '$25.000',
        category: 'Suplementos'
      }
    ],
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
    hasProducts: true,
    products: [
      {
        id: 'p7',
        name: 'Ibuprofeno 400mg',
        description: 'Caja x 20 tabletas - Antiinflamatorio',
        price: '$6.000',
        category: 'Medicamentos'
      },
      {
        id: 'p8',
        name: 'Crema Dental',
        description: 'Tubo de 150ml con flúor',
        price: '$9.500',
        category: 'Cuidado Personal'
      },
      {
        id: 'p9',
        name: 'Termómetro Digital',
        description: 'Lectura rápida en 60 segundos',
        price: '$18.000',
        category: 'Equipos Médicos'
      }
    ],
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
    hasPromotions: true,
    promotions: [
      {
        id: 'p0-11',
        title: '🎉 ¡Bienvenida! Primera visita con la app',
        description: '¡Recibe un cupón de $20.000 en compras por ser tu primera vez usando nuestra app!',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
        conditions: 'Válido solo en tu primera visita\nEscanea el código QR en el centro comercial\nMínimo de compra: $100.000',
        validUntil: '2025-12-31',
        qrRequired: true,
        firstTimeOnly: true
      },
      {
        id: 'p11-1',
        title: 'Black Friday - Descuentos hasta 70%',
        description: 'Aprovecha descuentos increíbles en todas las tiendas del centro comercial',
        image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&q=80',
        conditions: 'Válido del 23 al 27 de noviembre\nEscanea el código QR para acceso anticipado',
        validUntil: '2025-11-27',
        qrRequired: true
      }
    ],
    featuredProducts: [
      {
        id: 'fp11-1',
        name: 'Smart TV 55" 4K',
        description: 'Televisor inteligente Samsung con tecnología QLED',
        price: '$2.499.000',
        category: 'Tecnología',
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80'
      },
      {
        id: 'fp11-2',
        name: 'Zapatos Deportivos Nike',
        description: 'Tenis para running con tecnología Air Max',
        price: '$389.900',
        category: 'Ropa y Calzado',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'
      },
      {
        id: 'fp11-3',
        name: 'Perfume Importado',
        description: 'Fragancia exclusiva para mujer 100ml',
        price: '$259.000',
        category: 'Perfumería',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80'
      },
      {
        id: 'fp11-4',
        name: 'Audífonos Bluetooth Sony',
        description: 'Audífonos inalámbricos con cancelación de ruido',
        price: '$599.000',
        category: 'Tecnología',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'
      },
      {
        id: 'fp11-5',
        name: 'Reloj Inteligente',
        description: 'Smartwatch con monitor de salud y fitness',
        price: '$899.000',
        category: 'Tecnología',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'
      }
    ],
    catalogUrl: 'https://www.plazavallegrande.com/catalogo',
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
      'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80',
      'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=800&q=80',
      'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800&q=80'
    ],
    latitude: 3.4100,
    longitude: -76.5178,
    rating: 3.8,
    priceRange: '$',
    featured: false,
    hasProducts: true,
    products: [
      {
        id: 'p1',
        name: 'Kit de Herramientas Básicas',
        description: 'Set completo con martillo, destornilladores, alicates y llave inglesa',
        price: '$85.000',
        category: 'Ferretería'
      },
      {
        id: 'p2',
        name: 'Camiseta Deportiva',
        description: 'Tela transpirable, varios colores disponibles',
        price: '$35.000',
        category: 'Ropa'
      },
      {
        id: 'p3',
        name: 'Aceite de Cocina (1L)',
        description: 'Aceite vegetal premium',
        price: '$12.000',
        category: 'Supermercado'
      }
    ],
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
    hasServices: true,
    services: [
      {
        id: 'h1',
        name: 'Habitación Sencilla',
        description: 'Cama doble, baño privado, TV, Wi-Fi, desayuno incluido',
        price: '$120.000/noche'
      },
      {
        id: 'h2',
        name: 'Habitación Doble',
        description: 'Dos camas, baño privado, TV, Wi-Fi, desayuno incluido',
        price: '$150.000/noche'
      },
      {
        id: 'h3',
        name: 'Suite Ejecutiva',
        description: 'Cama king, sala de estar, baño con jacuzzi, desayuno y cena incluidos',
        price: '$250.000/noche'
      }
    ],
    airbnbUrl: 'https://www.airbnb.com',
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
    hasServices: true,
    services: [
      {
        id: 'h4',
        name: 'Habitación Ejecutiva',
        description: 'Cama queen, escritorio de trabajo, Wi-Fi de alta velocidad, desayuno buffet',
        price: '$180.000/noche'
      },
      {
        id: 'h5',
        name: 'Suite Junior',
        description: 'Cama king, sala de estar, minibar, desayuno y acceso al lounge ejecutivo',
        price: '$280.000/noche'
      },
      {
        id: 'h6',
        name: 'Alquiler de Sala de Reuniones',
        description: 'Sala con capacidad para 12 personas, proyector, Wi-Fi, servicio de café',
        price: '$100.000/hora',
        duration: 'Por hora'
      }
    ],
    airbnbUrl: 'https://www.airbnb.com',
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
    hasServices: true,
    services: [
      {
        id: 's1',
        name: 'Cambio de Aceite',
        description: 'Cambio de aceite y filtro, incluye revisión de niveles',
        price: '$80.000',
        duration: '30 min'
      },
      {
        id: 's2',
        name: 'Diagnóstico Computarizado',
        description: 'Escaneo completo del sistema electrónico del vehículo',
        price: '$50.000',
        duration: '45 min'
      },
      {
        id: 's3',
        name: 'Cambio de Frenos',
        description: 'Cambio de pastillas y discos de freno',
        price: '$250.000',
        duration: '2 horas'
      }
    ],
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
  // Ciudad Jardín
  {
    id: '21',
    name: 'Pizzería Napolitana',
    category: 'Restaurante',
    address: 'Calle 18 #100-45, Barrio Ciudad Jardín',
    neighborhood: 'Ciudad Jardín',
    phone: '+57 2 555 4123',
    description: 'Auténtica pizza napolitana con ingredientes importados. Horno de leña tradicional y ambiente italiano.',
    images: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
      'https://images.unsplash.com/photo-1571407970349-bc81e7e96c47?w=800&q=80'
    ],
    latitude: 3.3783,
    longitude: -76.5317,
    rating: 4.8,
    priceRange: '$$',
    featured: true,
    hasMenu: true,
    menu: [
      {
        id: 'm13',
        name: 'Pizza Margherita',
        description: 'Tomate San Marzano, mozzarella di bufala, albahaca fresca',
        price: '$32.000',
        category: 'Pizzas'
      },
      {
        id: 'm14',
        name: 'Pizza Quattro Formaggi',
        description: 'Mozzarella, gorgonzola, parmesano y provolone',
        price: '$35.000',
        category: 'Pizzas'
      }
    ],
    reviews: []
  },
  {
    id: '22',
    name: 'Gimnasio FitZone',
    category: 'Servicios',
    address: 'Carrera 102 #19-30, Barrio Ciudad Jardín',
    neighborhood: 'Ciudad Jardín',
    phone: '+57 2 555 4234',
    description: 'Gimnasio completo con equipos de última generación, clases grupales, entrenadores personales y zona de crossfit.',
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
      'https://images.unsplash.com/photo-1623874514711-0f321325f318?w=800&q=80'
    ],
    latitude: 3.3790,
    longitude: -76.5320,
    rating: 4.6,
    priceRange: '$$',
    featured: true,
    reviews: []
  },
  // San Fernando
  {
    id: '23',
    name: 'Cafetería Artesanal Origen',
    category: 'Café',
    address: 'Calle 5 #38-20, Barrio San Fernando',
    neighborhood: 'San Fernando',
    phone: '+57 2 555 5345',
    description: 'Café de especialidad con métodos de extracción manuales. Barista certificado y granos de origen único.',
    images: [
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
      'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80',
      'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80'
    ],
    latitude: 3.4210,
    longitude: -76.5380,
    rating: 4.9,
    priceRange: '$$',
    featured: true,
    hasMenu: true,
    menu: [
      {
        id: 'm15',
        name: 'V60 Pour Over',
        description: 'Café de origen único con método manual',
        price: '$8.000',
        category: 'Métodos de Extracción'
      },
      {
        id: 'm16',
        name: 'Cold Brew',
        description: 'Café en frío extraído por 16 horas',
        price: '$9.000',
        category: 'Bebidas Frías'
      }
    ],
    reviews: []
  },
  {
    id: '24',
    name: 'Panadería La Espiga Dorada',
    category: 'Restaurante',
    address: 'Carrera 39 #6-15, Barrio San Fernando',
    neighborhood: 'San Fernando',
    phone: '+57 2 555 5456',
    description: 'Panadería tradicional con pan recién horneado todos los días. Especialidad en pan francés y pastelería.',
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80',
      'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&q=80'
    ],
    latitude: 3.4215,
    longitude: -76.5375,
    rating: 4.7,
    priceRange: '$',
    featured: true,
    reviews: []
  },
  // Granada
  {
    id: '25',
    name: 'Restaurante Vegetariano Raíces',
    category: 'Restaurante',
    address: 'Calle 8 #50-25, Barrio Granada',
    neighborhood: 'Granada',
    phone: '+57 2 555 6567',
    description: 'Cocina vegetariana y vegana con ingredientes orgánicos locales. Opciones sin gluten disponibles.',
    images: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
      'https://images.unsplash.com/photo-1540914124281-342587941389?w=800&q=80'
    ],
    latitude: 3.4320,
    longitude: -76.5410,
    rating: 4.6,
    priceRange: '$$',
    featured: true,
    hasMenu: true,
    menu: [
      {
        id: 'm17',
        name: 'Bowl Buddha',
        description: 'Quinoa, vegetales asados, hummus y tahini',
        price: '$22.000',
        category: 'Platos Principales'
      },
      {
        id: 'm18',
        name: 'Hamburguesa Vegana',
        description: 'Hamburguesa de lentejas con aguacate y chips',
        price: '$19.000',
        category: 'Platos Principales'
      }
    ],
    reviews: []
  },
  {
    id: '26',
    name: 'Librería Café Páginas',
    category: 'Café',
    address: 'Carrera 51 #9-40, Barrio Granada',
    neighborhood: 'Granada',
    phone: '+57 2 555 6678',
    description: 'Librería independiente con cafetería. Eventos literarios, clubes de lectura y música en vivo los fines de semana.',
    images: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80',
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80'
    ],
    latitude: 3.4325,
    longitude: -76.5405,
    rating: 4.8,
    priceRange: '$$',
    featured: false,
    reviews: []
  },
  // El Peñón
  {
    id: '27',
    name: 'Mercado Campesino El Peñón',
    category: 'Centro Comercial',
    address: 'Calle 70 #8A-50, Barrio El Peñón',
    neighborhood: 'El Peñón',
    phone: '+57 2 555 7789',
    description: 'Mercado local con productos frescos del campo. Frutas, verduras, lácteos y carnes de productores locales.',
    images: [
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
      'https://images.unsplash.com/photo-1506617564039-2f3b650b7010?w=800&q=80'
    ],
    latitude: 3.4520,
    longitude: -76.5280,
    rating: 4.3,
    priceRange: '$',
    featured: false,
    reviews: []
  },
  {
    id: '28',
    name: 'Clínica Dental Sonrisa Perfecta',
    category: 'Hospital',
    address: 'Carrera 9 #71-15, Barrio El Peñón',
    neighborhood: 'El Peñón',
    phone: '+57 2 555 7890',
    description: 'Clínica odontológica especializada en tratamientos estéticos y ortodoncia. Tecnología de punta.',
    images: [
      'https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=800&q=80',
      'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80',
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80'
    ],
    latitude: 3.4525,
    longitude: -76.5275,
    rating: 4.5,
    priceRange: '$$',
    featured: false,
    reviews: []
  },
  // Versalles
  {
    id: '29',
    name: 'Sushi Bar Tokio',
    category: 'Restaurante',
    address: 'Calle 23N #5N-63, Barrio Versalles',
    neighborhood: 'Versalles',
    phone: '+57 2 555 8901',
    description: 'Restaurante japonés con sushi fresco y cocina nikkei. Chef con experiencia internacional.',
    images: [
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80',
      'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800&q=80',
      'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&q=80'
    ],
    latitude: 3.4580,
    longitude: -76.5360,
    rating: 4.7,
    priceRange: '$$$',
    featured: true,
    hasMenu: true,
    menu: [
      {
        id: 'm19',
        name: 'Sushi Roll California',
        description: 'Cangrejo, aguacate, pepino y sésamo',
        price: '$28.000',
        category: 'Rolls'
      },
      {
        id: 'm20',
        name: 'Sashimi Variado',
        description: 'Selección de pescado fresco del día',
        price: '$42.000',
        category: 'Sashimi'
      }
    ],
    hasPromotions: true,
    promotions: [
      {
        id: 'p0-29',
        title: '🎉 ¡Bienvenida! Primera visita con la app',
        description: '¡Recibe un roll especial GRATIS por ser tu primera vez usando nuestra app!',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80',
        conditions: 'Válido solo en tu primera visita\nEscanea el código QR en el restaurante\nNo aplica con otras promociones',
        validUntil: '2025-12-31',
        qrRequired: true,
        firstTimeOnly: true
      },
      {
        id: 'p29-1',
        title: 'Combo Sushi para 2 Personas',
        description: '20 piezas de sushi variado + 2 bebidas por precio especial',
        image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800&q=80',
        conditions: 'Válido de domingo a jueves\nPrecio especial: $65.000\nEscanea el código QR para reclamar',
        validUntil: '2025-12-31',
        qrRequired: true
      },
      {
        id: 'p29-2',
        title: 'Happy Hour Sake & Rolls',
        description: '25% de descuento en rolls seleccionados y sake',
        image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&q=80',
        conditions: 'Válido de lunes a viernes de 3:00 PM a 6:00 PM\nEscanea el código QR para reclamar',
        validUntil: '2025-12-31',
        qrRequired: true
      }
    ],
    reviews: []
  },
  {
    id: '30',
    name: 'Parque de los Poetas',
    category: 'Parque',
    address: 'Avenida 4N con Calle 24N, Barrio Versalles',
    neighborhood: 'Versalles',
    phone: '+57 2 555 9012',
    description: 'Hermoso parque urbano con esculturas, zonas verdes y senderos para caminar. Perfecto para ejercicio matutino.',
    images: [
      'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&q=80',
      'https://images.unsplash.com/photo-1572198166687-ea769c66c1aa?w=800&q=80',
      'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=800&q=80'
    ],
    latitude: 3.4585,
    longitude: -76.5365,
    rating: 4.4,
    priceRange: 'Gratis',
    featured: false,
    reviews: []
  },
  {
    id: '31',
    name: 'Smart Fit Granada',
    category: 'Gym',
    address: 'Carrera 36 #5A-100, Centro Comercial Unicentro',
    neighborhood: 'Granada',
    phone: '+57 2 555 4500',
    description: 'Moderno gimnasio con equipos de última generación. Clases grupales de spinning, yoga, funcional y zumba. Horario: Lunes a Viernes 5:00 AM - 11:00 PM, Sábados y Domingos 7:00 AM - 9:00 PM. Área de pesas libres, máquinas cardiovasculares y zona de estiramiento.',
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80'
    ],
    latitude: 3.4236,
    longitude: -76.5295,
    rating: 4.6,
    priceRange: '$$',
    featured: true,
    attributes: ['WiFi', 'Estacionamiento', 'Casilleros', 'Duchas'],
    hasPromotions: true,
    promotions: [
      {
        id: 'gym-p1',
        title: '🎉 ¡Bienvenido! Primera clase gratis',
        description: 'Prueba cualquier clase grupal GRATIS en tu primera visita con la app',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
        conditions: 'Válido solo en tu primera visita\nEscanea el código QR en recepción\nAplica para cualquier clase grupal',
        validUntil: '2025-12-31',
        qrRequired: true,
        firstTimeOnly: true
      },
      {
        id: 'gym-p2',
        title: 'Membresía Semestral - 20% OFF',
        description: 'Adquiere tu membresía de 6 meses con descuento especial',
        image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80',
        conditions: 'Precio especial: $450.000 (antes $540.000)\nIncluye todas las clases grupales\nAcceso 7 días a la semana\nEscanea el código QR para reclamar',
        validUntil: '2025-12-31',
        qrRequired: true
      },
      {
        id: 'gym-p3',
        title: 'Pack Nutrición + Gym',
        description: 'Membresía mensual + plan nutricional personalizado',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
        conditions: 'Precio combo: $180.000/mes\nIncluye valoración nutricional\nPlan de alimentación personalizado\nEscanea el código QR en recepción',
        validUntil: '2025-12-31',
        qrRequired: true
      },
      {
        id: 'gym-p4',
        title: 'Proteína y Suplementos - 15% OFF',
        description: 'Descuento en nuestra línea de productos de nutrición deportiva',
        image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80',
        conditions: 'Aplica en proteínas, creatina, pre-entrenos y más\nSolo para miembros activos\nEscanea el código QR en la tienda del gym',
        validUntil: '2025-12-31',
        qrRequired: true
      }
    ],
    hasGymClasses: true,
    gymClasses: [
      {
        id: 'gc1',
        name: 'Zumba',
        description: 'Baila y quema calorías con ritmos latinos. Clase energética y divertida para todos los niveles.',
        instructor: 'Carolina Rodríguez',
        schedule: 'Lunes, Miércoles y Viernes 6:00 PM',
        duration: '60 min',
        level: 'Todos los niveles',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80'
      },
      {
        id: 'gc2',
        name: 'Spinning',
        description: 'Cardio intenso sobre bicicleta estática. Fortalece piernas y mejora resistencia cardiovascular.',
        instructor: 'Miguel Ángel Torres',
        schedule: 'Martes y Jueves 7:00 AM, Sábados 9:00 AM',
        duration: '45 min',
        level: 'Intermedio - Avanzado',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'
      },
      {
        id: 'gc3',
        name: 'Yoga',
        description: 'Conecta cuerpo y mente. Mejora flexibilidad, fuerza y reduce el estrés.',
        instructor: 'Andrea Gómez',
        schedule: 'Lunes, Miércoles y Viernes 8:00 AM',
        duration: '60 min',
        level: 'Todos los niveles',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80'
      },
      {
        id: 'gc4',
        name: 'Entrenamiento Funcional',
        description: 'Ejercicios con peso corporal y equipamiento variado. Mejora fuerza, agilidad y coordinación.',
        instructor: 'Andrés Martínez',
        schedule: 'Martes y Jueves 6:30 PM',
        duration: '50 min',
        level: 'Intermedio',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80'
      },
      {
        id: 'gc5',
        name: 'Aeróbicos',
        description: 'Clase clásica de cardio con pasos coreografiados. Perfecta para quemar grasa y tonificar.',
        instructor: 'Laura Sánchez',
        schedule: 'Lunes y Viernes 5:30 PM',
        duration: '55 min',
        level: 'Principiante - Intermedio',
        image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80'
      },
      {
        id: 'gc6',
        name: 'CrossFit',
        description: 'Entrenamientos de alta intensidad variados. Combina fuerza, cardio y gimnasia.',
        instructor: 'Daniel Vargas',
        schedule: 'Lunes a Viernes 7:00 PM, Sábados 10:00 AM',
        duration: '60 min',
        level: 'Avanzado',
        image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80'
      }
    ],
    reviews: []
  },
  {
    id: '32',
    name: 'Bodytech San Fernando',
    category: 'Gym',
    address: 'Calle 13 #100-10, Barrio San Fernando',
    neighborhood: 'San Fernando',
    phone: '+57 2 555 7800',
    description: 'Gimnasio premium con entrenadores personales certificados. Incluye piscina, sauna, spa y cafetería saludable. Horario: Lunes a Viernes 5:30 AM - 10:30 PM, Sábados y Domingos 7:00 AM - 8:00 PM. Clases incluidas: CrossFit, pilates, natación y más.',
    images: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80',
      'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&q=80'
    ],
    latitude: 3.3845,
    longitude: -76.5425,
    rating: 4.8,
    priceRange: '$$$',
    featured: true,
    attributes: ['WiFi', 'Estacionamiento', 'Piscina', 'Sauna', 'Spa', 'Cafetería'],
    reviews: []
  },
  {
    id: '33',
    name: 'Gasolinera Terpel Ciudad Jardín',
    category: 'Gasolinera',
    address: 'Calle 16 Norte #6N-25, Ciudad Jardín',
    neighborhood: 'Ciudad Jardín',
    phone: '+57 2 555 3300',
    description: 'Estación de servicio 24 horas con tienda de conveniencia, baños limpios y servicio de lavado express. Combustibles: Gasolina corriente, extra y diesel. Métodos de pago: efectivo, tarjetas débito/crédito. Servicio de aire y agua gratis.',
    images: [
      'https://images.unsplash.com/photo-1545262810-77515befe149?w=800&q=80',
      'https://images.unsplash.com/photo-1529688499411-262f191fe29e?w=800&q=80',
      'https://images.unsplash.com/photo-1626668011687-8a114d2e0b61?w=800&q=80'
    ],
    latitude: 3.4156,
    longitude: -76.5389,
    rating: 4.3,
    priceRange: '$$',
    featured: false,
    attributes: ['Abierto 24h', 'Tienda', 'Baños', 'Lavado'],
    reviews: []
  },
  {
    id: '34',
    name: 'Estación de Servicio Mobil Versalles',
    category: 'Gasolinera',
    address: 'Avenida 4N #24-50, Versalles',
    neighborhood: 'Versalles',
    phone: '+57 2 555 6700',
    description: 'Gasolinera moderna con servicio rápido y eficiente. Abierto 24/7. Ofrece programa de puntos y descuentos. Tienda con snacks, bebidas y productos básicos. Área de descanso para conductores. Combustibles certificados y de alta calidad.',
    images: [
      'https://images.unsplash.com/photo-1594919121168-ba8b5cb35de6?w=800&q=80',
      'https://images.unsplash.com/photo-1529688499411-262f191fe29e?w=800&q=80',
      'https://images.unsplash.com/photo-1618090584126-30a1b610d651?w=800&q=80'
    ],
    latitude: 3.4573,
    longitude: -76.5378,
    rating: 4.5,
    priceRange: '$$',
    featured: false,
    attributes: ['Abierto 24h', 'Tienda', 'WiFi', 'Programa de puntos'],
    reviews: []
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
  'Gym',
  'Gasolinera'
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
