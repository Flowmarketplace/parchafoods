import { Short } from '@/types/short';

export const mockShorts: Short[] = [
  {
    id: 's0',
    title: 'Descubre Sabor 360 Cali 🌆',
    description: 'La mejor app para descubrir lugares increíbles en Cali 🔥 #sabor360 #cali #descubre',
    videoUrl: '/videos/handcity-short-1.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&q=80',
    creator: {
      name: 'Sabor 360',
      username: '@sabor360',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
      verified: true
    },
    views: 45000,
    likes: 8500,
    category: 'Turismo',
    createdAt: '2025-10-14'
  },
  {
    id: 's1',
    title: 'Tour por Smart Fit Granada 🏋️',
    description: 'Conoce las instalaciones del mejor gym de Cali 💪 #fitness #gym #cali',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
    creator: {
      name: 'Fitness Cali',
      username: '@fitnesscali',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
      verified: true
    },
    views: 12500,
    likes: 1840,
    category: 'Gym',
    placeId: '31',
    placeName: 'Smart Fit Granada',
    createdAt: '2025-10-01'
  },
  {
    id: 's2',
    title: 'La mejor bandeja paisa de Cali 🍽️',
    description: 'Probando la bandeja paisa más deliciosa del barrio #comida #cali #foodie',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
    creator: {
      name: 'Cali Food Tour',
      username: '@califoodtour',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
      verified: true
    },
    views: 25300,
    likes: 3650,
    category: 'Restaurante',
    placeId: '1',
    placeName: 'Restaurante El Sabor del Barrio',
    createdAt: '2025-09-30'
  },
  {
    id: 's3',
    title: 'Clase de Zumba en vivo 💃',
    description: 'Únete a nuestras clases de Zumba todos los lunes #zumba #dance #fitness',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=400&q=80',
    creator: {
      name: 'Carolina Rodríguez',
      username: '@carolfit',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
      verified: false
    },
    views: 8900,
    likes: 1250,
    category: 'Gym',
    placeId: '31',
    placeName: 'Smart Fit Granada',
    createdAt: '2025-09-29'
  },
  {
    id: 's4',
    title: 'Café artesanal en San Antonio ☕',
    description: 'El mejor latte art de Cali ✨ #cafe #coffee #barista',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80',
    creator: {
      name: 'Cali Coffee',
      username: '@calicoffee',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      verified: true
    },
    views: 15700,
    likes: 2340,
    category: 'Café',
    createdAt: '2025-09-28'
  },
  {
    id: 's5',
    title: 'Spinning extremo 🚴',
    description: 'Martes de spinning intenso! Ven y súmate 🔥 #spinning #cardio #fitness',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
    creator: {
      name: 'Miguel Ángel Torres',
      username: '@miguelspinning',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
      verified: false
    },
    views: 10200,
    likes: 1580,
    category: 'Gym',
    placeId: '31',
    placeName: 'Smart Fit Granada',
    createdAt: '2025-09-27'
  },
  {
    id: 's6',
    title: 'Recorrido por Granada 🏙️',
    description: 'Los mejores lugares del barrio Granada #cali #tour #lifestyle',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&q=80',
    creator: {
      name: 'Cali Explorer',
      username: '@caliexplorer',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
      verified: true
    },
    views: 18400,
    likes: 2910,
    category: 'Turismo',
    createdAt: '2025-09-26'
  }
];
