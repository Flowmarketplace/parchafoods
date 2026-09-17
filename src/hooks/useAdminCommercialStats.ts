import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { subscriptionCommission, subscriptionValue } from '@/lib/sellerMath';
import { clientsThisMonth, clientsToday, localMonth } from '@/lib/sellerGoals';

/** Ciudades activas comercialmente (Cali queda fuera de las estadísticas por ahora) */
export const ACTIVE_CITIES = ['Barbosa', 'Santana'];

export interface SellerStat {
  id: string;
  name: string;
  clients: number;
  sold: number;
  collected: number;
  pending: number;
  commission: number;
  today: number;
  month: number;
}

export interface CityStat {
  city: string;
  businesses: number;
  subscriptions: number;
  sold: number;
  collected: number;
}

export interface AdminCommercialStats {
  loading: boolean;
  reload: () => void;
  totalBusinesses: number;
  totalUsers: number;
  totalClients: number;
  activeSubscriptions: number;
  totalSold: number;
  totalCollected: number;
  totalPending: number;
  totalCommission: number;
  monthSold: number;
  monthSubscriptions: number;
  sellers: SellerStat[];
  cities: CityStat[];
  monthly: { month: string; negocios: number; membresias: number; ingresos: number }[];
  categories: { name: string; value: number }[];
  recent: any[];
}

const EMPTY: Omit<AdminCommercialStats, 'loading' | 'reload'> = {
  totalBusinesses: 0,
  totalUsers: 0,
  totalClients: 0,
  activeSubscriptions: 0,
  totalSold: 0,
  totalCollected: 0,
  totalPending: 0,
  totalCommission: 0,
  monthSold: 0,
  monthSubscriptions: 0,
  sellers: [],
  cities: [],
  monthly: [],
  categories: [],
  recent: [],
};

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export const useAdminCommercialStats = (): AdminCommercialStats => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(EMPTY);

  const load = useCallback(async () => {
    setLoading(true);
    const [businessesRes, subsRes, sellersRes, clientsRes, usersRes] = await Promise.all([
      supabase.from('businesses').select('id, name, city, business_type, created_at').in('city', ACTIVE_CITIES),
      supabase
        .from('business_subscriptions')
        .select('*, businesses(name, city), subscription_plans(name, price, currency), sellers(full_name)')
        .order('start_date', { ascending: false }),
      supabase.from('sellers').select('id, full_name, active'),
      supabase.from('clients').select('id, name, status, seller_id, business_id'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
    ]);

    const businesses = businessesRes.data || [];
    const businessIds = new Set(businesses.map((b) => b.id));
    const allSubs = subsRes.data || [];
    // Solo membresías de negocios en las ciudades activas
    const subs = allSubs.filter((s: any) => !s.business_id || businessIds.has(s.business_id));
    const sellersList = sellersRes.data || [];
    const clients = clientsRes.data || [];

    const totalSold = subs.reduce((sum, s: any) => sum + subscriptionValue(s), 0);
    const paid = subs.filter((s: any) => s.collected);
    const unpaid = subs.filter((s: any) => !s.collected);
    const totalCollected = paid.reduce(
      (sum, s: any) => sum + Number(s.collected_amount ?? subscriptionValue(s)),
      0,
    );
    const totalCommission = paid.reduce((sum, s: any) => sum + subscriptionCommission(s), 0);
    const totalPending = unpaid.reduce((sum, s: any) => sum + subscriptionValue(s), 0);

    const sellers: SellerStat[] = sellersList.map((sel: any) => {
      const own = subs.filter((s: any) => s.seller_id === sel.id);
      const ownPaid = own.filter((s: any) => s.collected);
      return {
        id: sel.id,
        name: sel.full_name,
        clients: own.length,
        sold: own.reduce((sum, s: any) => sum + subscriptionValue(s), 0),
        collected: ownPaid.reduce((sum, s: any) => sum + Number(s.collected_amount ?? subscriptionValue(s)), 0),
        pending: own.filter((s: any) => !s.collected).reduce((sum, s: any) => sum + subscriptionValue(s), 0),
        commission: ownPaid.reduce((sum, s: any) => sum + subscriptionCommission(s), 0),
        today: clientsToday(own).length,
        month: clientsThisMonth(own).length,
      };
    });

    const cities: CityStat[] = ACTIVE_CITIES.map((city) => {
      const cityBusinesses = businesses.filter((b) => b.city === city);
      const ids = new Set(cityBusinesses.map((b) => b.id));
      const citySubs = subs.filter((s: any) => ids.has(s.business_id));
      return {
        city,
        businesses: cityBusinesses.length,
        subscriptions: citySubs.length,
        sold: citySubs.reduce((sum, s: any) => sum + subscriptionValue(s), 0),
        collected: citySubs
          .filter((s: any) => s.collected)
          .reduce((sum, s: any) => sum + Number(s.collected_amount ?? subscriptionValue(s)), 0),
      };
    });

    // Últimos 6 meses
    const monthly: AdminCommercialStats['monthly'] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthSubs = subs.filter((s: any) => (s.start_date || '').slice(0, 7) === key);
      monthly.push({
        month: MONTH_LABELS[d.getMonth()],
        negocios: businesses.filter((b) => (b.created_at || '').slice(0, 7) === key).length,
        membresias: monthSubs.length,
        ingresos: monthSubs
          .filter((s: any) => s.collected)
          .reduce((sum, s: any) => sum + Number(s.collected_amount ?? subscriptionValue(s)), 0),
      });
    }

    const byCategory = new Map<string, number>();
    businesses.forEach((b) => {
      const key = b.business_type || 'Otros';
      byCategory.set(key, (byCategory.get(key) || 0) + 1);
    });
    const categories = Array.from(byCategory.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    const thisMonth = localMonth();
    const monthSubs = subs.filter((s: any) => (s.start_date || '').slice(0, 7) === thisMonth);

    setData({
      totalBusinesses: businesses.length,
      totalUsers: usersRes.count || 0,
      totalClients: clients.filter((c: any) => (c.status || '').toLowerCase().startsWith('activ')).length,
      activeSubscriptions: subs.filter((s: any) => s.status === 'active').length,
      totalSold,
      totalCollected,
      totalPending,
      totalCommission,
      monthSold: monthSubs.reduce((sum, s: any) => sum + subscriptionValue(s), 0),
      monthSubscriptions: monthSubs.length,
      sellers: sellers.sort((a, b) => b.sold - a.sold),
      cities,
      monthly,
      categories,
      recent: subs.slice(0, 8),
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const onFocus = () => load();
    const onVisible = () => {
      if (document.visibilityState === 'visible') load();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [load]);

  return { ...data, loading, reload: load };
};
