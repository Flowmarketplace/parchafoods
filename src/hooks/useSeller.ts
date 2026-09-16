import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export interface SellerProfile {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  commission_percentage: number;
  active: boolean;
  notes: string | null;
}

export const useSeller = () => {
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/auth');
        return;
      }

      // Admin viewing a specific seller panel
      if (sellerId) {
        const { data: viewed } = await supabase
          .from('sellers')
          .select('*')
          .eq('id', sellerId)
          .maybeSingle();
        if (!cancelled) {
          setSeller((viewed as any) || null);
          setLoading(false);
        }
        return;
      }

      const { data: existing } = await supabase
        .from('sellers')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      let record = existing;

      if (!record) {
        const { data: created } = await supabase
          .from('sellers')
          .insert({
            user_id: session.user.id,
            full_name: (session.user.user_metadata as any)?.full_name || session.user.email || 'Vendedor',
            email: session.user.email,
          })
          .select('*')
          .maybeSingle();
        record = created;
      }

      if (!cancelled) {
        setSeller((record as any) || null);
        setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [navigate, sellerId]);

  return { seller, setSeller, loading, isAdminView: Boolean(sellerId) };
};
