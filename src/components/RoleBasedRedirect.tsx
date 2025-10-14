import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const RoleBasedRedirect = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Only check once on initial mount
    if (!hasChecked.current) {
      checkUserRole();
      hasChecked.current = true;
    } else {
      setLoading(false);
    }
  }, []);

  const checkUserRole = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setLoading(false);
        return;
      }

      // Only check role on the root path
      if (location.pathname !== '/') {
        setLoading(false);
        return;
      }

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);

      const isAdmin = roles?.some(r => r.role === 'admin');
      const isBusinessOwner = roles?.some(r => r.role === 'business_owner');
      
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else if (isBusinessOwner) {
        navigate('/business-dashboard', { replace: true });
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking role:', error);
      setLoading(false);
    }
  };

  if (loading && location.pathname === '/') {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
