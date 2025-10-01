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

export interface Place {
  id: string;
  name: string;
  category: string;
  address: string;
  neighborhood: string;
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
  services?: Service[];
  hasServices?: boolean;
  airbnbUrl?: string;
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
  | 'Otro';
