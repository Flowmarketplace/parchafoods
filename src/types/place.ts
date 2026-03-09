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

export interface GymClass {
  id: string;
  name: string;
  description: string;
  instructor?: string;
  schedule: string;
  duration?: string;
  level?: string;
  image?: string;
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
  slug?: string;
  name: string;
  category: string;
  address: string;
  neighborhood: string;
  zone?: string;
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
  featuredProducts?: Product[];
  services?: Service[];
  hasServices?: boolean;
  promotions?: Promotion[];
  hasPromotions?: boolean;
  catalogUrl?: string;
  airbnbUrl?: string;
  gymClasses?: GymClass[];
  hasGymClasses?: boolean;
  foodType?: string[];
  familyFriendly?: boolean;
  petFriendly?: boolean;
  goodForCouples?: boolean;
  goodForKids?: boolean;
  attributes?: string[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export type Category = 
  | 'Comidas Rápidas'
  | 'Café'
  | 'Food Truck'
  | 'Italiana'
  | 'Parrilla'
  | 'Tradicional'
  | 'Saludable'
  | 'Mariscos'
  | 'Postres'
  | 'Panadería'
  | 'Asiática'
  | 'Otro';
