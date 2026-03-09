// SVG paths for category icons
export const categoryIcons: Record<string, string> = {
  'Comidas Rápidas': `<path d="M3 2v10c0 1.1.9 2 2 2h2v5a1 1 0 002 0v-5h2a2 2 0 002-2V2a1 1 0 00-2 0v8H5V2a1 1 0 00-2 0zm16 0a1 1 0 00-1 1v5c0 1.66-1.34 3-3 3v8a1 1 0 002 0v-6.1c1.49-.44 3-1.89 3-3.9V3a1 1 0 00-1-1z"/>`,
  'Café': `<path d="M2 21h18v-2H2v2zM20 8h-2V5h2a2 2 0 012 2 2 2 0 01-2 2zM18 5V3H4v16h14V8a2 2 0 002-2V5zm-4 10H6V7h8v8z"/>`,
  'Food Truck': `<path d="M18 18.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm1.5-9H17V12h4.46L19.5 9.5zM6 18.5c.83 0 1.5-.67 1.5-1.5S6.83 15.5 6 15.5 4.5 16.17 4.5 17 5.17 18.5 6 18.5zM20 8l3 4v5h-2c0 1.66-1.34 3-3 3s-3-1.34-3-3H9c0 1.66-1.34 3-3 3s-3-1.34-3-3H1V6c0-1.11.89-2 2-2h14v4h3z"/>`,
  'Italiana': `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>`,
  'Parrilla': `<path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>`,
  'Tradicional': `<path d="M3 2v10c0 1.1.9 2 2 2h2v5a1 1 0 002 0v-5h2a2 2 0 002-2V2a1 1 0 00-2 0v8H5V2a1 1 0 00-2 0zm16 0a1 1 0 00-1 1v5c0 1.66-1.34 3-3 3v8a1 1 0 002 0v-6.1c1.49-.44 3-1.89 3-3.9V3a1 1 0 00-1-1z"/>`,
  'Saludable': `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>`,
  'Mariscos': `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>`,
  'Postres': `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>`,
  'Panadería': `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>`,
  'Asiática': `<path d="M3 2v10c0 1.1.9 2 2 2h2v5a1 1 0 002 0v-5h2a2 2 0 002-2V2a1 1 0 00-2 0v8H5V2a1 1 0 00-2 0zm16 0a1 1 0 00-1 1v5c0 1.66-1.34 3-3 3v8a1 1 0 002 0v-6.1c1.49-.44 3-1.89 3-3.9V3a1 1 0 00-1-1z"/>`,
  'Otro': `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>`
};

export const getCategoryIcon = (category: string): string => {
  return categoryIcons[category] || categoryIcons['Otro'];
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Comidas Rápidas': '#ff5722',
    'Café': '#795548',
    'Food Truck': '#ff9800',
    'Italiana': '#e91e63',
    'Parrilla': '#d32f2f',
    'Tradicional': '#4caf50',
    'Saludable': '#8bc34a',
    'Mariscos': '#00bcd4',
    'Postres': '#9c27b0',
    'Panadería': '#ff8f00',
    'Asiática': '#f44336',
    'Otro': '#9e9e9e'
  };
  
  return colors[category] || colors['Otro'];
};
