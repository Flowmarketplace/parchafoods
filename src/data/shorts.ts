import { Short } from '@/types/short';

export const mockShorts: Short[] = [
  {
    id: 's1',
    title: 'La Hamburguesa Mundialista 🍔⚽',
    description: 'Edición especial: doble carne, queso cheddar y salsa gol. ¡Solo en época mundialista! #mundial2026 #burger #cali',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    creator: {
      name: 'Burger Stadium',
      username: '@burgerstadium',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
      verified: true
    },
    views: 32000,
    likes: 5400,
    category: 'Comidas Rápidas',
    placeId: '1',
    placeName: 'Burger Stadium',
    createdAt: '2026-03-20'
  },
  {
    id: 's2',
    title: 'Tacos al Pastor para el partido 🌮🏆',
    description: 'Prepara tus tacos mundialistas con esta receta ganadora #tacos #mundial #mexico',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80',
    creator: {
      name: 'La Taquería Mundial',
      username: '@taqueriamundial',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
      verified: true
    },
    views: 28500,
    likes: 4200,
    category: 'Mexicana',
    placeId: '2',
    placeName: 'La Taquería Mundial',
    createdAt: '2026-03-19'
  },
  {
    id: 's3',
    title: 'Sushi Roll "Gol de Colombia" 🍣🇨🇴',
    description: 'Roll especial con camarón tempura, aguacate y salsa de maracuyá. ¡Puro sabor tricolor!',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80',
    creator: {
      name: 'Sushi Gol',
      username: '@sushigol',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
      verified: true
    },
    views: 19800,
    likes: 3100,
    category: 'Asiática',
    placeId: '3',
    placeName: 'Sushi Gol',
    createdAt: '2026-03-18'
  },
  {
    id: 's4',
    title: 'El Asado del Hincha 🥩🔥',
    description: 'Corte premium a la parrilla para ver los partidos como se debe #asado #mundial #parrilla',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80',
    creator: {
      name: 'Parrilla Mundialista',
      username: '@parrillamundial',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      verified: true
    },
    views: 22400,
    likes: 3800,
    category: 'Parrilla',
    placeId: '4',
    placeName: 'Parrilla Mundialista',
    createdAt: '2026-03-17'
  },
  {
    id: 's5',
    title: 'Cerveza artesanal edición Mundial 🍺⚽',
    description: 'Probamos las cervezas artesanales que sacaron para el mundial. ¡Imperdibles! #cerveza #craft #mundial2026',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&q=80',
    creator: {
      name: 'Cervecería Gol',
      username: '@cerveceriagol',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
      verified: true
    },
    views: 17600,
    likes: 2900,
    category: 'Bar',
    placeId: '5',
    placeName: 'Cervecería Gol',
    createdAt: '2026-03-16'
  },
  {
    id: 's6',
    title: 'Food Truck: Hot Dogs del Campeón 🌭🏟️',
    description: 'Los perros calientes más locos de Cali, directo desde el food truck #foodtruck #hotdog #mundial',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1619740455993-9d701c4cb641?w=400&q=80',
    creator: {
      name: 'Hot Dog Campeón',
      username: '@hotdogcampeon',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
      verified: true
    },
    views: 14200,
    likes: 2100,
    category: 'Food Truck',
    placeId: '6',
    placeName: 'Hot Dog Campeón',
    createdAt: '2026-03-15'
  },
  {
    id: 's7',
    title: 'Café Colombiano: Latte del 10 ☕🇨🇴',
    description: 'Latte art con la camiseta de Colombia. ¡El café más mundialista! #cafe #colombia #latte',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80',
    creator: {
      name: 'Café Gol',
      username: '@cafegol',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
      verified: true
    },
    views: 11300,
    likes: 1800,
    category: 'Café',
    placeId: '7',
    placeName: 'Café Gol',
    createdAt: '2026-03-14'
  },
  {
    id: 's8',
    title: 'Pizza del Mundial: 4 países en 1 🍕🌍',
    description: 'Cada cuarto de la pizza representa un país del grupo. ¡Sabor internacional! #pizza #mundial #foodie',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
    creator: {
      name: 'Pizza Stadium',
      username: '@pizzastadium',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
      verified: true
    },
    views: 20100,
    likes: 3500,
    category: 'Italiana',
    placeId: '8',
    placeName: 'Pizza Stadium',
    createdAt: '2026-03-13'
  }
];
