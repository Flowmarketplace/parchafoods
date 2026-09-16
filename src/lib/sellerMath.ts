export const DEFAULT_COMMISSION = 25;

export interface SubscriptionLike {
  custom_price?: number | null;
  commission_percentage?: number | null;
  collected?: boolean | null;
  collected_amount?: number | null;
  subscription_plans?: { price?: number | null } | null;
}

export const subscriptionValue = (sub: SubscriptionLike): number =>
  Number(sub.custom_price ?? sub.subscription_plans?.price ?? 0);

export const subscriptionCommission = (sub: SubscriptionLike): number => {
  const base = Number(sub.collected_amount ?? subscriptionValue(sub));
  const pct = Number(sub.commission_percentage ?? DEFAULT_COMMISSION);
  return (base * pct) / 100;
};

export const formatMoney = (value: number, currency = 'COP') =>
  `$${Math.round(value).toLocaleString('es-CO')} ${currency}`;
