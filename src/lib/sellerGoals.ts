export const DAILY_CLIENT_GOAL = 5;
export const MONTHLY_CLIENT_GOAL = 65;

export interface SaleLike {
  sale_type?: string | null;
  amount?: number | null;
  sale_date?: string | null;
}

export const todayKey = () => new Date().toISOString().slice(0, 10);
export const monthKey = () => new Date().toISOString().slice(0, 7);

export const isSale = (s: SaleLike) => (s.sale_type || 'venta') === 'venta';

export const salesToday = (sales: SaleLike[]) =>
  sales.filter((s) => isSale(s) && (s.sale_date || '').startsWith(todayKey()));

export const salesThisMonth = (sales: SaleLike[]) =>
  sales.filter((s) => isSale(s) && (s.sale_date || '').startsWith(monthKey()));

export const amountThisMonth = (sales: SaleLike[]) =>
  sales
    .filter((s) => (s.sale_date || '').startsWith(monthKey()))
    .reduce((sum, s) => sum + Number(s.amount || 0), 0);

export const goalProgress = (count: number, goal: number) =>
  Math.min(100, Math.round((count / goal) * 100));
