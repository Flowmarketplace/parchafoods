import {
  Grid,
  UtensilsCrossed,
  HeartPulse,
  Scissors,
  Shirt,
  Music,
  Hammer,
  Wrench,
  BedDouble,
  ShoppingBasket,
  type LucideIcon,
} from 'lucide-react';

export interface BusinessCategory {
  /** Value stored in businesses.business_type */
  id: string;
  /** Short label used in the category bar */
  name: string;
  /** Longer label used in listings/filters */
  label: string;
  icon: LucideIcon;
  color: string;
  /** Legacy/specific categories that map into this macro category */
  aliases: string[];
}

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    id: 'Comida',
    name: 'Comida',
    label: 'Comida y bebida',
    icon: UtensilsCrossed,
    color: '#e8590c',
    aliases: [
      'Comidas Rápidas', 'Rápidas', 'Café', 'Cafés', 'Food Truck', 'Italiana',
      'Parrilla', 'Tradicional', 'Saludable', 'Mariscos', 'Postres',
      'Panadería', 'Asiática', 'Mexicana', 'Sushi', 'Bar', 'Cerveza',
      'Rooftop', 'Remate', 'Restaurante', 'Asadero', 'Heladería', 'Pizzería',
    ],
  },
  {
    id: 'Salud',
    name: 'Salud',
    label: 'Salud y bienestar',
    icon: HeartPulse,
    color: '#0ca678',
    aliases: ['Droguería', 'Farmacia', 'Consultorio', 'Odontología', 'Veterinaria', 'Óptica', 'Laboratorio', 'IPS'],
  },
  {
    id: 'Belleza',
    name: 'Belleza',
    label: 'Belleza y cuidado personal',
    icon: Scissors,
    color: '#d6336c',
    aliases: ['Peluquería', 'Barbería', 'Spa', 'Uñas', 'Estética'],
  },
  {
    id: 'Ropa',
    name: 'Ropa',
    label: 'Ropa y calzado',
    icon: Shirt,
    color: '#7048e8',
    aliases: ['Boutique', 'Almacén', 'Calzado', 'Moda', 'Textiles'],
  },
  {
    id: 'Entretenimiento',
    name: 'Ocio',
    label: 'Entretenimiento',
    icon: Music,
    color: '#f59f00',
    aliases: ['Bar', 'Billar', 'Gimnasio', 'Discoteca', 'Tejo', 'Cine', 'Eventos'],
  },
  {
    id: 'Hogar',
    name: 'Hogar',
    label: 'Hogar y ferretería',
    icon: Hammer,
    color: '#1864ab',
    aliases: ['Ferretería', 'Muebles', 'Electrodomésticos', 'Decoración', 'Construcción'],
  },
  {
    id: 'Servicios',
    name: 'Servicios',
    label: 'Servicios',
    icon: Wrench,
    color: '#0b7285',
    aliases: ['Taller', 'Lavandería', 'Papelería', 'Tecnología', 'Transporte', 'Financiero', 'Educación'],
  },
  {
    id: 'Hospedaje',
    name: 'Hospedaje',
    label: 'Hospedaje',
    icon: BedDouble,
    color: '#5f3dc4',
    aliases: ['Hotel', 'Hostal', 'Finca', 'Posada', 'Camping'],
  },
  {
    id: 'Mercados',
    name: 'Mercados',
    label: 'Mercados y abastos',
    icon: ShoppingBasket,
    color: '#2b8a3e',
    aliases: ['Supermercado', 'Frutería', 'Carnicería', 'Tienda', 'Granero', 'Licorera'],
  },
];

export const ALL_CATEGORY = {
  id: 'Todos',
  name: 'Todos',
  label: 'Todas las categorías',
  icon: Grid,
  color: '#495057',
  aliases: [] as string[],
};

export const getCategoryById = (id: string): BusinessCategory | undefined =>
  BUSINESS_CATEGORIES.find((c) => c.id === id);

/** Maps a specific category (or a macro type) to its macro business type. */
export function resolveBusinessType(value?: string | null): string {
  if (!value) return 'Servicios';
  const direct = BUSINESS_CATEGORIES.find((c) => c.id === value);
  if (direct) return direct.id;
  const byAlias = BUSINESS_CATEGORIES.find((c) =>
    c.aliases.some((a) => a.toLowerCase() === value.toLowerCase()),
  );
  return byAlias?.id ?? 'Servicios';
}

export function getBusinessTypeColor(type?: string | null): string {
  return getCategoryById(resolveBusinessType(type))?.color ?? ALL_CATEGORY.color;
}
