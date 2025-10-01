// SVG paths for category icons
export const categoryIcons: Record<string, string> = {
  'Restaurante': `<path d="M3 2v10c0 1.1.9 2 2 2h2v5a1 1 0 002 0v-5h2a2 2 0 002-2V2a1 1 0 00-2 0v8H5V2a1 1 0 00-2 0zm16 0a1 1 0 00-1 1v5c0 1.66-1.34 3-3 3v8a1 1 0 002 0v-6.1c1.49-.44 3-1.89 3-3.9V3a1 1 0 00-1-1z"/>`,
  'Café': `<path d="M2 21h18v-2H2v2zM20 8h-2V5h2a2 2 0 012 2 2 2 0 01-2 2zM18 5V3H4v16h14V8a2 2 0 002-2V5zm-4 10H6V7h8v8z"/>`,
  'Parque': `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>`,
  'Farmacia': `<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 9h-4v4h-4v-4H6v-4h4V4h4v4h4v4z"/>`,
  'Banco': `<path d="M4 10h3v7H4v-7zm6.5 0h3v7h-3v-7zM2 19h20v3H2v-3zm15-9h3v7h-3v-7zM12 1L2 6v2h20V6l-10-5z"/>`,
  'Centro Comercial': `<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>`,
  'Hospital': `<path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>`,
  'Hotel': `<path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>`,
  'Entretenimiento': `<path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>`,
  'Servicios': `<path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>`,
  'Inmobiliaria': `<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>`,
  'Otro': `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>`
};

export const getCategoryIcon = (category: string): string => {
  return categoryIcons[category] || categoryIcons['Otro'];
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Restaurante': '#ff5722',
    'Café': '#795548',
    'Parque': '#4caf50',
    'Farmacia': '#00bcd4',
    'Banco': '#ffc107',
    'Centro Comercial': '#9c27b0',
    'Hospital': '#f44336',
    'Hotel': '#3f51b5',
    'Entretenimiento': '#e91e63',
    'Servicios': '#607d8b',
    'Inmobiliaria': '#2196f3',
    'Otro': '#9e9e9e'
  };
  
  return colors[category] || colors['Otro'];
};
