export type PanelKey = 'admin' | 'business' | 'sponsor' | 'seller';

export interface PanelOption {
  key: PanelKey;
  label: string;
  description: string;
  path: string;
}

export const PANEL_OPTIONS: Record<PanelKey, PanelOption> = {
  admin: {
    key: 'admin',
    label: 'Administrador',
    description: 'Gestiona negocios, usuarios, suscripciones y vendedores',
    path: '/admin',
  },
  business: {
    key: 'business',
    label: 'Mi negocio',
    description: 'Administra tu negocio, fotos, horarios y catálogo',
    path: '/business-dashboard',
  },
  sponsor: {
    key: 'sponsor',
    label: 'Patrocinador',
    description: 'Campañas y métricas de tu marca',
    path: '/sponsor',
  },
  seller: {
    key: 'seller',
    label: 'Vendedor',
    description: 'Clientes, prospectos, recaudo y comisiones',
    path: '/seller',
  },
};

export const getPanelsForRoles = (roles: { role: string }[] | null | undefined): PanelOption[] => {
  const list = roles?.map((r) => r.role) || [];
  const panels: PanelOption[] = [];
  if (list.includes('admin')) panels.push(PANEL_OPTIONS.admin);
  if (list.includes('business_owner')) panels.push(PANEL_OPTIONS.business);
  if (list.includes('sponsor')) panels.push(PANEL_OPTIONS.sponsor);
  if (list.includes('seller')) panels.push(PANEL_OPTIONS.seller);
  return panels;
};

/** Where to send the user after login: chooser when there is more than one panel. */
export const destinationForRoles = (roles: { role: string }[] | null | undefined): string => {
  const panels = getPanelsForRoles(roles);
  if (panels.length === 0) return '/';
  if (panels.length === 1) return panels[0].path;
  return '/panel';
};
