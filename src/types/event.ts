export interface Event {
  id: string;
  name: string;
  type: 'Concierto' | 'Teatro' | 'Cine' | 'Festival' | 'Deportes' | 'Arte' | 'Otro';
  venue: string;
  address: string;
  neighborhood: string;
  date: string;
  time: string;
  price: string;
  description: string;
  images: string[];
  latitude: number;
  longitude: number;
  organizer?: string;
  featured?: boolean;
}

export type EventType = 
  | 'Todos'
  | 'Concierto'
  | 'Teatro'
  | 'Cine'
  | 'Festival'
  | 'Deportes'
  | 'Arte';
