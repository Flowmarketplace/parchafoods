import {
  Grid,
  UtensilsCrossed,
  HeartPulse,
  Scissors,
  Shirt,
  Music,
  Hammer,
  Wrench,
  Briefcase,
  BedDouble,
  ShoppingBasket,
  GraduationCap,
  Building2,
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
  /** Ordered subcategories shown when the macro category is selected */
  subcategories: string[];
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
      'Dulces', 'Frutería', 'Comida',
    ],
    subcategories: [
      'Restaurante', 'Comidas Rápidas', 'Asadero', 'Parrilla', 'Pizzería',
      'Panadería', 'Café', 'Heladería', 'Dulces', 'Comida típica',
      'Comida saludable', 'Comida internacional', 'Mariscos', 'Bar y cerveza',
    ],
  },
  {
    id: 'Salud',
    name: 'Salud',
    label: 'Salud y bienestar',
    icon: HeartPulse,
    color: '#0ca678',
    aliases: ['Droguería', 'Farmacia', 'Odontología', 'Veterinaria', 'Óptica', 'Laboratorio', 'IPS', 'Hospital', 'Naturista', 'Suplementos', 'Salud'],
    subcategories: [
      'Medicina general', 'Pediatría', 'Odontología', 'Veterinaria', 'Óptica',
      'Droguería', 'Laboratorio clínico', 'Hospital / Clínica', 'IPS',
      'Fisioterapia', 'Psicología', 'Nutrición', 'Naturista', 'Suplementos',
    ],
  },
  {
    id: 'Belleza',
    name: 'Belleza',
    label: 'Belleza y cuidado personal',
    icon: Scissors,
    color: '#d6336c',
    aliases: ['Peluquería', 'Barbería', 'Spa', 'Uñas', 'Estética', 'Cosméticos', 'Perfumería', 'Tatuajes', 'Belleza'],
    subcategories: [
      'Peluquería', 'Barbería', 'Salón de belleza', 'Uñas', 'Maquillaje',
      'Spa y masajes', 'Estética', 'Cosméticos', 'Perfumería', 'Tatuajes',
    ],
  },
  {
    id: 'Ropa',
    name: 'Ropa',
    label: 'Ropa y calzado',
    icon: Shirt,
    color: '#7048e8',
    aliases: ['Boutique', 'Almacén', 'Calzado', 'Moda', 'Textiles', 'Ropa', 'Joyería', 'Relojería', 'Telas', 'Juguetería', 'Regalos'],
    subcategories: [
      'Ropa para dama', 'Ropa para caballero', 'Ropa infantil', 'Ropa deportiva',
      'Boutique', 'Calzado', 'Accesorios', 'Joyería', 'Relojería', 'Telas',
      'Sastrería', 'Regalos', 'Juguetería',
    ],
  },
  {
    id: 'Entretenimiento',
    name: 'Ocio',
    label: 'Entretenimiento',
    icon: Music,
    color: '#f59f00',
    aliases: ['Billar', 'Gimnasio', 'Discoteca', 'Tejo', 'Cine', 'Eventos', 'Casino', 'Piscina', 'Juegos', 'Parque', 'Karaoke', 'Entretenimiento'],
    subcategories: [
      'Bar', 'Discoteca', 'Billar', 'Tejo', 'Gimnasio', 'Cine', 'Karaoke',
      'Casino', 'Juegos', 'Piscina', 'Parque', 'Eventos', 'Turismo',
    ],
  },
  {
    id: 'Hogar',
    name: 'Hogar',
    label: 'Hogar y ferretería',
    icon: Hammer,
    color: '#1864ab',
    aliases: [
      'Ferretería', 'Muebles', 'Electrodomésticos', 'Decoración', 'Construcción',
      'Pinturas', 'Colchones', 'Vidriería', 'Metalistería', 'Gas', 'Cerámica',
      'Cortinas', 'Eléctricos', 'Jardinería', 'Artesanías', 'Baños', 'Pisos',
      'Carpintería', 'Hogar',
    ],
    subcategories: [
      'Ferretería', 'Construcción', 'Pinturas', 'Muebles', 'Colchones',
      'Electrodomésticos', 'Decoración', 'Cortinas', 'Cerámica y pisos',
      'Baños y cocina', 'Vidriería', 'Metalistería', 'Carpintería',
      'Eléctricos', 'Gas', 'Jardinería', 'Artesanías',
    ],
  },
  {
    id: 'Servicios',
    name: 'Servicios',
    label: 'Servicios',
    icon: Wrench,
    color: '#0b7285',
    aliases: [
      'Lavandería', 'Papelería', 'Tecnología', 'Transporte', 'Financiero',
      'Celulares', 'Banco', 'Gasolinera', 'Repuestos', 'Repuestos de moto',
      'Llantas', 'Lavadero', 'Funeraria', 'Correo', 'Impresión', 'Compraventa',
      'Comercio', 'Fiestas', 'Computadores', 'Electrónica', 'Reparación de calzado',
      'Servicios',
    ],
    subcategories: [
      'Repuestos', 'Llantas', 'Lavadero de autos', 'Gasolinera', 'Transporte',
      'Banco y financiero', 'Papelería e impresión', 'Celulares y tecnología',
      'Computadores', 'Electrónica', 'Lavandería', 'Reparación de calzado',
      'Fiestas y eventos', 'Compraventa', 'Correo y encomiendas', 'Funeraria',
    ],
  },
  {
    id: 'Educación',
    name: 'Educación',
    label: 'Educación y formación',
    icon: GraduationCap,
    color: '#1971c2',
    aliases: [
      'Educación', 'Colegio', 'Escuela', 'Universidad', 'Instituto', 'Academia',
      'Jardín infantil', 'Preescolar', 'Biblioteca', 'SENA', 'Idiomas',
      'Autoescuela', 'Guardería',
    ],
    subcategories: [
      'Jardín infantil', 'Preescolar', 'Colegio', 'Universidad',
      'Instituto técnico', 'Academia de idiomas', 'Escuela de música',
      'Escuela de danza', 'Escuela de conducción', 'Refuerzo escolar',
      'Cursos y talleres', 'Biblioteca',
    ],
  },
  {
    id: 'Profesionales',
    name: 'Profesionales',
    label: 'Servicios profesionales',
    icon: Briefcase,
    color: '#364fc7',
    aliases: [
      'Abogados', 'Notaría', 'Contaduría', 'Consultorio', 'Médico', 'Psicología',
      'Arquitectura', 'Ingeniería', 'Topografía', 'Diseño gráfico', 'Publicidad',
      'Taller', 'Taller automotriz', 'Taller de motos', 'Mecánica',
      'Tecnomecánica', 'Reparación electrónica', 'Motos', 'Profesionales',
    ],
    subcategories: [
      'Abogados', 'Contaduría', 'Notaría', 'Consultorio médico particular',
      'Psicología', 'Arquitectura', 'Ingeniería', 'Topografía',
      'Publicidad y diseño', 'Mecánica automotriz', 'Taller de motos',
      'Tecnomecánica', 'Reparación electrónica', 'Seguros',
    ],
  },
  {
    id: 'Inmuebles',
    name: 'Inmuebles',
    label: 'Inmuebles y finca raíz',
    icon: Building2,
    color: '#087f5b',
    aliases: [
      'Inmuebles', 'Inmobiliaria', 'Finca raíz', 'Arriendos', 'Arriendo',
      'Venta de inmuebles', 'Proyectos', 'Constructora', 'Lotes', 'Bienes raíces',
    ],
    subcategories: [
      'Arriendos', 'En venta', 'Proyectos', 'Inmobiliarias', 'Lotes y terrenos',
      'Fincas y campestre', 'Locales y oficinas', 'Constructoras',
      'Avalúos y asesoría',
    ],
  },
  {
    id: 'Hospedaje',
    name: 'Hospedaje',
    label: 'Hospedaje',
    icon: BedDouble,
    color: '#5f3dc4',
    aliases: ['Hotel', 'Hostal', 'Finca', 'Posada', 'Camping', 'Motel', 'Cabaña', 'Hospedaje'],
    subcategories: ['Hotel', 'Hostal', 'Motel', 'Posada', 'Finca', 'Cabaña', 'Camping', 'Apartamentos'],
  },
  {
    id: 'Mercados',
    name: 'Mercados',
    label: 'Mercados y abastos',
    icon: ShoppingBasket,
    color: '#2b8a3e',
    aliases: [
      'Supermercado', 'Carnicería', 'Tienda', 'Granero', 'Licorera',
      'Bebidas', 'Variedades', 'Agropecuaria', 'Centro comercial', 'Quesos',
      'Plaza de mercado', 'Mercados',
    ],
    subcategories: [
      'Supermercado', 'Tienda de barrio', 'Plaza de mercado', 'Carnicería',
      'Fruver', 'Quesos y lácteos', 'Panadería y víveres', 'Licorera',
      'Bebidas', 'Granero', 'Agropecuaria', 'Variedades', 'Centro comercial',
    ],
  },
];

