import { getBusinessTypeColor, resolveBusinessType } from '@/data/categories';

// SVG paths for category icons
export const categoryIcons: Record<string, string> = {
  'Comidas Rápidas': `<path d="M3 2v10c0 1.1.9 2 2 2h2v5a1 1 0 002 0v-5h2a2 2 0 002-2V2a1 1 0 00-2 0v8H5V2a1 1 0 00-2 0zm16 0a1 1 0 00-1 1v5c0 1.66-1.34 3-3 3v8a1 1 0 002 0v-6.1c1.49-.44 3-1.89 3-3.9V3a1 1 0 00-1-1z"/>`,
  'Café': `<path d="M18 8h2a2 2 0 0 1 0 4h-2m-2-4v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8h12zM2 21h18M6 2v3M10 2v3M14 2v3" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  'Food Truck': `<path d="M18 18.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm1.5-9H17V12h4.46L19.5 9.5zM6 18.5c.83 0 1.5-.67 1.5-1.5S6.83 15.5 6 15.5 4.5 16.17 4.5 17 5.17 18.5 6 18.5zM20 8l3 4v5h-2c0 1.66-1.34 3-3 3s-3-1.34-3-3H9c0 1.66-1.34 3-3 3s-3-1.34-3-3H1V6c0-1.11.89-2 2-2h14v4h3z"/>`,
  'Italiana': `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>`,
  'Parrilla': `<path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>`,
  'Tradicional': `<path d="M3 2v10c0 1.1.9 2 2 2h2v5a1 1 0 002 0v-5h2a2 2 0 002-2V2a1 1 0 00-2 0v8H5V2a1 1 0 00-2 0zm16 0a1 1 0 00-1 1v5c0 1.66-1.34 3-3 3v8a1 1 0 002 0v-6.1c1.49-.44 3-1.89 3-3.9V3a1 1 0 00-1-1z"/>`,
  'Saludable': `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>`,
  'Mariscos': `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>`,
  'Postres': `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>`,
  'Panadería': `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>`,
  'Asiática': `<path d="M3 2v10c0 1.1.9 2 2 2h2v5a1 1 0 002 0v-5h2a2 2 0 002-2V2a1 1 0 00-2 0v8H5V2a1 1 0 00-2 0zm16 0a1 1 0 00-1 1v5c0 1.66-1.34 3-3 3v8a1 1 0 002 0v-6.1c1.49-.44 3-1.89 3-3.9V3a1 1 0 00-1-1z"/>`,
  'Mexicana': `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="none" stroke="white" stroke-width="1.5"/><path d="M8 14c0-2 2-3 4-3s4 1 4 3M7 10l1-3 2 2 2-4 2 4 2-2 1 3" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  'Sushi': `<path d="M2 12c0 3.5 4.5 6 10 6s10-2.5 10-6-4.5-6-10-6S2 8.5 2 12z" fill="none" stroke="white" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="4" ry="2.5" fill="none" stroke="white" stroke-width="1.5"/><circle cx="12" cy="12" r="1" fill="white"/>`,
  'Bar': `<path d="M17 11h1a3 3 0 0 1 0 6h-1m-6-6v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6h12zM4 7h16M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  'Rooftop': `<path d="M3 21h18M9 21V12h6v9M3 12l9-9 9 9" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 21V16h3v5M15 21V16h3v5" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round"/>`,
  'Remate': `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  'Otro': `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>`
};

// Aliases for category variants used in the database
categoryIcons['Rápidas'] = categoryIcons['Comidas Rápidas'];
categoryIcons['Cafés'] = categoryIcons['Café'];
categoryIcons['Cerveza'] = categoryIcons['Bar'];
categoryIcons['Restaurante'] = categoryIcons['Tradicional'];

// Macro business-type icons (La Ciudad en tus Manos taxonomy)
categoryIcons['Comida'] = categoryIcons['Tradicional'];
categoryIcons['Salud'] = `<path d="M12 3v18M3 12h18" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round"/>`;
categoryIcons['Belleza'] = `<path d="M6 3l12 12M18 3L6 15" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/><circle cx="6" cy="19" r="2.5" fill="none" stroke="white" stroke-width="2"/><circle cx="18" cy="19" r="2.5" fill="none" stroke="white" stroke-width="2"/>`;
categoryIcons['Ropa'] = `<path d="M8 3l4 2 4-2 5 4-3 3v11H6V10L3 7l5-4z" fill="none" stroke="white" stroke-width="2" stroke-linejoin="round"/>`;
categoryIcons['Entretenimiento'] = `<path d="M9 18V5l12-2v13" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="18" r="3" fill="none" stroke="white" stroke-width="2"/><circle cx="18" cy="16" r="3" fill="none" stroke="white" stroke-width="2"/>`;
categoryIcons['Hogar'] = `<path d="M3 11l9-8 9 8M5 10v10h14V10" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
categoryIcons['Servicios'] = `<path d="M14.7 6.3a4 4 0 01-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 015.4-5.4l-2.6 2.6-1.4-1.4 2.6-2.6z" fill="none" stroke="white" stroke-width="2" stroke-linejoin="round"/>`;
categoryIcons['Hospedaje'] = `<path d="M3 18V8m0 4h18v6M7 11a2 2 0 100-4 2 2 0 000 4zM11 12h8a2 2 0 012 2" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
categoryIcons['Mercados'] = `<path d="M3 6h18l-2 12H5L3 6zM8 6V4a4 4 0 018 0v2" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
categoryIcons['Profesionales'] = `<path d="M3 8h18v11a1 1 0 01-1 1H4a1 1 0 01-1-1V8zM9 8V6a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
categoryIcons['Educación'] = `<path d="M12 4L2 9l10 5 10-5-10-5zM6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;

export const getCategoryIcon = (category: string): string => {
  return (
    categoryIcons[category] ||
    categoryIcons[resolveBusinessType(category)] ||
    categoryIcons['Otro']
  );
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Comidas Rápidas': '#ff5722',
    'Rápidas': '#ff5722',
    'Café': '#795548',
    'Cafés': '#795548',
    'Food Truck': '#ff9800',
    'Italiana': '#e91e63',
    'Parrilla': '#d32f2f',
    'Tradicional': '#4caf50',
    'Restaurante': '#4caf50',
    'Saludable': '#8bc34a',
    'Mariscos': '#00bcd4',
    'Postres': '#9c27b0',
    'Panadería': '#ff8f00',
    'Asiática': '#f44336',
    'Mexicana': '#e65100',
    'Sushi': '#1565c0',
    'Bar': '#f9a825',
    'Cerveza': '#f9a825',
    'Rooftop': '#7c4dff',
    'Remate': '#e91e63',
    'Otro': '#9e9e9e'
  };
  
  return colors[category] || getBusinessTypeColor(category);
};
