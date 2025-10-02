export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: string;
  category?: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  category?: string;
  image?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration?: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  conditions: string;
  validUntil?: string;
  qrRequired?: boolean;
  firstTimeOnly?: boolean;
}

export interface Place {
  id: string;
  name: string;
  category: string;
  address: string;
  neighborhood: string;
  zone?: string; // 'Norte', 'Sur', 'Oriente', 'Occidente', 'Centro'
  phone?: string;
  description?: string;
  images: string[];
  latitude: number;
  longitude: number;
  rating?: number;
  reviews?: Review[];
  priceRange?: string;
  featured?: boolean;
  menu?: MenuItem[];
  hasMenu?: boolean;
  products?: Product[];
  hasProducts?: boolean;
  featuredProducts?: Product[]; // Top 5 productos destacados para tiendas
  services?: Service[];
  hasServices?: boolean;
  promotions?: Promotion[];
  hasPromotions?: boolean;
  catalogUrl?: string; // URL del catálogo completo
  airbnbUrl?: string;
  // Características y filtros
  foodType?: string[]; // Para restaurantes: ['Colombiana', 'Internacional', etc.]
  familyFriendly?: boolean;
  petFriendly?: boolean;
  goodForCouples?: boolean;
  goodForKids?: boolean;
  attributes?: string[]; // Otros atributos específicos: ['WiFi', 'Parking', 'Terraza', etc.]
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export type Category = 
  | 'Restaurante'
  | 'Café'
  | 'Parque'
  | 'Farmacia'
  | 'Banco'
  | 'Centro Comercial'
  | 'Hospital'
  | 'Hotel'
  | 'Entretenimiento'
  | 'Servicios'
  | 'Gym'
  | 'Gasolinera'
  | 'Otro';
