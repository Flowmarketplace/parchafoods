import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const RoleBasedRedirect = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(location.pathname === '/');

  useEffect(() => {
    // Only check on root path
    if (location.pathname !== '/') {
      setLoading(false);
      return;
    }

    const checkUserRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setLoading(false);
          return;
        }

        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);

        const isAdmin = roles?.some(r => r.role === 'admin');
        const isBusinessOwner = roles?.some(r => r.role === 'business_owner');
        const isSponsor = roles?.some((r: any) => r.role === 'sponsor');
        
        if (isAdmin) {
          navigate('/admin', { replace: true });
        } else if (isBusinessOwner) {
          navigate('/business-dashboard', { replace: true });
        } else if (isSponsor) {
          navigate('/sponsor', { replace: true });
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking role:', error);
        setLoading(false);
      }
    };

    checkUserRole();
  }, [location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleBasedRedirect;