export const ALL_CATEGORY = {
  id: 'Todos',
  name: 'Todos',
  label: 'Todas las categorías',
  icon: Grid,
  color: '#495057',
  aliases: [] as string[],
  subcategories: [] as string[],
};

export const getCategoryById = (id: string): BusinessCategory | undefined =>
  BUSINESS_CATEGORIES.find((c) => c.id === id);

/** Subcategories available for a macro business type. */
export const getSubcategories = (businessTypeId: string): string[] =>
  getCategoryById(businessTypeId)?.subcategories ?? [];

const normalize = (v: string) =>
  v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

/** Maps a specific category (or a macro type) to its macro business type. */
export function resolveBusinessType(value?: string | null): string {
  if (!value) return 'Servicios';
  const direct = BUSINESS_CATEGORIES.find((c) => c.id === value);
  if (direct) return direct.id;
  const target = normalize(value);
  const byAlias = BUSINESS_CATEGORIES.find((c) =>
    c.aliases.some((a) => normalize(a) === target),
  );
  if (byAlias) return byAlias.id;
  const bySub = BUSINESS_CATEGORIES.find((c) =>
    c.subcategories.some((s) => normalize(s) === target),
  );
  return bySub?.id ?? 'Servicios';
}

/**
 * Resolves the subcategory label for a business inside its macro category.
 * Falls back to the stored category when it does not match a known subcategory.
 */
export function resolveSubcategory(
  category?: string | null,
  businessType?: string | null,
  name?: string | null,
): string | null {
  const type = resolveBusinessType(businessType || category);
  const subs = getSubcategories(type);
  if (!subs.length) return null;

  const candidates = [category, name].filter(Boolean) as string[];
  for (const candidate of candidates) {
    const target = normalize(candidate);
    const exact = subs.find((s) => normalize(s) === target);
    if (exact) return exact;
  }
  for (const candidate of candidates) {
    const target = normalize(candidate);
    const partial = subs.find((s) => {
      const n = normalize(s);
      return target.includes(n) || n.includes(target);
    });
    if (partial) return partial;
  }
  return category || null;
}

export function getBusinessTypeColor(type?: string | null): string {
  return getCategoryById(resolveBusinessType(type))?.color ?? ALL_CATEGORY.color;
}
